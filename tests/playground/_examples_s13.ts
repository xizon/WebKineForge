/*
TEST:
npx tsx core/playground/__test__/_examples_s13.ts

PURPOSE:
Generate the Playground index from component examples.md files.
*/


import fs from 'node:fs';
import path from 'node:path';

import { loadSite } from '../../core/site/load-site.ts';

import { createComponentRegistry } from '../../core/playground/component-registry.ts';
import { analyzeComponentExamples } from '../../core/playground/analyze-component.ts';

import {
    renderPlaygroundIndex,
} from '../../core/playground/render-playground-index.ts';

import type {
    PlaygroundIndexComponent,

} from '../../core/utils/types.ts';


async function main() {
    // 1. Load Site
    const siteRoot = path.resolve(
        'sites/default-site'
    );

    const site = loadSite(siteRoot);

    const componentsRoot = site.paths.components;

    const entriesRoot = path.join(
        site.root,
        '.wkf/playground/entries'
    );

    // 2. Create component registry
    const registry = await createComponentRegistry(
        componentsRoot
    );

    // 3. Discover components with generated entries
    const componentDirectories = fs.readdirSync(
        entriesRoot,
        { withFileTypes: true }
    )
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();

    const components: PlaygroundIndexComponent[] = [];

    // 4. Read component examples
    for (const componentDirectory of componentDirectories) {
        const examplesPath = path.join(
            componentsRoot,
            componentDirectory,
            'examples.md'
        );

        if (!fs.existsSync(examplesPath)) {
            continue;
        }

        const source = fs.readFileSync(
            examplesPath,
            'utf8'
        );

        const result = analyzeComponentExamples(
            source,
            registry
        );

        const entryDir = path.join(
            entriesRoot,
            componentDirectory
        );

        const entryFiles = fs.readdirSync(entryDir)
            .filter((file) => file.endsWith('.tsx'))
            .sort();

        if (entryFiles.length !== result.demos.length) {
            throw new Error(
                `[WKF][PLAYGROUND] Demo count mismatch: ${componentDirectory}`
            );
        }

        // 5. Build demo links
        const demos = result.demos.map((demo, index) => {
            const demoSlug = path.basename(
                entryFiles[index],
                '.tsx'
            ).replace(/^\d+-/, '');

            return {
                title: demo.title,
                description: demo.description,
                href: `${componentDirectory}--${demoSlug}.html`,
            };
        });

        components.push({
            name: result.componentName,
            slug: componentDirectory,
            overview: result.overview,
            demos,
        });
    }

    // 6. Render index HTML
    const html = renderPlaygroundIndex(
        components,
        site
    );

    // 7. Write output
    const outputDir = path.join(
        site.paths.dist,
        'playground'
    );

    fs.mkdirSync(outputDir, {
        recursive: true,
    });

    const outputFile = path.join(
        outputDir,
        'index.html'
    );

    fs.writeFileSync(
        outputFile,
        html,
        'utf8'
    );

    console.log('[PASS] Playground index generated.');
    console.log(`[WRITE] ${outputFile}`);
    console.log(`[CHECK] Components: ${components.length}`);

    console.log(
        `[CHECK] Demos: ${
            components.reduce(
                (total, component) => total + component.demos.length,
                0
            )
        }`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});