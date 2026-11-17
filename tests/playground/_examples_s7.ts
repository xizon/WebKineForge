/*

TEST：
npx tsx core/playground/__test__/_examples_s7.ts


PURPOSE:
Inspect Playground entries and their related JS/CSS chunks.
*/


import fs from 'node:fs';

interface ManifestEntry {
    file?: string;
    name?: string;
    isEntry?: boolean;
    isDynamicEntry?: boolean;
    css?: string[];
    imports?: string[];
    dynamicImports?: string[];
}

const manifestPath =
    'sites/default-site/dist/.vite/manifest.json';

const manifest = JSON.parse(
    fs.readFileSync(manifestPath, 'utf8')
) as Record<string, ManifestEntry>;

const pattern =
    /playground-|hero-3d|photo-scatter|scene-item|preload-helper|virtual:auto-entry|\.css$/i;

for (const [key, entry] of Object.entries(manifest)) {
    const related = pattern.test([
        key,
        entry.file,
        entry.name,
    ].join(' '));

    if (related === false) continue;

    console.log(`\n========== ${key} ==========\n`);

    console.log(
        JSON.stringify(
            {
                file: entry.file,
                name: entry.name,
                isEntry: entry.isEntry,
                isDynamicEntry: entry.isDynamicEntry,
                css: entry.css,
                imports: entry.imports,
                dynamicImports: entry.dynamicImports,
            },
            null,
            2
        )
    );
}