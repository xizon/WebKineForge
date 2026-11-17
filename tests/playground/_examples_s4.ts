/*
TEST：

npx tsx core/playground/__test__/_examples_s4.ts
*/

import path from 'node:path';
import { writeDemoEntries } from '../../core/playground/entry-writer';
import { readFile } from 'node:fs/promises';

import { generateDemoEntry } from '../../core/playground/demo-entry.ts';
import { createComponentRegistry } from '../../core/playground/component-registry.ts';
import { analyzeComponentExamples } from '../../core/playground/analyze-component.ts';
import { parseDemoJSX } from '../../core/playground/jsx-parser.ts';

async function main() {

    const siteRoot = 'sites/default-site';

    const componentsRoot = path.join(
        siteRoot,
        'src',
        'components'
    );

    const outputRoot = path.join(
        siteRoot,
        '.wkf',
        'playground',
        'entries'
    );


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

        // Validate every generated TSX entry.
        for (const demo of result.demos) {
            const entrySource = generateDemoEntry(demo);

            const entryProgram = parseDemoJSX(entrySource);

            console.log(
                `[PASS] ${result.componentName} / ${demo.title}`,
                `(${entryProgram.body.length} statements)`
            );
        }

        // Write all generated demo entries.
        const writtenEntries = await writeDemoEntries(
            component,
            result.demos,
            outputRoot
        );

        for (const entry of writtenEntries) {
            console.log(
                `[WRITE] ${entry.title}`,
                entry.filePath
            );
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});