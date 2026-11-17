/*
TEST:
npx tsx core/playground/__test__/_examples_s12.ts

PURPOSE:
Render all Playground demos into standalone HTML pages.
*/


import fs from 'node:fs';
import path from 'node:path';

import { createServer } from 'vite';
import { h } from 'preact';
import render from 'preact-render-to-string';

import { loadSite } from '../../core/site/load-site.ts';

import { createComponentRegistry } from '../../core/playground/component-registry.ts';
import { analyzeComponentExamples } from '../../core/playground/analyze-component.ts';
import { discoverPlaygroundEntries } from '../../core/playground/discover-entries.ts';

import {
    collectPlaygroundAssets,
} from '../../core/playground/collect-assets.ts';

import { renderPlaygroundDocument } from '../../core/playground/render-demo-document.ts';

import type { PlaygroundManifest } from '../../core/utils/types.ts';


async function main() {
    const projectRoot = process.cwd();

    // 1. Load Site
    const siteRoot = path.resolve(
        projectRoot,
        'sites/default-site'
    );

    const site = loadSite(siteRoot);

    const componentsRoot = site.paths.components;

    const entriesRoot = path.join(
        site.root,
        '.wkf/playground/entries'
    );

    const outputDir = path.join(
        site.paths.dist,
        'playground'
    );

    // 2. Create component registry
    const registry = await createComponentRegistry(
        componentsRoot
    );

    // 3. Discover generated Vite entries
    const playgroundEntries = discoverPlaygroundEntries(
        site.root
    );

    const entryNameByPath = new Map(
        Object.entries(playgroundEntries).map(
            ([name, filePath]) => [
                path.resolve(filePath),
                name,
            ]
        )
    );

    // 4. Read Vite manifest
    const manifestPath = path.join(
        site.paths.dist,
        '.vite/manifest.json'
    );

    const manifest = JSON.parse(
        fs.readFileSync(manifestPath, 'utf8')
    ) as PlaygroundManifest;

    // 5. Create one Vite SSR server for all demos
    const server = await createServer({
        configFile: path.resolve(
            projectRoot,
            'vite.config.ts'
        ),
        server: {
            middlewareMode: true,
        },
        appType: 'custom',
    });

    let generatedCount = 0;

    try {
        fs.mkdirSync(outputDir, {
            recursive: true,
        });

        // 6. Process component directories
        const componentDirectories = fs.existsSync(entriesRoot)
            ? fs.readdirSync(entriesRoot, {
                withFileTypes: true,
            })
                .filter((entry) => entry.isDirectory())
                .map((entry) => entry.name)
                .sort()
            : [];

        for (const componentDirectory of componentDirectories) {
            const examplesPath = path.join(
                componentsRoot,
                componentDirectory,
                'examples.md'
            );

            // Skip components without examples.md
            if (!fs.existsSync(examplesPath)) {
                continue;
            }

            console.log(`\n[${componentDirectory}]`);

            // 7. Analyze Markdown and demos
            const source = fs.readFileSync(
                examplesPath,
                'utf8'
            );

            const result = analyzeComponentExamples(
                source,
                registry
            );

            // 8. Locate generated TSX entries
            const componentEntryDir = path.join(
                entriesRoot,
                componentDirectory
            );

            const entryFiles = fs.readdirSync(
                componentEntryDir
            )
                .filter((file) => file.endsWith('.tsx'))
                .sort();

            if (entryFiles.length !== result.demos.length) {
                throw new Error(
                    `[WKF][PLAYGROUND] Demo count mismatch: ${componentDirectory}. ` +
                    `Examples: ${result.demos.length}, entries: ${entryFiles.length}`
                );
            }

            // 9. Render every demo
            for (const [index, demo] of result.demos.entries()) {
                const entryPath = path.resolve(
                    componentEntryDir,
                    entryFiles[index]
                );

                const entryName = entryNameByPath.get(
                    entryPath
                );

                if (!entryName) {
                    throw new Error(
                        `[WKF][PLAYGROUND] Vite entry not found: ${entryPath}`
                    );
                }

                // Load generated TSX module
                const module = await server.ssrLoadModule(
                    entryPath
                );

                const PlaygroundDemo = module.default;

                if (typeof PlaygroundDemo !== 'function') {
                    throw new Error(
                        `Invalid PlaygroundDemo: ${entryPath}`
                    );
                }

                // Render actual component HTML
                const previewHtml = render(
                    h(PlaygroundDemo, {})
                );

                if (!previewHtml.trim()) {
                    throw new Error(
                        `Empty SSR output: ${entryName}`
                    );
                }

                // Collect JS/CSS resources
                const assets = collectPlaygroundAssets(
                    manifest,
                    entryName
                );

                // Generate complete HTML
                const html = renderPlaygroundDocument(
                    {
                        componentName: result.componentName,
                        overview: result.overview,

                        demoTitle: demo.title,
                        demoDescription: demo.description,

                        previewHtml,
                        assets,
                        demoCode: demo.code,

                        apiReference: result.apiReference,
                        dependencies: result.dependencies,
                    },
                    site
                );

                // Generate output filename
                const demoSlug = path.basename(
                    entryPath,
                    '.tsx'
                ).replace(/^\d+-/, '');

                const outputFile = path.join(
                    outputDir,
                    `${componentDirectory}--${demoSlug}.html`
                );

                fs.writeFileSync(
                    outputFile,
                    html,
                    'utf8'
                );

                generatedCount += 1;

                console.log(
                    `[SSR] ${result.componentName} / ${demo.title}`
                );

                console.log(
                    `[WRITE] ${path.relative(site.paths.dist, outputFile)}`
                );
            }
        }

        console.log('\n================================');
        console.log(
            `[PASS] Generated ${generatedCount} Playground pages.`
        );
        console.log('================================');

    } finally {
        await server.close();
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});