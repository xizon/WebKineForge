/**
 * Gets the Tailwind CSS prefix from a Site.
 */
/*
Usage:

const sitePrefix = getPrefix(site.paths.styles);
const prefix = prefixOverride || sitePrefix;
*/
import fs from 'node:fs';
import path from 'node:path';
import { readTailwindPrefix } from './helper.ts';

export const DEFAULT_PREFIX = 'wkf';

export function getPrefix(stylesPath: string): string {
    try {
        const cssPath = path.join(stylesPath, 'tailwind.css');

        if (!fs.existsSync(cssPath)) {
            return DEFAULT_PREFIX;
        }

        const prefix = readTailwindPrefix(cssPath);

        if (!prefix || !/^[a-zA-Z][\w-]*$/.test(prefix)) {
            return DEFAULT_PREFIX;
        }

        return prefix;
    } catch {
        return DEFAULT_PREFIX;
    }
}