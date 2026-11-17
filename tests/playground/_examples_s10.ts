/*
TEST:
npx tsx core/playground/__test__/_examples_s10.ts

PURPOSE:
Render a generated Playground TSX entry using Vite SSR.
*/


import path from 'node:path';

import { createServer } from 'vite';
import { h } from 'preact';
import render from 'preact-render-to-string';

async function main() {
    const projectRoot = process.cwd();

    const entryPath = path.resolve(
        projectRoot,
        'sites/default-site/.wkf/playground/entries/hero-3d/01-basic-usage.tsx'
    );

    // Create Vite SSR server.
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
        // Load generated TSX entry.
        const module = await server.ssrLoadModule(
            entryPath
        );

        const PlaygroundDemo = module.default;

        if (typeof PlaygroundDemo !== 'function') {
            throw new Error(
                'PlaygroundDemo default export is invalid.'
            );
        }

        // Render component to static HTML.
        const html = render(
            h(PlaygroundDemo, {})
        );

        console.log('\n========== SSR HTML ==========\n');

        console.log(html);

        if (!html.trim()) {
            throw new Error('SSR returned empty HTML.');
        }

        console.log('\n[PASS] Playground SSR completed.');

    } finally {
        await server.close();
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});