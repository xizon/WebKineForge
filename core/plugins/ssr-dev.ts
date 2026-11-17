/**
 * SSR in the development phase 
 */
import path from 'node:path';
import type { Plugin } from 'vite';
import { h } from 'preact';
import renderToString from 'preact-render-to-string';
import { loadSite } from '../site/load-site.ts';
import { discoverPages } from '../processors/pages.ts';
import {
    matchRequestPath,
    renderCatalogHtml,
    renderDocument,
} from '../processors/html-shell.ts';

import {
    isInsideDirectory
} from '../utils/helper.ts';

import type {
    PlaygroundDemoRoute
} from '../utils/types.ts';


// for playground
import { getPlaygroundDevData } from '../playground/get-playground-dev-data.ts';
import { renderPlaygroundDocument } from '../playground/render-demo-document.ts';
import { renderPlaygroundIndex } from '../playground/render-playground-index.ts';



const projectRoot = path.resolve(import.meta.dirname, '../..');

const siteTitle = process.env.SITE || 'default-site';

const site = loadSite(
    path.resolve(projectRoot, 'sites', siteTitle)
);

// The page is encountered only once
// it is used for the development and build process of the current site.
const pages = discoverPages(site);


/*
Accessing the Playground home page in the browser

GET /playground/
1. Read `examples.md` and the temporary TSX entry point.
2. Call `renderPlaygroundIndex()`.
3. Inject the Vite client and the development runtime.
4. Return the HTML directly (without writing to the `dist` directory).

Accessing a demo detail page in the browser

GET /playground/hero-3d--basic-usage.html
1. Locate the corresponding TSX entry point based on the URL.
2. Call `server.ssrLoadModule()` to load the component.
3. Use Preact SSR to generate the preview HTML.
4. Pass the browser-side TSX entry point to Vite for loading.
5. Return the complete HTML.

*/
export function devSsrPlugin(): Plugin {
    return {
        name: 'dev-ssr',

        configureServer(server) {

            // Monitor changes in Core and Runtime
            server.watcher.add([
                path.resolve(projectRoot, 'core'),
                path.resolve(projectRoot, 'runtime'),
            ]);

            server.middlewares.use(async (req, res, next) => {
                if (req.method !== 'GET') {
                    return next();
                }

                // ----------------------------------------
                // Playground routes
                // ----------------------------------------
                const pathname = new URL(
                    req.url ?? '/',
                    'http://localhost'
                ).pathname;

                // Normalize Playground root URL.
                if (pathname === '/playground') {
                    res.statusCode = 302;
                    res.setHeader('Location', '/playground/');
                    res.end();
                    return;
                }

                if (
                    pathname === '/playground/' ||
                    pathname.startsWith('/playground/')
                ) {
                    try {
                        // 1. Discover Playground data
                        const playground = await getPlaygroundDevData();

                        let documentHtml = '';

                        // ----------------------------------------
                        // Request type
                        // ----------------------------------------

                        const isPlaygroundIndex =
                            pathname === '/playground/' ||
                            pathname === '/playground/index.html';

                        const isAjaxRequest =
                            req.headers['x-requested-with'] === 'PjaxRequest';


                        // ----------------------------------------
                        // Resolve Demo
                        // ----------------------------------------

                        let demoKey = '';

                        let demo: PlaygroundDemoRoute | undefined;

                        if (!isPlaygroundIndex) {

                            demoKey = decodeURIComponent(
                                pathname.slice('/playground/'.length)
                            );

                            demo = playground.demos.get(demoKey);

                            if (!demo || demoKey.includes('/')) {
                                res.statusCode = 404;
                                res.setHeader(
                                    'Content-Type',
                                    'text/plain; charset=utf-8'
                                );

                                res.end('Playground demo not found.');
                                return;
                            }
                        }


                        // ----------------------------------------
                        // Full Playground Workbench
                        // ----------------------------------------

                        // Normal browser navigation must always return
                        // the complete Playground shell.
                        //
                        // This is important because PJAX uses pushState(),
                        // so refreshing a Demo URL must restore the sidebar.

                        if (isPlaygroundIndex || !isAjaxRequest) {

                            documentHtml = renderPlaygroundIndex(
                                playground.components,
                                site,
                                true,
                                demoKey || undefined
                            );

                        }


                        // ----------------------------------------
                        // AJAX: Original Standalone Demo HTML
                        // ----------------------------------------

                        else if (demo) {

                            let previewHtml = '';

                            const entryUrls: string[] = [];

                            // Only load and render a Demo when a TSX entry exists.
                            if (demo.entryPath) {

                                // Load generated TSX module.
                                const module = await server.ssrLoadModule(
                                    demo.entryPath
                                );

                                const PlaygroundDemo = module.default;

                                if (typeof PlaygroundDemo !== 'function') {
                                    throw new Error(
                                        `[WKF][PLAYGROUND] Invalid Demo entry: ${demo.entryPath}`
                                    );
                                }

                                // Render actual component HTML.
                                previewHtml = renderToString(
                                    h(PlaygroundDemo, {})
                                );

                                if (!previewHtml.trim()) {
                                    throw new Error(
                                        `[WKF][PLAYGROUND] Empty SSR output: ${demoKey}`
                                    );
                                }

                                // Browser-side Vite module URL.
                                const entryUrl = `/@fs/${demo.entryPath
                                    .replace(/\\/g, '/')
                                    .replace(/^\/+/, '')}`;

                                entryUrls.push(entryUrl);
                            }

                            // Generate original standalone Demo HTML.
                            documentHtml = renderPlaygroundDocument(
                                {
                                    componentName: demo.componentName,
                                    overview: demo.overview,

                                    demoTitle: demo.demoTitle,
                                    demoDescription: demo.demoDescription,

                                    previewHtml,

                                    assets: {
                                        js: entryUrls,
                                        css: [],
                                    },

                                    demoCode: demo.demoCode,

                                    apiReference: demo.apiReference,
                                    dependencies: demo.dependencies,

                                    viteClient: true,
                                },
                                site
                            );
                        }



                        // Apply Vite HTML transformations.
                        // This also injects the WKF development runtime.
                        const transformedHtml = await server.transformIndexHtml(
                            req.url!,
                            documentHtml
                        );

                        res.setHeader(
                            'Content-Type',
                            'text/html; charset=utf-8'
                        );

                        res.end(transformedHtml);
                        return;

                    } catch (error) {
                        server.ssrFixStacktrace(error as Error);

                        console.error(
                            '[WKF][PLAYGROUND] Development SSR failed:',
                            error
                        );

                        res.statusCode = 500;
                        res.setHeader(
                            'Content-Type',
                            'text/plain; charset=utf-8'
                        );
                        res.end(String(error));
                        return;
                    }
                }


                // ----------------------------------------
                // Main
                // ----------------------------------------

                const match = matchRequestPath(req.url, pages);

                if (!match) {
                    return next();
                }

                try {
                    if (match.type === 'catalog') {
                        res.setHeader(
                            'Content-Type',
                            'text/html; charset=utf-8'
                        );

                        res.end(renderCatalogHtml(site, pages, true));
                        return;
                    }

                    const { page } = match;

                    const { default: Page } = await server.ssrLoadModule(
                        page.templatePath
                    );

                    const html = renderToString(h(Page, {}));

                    const documentHtml = renderDocument({
                        seo: page.seo,
                        bodyClass: page.bodyClass,
                        siteTitle: site.title,
                        isIndex: page.slug === 'index',
                        body: html,
                        jsHrefs: [page.clientPath],
                        viteClient: true,
                    }, site);

                    // Apply Vite HTML transformations, including WKF Runtime injection.
                    const transformedHtml = await server.transformIndexHtml(
                        req.url!,
                        documentHtml
                    );

                    res.setHeader(
                        'Content-Type',
                        'text/html; charset=utf-8'
                    );

                    res.end(transformedHtml);

                } catch (error) {
                    server.ssrFixStacktrace(error as Error);
                    res.statusCode = 500;
                    res.end(String(error));
                }
            });

            // Refresh the page when changes occur in the current site source code, Core, or Runtime.
            server.watcher.on('change', (file) => {
                const inSiteSrc = isInsideDirectory(file, site.paths.src);
                const inCore = isInsideDirectory(
                    file,
                    path.resolve(projectRoot, 'core')
                );
                const inRuntime = isInsideDirectory(
                    file,
                    path.resolve(projectRoot, 'runtime')
                );

                if (inSiteSrc || inCore || inRuntime) {
                    server.ws.send({ type: 'full-reload' });
                }
            });
        },
    };
}