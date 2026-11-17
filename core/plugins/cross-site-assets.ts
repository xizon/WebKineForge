
/**
 * Cross-Site Assets Resolver
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import type { AssetInfo } from '../utils/types.ts';

const VIRTUAL_PREFIX = '\0cross-site-asset:';
const URL_PREFIX = '/@site/';

// Record the relationship between resource URLs and Rollup referenceIds
// to resolve path-related issues during HTML rendering.
const emittedAssets = new Map<string, string>();

export function crossSiteAssetsPlugin(): Plugin {
    let config: ResolvedConfig;
    let sitesDir = '';

    const assets = new Map<string, AssetInfo>();

    function isInsideDirectory(root: string, target: string) {
        const relative = path.relative(root, target);

        return (
            relative === '' ||
            (
                relative !== '..' &&
                !relative.startsWith(`..${path.sep}`) &&
                !path.isAbsolute(relative)
            )
        );
    }

    function resolveAsset(source: string): AssetInfo | null {
        const prefix = '@/site/';

        if (!source.startsWith(prefix)) return null;

        const parts = source.slice(prefix.length).split('/');

        if (
            parts.length < 3 ||
            parts.some((part) => !part)
        ) {
            throw new Error(
                `[WKF] Invalid cross-site asset import: ${source}`
            );
        }

        const [siteName, resourceType, ...resourcePaths] = parts;

        if (resourceType !== 'assets') return null;

        const targetSiteRoot = path.resolve(sitesDir, siteName);

        if (!isInsideDirectory(sitesDir, targetSiteRoot)) {
            throw new Error(
                `[WKF] Invalid cross-site site path: ${siteName}`
            );
        }

        const siteConfigPath = path.join(
            targetSiteRoot,
            'site.json'
        );

        if (!fs.existsSync(siteConfigPath)) {
            throw new Error(`[WKF] Site not found: ${siteName}`);
        }

        const siteConfig = JSON.parse(
            fs.readFileSync(siteConfigPath, 'utf-8')
        );

        if (siteConfig.name !== siteName) {
            throw new Error(
                `[WKF] Invalid site configuration: ${siteName}`
            );
        }

        const assetsRoot = path.resolve(
            targetSiteRoot,
            'public',
            'assets'
        );

        const filePath = path.resolve(
            assetsRoot,
            ...resourcePaths
        );

        if (!isInsideDirectory(assetsRoot, filePath)) {
            throw new Error(
                `[WKF] Invalid asset path: ${source}`
            );
        }

        // Missing assets should not interrupt page rendering or building.
        if (
            !fs.existsSync(filePath) ||
            !fs.statSync(filePath).isFile()
        ) {
            console.warn(
                `[WKF][ASSET] Asset not found, skipped: ${source}`
            );

            return {
                filePath,
                devUrl: '',
            };
        }

        return {
            filePath,
            devUrl: `${URL_PREFIX}${siteName}/assets/${resourcePaths
                .map(encodeURIComponent)
                .join('/')}`,
        };
    }

    return {
        name: 'cross-site-assets',
        enforce: 'pre',

        configResolved(resolvedConfig: ResolvedConfig) {
            config = resolvedConfig;
            sitesDir = path.resolve(config.root, '..');
        },

        resolveId(source) {
            if (!source.startsWith('@/site/')) return null;

            const asset = resolveAsset(source);

            if (!asset) return null;

            const id = VIRTUAL_PREFIX + asset.filePath;

            assets.set(id, asset);

            return id;
        },

        load(id) {
            if (!id.startsWith(VIRTUAL_PREFIX)) return null;

            const asset = assets.get(id);

            if (!asset) return null;

            // Missing asset: export undefined without interrupting rendering.
            if (!asset.devUrl) {
                return {
                    code: 'export default undefined;',
                    map: null,
                };
            }

            // Development: return a URL served by the dev middleware.
            if (config.command === 'serve') {
                return {
                    code: `export default ${JSON.stringify(asset.devUrl)};`,
                    map: null,
                };
            }

            // Production: emit the file and let Rollup generate its URL.
            const referenceId = this.emitFile({
                type: 'asset',
                name: path.basename(asset.filePath),
                source: fs.readFileSync(asset.filePath),
            });

            emittedAssets.set(asset.devUrl, referenceId);

            return {
                code: `export default import.meta.ROLLUP_FILE_URL_${referenceId};`,
                map: null,
            };
        },

        // Connected with render-page.ts
        generateBundle() {
            const assetMap: Record<string, string> = {};

            for (const [devUrl, referenceId] of emittedAssets) {
                assetMap[devUrl] = this.getFileName(referenceId);
            }

            this.emitFile({
                type: 'asset',
                fileName: 'cross-site-assets.json',
                source: JSON.stringify(assetMap, null, 2),
            });
        },

        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (!req.url?.startsWith(URL_PREFIX)) {
                    return next();
                }

                if (req.method !== 'GET' && req.method !== 'HEAD') {
                    res.statusCode = 405;
                    return res.end('Method Not Allowed');
                }

                let pathname: string;

                try {
                    pathname = decodeURIComponent(
                        req.url.split('?')[0]
                    );
                } catch {
                    res.statusCode = 400;
                    return res.end('Invalid URL');
                }

                const parts = pathname
                    .slice(URL_PREFIX.length)
                    .split('/');

                const [siteName, resourceType, ...resourcePaths] = parts;

                if (
                    !siteName ||
                    resourceType !== 'assets' ||
                    resourcePaths.length === 0
                ) {
                    res.statusCode = 400;
                    return res.end('Invalid asset URL');
                }

                const source = [
                    '@/site',
                    siteName,
                    'assets',
                    ...resourcePaths,
                ].join('/');

                let asset: AssetInfo | null;

                try {
                    asset = resolveAsset(source);
                } catch {
                    res.statusCode = 404;
                    return res.end('Asset not found');
                }

                if (!asset || !asset.devUrl) {
                    res.statusCode = 404;
                    return res.end('Asset not found');
                }

                res.setHeader(
                    'Content-Type',
                    getMimeType(asset.filePath)
                );

                res.setHeader('Cache-Control', 'no-cache');

                if (req.method === 'HEAD') {
                    return res.end();
                }

                fs.createReadStream(asset.filePath).pipe(res);
            });
        },
    };
}

function getMimeType(filePath: string): string {
    const types: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.avif': 'image/avif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.otf': 'font/otf',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
    };

    return (
        types[path.extname(filePath).toLowerCase()] ??
        'application/octet-stream'
    );
}
