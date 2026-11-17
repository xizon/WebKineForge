/*
TEST:
npx tsx core/playground/__test__/_examples_s9.ts

PURPOSE:
Test standalone Playground HTML document generation.
*/

import fs from 'node:fs';
import path from 'node:path';

import { loadSite } from '../../core/site/load-site.ts';

import {
    renderPlaygroundDocument,
} from '../../core/playground/render-demo-document.ts';

import {
    collectPlaygroundAssets
} from '../../core/playground/collect-assets.ts';

import type {
    PlaygroundManifest
} from '../../core/utils/types.ts';

const siteRoot = path.resolve(
    'sites/default-site'
);

const site = loadSite(siteRoot);

const manifestPath = path.join(
    site.paths.dist,
    '.vite/manifest.json'
);

const manifest = JSON.parse(
    fs.readFileSync(manifestPath, 'utf8')
) as PlaygroundManifest;

// Test one Demo first.
const entryName =
    'playground-hero-3d-01-basic-usage';

const assets = collectPlaygroundAssets(
    manifest,
    entryName
);

const emptySection = {
    title: '',
    paragraphs: [],
    lists: [],
    tables: [],
};

const html = renderPlaygroundDocument(
    {
        componentName: 'Hero 3D',

        overview:
            'A full-screen hero section featuring an interactive 3D particle field and an extruded SVG logo.',

        demoTitle: 'Basic Usage',

        demoDescription:
            'A basic full-screen hero section using the default configuration.',

        // Temporary placeholder.
        // Real component SSR will be added in the next step.
        previewHtml: `
            <div class="playground-test">
                Playground HTML rendering test.
            </div>
        `,

        assets,
        demoCode: '<Hero3D />',


        apiReference: emptySection,
        dependencies: emptySection,
    },
    site
);

const outputDir = path.join(
    site.paths.dist,
    'playground'
);

fs.mkdirSync(outputDir, {
    recursive: true,
});

const outputFile = path.join(
    outputDir,
    '__document-test.html'
);

fs.writeFileSync(
    outputFile,
    html,
    'utf8'
);

console.log('[PASS] Playground HTML generated.');
console.log(outputFile);