
/**
 * Cross-site component dependency checker.
 *
 * Scans component manifests across all sites and warns
 * when the same dependency has different version declarations.
 *
 * Warnings never block development or production builds.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import type {
    ComponentManifest,
    DependencyCheckerOptions,
    DependencyMismatch,
    DependencyUsage
} from '../utils/types.ts';

import { consoleColors } from '../utils/helper.ts';

const {
    RESET,
    YELLOW,
    BOLD_YELLOW,
    DIM,
} = consoleColors;


export function dependencyCheckerPlugin(
    options: DependencyCheckerOptions = {}
): Plugin {
    let config: ResolvedConfig;
    let sitesDir = '';
    let componentsDirs: string[] = [];

    function collectManifests() {
        const usages = new Map<string, DependencyUsage[]>();

        for (const componentsDir of componentsDirs) {
            if (!fs.existsSync(componentsDir)) continue;

            const siteName = path.basename(
                path.dirname(path.dirname(componentsDir))
            );

            const entries = fs.readdirSync(componentsDir, {
                withFileTypes: true,
            });

            for (const entry of entries) {
                if (!entry.isDirectory()) continue;

                const componentDir = path.join(
                    componentsDir,
                    entry.name
                );

                const manifestPath = path.join(
                    componentDir,
                    'manifest.json'
                );

                if (!fs.existsSync(manifestPath)) continue;

                try {
                    const manifest = JSON.parse(
                        fs.readFileSync(manifestPath, 'utf-8')
                    ) as ComponentManifest;

                    const dependencies = manifest.dependencies ?? {};
                    const componentName = manifest.name ?? entry.name;
                    const source = `${siteName} / ${componentName}`;

                    for (const [name, version] of Object.entries(dependencies)) {
                        if (typeof version !== 'string') continue;

                        const list = usages.get(name) ?? [];

                        list.push({
                            source,
                            version,
                        });

                        usages.set(name, list);
                    }
                } catch (error) {
                    console.warn(
                        `[WKF][DEPENDENCY] Failed to read manifest: ${manifestPath}`,
                        error
                    );
                }
            }
        }

        return usages;
    }

    function checkDependencies() {
        const usages = collectManifests();
        const mismatches: DependencyMismatch[] = [];

        // console.log(
        //     '[WKF][DEPENDENCY] Dependencies found:\n',
        //     JSON.stringify(
        //         [...usages.entries()],
        //         null,
        //         4
        //     )
        // );

        for (const [name, items] of usages) {
            const versions = new Set(
                items.map(item => item.version)
            );

            if (versions.size > 1) {
                mismatches.push({
                    name,
                    usages: items,
                });
            }
        }

        if (mismatches.length === 0) {
            return;
        }


        const line = '━'.repeat(60);

        console.warn(
            `\n${BOLD_YELLOW}${line}\n` +
            `  [WKF][DEPENDENCY] VERSION MISMATCH WARNING\n` +
            `${line}${RESET}\n`
        );

        for (const mismatch of mismatches) {
            console.warn(
                `${BOLD_YELLOW}  ◆ ${mismatch.name}${RESET}`
            );

            for (const usage of mismatch.usages) {
                console.warn(
                    `${YELLOW}      ${usage.source.padEnd(35)} ${usage.version}${RESET}`
                );
            }

            console.warn('');
        }

        console.warn(
            `${DIM}${line}${RESET}\n` +
            `${YELLOW}  Please review dependency versions.${RESET}\n` +
            `${YELLOW}  Dev/Build will continue.${RESET}\n` +
            `${DIM}${line}${RESET}\n`
        );
    }

    return {
        name: 'wkf-dependency-checker',
        enforce: 'pre',

        configResolved(resolvedConfig) {
            config = resolvedConfig;

            sitesDir = path.resolve(
                config.root,
                options.sitesDir ?? '..'
            );

            const componentsDirName =
                options.componentsDir ?? 'src/components';

            if (!fs.existsSync(sitesDir)) {
                console.warn(
                    '[WKF][DEPENDENCY] Sites directory not found:',
                    sitesDir
                );
                return;
            }

            componentsDirs = fs.readdirSync(sitesDir, {
                withFileTypes: true,
            })
                .filter(entry => entry.isDirectory())
                .map(entry => path.resolve(
                    sitesDir,
                    entry.name,
                    componentsDirName
                ))
                .filter(dir => fs.existsSync(dir));

            checkDependencies();
        },

        configureServer(server) {
            // Watch component manifests during development.
            server.watcher.add(componentsDirs);

            server.watcher.on('change', file => {
                if (
                    file.endsWith(`${path.sep}manifest.json`) &&
                    componentsDirs.some(dir =>
                        file.startsWith(dir + path.sep)
                    )
                ) {
                    checkDependencies();
                }
            });

            server.watcher.on('add', file => {
                if (
                    file.endsWith(`${path.sep}manifest.json`) &&
                    componentsDirs.some(dir =>
                        file.startsWith(dir + path.sep)
                    )
                ) {
                    checkDependencies();
                }
            });
        },
    };
}
