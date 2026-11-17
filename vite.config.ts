
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import cssnano from 'cssnano';
import lite from 'cssnano-preset-lite';
import postcssNesting from 'postcss-nesting';

import { externalAdapterPlugin } from './core/plugins/external-adapter.ts';
import { devSsrPlugin } from './core/plugins/ssr-dev.ts';
import { injectComponentAttributePlugin } from './core/plugins/inject-com.ts';
import { crossSiteResolverPlugin } from './core/plugins/cross-site.ts';
import { crossSiteAssetsPlugin } from './core/plugins/cross-site-assets.ts';
import { dependencyCheckerPlugin } from './core/plugins/dependency-checker.ts';
import { autoMount } from './core/plugins/auto-mount.ts';
import { createSiteContext } from './core/site/site-context.ts';
import { discoverPlaygroundEntries } from './core/playground/discover-entries.ts';



const projectRoot = import.meta.dirname;

const {
    site,
    pages,
    externals,
} = createSiteContext(projectRoot);

// Playground entries
// const playgroundEntries = discoverPlaygroundEntries(site.root);

// Combine normal page entries and Playground entries.
// const allEntryFiles = [
//     ...pages.map((page) => page.clientFile),
//     ...Object.values(playgroundEntries),
// ];

// Normal page entries only.
const allEntryFiles = pages.map(
    (page) => page.clientFile
);

if (pages.length === 0) {
    throw new Error(
        `[WKF] No pages found for Site "${site.name}". ` +
        `Please check: ${site.paths.pages}`
    );
}


// --------------------------------------------------
// Vite
// --------------------------------------------------
export default defineConfig({
    root: site.root,
    base: './', // for Github Page

    plugins: [
        dependencyCheckerPlugin(),
        crossSiteResolverPlugin(),
        crossSiteAssetsPlugin(),
        devSsrPlugin(),
        tailwindcss(),
        externalAdapterPlugin(site.root, externals),
        injectComponentAttributePlugin(),
        autoMount({
            componentsDir: 'src/components',
            registryEntry: '@/runtime/bridge/register',
            runtimeEntry: '../../core/runtime/auto.ts',

            // Production: normal page entry files only [for "npm run build"]
            entryFiles: allEntryFiles,
            
        }),
    ],

    resolve: {
        alias: [
            {
                find: '@/components',
                replacement: site.paths.components,
            },
            {
                find: '@/pages',
                replacement: site.paths.pages,
            },
            {
                find: '@/styles',
                replacement: site.paths.styles,
            },
            {
                find: '@/runtime',
                replacement: path.resolve(projectRoot, 'core/runtime'),
            },
            {
                find: '@/core',
                replacement: path.resolve(projectRoot, 'core'),
            },
            {
                find: /^@\/(?!site\/)/,  // Solve the problem of alias priority matching.
                replacement: `${site.paths.src}/`,
            },
        ],
    },

    server: {
        host: '0.0.0.0',
        port: 3000,

        fs: {
            allow: [projectRoot],
        },
    },

    preview: {
        host: '0.0.0.0',
        port: 3000,
    },

    css: {
        postcss: {
            plugins: [
                postcssNesting({ noIsPseudoSelector: true }),
                cssnano({ preset: lite }),
            ],
        },
    },
    build: {
        outDir: site.paths.dist,
        emptyOutDir: true,
        manifest: true,
        sourcemap: false,
        cssMinify: false, // Avoid using non-standard forms.

        rollupOptions: {
            input: {
                // Normal pages
                ...Object.fromEntries(
                    pages.map((page) => [
                        page.slug,
                        page.clientFile,
                    ])
                ),

                // Playground demos [for "npm run build"]
                //...playgroundEntries,
            },

            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/chunks/[name].js',

                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'assets/[name]-[hash][extname]';
                    }

                    return 'assets/[name][extname]';
                },
            },
        },
    },
});
