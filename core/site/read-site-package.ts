/**
 * Retrieve Package
 */
import path from 'node:path';
import { readJson } from '../utils/helper.ts';
import type { SitePackageJson } from '../utils/types.ts';

export function readSitePackage(siteRoot: string): SitePackageJson {
    const packagePath = path.join(siteRoot, 'package.json');
    const packageJson = readJson<SitePackageJson>(packagePath);

    if (!packageJson) {
        throw new Error(
            `[WKF] Failed to read package.json: ${packagePath}`
        );
    }

    return packageJson;
}

export function getSiteExternals(
    siteRoot: string
): Record<string, string> {
    const packageJson = readSitePackage(siteRoot);
    const externals = packageJson.build?.externals ?? {};

    for (const [packageName, globalName] of Object.entries(externals)) {
        if (!packageName.trim() || !globalName.trim()) {
            throw new Error(
                `[WKF] Invalid external configuration: ${packageName}`
            );
        }
    }

    return externals;
}