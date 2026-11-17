
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

import { readJson } from '../../core/utils/helper.ts';
import { discoverTemplates } from '../../core/discovery/templates.ts';

vi.mock('../../core/utils/helper.ts', () => ({
    readJson: vi.fn(),
}));

describe('Template Discovery', () => {
    let rootDir: string;
    let componentsDir: string;
    let pagesDir: string;
    let site: SiteContext;

    beforeEach(() => {
        rootDir = mkdtempSync(
            path.join(tmpdir(), 'wkf-discovery-')
        );

        componentsDir = path.join(rootDir, 'components');
        pagesDir = path.join(rootDir, 'pages');

        mkdirSync(componentsDir, { recursive: true });
        mkdirSync(pagesDir, { recursive: true });

        site = {
            paths: {
                components: componentsDir,
                pages: pagesDir,
            },
        } as SiteContext;

        vi.mocked(readJson).mockReturnValue({
            name: 'test',
        } as never);
    });

    afterEach(() => {
        rmSync(rootDir, {
            recursive: true,
            force: true,
        });

        vi.clearAllMocks();
    });

    function createComponent(
        name: string,
        options: {
            manifest?: boolean;
            template?: boolean;
        } = {}
    ) {
        const directory = path.join(componentsDir, name);

        mkdirSync(directory, { recursive: true });

        if (options.manifest !== false) {
            writeFileSync(
                path.join(directory, 'manifest.json'),
                '{}'
            );
        }

        if (options.template !== false) {
            writeFileSync(
                path.join(directory, 'template.tsx'),
                'export default function Component() {}'
            );
        }

        return path.join(directory, 'template.tsx');
    }

    function createPage(
        name: string,
        options: {
            manifest?: boolean;
            template?: boolean;
        } = {}
    ) {
        const directory = path.join(pagesDir, name);

        mkdirSync(directory, { recursive: true });

        if (options.manifest !== false) {
            writeFileSync(
                path.join(directory, 'manifest.json'),
                '{}'
            );
        }

        if (options.template !== false) {
            writeFileSync(
                path.join(directory, 'index.tsx'),
                'export default function Page() {}'
            );
        }

        return path.join(directory, 'index.tsx');
    }

    it('should discover valid component templates', () => {
        const componentPath = createComponent('hero-section');

        const result = discoverTemplates(site);

        expect(result).toContain(componentPath);
    });

    it('should discover valid page templates', () => {
        const pagePath = createPage('home');

        const result = discoverTemplates(site);

        expect(result).toContain(pagePath);
    });

    it('should discover both component and page templates', () => {
        const componentPath = createComponent('hero-section');
        const pagePath = createPage('home');

        const result = discoverTemplates(site);

        expect(result).toEqual([
            componentPath,
            pagePath,
        ]);
    });

    it('should ignore directories without manifest.json', () => {
        createComponent('missing-manifest', {
            manifest: false,
        });

        createPage('missing-manifest', {
            manifest: false,
        });

        expect(discoverTemplates(site)).toEqual([]);
    });

    it('should ignore directories without template files', () => {
        createComponent('missing-template', {
            template: false,
        });

        createPage('missing-template', {
            template: false,
        });

        expect(discoverTemplates(site)).toEqual([]);
    });

    it('should ignore invalid manifest data', () => {
        createComponent('invalid-component');
        createPage('invalid-page');

        vi.mocked(readJson).mockReturnValue(null as never);

        expect(discoverTemplates(site)).toEqual([]);
    });

    it('should ignore non-object manifest data', () => {
        createComponent('invalid-component');

        vi.mocked(readJson).mockReturnValue(
            'invalid' as never
        );

        expect(discoverTemplates(site)).toEqual([]);
    });

    it('should skip missing component and page directories', () => {
        site.paths.components = path.join(rootDir, 'missing-components');
        site.paths.pages = path.join(rootDir, 'missing-pages');

        expect(discoverTemplates(site)).toEqual([]);
    });

    it('should ignore files inside source directories', () => {
        writeFileSync(
            path.join(componentsDir, 'not-a-component.tsx'),
            'export default function Test() {}'
        );

        writeFileSync(
            path.join(pagesDir, 'not-a-page.tsx'),
            'export default function Test() {}'
        );

        expect(discoverTemplates(site)).toEqual([]);
    });

    it('should not discover nested component or page directories recursively', () => {
        const nestedComponentDir = path.join(
            componentsDir,
            'group',
            'hero'
        );

        const nestedPageDir = path.join(
            pagesDir,
            'group',
            'home'
        );

        mkdirSync(nestedComponentDir, { recursive: true });
        mkdirSync(nestedPageDir, { recursive: true });

        writeFileSync(
            path.join(nestedComponentDir, 'manifest.json'),
            '{}'
        );

        writeFileSync(
            path.join(nestedComponentDir, 'template.tsx'),
            'export default function Hero() {}'
        );

        writeFileSync(
            path.join(nestedPageDir, 'manifest.json'),
            '{}'
        );

        writeFileSync(
            path.join(nestedPageDir, 'index.tsx'),
            'export default function Home() {}'
        );

        expect(discoverTemplates(site)).toEqual([]);
    });

    it('should return unique template paths', () => {
        createComponent('hero-section');
        createComponent('product-card');

        createPage('home');
        createPage('about');

        const result = discoverTemplates(site);

        expect(new Set(result).size).toBe(result.length);
    });
});
