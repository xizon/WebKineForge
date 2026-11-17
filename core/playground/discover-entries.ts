import fs from 'node:fs';
import path from 'node:path';

import type { PlaygroundEntries } from '../utils/types.ts';



/**
 * Recursively collect TSX entry files.
 */
function collectTSXFiles(directory: string): string[] {
    if (!fs.existsSync(directory)) {
        return [];
    }

    const files: string[] = [];

    for (const entry of fs.readdirSync(directory, {
        withFileTypes: true,
    })) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...collectTSXFiles(fullPath));
            continue;
        }

        if (entry.isFile() && entry.name.endsWith('.tsx')) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Discover generated Playground entries.
 */
export function discoverPlaygroundEntries(
    siteRoot: string
): PlaygroundEntries {
    const entriesRoot = path.resolve(
        siteRoot,
        '.wkf/playground/entries'
    );

    const files = collectTSXFiles(entriesRoot);

    const entries: PlaygroundEntries = {};

    for (const filePath of files) {
        const relativePath = path.relative(
            entriesRoot,
            filePath
        );

        const entryName = `playground-${relativePath
            .replace(/\.tsx$/, '')
            .replace(/[\\/]+/g, '-')}`;

        if (entries[entryName]) {
            throw new Error(
                `[WKF][PLAYGROUND] Duplicate entry: ${entryName}`
            );
        }

        entries[entryName] = path.resolve(filePath);
    }

    return entries;
}