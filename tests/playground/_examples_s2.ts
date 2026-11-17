/*
TEST：

npx tsx core/playground/__test__/_examples_s2.ts
*/

import { readFile } from 'node:fs/promises';

import {
    parseMarkdown,
    extractComponentInfo,
    extractDemos,
} from '../../core/playground/markdown-parser.ts';

import {
    createComponentRegistry,
    resolveComponentDirectory,
} from '../../core/playground/component-registry.ts';

import { extractComponentNames } from '../../core/playground/jsx-parser.ts';

import { parseDemoJSX } from '../../core/playground/jsx-parser.ts';

async function main() {
    const components = [
        'hero-3d',
        'photo-scatter',
        'scenes',
    ];

    const componentsRoot =
        'sites/default-site/src/components';

    const registry = await createComponentRegistry(
        componentsRoot
    );

    for (const component of components) {
        console.log(`\n========== ${component} ==========\n`);

        const filePath =
            `sites/default-site/src/components/${component}/examples.md`;

        const source = await readFile(filePath, 'utf8');

        const ast = parseMarkdown(source);
        const info = extractComponentInfo(ast);
        const demos = extractDemos(ast);

        for (const demo of demos) {
            const program = parseDemoJSX(demo.code);

            const componentNames = extractComponentNames(program);

            const resolvedComponents = componentNames.map((name) => ({
                name,
                directory: resolveComponentDirectory(name, registry),
            }));

            console.log(
                `[PASS] ${info.componentName} / ${demo.title}`,
                resolvedComponents
            );
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});