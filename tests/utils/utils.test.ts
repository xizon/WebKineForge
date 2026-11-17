
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import {
    readJson,
    firstExisting,
    escapeHtml,
    pageHref,
    isInsideDirectory,
    parseArgs,
    toKebabCase,
    toPascalCase,
    toTitleCase,
    readTailwindPrefix,
    writeFile,
    consoleColors,
} from '../../core/utils/helper.ts';

describe('readJson', () => {
    let dir: string;

    beforeEach(() => {
        dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wkf-test-'));
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it('should read and parse valid JSON', () => {
        const file = path.join(dir, 'data.json');
        fs.writeFileSync(file, '{"name":"test","enabled":true}');

        expect(readJson(file)).toEqual({
            name: 'test',
            enabled: true,
        });
    });

    it('should return null when file does not exist', () => {
        expect(readJson(path.join(dir, 'missing.json'))).toBeNull();
    });

    it('should return null when JSON is invalid', () => {
        const file = path.join(dir, 'invalid.json');
        fs.writeFileSync(file, '{invalid json}');

        expect(readJson(file)).toBeNull();
    });
});

describe('firstExisting', () => {
    let dir: string;

    beforeEach(() => {
        dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wkf-test-'));
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it('should return the first existing file', () => {
        fs.writeFileSync(path.join(dir, 'second.json'), '{}');
        fs.writeFileSync(path.join(dir, 'third.json'), '{}');

        expect(
            firstExisting(dir, ['first.json', 'second.json', 'third.json'])
        ).toBe(path.join(dir, 'second.json'));
    });

    it('should return null when no file exists', () => {
        expect(firstExisting(dir, ['a.json', 'b.json'])).toBeNull();
    });

    it('should return the first file when multiple files exist', () => {
        fs.writeFileSync(path.join(dir, 'a.json'), '{}');
        fs.writeFileSync(path.join(dir, 'b.json'), '{}');

        expect(firstExisting(dir, ['a.json', 'b.json'])).toBe(
            path.join(dir, 'a.json')
        );
    });
});

describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
        expect(escapeHtml(`<div class="test">Tom & Jerry's</div>`)).toBe(
            '&lt;div class=&quot;test&quot;&gt;Tom &amp; Jerry&#39;s&lt;/div&gt;'
        );
    });

    it('should return an empty string', () => {
        expect(escapeHtml('')).toBe('');
    });

    it('should preserve normal text', () => {
        expect(escapeHtml('Hello World')).toBe('Hello World');
    });
});

describe('pageHref', () => {
    it('should return a relative HTML page path', () => {
        expect(
            pageHref({
                htmlFileName: 'index.html',
            } as Parameters<typeof pageHref>[0])
        ).toBe('./index.html');
    });
});

describe('isInsideDirectory', () => {
    const root = path.resolve('/project/sites/my-site');

    it('should return true for the directory itself', () => {
        expect(isInsideDirectory(root, root)).toBe(true);
    });

    it('should return true for files inside the directory', () => {
        expect(
            isInsideDirectory(path.join(root, 'src', 'index.ts'), root)
        ).toBe(true);
    });

    it('should return true for nested directories', () => {
        expect(
            isInsideDirectory(path.join(root, 'src', 'components'), root)
        ).toBe(true);
    });

    it('should return false for files outside the directory', () => {
        expect(
            isInsideDirectory('/project/sites/other-site/index.ts', root)
        ).toBe(false);
    });

    it('should return false for sibling directories with similar names', () => {
        expect(
            isInsideDirectory('/project/sites/my-site-2/index.ts', root)
        ).toBe(false);
    });
});

describe('parseArgs', () => {
    it('should parse a positional name', () => {
        expect(parseArgs(['my-component'])).toEqual({
            name: 'my-component',
            siteName: undefined,
            prefixOverride: undefined,
        });
    });

    it('should parse --site and --prefix', () => {
        expect(
            parseArgs([
                'my-component',
                '--site',
                'my-site',
                '--prefix',
                'myprefix',
            ])
        ).toEqual({
            name: 'my-component',
            siteName: 'my-site',
            prefixOverride: 'myprefix',
        });
    });

    it('should support equals syntax', () => {
        expect(
            parseArgs([
                'my-component',
                '--site=my-site',
                '--prefix=myprefix',
            ])
        ).toEqual({
            name: 'my-component',
            siteName: 'my-site',
            prefixOverride: 'myprefix',
        });
    });

    it('should support options in different orders', () => {
        expect(
            parseArgs([
                '--prefix=myprefix',
                'my-component',
                '--site=my-site',
            ])
        ).toEqual({
            name: 'my-component',
            siteName: 'my-site',
            prefixOverride: 'myprefix',
        });
    });

    it('should throw when name is missing', () => {
        expect(() => parseArgs([])).toThrow('Missing [name].');
    });

    it('should throw when --site value is missing', () => {
        expect(() => parseArgs(['my-component', '--site'])).toThrow(
            'Missing value for --site.'
        );
    });

    it('should throw when --prefix value is missing', () => {
        expect(() => parseArgs(['my-component', '--prefix'])).toThrow(
            'Missing value for --prefix.'
        );
    });

    it('should throw for empty equals values', () => {
        expect(() => parseArgs(['my-component', '--site='])).toThrow(
            'Missing value for --site.'
        );

        expect(() => parseArgs(['my-component', '--prefix='])).toThrow(
            'Missing value for --prefix.'
        );
    });

    it('should throw for unknown options', () => {
        expect(() => parseArgs(['my-component', '--unknown'])).toThrow(
            'Unknown option: --unknown'
        );
    });

    it('should throw for unexpected positional arguments', () => {
        expect(() => parseArgs(['first', 'second'])).toThrow(
            'Unexpected argument: second'
        );
    });
});

describe('toKebabCase', () => {
    it('should convert PascalCase to kebab-case', () => {
        expect(toKebabCase('ProductShowcase')).toBe('product-showcase');
    });

    it('should convert camelCase to kebab-case', () => {
        expect(toKebabCase('heroSection')).toBe('hero-section');
    });

    it('should handle consecutive uppercase letters', () => {
        expect(toKebabCase('HTMLParser')).toBe('html-parser');
    });

    it('should replace spaces and special characters', () => {
        expect(toKebabCase('My Product Section!')).toBe(
            'my-product-section'
        );
    });

    it('should remove leading and trailing separators', () => {
        expect(toKebabCase('--My-Component--')).toBe('my-component');
    });

    it('should trim whitespace', () => {
        expect(toKebabCase('  My Component  ')).toBe('my-component');
    });
});

describe('toPascalCase', () => {
    it('should convert kebab-case to PascalCase', () => {
        expect(toPascalCase('product-showcase')).toBe('ProductShowcase');
    });

    it('should handle multiple segments', () => {
        expect(toPascalCase('hero-product-section')).toBe(
            'HeroProductSection'
        );
    });

    it('should ignore empty segments', () => {
        expect(toPascalCase('--hero--section--')).toBe('HeroSection');
    });

    it('should return an empty string for empty input', () => {
        expect(toPascalCase('')).toBe('');
    });
});

describe('toTitleCase', () => {
    it('should convert kebab-case to Title Case', () => {
        expect(toTitleCase('product-showcase')).toBe('Product Showcase');
    });

    it('should handle multiple segments', () => {
        expect(toTitleCase('hero-product-section')).toBe(
            'Hero Product Section'
        );
    });

    it('should ignore empty segments', () => {
        expect(toTitleCase('--hero--section--')).toBe('Hero Section');
    });

    it('should return an empty string for empty input', () => {
        expect(toTitleCase('')).toBe('');
    });
});

describe('readTailwindPrefix', () => {
    let dir: string;

    beforeEach(() => {
        dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wkf-test-'));
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it('should read Tailwind prefix', () => {
        const file = path.join(dir, 'style.css');

        fs.writeFileSync(
            file,
            '@import "tailwindcss" prefix(wkf);'
        );

        expect(readTailwindPrefix(file)).toBe('wkf');
    });

    it('should support single quotes', () => {
        const file = path.join(dir, 'style.css');

        fs.writeFileSync(
            file,
            "@import 'tailwindcss' prefix(app);"
        );

        expect(readTailwindPrefix(file)).toBe('app');
    });

    it('should support whitespace in prefix declaration', () => {
        const file = path.join(dir, 'style.css');

        fs.writeFileSync(
            file,
            '@import "tailwindcss" prefix(  myprefix  );'
        );

        expect(readTailwindPrefix(file)).toBe('myprefix');
    });

    it('should throw when CSS file does not exist', () => {
        expect(() =>
            readTailwindPrefix(path.join(dir, 'missing.css'))
        ).toThrow('Tailwind CSS entry not found');
    });

    it('should throw when prefix declaration is missing', () => {
        const file = path.join(dir, 'style.css');

        fs.writeFileSync(file, '@import "tailwindcss";');

        expect(() => readTailwindPrefix(file)).toThrow(
            'Could not find Tailwind prefix'
        );
    });
});

describe('writeFile', () => {
    let dir: string;

    beforeEach(() => {
        dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wkf-test-'));
    });

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true });
    });

    it('should create and write a file', () => {
        const file = path.join(dir, 'output.txt');

        writeFile(file, 'Hello World');

        expect(fs.readFileSync(file, 'utf8')).toBe('Hello World');
    });

    it('should create nested directories automatically', () => {
        const file = path.join(dir, 'nested', 'deep', 'output.txt');

        writeFile(file, 'Nested content');

        expect(fs.existsSync(file)).toBe(true);
        expect(fs.readFileSync(file, 'utf8')).toBe('Nested content');
    });

    it('should overwrite existing file content', () => {
        const file = path.join(dir, 'output.txt');

        writeFile(file, 'First');
        writeFile(file, 'Second');

        expect(fs.readFileSync(file, 'utf8')).toBe('Second');
    });

    it('should support empty content', () => {
        const file = path.join(dir, 'empty.txt');

        writeFile(file, '');

        expect(fs.readFileSync(file, 'utf8')).toBe('');
    });
});

describe('consoleColors', () => {
    it('should expose expected ANSI color codes', () => {
        expect(consoleColors).toEqual({
            GREEN: '\x1b[32m',
            RESET: '\x1b[0m',
            YELLOW: '\x1b[33m',
            BOLD_YELLOW: '\x1b[1;33m',
            DIM: '\x1b[2m',
        });
    });
});
