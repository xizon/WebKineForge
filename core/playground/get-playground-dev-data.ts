
/**
 * Discover Playground components and their Demo entries.
 */
import path from 'node:path';
import { loadSite } from '../site/load-site.ts';

// for playground
import fs from 'node:fs';

import {
    createComponentRegistry,
} from '../playground/component-registry.ts';

import {
    analyzeComponentExamples,
} from '../playground/analyze-component.ts';

import type {
    PlaygroundIndexComponent,
    PlaygroundDemoRoute,
    PlaygroundDevData,
} from '../utils/types.ts';


const projectRoot = path.resolve(import.meta.dirname, '../..');

const siteTitle = process.env.SITE || 'default-site';

const site = loadSite(
    path.resolve(projectRoot, 'sites', siteTitle)
);


export async function getPlaygroundDevData(): Promise<PlaygroundDevData> {
    const componentsRoot = site.paths.components;

    const entriesRoot = path.join(
        site.root,
        '.wkf/playground/entries'
    );

    if (!fs.existsSync(entriesRoot)) {
        throw new Error(
            `[WKF][PLAYGROUND] Entries directory not found: ${entriesRoot}`
        );
    }

    const registry = await createComponentRegistry(
        componentsRoot
    );

    const componentDirectories = fs.readdirSync(
        entriesRoot,
        { withFileTypes: true }
    )
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();

    const components: PlaygroundIndexComponent[] = [];
    const demos = new Map<string, PlaygroundDemoRoute>();

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


        const entryFiles = new Set(
            fs.existsSync(entryDir)
                ? fs.readdirSync(entryDir)
                    .filter((file) => file.endsWith('.tsx'))
                : []
        );

        const componentDemos = result.demos.map((demo, index) => {

            // Generate the same slug used by entry-writer.ts.
            const demoSlug = demo.title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            const href = `${componentDirectory}--${demoSlug}.html`;

            // Match the original Markdown Demo index.
            const expectedEntryFile = [
                String(index + 1).padStart(2, '0'),
                demoSlug,
            ].join('-') + '.tsx';

            const hasCode = demo.code.trim().length > 0;

            const hasEntry = entryFiles.has(expectedEntryFile);

            // A Demo with TSX must have its corresponding generated entry.
            if (hasCode && !hasEntry) {
                throw new Error(
                    `[WKF][PLAYGROUND] Missing TSX entry: ` +
                    `${componentDirectory}/${expectedEntryFile}`
                );
            }

            const entryPath = hasEntry
                ? path.resolve(entryDir, expectedEntryFile)
                : undefined;

            demos.set(href, {
                componentName: result.componentName,
                overview: result.overview,

                demoTitle: demo.title,
                demoDescription: demo.description,
                demoCode: demo.code,

                apiReference: result.apiReference,
                dependencies: result.dependencies,

                entryPath,
            });

            return {
                title: demo.title,
                description: demo.description,
                href,
            };
        });


        components.push({
            name: result.componentName,
            slug: componentDirectory,
            overview: result.overview,
            demos: componentDemos,
        });
    }

    return {
        components,
        demos,
    };
}
