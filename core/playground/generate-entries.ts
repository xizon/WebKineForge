import fs from 'node:fs';
import path from 'node:path';

import { loadSite } from '../site/load-site.ts';

import { createComponentRegistry } from './component-registry.ts';
import { analyzeComponentExamples } from './analyze-component.ts';
import { writeDemoEntries } from './entry-writer.ts';
import { discoverComponents } from './discover-components.ts';

/**
 * Components currently enabled for Playground.
 *
 * SceneItem is a dependency of Scenes,
 * so it does not need to be a standalone Playground group.
 */


/**
 * Generate Playground TSX entries for the selected Site.
 */
async function main() {
    const projectRoot = process.cwd();

    // 1. Resolve current Site from environment.
    const siteName = process.env.SITE || 'default-site';

    const siteRoot = path.resolve(
        projectRoot,
        'sites',
        siteName
    );

    const site = loadSite(siteRoot);

    const componentsRoot = site.paths.components;
   

    const entriesRoot = path.join(
        site.root,
        '.wkf',
        'playground',
        'entries'
    );

    console.log(
        `\n[WKF][PLAYGROUND] Generating entries for ${site.name}`
    );

    // 2. Create component registry.
    const registry = await createComponentRegistry(
        componentsRoot
    );

    // 3. Remove stale generated entries.
    fs.rmSync(entriesRoot, {
        recursive: true,
        force: true,
    });

    fs.mkdirSync(entriesRoot, {
        recursive: true,
    });

    // 4. Automatically discover components.
    /*
    TEST:

    const PLAYGROUND_COMPONENTS = [
        'hero-3d',
        'photo-scatter',
        'scenes',
    ];

    */

    const PLAYGROUND_COMPONENTS = discoverComponents(componentsRoot);
    const componentDirectories = PLAYGROUND_COMPONENTS;

    console.log(
        `[WKF][PLAYGROUND] Discovered ${componentDirectories.length} components.`
    );

    let totalDemos = 0;

    for (const componentDirectory of componentDirectories) {
        const componentRoot = path.join(
            componentsRoot,
            componentDirectory
        );

        const examplesPath = path.join(
            componentRoot,
            'examples.md'
        );

        if (!fs.existsSync(examplesPath)) {
            throw new Error(
                `[WKF][PLAYGROUND] examples.md not found: ${examplesPath}`
            );
        }

        console.log(`\n[${componentDirectory}]`);

        // Read examples.md.
        const source = fs.readFileSync(
            examplesPath,
            'utf8'
        );

        // Parse Markdown and resolve JSX dependencies.
        const result = analyzeComponentExamples(
            source,
            registry
        );

        if (result.demos.length === 0) {
            console.warn(
                `[SKIP] ${componentDirectory}: No Demo headings found.`
            );

            continue;
        }

        // Generate TSX files.
        const writtenEntries = await writeDemoEntries(
            componentDirectory,
            result.demos,
            entriesRoot
        );

        totalDemos += writtenEntries.length;

        for (const entry of writtenEntries) {
            console.log(
                `[WRITE] ${componentDirectory}/${entry.fileName}`
            );
        }
    }

    console.log('\n================================');

    console.log(
        `[PASS] Generated ${totalDemos} Playground entries.`
    );

    console.log(
        `[WKF][PLAYGROUND] Site: ${site.name}`
    );

    console.log('================================\n');
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});