/*
TEST:
npx tsx core/playground/__test__/_examples_s11.ts

PURPOSE:
Generate a real Playground HTML page using Vite SSR.
*/


import fs from 'node:fs';
import path from 'node:path';

import { createServer } from 'vite';
import { h } from 'preact';
import render from 'preact-render-to-string';

import { loadSite } from '../../core/site/load-site.ts';

import {
    collectPlaygroundAssets,
} from '../../core/playground/collect-assets.ts';

import {
    renderPlaygroundDocument,
} from '../../core/playground/render-demo-document.ts';

import type { PlaygroundManifest } from '../../core/utils/types.ts';

async function main() {
    const projectRoot = process.cwd();

    const siteRoot = path.resolve(
        projectRoot,
        'sites/default-site'
    );

    const site = loadSite(siteRoot);

    // 1. Resolve generated TSX entry.
    const component = 'hero-3d';

    const demoFile = '02-provide-the-next-section-target.tsx';

    const entryPath = path.join(
        siteRoot,
        '.wkf/playground/entries',
        component,
        demoFile
    );


    const entryName =
        'playground-hero-3d-02-provide-the-next-section-target';
    // 2. Read Vite manifest.
    const manifestPath = path.join(
        site.paths.dist,
        '.vite/manifest.json'
    );

    const manifest = JSON.parse(
        fs.readFileSync(manifestPath, 'utf8')
    ) as PlaygroundManifest;

    const assets = collectPlaygroundAssets(
        manifest,
        entryName
    );

    // 3. Create Vite SSR server.
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

    try {
        // 4. Load generated TSX entry.
        const module = await server.ssrLoadModule(
            entryPath
        );

        const PlaygroundDemo = module.default;

        if (typeof PlaygroundDemo !== 'function') {
            throw new Error(
                'PlaygroundDemo default export is invalid.'
            );
        }

        // 5. Render actual component HTML.
        const previewHtml = render(
            h(PlaygroundDemo, {})
        );

        if (!previewHtml.trim()) {
            throw new Error(
                'Playground SSR returned empty HTML.'
            );
        }

        // 6. Generate complete HTML document.
        const emptySection = {
            title: '',
            paragraphs: [],
            lists: [],
            tables: [],
        };
        const html = renderPlaygroundDocument(
            {
                componentName: 'Hero 3D',

                overview:
                    'A full-screen hero section featuring an interactive 3D particle field and an extruded SVG logo. Supports pointer interaction and smooth scrolling to the next section.',

                demoTitle: 'Provide the Next Section Target',

                demoDescription:
                    'Customize the target section for the scroll interaction by passing a CSS selector through nextSelector.',

                previewHtml,

                assets,
                demoCode: '<Hero3D />',

                apiReference: emptySection,
                dependencies: emptySection,
            },
            site
        );

        // 7. Write HTML.
        const outputDir = path.join(
            site.paths.dist,
            'playground'
        );

        fs.mkdirSync(outputDir, {
            recursive: true,
        });

        const outputFile = path.join(
            outputDir,
            'hero-3d--next-section-target.html'
        );

        fs.writeFileSync(
            outputFile,
            html,
            'utf8'
        );

        console.log(
            '[PASS] Real Playground HTML generated.'
        );

        console.log(outputFile);

        console.log(
            '[CHECK] Component HTML length:',
            previewHtml.length
        );

    } finally {
        await server.close();
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});