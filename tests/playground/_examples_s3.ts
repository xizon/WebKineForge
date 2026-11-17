/*
TEST：

npx tsx core/playground/__test__/_examples_s3.ts
*/

import { readFile } from 'node:fs/promises';

import { generateDemoEntry } from '../../core/playground/demo-entry.ts';
import { createComponentRegistry } from '../../core/playground/component-registry.ts';
import { analyzeComponentExamples } from '../../core/playground/analyze-component.ts';
import { parseDemoJSX } from '../../core/playground/jsx-parser.ts';

async function main() {
    const componentsRoot =
        'sites/default-site/src/components';

    const registry = await createComponentRegistry(
        componentsRoot
    );

    const components = [
        'hero-3d',
        'photo-scatter',
        'scenes',
    ];

    for (const component of components) {
        console.log(`\n========== ${component} ==========\n`);

        const filePath =
            `${componentsRoot}/${component}/examples.md`;

        const source = await readFile(filePath, 'utf8');

        const result = analyzeComponentExamples(
            source,
            registry
        );

        const demo = result.demos[0];

        const entrySource = generateDemoEntry(demo);

        // Validate generated TSX entry
        const entryProgram = parseDemoJSX(entrySource);

        console.log(
            `[PASS] Generated TSX: ${result.componentName} / ${demo.title}`,
            `(${entryProgram.body.length} statements)`
        );

        console.log('\n--- Generated TSX Entry ---\n');
        console.log(entrySource);

        console.log(JSON.stringify(result, null, 2));
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});