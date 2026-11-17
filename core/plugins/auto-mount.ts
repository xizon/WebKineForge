
/**
 * Auto Mount
 */
/*
Debug (Enter into the browser console): 

import ('/@fs/{your_computer_dir}/WebKineForge/runtime/auto.ts').then(() => console.log('Loaded')).catch(err => console.error(err));

You should see the following information, after which the mount will take effect:

-> auto.ts [WKF][RUNTIME] Runtime started ✅
-> auto.ts [WKF][RUNTIME] Components mounted ✅

*/
import path from 'node:path';
import fs from 'node:fs';
import type { Plugin, ResolvedConfig } from 'vite';
import type { AutoMountOptions } from '../utils/types.ts';

const VIRTUAL_AUTO_ENTRY = 'virtual:auto-entry';
let command: 'serve' | 'build' = 'serve';
let entryFiles: Set<string> = new Set();

export function autoMount(
    options: AutoMountOptions = {}
): Plugin {
    let config: ResolvedConfig;

    // !!!Required: Cross-site registration component
    let componentsDirs: string[] = [];  

    //
    let registryEntry = '';
    let runtimeEntry = '';
    let runtimeImport = '';

    return {
        name: 'auto-mount',

        enforce: 'pre',

        configResolved(resolvedConfig) {

            console.log(
                '[WKF][RUNTIME][CHECK] Plugin initialized:',
                resolvedConfig.command,
                resolvedConfig.root
            );

            config = resolvedConfig;
            command = resolvedConfig.command;

            entryFiles = new Set(
                (options.entryFiles ?? []).map((file) =>
                    path.resolve(config.root, file)
                )
            );

            // Cross-site paths
            const sitesDir = path.resolve(config.root, '..');
            componentsDirs = fs.readdirSync(sitesDir, {
                withFileTypes: true,
            })
                .filter((entry) => entry.isDirectory())
                .map((entry) =>
                    path.resolve(
                        sitesDir,
                        entry.name,
                        options.componentsDir ?? 'src/components'
                    )
                )
                .filter((dir) => fs.existsSync(dir));

            // console.log(
            //     '[WKF][RUNTIME] Component directories:',
            //     componentsDirs
            // );
            // console.log('[WKF][RUNTIME] Build command:', config.command);
            // console.log('[WKF][RUNTIME] Vite root:', config.root);
            // console.log('[WKF][RUNTIME] Runtime entry:', runtimeEntry);
            // console.log('[WKF][RUNTIME] Runtime import:', runtimeImport);
            // console.log('[WKF][RUNTIME] Page entry files:', [...entryFiles]);

            //

            registryEntry =
                options.registryEntry ?? '@/runtime/bridge/register';

            runtimeEntry = path.resolve(
                config.root,
                options.runtimeEntry ?? '../../runtime/auto.ts'
            );

            if (!fs.existsSync(runtimeEntry)) {
                throw new Error(
                    `[WKF][RUNTIME] Runtime entry not found: ${runtimeEntry}`
                );
            }

            runtimeImport = '@/runtime/auto';

        },

        /**
         * Resolve the virtual browser runtime entry.
         */
        resolveId(id) {
            if (id === VIRTUAL_AUTO_ENTRY) {
                return '\0' + VIRTUAL_AUTO_ENTRY;
            }

            return null;
        },

        /**
         * Load the virtual browser runtime entry.
         */
        load(id) {
            if (id !== '\0' + VIRTUAL_AUTO_ENTRY) {
                return null;
            }

            console.log('[WKF][RUNTIME] Production Runtime module loaded');

            return `
                import ${JSON.stringify(runtimeImport)};
            `;
        },

        /**
         * Automatically register imported components.
         *
         * Component index.ts only needs to export:
         * - Template
         * - mount (optional)
         * - manifest
         */
        buildStart() {
            //  console.log('[WKF][RUNTIME][BUILD] buildStart triggered');
        },


        transform(code, id) {
            const cleanId = id.split('?')[0];
            const normalizedId = path.resolve(cleanId);

            // 1. Inject Runtime into production page entries.
            const isPageEntry =
                command === 'build' &&
                options.autoMount !== false &&
                entryFiles.has(normalizedId);

            if (isPageEntry) {
                // console.log('[WKF][RUNTIME] Injecting Runtime into:', normalizedId);

                code = `
            ${code}

            // Start Runtime after page dependencies are evaluated.
            void import('${VIRTUAL_AUTO_ENTRY}');
        `;
            }

            // 2. Only process index.ts directly inside a component directory.
            if (!cleanId.endsWith('/index.ts')) {
                return isPageEntry
                    ? { code, map: null }
                    : null;
            }

            const componentRoot = componentsDirs.find((dir) => {
                const relativePath = path.relative(dir, normalizedId);

                return (
                    relativePath !== '' &&
                    !relativePath.startsWith('..') &&
                    !path.isAbsolute(relativePath) &&
                    relativePath.split(path.sep).length === 2
                );
            });

            if (!componentRoot) {
                return isPageEntry
                    ? { code, map: null }
                    : null;
            }

            // 3. Automatically register component.
            const componentDir = path.dirname(normalizedId);

            const controllerPath = path.join(
                componentDir,
                'controller.ts'
            );

            const controllerExists = fs.existsSync(controllerPath);

            const registerImport = JSON.stringify(
                registryEntry.replace(/\\/g, '/')
            );

            const registrationCode = `
        import {
            registerComponent as __wkfRegister
        } from ${registerImport};

        import {
            Template as __wkfTemplate
        } from './template';

        import __wkfManifest from './manifest.json';

        ${controllerExists
                    ? `import { mount as __wkfMount } from './controller';`
                    : `const __wkfMount = () => {};`
                }

        __wkfRegister(
            __wkfManifest.name,
            __wkfTemplate,
            __wkfMount
        );
    `;

            return {
                code: `${code}\n${registrationCode}`,
                map: null,
            };
        },


        /**
         * Automatically inject the Runtime entry into HTML.
         */
        transformIndexHtml: {
            order: 'post',

            handler() {
                if (
                    options.autoMount === false ||
                    command === 'build'
                ) {
                    return [];
                }

                return [
                    {
                        tag: 'script',
                        attrs: {
                            type: 'module',
                            src: `/@id/${VIRTUAL_AUTO_ENTRY}`,
                        },
                        injectTo: 'body',
                    },
                ];
            },
        },
    };
}
