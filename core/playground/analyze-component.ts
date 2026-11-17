import {
    parseMarkdown,
    extractComponentInfo,
    extractDemos,
} from './markdown-parser.ts';

import {
    parseDemoJSX,
    extractComponentNames,
} from './jsx-parser.ts';

import {
    resolveComponentDirectory,
} from './component-registry.ts';


import type {
    AnalyzedDemo,
    AnalyzedComponent,
    ComponentRegistry,
} from '../utils/types.ts';


/**
 * Analyze a component examples.md file.
 */
export function analyzeComponentExamples(
    source: string,
    registry: ComponentRegistry
): AnalyzedComponent {
    // 1. Parse Markdown
    const ast = parseMarkdown(source);

    // 2. Extract component information
    const info = extractComponentInfo(ast);

    // 3. Extract demos
    const demos = extractDemos(ast);

    // 4. Analyze JSX dependencies
    const analyzedDemos: AnalyzedDemo[] = demos.map((demo) => {

        // Documentation-only Demo: no JSX analysis required.
        if (!demo.code.trim()) {
            return {
                ...demo,
                components: [],
            };
        }

        const program = parseDemoJSX(demo.code);
        const componentNames = extractComponentNames(program);
        const components = componentNames.map((name) => ({
            name,
            directory: resolveComponentDirectory(name, registry),
        }));

        return {
            ...demo,
            components,
        };
    });

    return {
        ...info,
        demos: analyzedDemos,
    };
}