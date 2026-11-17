
import { describe, it, expect } from 'vitest';

import {
    renderDocument,
    renderCatalogHtml,
    matchRequestPath,
} from '../../core/processors/html-shell.ts';


import type {
    PageDefinition,
    SiteContext,
} from '../../core/utils/types.ts';

describe('renderDocument', () => {
    const options = {
        seo: {
            lang: 'en',
            title: 'Test Page',
            description: 'Page description',
        },
        body: '<main>Hello World</main>',
        beautify: false,
    };

    it('should render a complete HTML document', () => {
        const html = renderDocument(options);

        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('<html lang="en">');
        expect(html).toContain('<title>Test Page</title>');
        expect(html).toContain('<main>Hello World</main>');
        expect(html).toContain('</html>');
    });

    it('should render SEO metadata and asset links', () => {
        const html = renderDocument({
            ...options,
            seo: {
                ...options.seo,
                keywords: ['design', 'development'],
                author: 'WKF',
                canonical: 'https://example.com/page',
                'og:title': 'Open Graph Title',
            },
            cssHrefs: ['./assets/style.css'],
            jsHrefs: ['./assets/app.js'],
            viteClient: true,
        });

        expect(html).toContain('name="description"');
        expect(html).toContain('name="keywords"');
        expect(html).toContain('design, development');
        expect(html).toContain('name="author"');
        expect(html).toContain('rel="canonical"');
        expect(html).toContain('property="og:title"');
        expect(html).toContain('./assets/style.css');
        expect(html).toContain('./assets/app.js');
        expect(html).toContain('/@vite/client');
    });

    it('should use the site title for the index page', () => {
        const html = renderDocument(
            {
                ...options,
                isIndex: true,
            },
            {
                config: { title: 'My Site' },
                paths: {},
            } as SiteContext
        );

        expect(html).toContain('<title>My Site</title>');
        expect(html).toContain('auxiliary index page');
    });

    it('should escape HTML content', () => {
        const html = renderDocument({
            ...options,
            seo: {
                ...options.seo,
                title: '<script>alert(1)</script>',
                description: '<unsafe>',
            },
        });

        expect(html).not.toContain('<script>alert(1)</script>');
        expect(html).toContain('&lt;script&gt;');
        expect(html).toContain('&lt;unsafe&gt;');
    });
});

describe('renderCatalogHtml', () => {
    const site = {
        config: {
            lang: 'en',
            title: 'Test Site',
            name: 'Test Site',
            description: 'Site description',
        },
        paths: {},
    } as SiteContext;

    it('should render the catalog page', () => {
        const html = renderCatalogHtml(site, []);

        expect(html).toContain('Components');
        expect(html).toContain('Pages');
        expect(html).toContain('Component Preview');
        expect(html).toContain('Only available with');
        expect(html).toContain('wkf-catalog');
    });

    it('should enable the playground link when enabled', () => {
        const html = renderCatalogHtml(site, [], true);

        expect(html).toContain('href="http://localhost:3000/playground"');
        expect(html).toContain('target="_blank"');
    });
});

describe('matchRequestPath', () => {
    const page = {
        slug: 'about',
        htmlFileName: 'about.html',
    } as PageDefinition;

    const pages = [page];

    it('should match the catalog index paths', () => {
        expect(matchRequestPath('/', pages)).toEqual({
            type: 'catalog',
        });

        expect(matchRequestPath('/index.html', pages)).toEqual({
            type: 'catalog',
        });
    });

    it('should match a page by slug or filename', () => {
        expect(matchRequestPath('/about', pages)).toEqual({
            type: 'page',
            page,
        });

        expect(matchRequestPath('/about.html', pages)).toEqual({
            type: 'page',
            page,
        });
    });

    it('should ignore static asset paths', () => {
        expect(matchRequestPath('/assets/app.js', pages)).toBeNull();
        expect(matchRequestPath('/src/main.ts', pages)).toBeNull();
        expect(matchRequestPath('/@vite/client', pages)).toBeNull();
        expect(matchRequestPath('/node_modules/test.js', pages)).toBeNull();
    });

    it('should ignore unknown and nested paths', () => {
        expect(matchRequestPath('/unknown', pages)).toBeNull();
        expect(matchRequestPath('/about/details', pages)).toBeNull();
    });

    it('should ignore query strings when matching paths', () => {
        expect(matchRequestPath('/about?foo=bar', pages)).toEqual({
            type: 'page',
            page,
        });
    });
});
