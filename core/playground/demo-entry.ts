/*
[!!!Important!!!]
Component registration and `mountComponents()` use different module instances.

[!!!Solution!!!] 
Ensure that each generated demo entry point also exports `mountComponents`, so that PJAX can retrieve it directly from the demo entry point.
*/


import type { AnalyzedDemo } from '../utils/types.ts';

/**
 * Indent source code.
 */
function indent(source: string, spaces: number): string {
    const prefix = ' '.repeat(spaces);

    return source
        .split('\n')
        .map((line) => `${prefix}${line}`)
        .join('\n');
}

/**
 * Generate a standalone TSX entry for a Playground demo.
 *
 * The Demo entry and its imported components share
 * the same Runtime module instance.
 */
export function generateDemoEntry(
    demo: AnalyzedDemo
): string {
    // Generate component imports.
    const imports = demo.components.map(
        ({ name, directory }) =>
            `import ${name} from '@/components/${directory}';`
    );

    const importBlock = imports.join('\n');

    // Wrap the original JSX in a component.
    const content = indent(demo.code, 6);

    return `${importBlock}

import {
    mountComponents,
} from '@/runtime/bridge/register';

// Export mountComponents from the same Runtime instance
// used by the imported component registration modules.
export {
    mountComponents,
};

export default function PlaygroundDemo() {
  return (
    <>
${content}
    </>
  );
}
`;
}
