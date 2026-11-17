
import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    vi,
} from 'vitest';

import {
    mkdtempSync,
    mkdirSync,
    writeFileSync,
    rmSync,
} from 'node:fs';

import { tmpdir } from 'node:os';
import path from 'node:path';

import type { SiteContext } from '../../core/utils/types.ts';

import { discoverPages } from '../../core/discovery/pages.ts';


describe('Page Discovery', () => {
    let rootDir: string;
    let pagesDir: string;
    let site: SiteContext;

    beforeEach(() => {
        rootDir = mkdtempSync(
            path.join(tmpdir(), 'wkf-pages-')
        );

        pagesDir = path.join(rootDir, 'src', 'pages');

        mkdirSync(pagesDir, { recursive: true });

        site = {
            root: rootDir,
            paths: {
                pages: pagesDir,
            },
            config: {
                lang: 'en',
            },
        } as SiteContext;
    });

    afterEach(() => {
        rmSync(rootDir, {
            recursive: true,
            force: true,
        });

        vi.restoreAllMocks();
    });

    function createPage(
        slug: string,
        options: {
            manifest?: Record<string, unknown>;
            index?: boolean;
        } = {}
    ) {
        const dir = path.join(pagesDir, slug);

        mkdirSync(dir, { recursive: true });

        if (options.index !== false) {
            writeFileSync(
                path.join(dir, 'index.tsx'),
                'export default function Page() {}'
            );
        }

        if (options.manifest) {
            writeFileSync(
                path.join(dir, 'manifest.json'),
                JSON.stringify(options.manifest),
                'utf-8'
            );
        }

        return dir;
    }

    it('should discover a valid page', () => {
        createPage('home');

        const result = discoverPages(site);

        expect(result).toHaveLength(1);
        expect(result[0].slug).toBe('home');
    });

    it('should resolve page file paths correctly', () => {
        const dir = createPage('about');

        const result = discoverPages(site);
        const page = result[0];

        const entryPath = path.join(dir, 'index.tsx');
        const relativePath = 'src/pages/about/index.tsx';

        expect(page.templatePath).toBe(entryPath);
        expect(page.clientFile).toBe(entryPath);
        expect(page.clientPath).toBe(`/${relativePath}`);
        expect(page.clientRel).toBe(relativePath);
        expect(page.dir).toBe(dir);
    });

    it('should use default page configuration when manifest is missing', () => {
        createPage('home');

        const result = discoverPages(site);
        const page = result[0];

        expect(page.bodyClass).toBe('page');
        expect(page.htmlFileName).toBe('home.html');

        expect(page.seo).toEqual({
            lang: 'en',
            title: 'home',
            description: '',
            author: null,
            keywords: null,
            canonical: null,
        });
    });

    it('should read page manifest configuration', () => {
        createPage('about', {
            manifest: {
                name: 'About Us',
                output: 'company/about.html',
                bodyClass: 'about-page',
                seo: {
                    lang: 'zh-CN',
                    title: 'About Our Company',
                    description: 'Company introduction',
                    author: 'WebKineForge',
                    keywords: ['company', 'about'],
                    canonical: 'https://example.com/about',
                },
            },
        });

        const result = discoverPages(site);
        const page = result[0];

        expect(page.bodyClass).toBe('about-page');
        expect(page.htmlFileName).toBe('about.html');

        expect(page.seo).toEqual({
            lang: 'zh-CN',
            title: 'About Our Company',
            description: 'Company introduction',
            author: 'WebKineForge',
            keywords: ['company', 'about'],
            canonical: 'https://example.com/about',
        });
    });

    it('should use manifest name as SEO title when seo title is missing', () => {
        createPage('about', {
            manifest: {
                name: 'About Us',
            },
        });

        const result = discoverPages(site);

        expect(result[0].seo.title).toBe('About Us');
    });

    it('should use page slug as SEO title when manifest name is missing', () => {
        createPage('contact');

        const result = discoverPages(site);

        expect(result[0].seo.title).toBe('contact');
    });

    it('should ignore page directories without index.tsx', () => {
        createPage('invalid', {
            index: false,
        });

        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const result = discoverPages(site);

        expect(result).toEqual([]);
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('missing index.tsx')
        );
    });

    it('should ignore files inside the pages directory', () => {
        writeFileSync(
            path.join(pagesDir, 'readme.md'),
            '# Pages'
        );

        createPage('home');

        const result = discoverPages(site);

        expect(result).toHaveLength(1);
        expect(result[0].slug).toBe('home');
    });

    it('should return an empty array when pages directory does not exist', () => {
        site.paths.pages = path.join(rootDir, 'missing-pages');

        expect(discoverPages(site)).toEqual([]);
    });

    it('should sort discovered pages by slug', () => {
        createPage('contact');
        createPage('about');
        createPage('home');

        const result = discoverPages(site);

        expect(result.map(page => page.slug)).toEqual([
            'about',
            'contact',
            'home',
        ]);
    });

    it('should use only the basename of manifest output', () => {
        createPage('about', {
            manifest: {
                output: 'nested/company/about.html',
            },
        });

        const result = discoverPages(site);

        expect(result[0].htmlFileName).toBe('about.html');
    });

    it('should return null keywords when manifest keywords are empty or invalid', () => {
        createPage('empty-keywords', {
            manifest: {
                seo: {
                    keywords: [],
                },
            },
        });

        createPage('invalid-keywords', {
            manifest: {
                seo: {
                    keywords: 'company,about',
                },
            },
        });

        const result = discoverPages(site);

        expect(result[0].seo.keywords).toBeNull();
        expect(result[1].seo.keywords).toBeNull();
    });

    it('should preserve custom SEO attributes', () => {
        createPage('custom-seo', {
            manifest: {
                seo: {
                    title: 'Custom Title',
                    ogImage: '/images/preview.png',
                    robots: 'index,follow',
                },
            },
        });

        const result = discoverPages(site);

        expect(result[0].seo).toMatchObject({
            title: 'Custom Title',
            ogImage: '/images/preview.png',
            robots: 'index,follow',
        });
    });
});
