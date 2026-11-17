/**
 * Discovers valid component and page templates from Site manifests.
 */
import {
    existsSync,
    readdirSync,
} from 'node:fs';

import path from 'node:path';

import { readJson } from '../utils/helper.ts';

import type {
    SiteContext,
    PageManifest,
    ComponentManifest,
} from '../utils/types.ts';



export function discoverTemplates(site: SiteContext): string[] {
    const files: string[] = [];

    const configs = [
        {
            type: 'component',
            sourceDir: site.paths.components,
            manifestFile: 'manifest.json',
            templateFile: 'template.tsx',
        },
        {
            type: 'page',
            sourceDir: site.paths.pages,
            manifestFile: 'manifest.json',
            templateFile: 'index.tsx',
        },
    ] as const;

    for (const config of configs) {
        if (!existsSync(config.sourceDir)) {
            continue;
        }

        const directories = readdirSync(config.sourceDir, {
            withFileTypes: true,
        }).filter(entry => entry.isDirectory());

        for (const entry of directories) {
            const directory = path.join(
                config.sourceDir,
                entry.name
            );

            const manifestPath = path.join(
                directory,
                config.manifestFile
            );

            const templatePath = path.join(
                directory,
                config.templateFile
            );

            if (!existsSync(manifestPath) || !existsSync(templatePath)) {
                continue;
            }

            const manifest = config.type === 'component'
                ? readJson<ComponentManifest>(manifestPath)
                : readJson<PageManifest>(manifestPath);

            if (!manifest || typeof manifest !== 'object') {
                continue;
            }

            files.push(templatePath);
        }
    }

    return [...new Set(files)];
}