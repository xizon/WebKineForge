/**
 * SSR bridging
 */

import { createServer } from 'vite';
import { h } from 'preact';
import render from 'preact-render-to-string';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { loadSite } from '../site/load-site.ts';
import { discoverPages } from './pages.ts';

import type { 
    PageDefinition,
    ViteManifest

 } from '../utils/types.ts';

import {
    renderCatalogHtml,
    renderDocument,
} from './html-shell.ts';

/**
 * 
 * Read CrossSite Assets
 */
async function readCrossSiteAssets(
    outDir: string
): Promise<Record<string, string>> {
    const file = path.resolve(outDir, 'cross-site-assets.json'); // from "dist/"

    if (!existsSync(file)) {
        console.warn(`[WKF] Cross-site assets manifest not found: ${file}`);
        return {};
    }

    return JSON.parse(await readFile(file, 'utf8'));
}


/**
 * Read Vite build manifest.
 */
async function readManifest(outDir: string): Promise<ViteManifest> {
    const candidates = [
        path.resolve(outDir, '.vite/manifest.json'),
        path.resolve(outDir, 'manifest.json'),
    ];

    for (const file of candidates) {
        if (existsSync(file)) {
            return JSON.parse(
                await readFile(file, 'utf8')
            ) as ViteManifest;
        }
    }

    throw new Error(
        '[WKF] Vite manifest not found. Enable build.manifest in vite.config.ts.'
    );
}


/**
 * Collect JS and CSS assets for a page from the Vite manifest.
 */
export function collectAssets(
    manifest: ViteManifest,
    page: PageDefinition
): { js: string[]; css: string[] } {
    const entry = manifest[page.clientRel];

    if (!entry) {
        throw new Error(
            `[WKF] no build assets for ${page.clientRel}`
        );
    }

    const visited = new Set<string>();
    const css: string[] = [];

    const walkCss = (key: string) => {
        if (visited.has(key)) {
            return;
        }

        visited.add(key);

        const chunk = manifest[key];

        if (!chunk) {
            return;
        }

        for (const href of chunk.css ?? []) {
            css.push(`./${href}`);
        }

        for (const imported of chunk.imports ?? []) {
            walkCss(imported);
        }
    };

    walkCss(page.clientRel);

    return {
        js: [`./${entry.file}`],
        css: [...new Set(css)],
    };
}


/**
 * Build the currently selected Site.
 */
async function main() {
    // 1. Resolve project root
    const projectRoot = process.cwd();

    // 2. Resolve the selected Site
    const siteTitle = process.env.SITE || 'default-site';

    const siteRoot = path.resolve(
        projectRoot,
        'sites',
        siteTitle
    );

    const site = loadSite(siteRoot);

    // 3. Discover pages from the current Site
    const pages = discoverPages(site);

    // 4. Resolve the current Site output directory
    const outDir = site.paths.dist;

    if (pages.length === 0) {
        throw new Error(
            `[WKF] no pages found in ${path.relative(site.root, site.paths.pages)}`
        );
    }

    // 5. Read the current Site Vite manifest
    const manifest = await readManifest(outDir);
    const crossSiteAssets = await readCrossSiteAssets(outDir);


    // 6. Create Vite SSR server using the project-level config
    const server = await createServer({
        configFile: path.resolve(projectRoot, 'vite.config.ts'),
        server: {
            middlewareMode: true,
        },
        appType: 'custom',
    });

    try {
        await mkdir(outDir, { recursive: true });

        // 7. Render every page
        for (const page of pages) {
            const pageModule = await server.ssrLoadModule(
                page.templatePath
            );

            const Page = pageModule.default;

            const body = render(h(Page, {}));

            const assets = collectAssets(manifest, page);

            // Render the complete HTML document
            const html = renderDocument(
                {
                    seo: page.seo,
                    bodyClass: page.bodyClass,
                    siteTitle: site.config.name,
                    isIndex: page.slug === 'index',
                    body,
                    cssHrefs: assets.css,
                    jsHrefs: assets.js,
                },
                site
            );

            // Handling resource paths in HTML
            const finalHtml = html.replace(
                /\/@site\/[^"'\s<>]+/g,
                (url) => {
                    const outputPath = crossSiteAssets[url];

                    return outputPath ? `./${outputPath}` : url;
                }
            );
            
            const outputFile = path.resolve(
                outDir,
                page.htmlFileName
            );

            await writeFile(outputFile, finalHtml, 'utf8');

            console.log(
                `[WKF] Generated ${path.relative(site.root, outputFile)}`
            );
        }

        // 8. Generate the Site catalog index
        const catalogHtml = renderCatalogHtml(site, pages);

        const catalogFile = path.resolve(
            outDir,
            'index.html'
        );

        await writeFile(
            catalogFile,
            catalogHtml,
            'utf8'
        );

        console.log(
            `[WKF] Generated ${path.relative(site.root, catalogFile)} (page index).`
        );

    } finally {
        await server.close();
    }
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});