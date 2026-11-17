/**
 * Site Context
 *
 * Initialize the current Site and its build configuration.
 */

import fs from 'node:fs';
import path from 'node:path';

import { loadSite } from './load-site.ts';
import { discoverPages } from '../processors/pages.ts';

import type { SitePackageJson } from '../utils/types.ts';
import type { ExternalMap } from '../utils/types.ts';


export interface SiteContext {
    projectRoot: string;
    siteName: string;
    site: ReturnType<typeof loadSite>;
    pages: ReturnType<typeof discoverPages>;
    packageJson: SitePackageJson;
    externals: ExternalMap;
}


export function createSiteContext(
    projectRoot: string,
    siteName = process.env.SITE || 'default-site'
): SiteContext {
    const resolvedProjectRoot = path.resolve(projectRoot);

    // Load Site
    const siteRoot = path.resolve(
        resolvedProjectRoot,
        'sites',
        siteName
    );

    const site = loadSite(siteRoot);

    // Discover pages
    const pages = discoverPages(site);

    // Load Site package.json
    const packagePath = path.join(site.root, 'package.json');

    if (!fs.existsSync(packagePath)) {
        throw new Error(
            `[WKF] Site package.json not found: ${packagePath}`
        );
    }

    const packageJson = JSON.parse(
        fs.readFileSync(packagePath, 'utf-8')
    ) as SitePackageJson;

    // Validate External configuration
    const externals = packageJson.build?.externals ?? {};

    for (const [packageName, globalName] of Object.entries(externals)) {
        if (
            !packageName.trim() ||
            typeof globalName !== 'string' ||
            !globalName.trim()
        ) {
            throw new Error(
                `[WKF] Invalid external configuration: ${packageName}`
            );
        }
    }

    return {
        projectRoot: resolvedProjectRoot,
        siteName,
        site,
        pages,
        packageJson,
        externals,
    };
}