

import type {
    PlaygroundManifest,
    PlaygroundAssets
} from '../utils/types.ts';


/**
 * Collect JS and CSS resources for a Playground entry.
 */

export function collectPlaygroundAssets(
    manifest: PlaygroundManifest,
    entryName: string
): PlaygroundAssets {
    // Find the entry.
    const entry = Object.entries(manifest).find(
        ([, chunk]) =>
            chunk.name === entryName &&
            chunk.isEntry === true
    );

    if (!entry) {
        throw new Error(
            `[WKF][PLAYGROUND] Manifest entry not found: ${entryName}`
        );
    }

    const [entryKey, entryChunk] = entry;

    // Collect CSS recursively from static imports.
    const visited = new Set<string>();
    const css = new Set<string>();

    function walk(key: string): void {
        if (visited.has(key)) return;

        visited.add(key);

        const chunk = manifest[key];

        if (!chunk) {
            throw new Error(
                `[WKF][PLAYGROUND] Manifest chunk not found: ${key}`
            );
        }

        for (const href of chunk.css ?? []) {
            css.add(href);
        }

        for (const imported of chunk.imports ?? []) {
            walk(imported);
        }
    }

    walk(entryKey);

    return {
        js: [`../${entryChunk.file}`],
        css: [...css].map(
            (href) => `../${href}`
        ),
    };
}