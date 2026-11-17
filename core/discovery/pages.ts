/**
 * Discover Pages
 */
import {
    existsSync,
    readdirSync,
} from 'node:fs';

import path from 'node:path';

import { readJson, firstExisting } from '../utils/helper.ts';

import type {
    PageDefinition,
    SiteContext,
    PageManifest,
} from '../utils/types.ts';


export function discoverPages(site: SiteContext): PageDefinition[] {
    const pagesDir = site.paths.pages;

    if (!existsSync(pagesDir)) {
        return [];
    }

    return readdirSync(pagesDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) => {
            const dir = path.join(pagesDir, entry.name);

            // Discover page entry
            const entryFile = firstExisting(dir, [
                'index.tsx',
            ]);

            if (!entryFile) {
                console.warn(
                    `[WKF] skip ${path.relative(site.root, dir)}: missing index.tsx`
                );

                return [];
            }

            // Resolve absolute file path
            const entryFilePath = path.resolve(dir, entryFile);

            // Read page manifest
            const manifest =
                readJson<PageManifest>(
                    path.join(dir, 'manifest.json')
                ) ?? {};

            const slug = entry.name;

            const htmlFileName = path.basename(
                manifest.output || `${slug}.html`
            );

            const bodyClass = manifest.bodyClass || 'page';

            // SEO configuration
            const seoTitle = manifest.seo?.title || manifest.name || slug;
            const seoDescription = manifest.seo?.description ?? '';
            const keywords = manifest.seo?.keywords;

            // Path relative to the current Site root
            const entryRel = path
                .relative(site.root, entryFilePath)
                .split(path.sep)
                .join('/');

            const page: PageDefinition = {
                slug,
                dir,
                bodyClass,

                // Same entry for SSR and client build
                templatePath: entryFilePath,
                clientPath: `/${entryRel}`,
                clientFile: entryFilePath,
                clientRel: entryRel,

                htmlFileName,

                seo: {
                    // Preserve user-defined SEO attributes
                    ...(manifest.seo || {}),

                    lang: manifest.seo?.lang || site.config.lang,
                    title: seoTitle,
                    description: seoDescription,
                    author: manifest.seo?.author || null,

                    keywords:
                        Array.isArray(keywords) && keywords.length > 0
                            ? keywords
                            : null,

                    canonical: manifest.seo?.canonical || null,
                },
            };

            return [page];
        })
        .sort((a, b) => a.slug.localeCompare(b.slug));
}
