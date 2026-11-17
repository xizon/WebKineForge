
import { describe, it, expect } from 'vitest';

import { collectAssets } from '../../core/processors/render-page.ts';

import type {
    PageDefinition,
    ViteManifest,
} from '../../core/utils/types.ts';


describe('collectAssets', () => {
    it('should collect JS and CSS assets recursively and remove duplicates', () => {
        const manifest = {
            'src/pages/home.tsx': {
                file: 'assets/home.js',
                css: ['assets/home.css'],
                imports: ['shared.js', 'layout.js'],
            },
            'shared.js': {
                file: 'assets/shared.js',
                css: ['assets/shared.css'],
                imports: ['layout.js'],
            },
            'layout.js': {
                file: 'assets/layout.js',
                css: ['assets/layout.css', 'assets/shared.css'],
            },
        } as ViteManifest;

        const page = {
            clientRel: 'src/pages/home.tsx',
        } as PageDefinition;

        const result = collectAssets(manifest, page);

        expect(result).toEqual({
            js: ['./assets/home.js'],
            css: [
                './assets/home.css',
                './assets/shared.css',
                './assets/layout.css',
            ],
        });
    });

    it('should throw an error when the entry is missing', () => {
        const manifest = {} as ViteManifest;

        const page = {
            clientRel: 'src/pages/missing.tsx',
        } as PageDefinition;

        expect(() => collectAssets(manifest, page)).toThrow(
            '[WKF] no build assets for src/pages/missing.tsx'
        );
    });

    it('should handle circular imports without infinite recursion', () => {
        const manifest = {
            'src/pages/home.tsx': {
                file: 'assets/home.js',
                css: ['assets/home.css'],
                imports: ['shared.js'],
            },
            'shared.js': {
                file: 'assets/shared.js',
                css: ['assets/shared.css'],
                imports: ['src/pages/home.tsx'],
            },
        } as ViteManifest;

        const page = {
            clientRel: 'src/pages/home.tsx',
        } as PageDefinition;

        expect(collectAssets(manifest, page)).toEqual({
            js: ['./assets/home.js'],
            css: [
                './assets/home.css',
                './assets/shared.css',
            ],
        });
    });

    it('should ignore missing imported chunks', () => {
        const manifest = {
            'src/pages/home.tsx': {
                file: 'assets/home.js',
                css: ['assets/home.css'],
                imports: ['missing.js'],
            },
        } as ViteManifest;

        const page = {
            clientRel: 'src/pages/home.tsx',
        } as PageDefinition;

        expect(collectAssets(manifest, page)).toEqual({
            js: ['./assets/home.js'],
            css: ['./assets/home.css'],
        });
    });
});
