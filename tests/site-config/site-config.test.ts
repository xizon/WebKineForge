
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadSite } from '../../core/site/load-site.ts';
import type { SiteContext } from '../../core/utils/types.ts';
import fs from 'node:fs';

vi.mock('node:fs');

describe('Site Configuration and Path Resolution', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should load and merge default options with site-specific configuration', () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);

        vi.mocked(fs.readFileSync).mockReturnValue(
            JSON.stringify({
                name: 'portfolio',
                version: '1.0.0',
                lang: 'en-US',
                title: 'Portfolio Website',
                description: 'Personal portfolio website.',
                author: {
                    name: 'UIUX Lab',
                    website: 'https://uiux.cc',
                    email: 'uiuxlab@gmail.com',
                },
                template: './site.html',
                paths: {
                    src: './src',
                    public: './public',
                    dist: './dist',
                },
                entries: {
                    pages: './src/pages',
                    components: './src/components',
                    styles: './src/styles',
                },
            })
        );

        const config: SiteContext = loadSite(
            '/workspace/sites/portfolio'
        );

        expect(config.name).toBe('portfolio');

        expect(config.paths).toEqual({
            src: '/workspace/sites/portfolio/src',
            public: '/workspace/sites/portfolio/public',
            dist: '/workspace/sites/portfolio/dist',
            pages: '/workspace/sites/portfolio/src/pages',
            components: '/workspace/sites/portfolio/src/components',
            styles: '/workspace/sites/portfolio/src/styles',
            template: '/workspace/sites/portfolio/site.html',
        });
    });
});
