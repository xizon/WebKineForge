/*
TEST:
npx tsx core/playground/__test__/_examples_s8.ts

PURPOSE:
Verify JS/CSS asset collection for all Playground demos.
*/

import fs from 'node:fs';

import {
    collectPlaygroundAssets,
} from '../../core/playground/collect-assets.ts';

import type {
    PlaygroundManifest
} from '../../core/utils/types.ts';

const manifestPath =
    'sites/default-site/dist/.vite/manifest.json';

const manifest = JSON.parse(
    fs.readFileSync(manifestPath, 'utf8')
) as PlaygroundManifest;

const entries = [
    'playground-hero-3d-01-basic-usage',
    'playground-hero-3d-02-provide-the-next-section-target',

    'playground-photo-scatter-01-basic-usage',
    'playground-photo-scatter-02-custom-image-tiles',

    'playground-scenes-01-basic-usage',
    'playground-scenes-02-configure-the-stack',
];

for (const entryName of entries) {
    console.log(`\n========== ${entryName} ==========\n`);

    const assets = collectPlaygroundAssets(
        manifest,
        entryName
    );

    console.log(
        JSON.stringify(assets, null, 2)
    );
}