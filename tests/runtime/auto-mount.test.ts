
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { autoMount } from '../../core/plugins/auto-mount.ts';

import type { Plugin } from 'vite';

let tempDir: string;
let root: string;
let runtimeEntry: string;

function createFile(filePath: string, content = '') {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
}

function createFixture() {
    tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), 'wkf-auto-mount-')
    );

    // tempDir/
    //   sites/
    //     site-a/  <- current
    //     site-b/
    //   runtime/
    //     auto.ts

    const sitesDir = path.join(tempDir, 'sites');

    root = path.join(sitesDir, 'site-a');

    const siteB = path.join(sitesDir, 'site-b');

    runtimeEntry = path.join(tempDir, 'runtime', 'auto.ts');

    fs.mkdirSync(root, { recursive: true });
    fs.mkdirSync(siteB, { recursive: true });

    createFile(runtimeEntry, '// runtime entry');

    return {
        sitesDir,
        siteB,
    };
}

function initializePlugin(
    options: Parameters<typeof autoMount>[0] = {},
    command: 'serve' | 'build' = 'serve'
) {
    const plugin = autoMount(options);

    (plugin.configResolved as any)({
        command,
        root,
    });

    return plugin;
}

function getTransformResult(
    plugin: Plugin,
    code: string,
    id: string
) {
    return (plugin.transform as any)(code, id);
}

function getHtmlResult(plugin: Plugin) {
    const hook = plugin.transformIndexHtml as any;

    return hook.handler();
}

beforeEach(() => {
    createFixture();

    vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
    vi.restoreAllMocks();

    if (tempDir && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true,
        });
    }
});

describe('plugins/auto-mount', () => {
    // 1. 
    it('should create a Vite plugin', () => {
        const plugin = autoMount();

        expect(plugin.name).toBe('auto-mount');
        expect(plugin.enforce).toBe('pre');
        expect(plugin.configResolved).toBeTypeOf('function');
        expect(plugin.resolveId).toBeTypeOf('function');
        expect(plugin.load).toBeTypeOf('function');
        expect(plugin.transform).toBeTypeOf('function');
    });

    // 2. 
    it('should initialize when runtime entry exists', () => {
        const plugin = initializePlugin();

        expect(plugin.name).toBe('auto-mount');
    });

    // 3. 
    it('should throw when runtime entry does not exist', () => {
        const missingRuntime = path.join(
            tempDir,
            'missing',
            'auto.ts'
        );

        const plugin = autoMount({
            runtimeEntry: missingRuntime,
        });

        expect(() => {
            (plugin.configResolved as any)({
                command: 'serve',
                root,
            });
        }).toThrow(/Runtime entry not found/);
    });

    // 4. 
    it('should resolve virtual:auto-entry', () => {
        const plugin = initializePlugin();

        const result = (plugin.resolveId as any)(
            'virtual:auto-entry'
        );

        expect(result).toBe('\0virtual:auto-entry');
    });

    // 5. 
    it('should return null for unrelated module IDs', () => {
        const plugin = initializePlugin();

        expect(
            (plugin.resolveId as any)('some-other-module')
        ).toBeNull();
    });

    // 6. 
    it('should load the virtual runtime entry', () => {
        const plugin = initializePlugin();

        const result = (plugin.load as any)(
            '\0virtual:auto-entry'
        );

        expect(result).toContain(
            'import "@/runtime/auto"'
        );
    });

    // 7. 
    it('should return null for unrelated load IDs', () => {
        const plugin = initializePlugin();

        expect(
            (plugin.load as any)('\0some-other-module')
        ).toBeNull();
    });

    // 8. 
    it('should inject runtime into production page entries', () => {
        const pageEntry = path.join(root, 'src/main.ts');

        createFile(pageEntry, 'console.log("page");');

        const plugin = initializePlugin(
            {
                entryFiles: ['src/main.ts'],
            },
            'build'
        );

        const result = getTransformResult(
            plugin,
            'console.log("page");',
            pageEntry
        );

        expect(result).not.toBeNull();
        expect(result.code).toContain(
            "import('virtual:auto-entry')"
        );
        expect(result.code).toContain(
            'console.log("page");'
        );
        expect(result.map).toBeNull();
    });

    // 9.
    it('should not inject runtime into page entries during development', () => {
        const pageEntry = path.join(root, 'src/main.ts');

        createFile(pageEntry, 'console.log("page");');

        const plugin = initializePlugin(
            {
                entryFiles: ['src/main.ts'],
            },
            'serve'
        );

        const result = getTransformResult(
            plugin,
            'console.log("page");',
            pageEntry
        );

        expect(result).toBeNull();
    });

    // 10. 
    it('should inject component registration code with controller', () => {
        const componentDir = path.join(
            root,
            'src/components/hero'
        );

        const indexFile = path.join(
            componentDir,
            'index.ts'
        );

        createFile(indexFile, 'export const name = "hero";');
        createFile(
            path.join(componentDir, 'controller.ts'),
            'export function mount() {}'
        );

        createFile(
            path.join(componentDir, 'template.tsx'),
            'export function Template() {}'
        );

        createFile(
            path.join(componentDir, 'manifest.json'),
            JSON.stringify({ name: 'hero' })
        );

        const plugin = initializePlugin();

        const result = getTransformResult(
            plugin,
            'export const name = "hero";',
            indexFile
        );

        expect(result).not.toBeNull();

        expect(result.code).toContain(
            'registerComponent as __wkfRegister'
        );

        expect(result.code).toContain(
            "Template as __wkfTemplate"
        );

        expect(result.code).toContain(
            "import __wkfManifest from './manifest.json'"
        );

        expect(result.code).toContain(
            "import { mount as __wkfMount } from './controller'"
        );

        expect(result.code).toContain(
            '__wkfRegister('
        );

        expect(result.code).toContain(
            '__wkfManifest.name'
        );

        expect(result.map).toBeNull();
    });

    // 11. 
    it('should use noop mount when controller does not exist', () => {
        const componentDir = path.join(
            root,
            'src/components/hero'
        );

        const indexFile = path.join(
            componentDir,
            'index.ts'
        );

        createFile(indexFile, 'export const name = "hero";');

        createFile(
            path.join(componentDir, 'template.tsx'),
            'export function Template() {}'
        );

        createFile(
            path.join(componentDir, 'manifest.json'),
            JSON.stringify({ name: 'hero' })
        );

        const plugin = initializePlugin();

        const result = getTransformResult(
            plugin,
            'export const name = "hero";',
            indexFile
        );

        expect(result).not.toBeNull();

        expect(result.code).toContain(
            'const __wkfMount = () => {};'
        );

        expect(result.code).not.toContain(
            "from './controller'"
        );
    });

    // 12.
    it('should discover components from other sites', () => {
        const siteB = path.join(
            tempDir,
            'sites/site-b'
        );

        const componentDir = path.join(
            siteB,
            'src/components/shared'
        );

        const indexFile = path.join(
            componentDir,
            'index.ts'
        );

        createFile(indexFile, 'export const name = "shared";');

        createFile(
            path.join(componentDir, 'template.tsx'),
            'export function Template() {}'
        );

        createFile(
            path.join(componentDir, 'manifest.json'),
            JSON.stringify({ name: 'shared' })
        );

        const plugin = initializePlugin();

        const result = getTransformResult(
            plugin,
            'export const name = "shared";',
            indexFile
        );

        expect(result).not.toBeNull();

        expect(result.code).toContain(
            '__wkfRegister('
        );
    });

    // 13. 
    it('should ignore index.ts outside component directories', () => {
        const indexFile = path.join(
            root,
            'src/utils/index.ts'
        );

        createFile(indexFile, 'export const value = 1;');

        const plugin = initializePlugin();

        const result = getTransformResult(
            plugin,
            'export const value = 1;',
            indexFile
        );

        expect(result).toBeNull();
    });

    // 14. 
    it('should ignore nested index.ts files', () => {
        const indexFile = path.join(
            root,
            'src/components/hero/nested/index.ts'
        );

        createFile(indexFile, 'export const value = 1;');

        const plugin = initializePlugin();

        const result = getTransformResult(
            plugin,
            'export const value = 1;',
            indexFile
        );

        expect(result).toBeNull();
    });

    // 15. 
    it('should inject runtime script into HTML during development', () => {
        const plugin = initializePlugin(
            {},
            'serve'
        );

        const result = getHtmlResult(plugin);

        expect(result).toHaveLength(1);

        expect(result[0]).toEqual({
            tag: 'script',
            attrs: {
                type: 'module',
                src: '/@id/virtual:auto-entry',
            },
            injectTo: 'body',
        });
    });

    // 16.
    it('should not inject runtime script into HTML during production build', () => {
        const plugin = initializePlugin(
            {},
            'build'
        );

        const result = getHtmlResult(plugin);

        expect(result).toEqual([]);
    });

    // 17. 
    it('should not inject runtime script when autoMount is false', () => {
        const plugin = initializePlugin(
            {
                autoMount: false,
            },
            'serve'
        );

        const result = getHtmlResult(plugin);

        expect(result).toEqual([]);
    });

    // 18.
    it('should not inject runtime into production entries when autoMount is false', () => {
        const pageEntry = path.join(root, 'src/main.ts');

        createFile(pageEntry, 'console.log("page");');

        const plugin = initializePlugin(
            {
                autoMount: false,
                entryFiles: ['src/main.ts'],
            },
            'build'
        );

        const result = getTransformResult(
            plugin,
            'console.log("page");',
            pageEntry
        );

        expect(result).toBeNull();
    });

    // 19. 
    it('should use custom registryEntry', () => {
        const componentDir = path.join(
            root,
            'src/components/hero'
        );

        const indexFile = path.join(
            componentDir,
            'index.ts'
        );

        createFile(indexFile, 'export const name = "hero";');

        const plugin = initializePlugin({
            registryEntry: '@custom/runtime/register',
        });

        const result = getTransformResult(
            plugin,
            'export const name = "hero";',
            indexFile
        );

        expect(result.code).toContain(
            '"@custom/runtime/register"'
        );
    });

    // 20. 
    it('should support custom componentsDir', () => {
        const componentDir = path.join(
            root,
            'src/ui-components/hero'
        );

        const indexFile = path.join(
            componentDir,
            'index.ts'
        );

        createFile(indexFile, 'export const name = "hero";');

        const plugin = initializePlugin({
            componentsDir: 'src/ui-components',
        });

        const result = getTransformResult(
            plugin,
            'export const name = "hero";',
            indexFile
        );

        expect(result).not.toBeNull();
        expect(result.code).toContain('__wkfRegister(');
    });
});
