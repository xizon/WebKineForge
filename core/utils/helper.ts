import fs, { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { PageDefinition } from '../utils/types.ts';

export function readJson<T>(file: string): T | null {
    if (!existsSync(file)) {
        return null;
    }

    try {
        return JSON.parse(readFileSync(file, 'utf8')) as T;
    } catch {
        return null;
    }
}

export function firstExisting(dir: string, names: string[]): string | null {
    for (const name of names) {
        const file = path.join(dir, name);
        if (existsSync(file)) {
            return file;
        }
    }

    return null;
}

export function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

export function pageHref(page: PageDefinition): string {
    return `./${page.htmlFileName}`;
}


export function isInsideDirectory(file: string, directory: string): boolean {
    const relative = path.relative(directory, file);

    return (
        relative === '' ||
        (!relative.startsWith('..' + path.sep) &&
            relative !== '..' &&
            !path.isAbsolute(relative))
    );
}


export function parseArgs(args: string[]) {
    let name: string | undefined;
    let siteName: string | undefined;
    let prefixOverride: string | undefined;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === '--site') {
            siteName = args[++i];
            if (!siteName) throw new Error('Missing value for --site.');
        } else if (arg.startsWith('--site=')) {
            siteName = arg.slice('--site='.length);
            if (!siteName) throw new Error('Missing value for --site.');
        } else if (arg === '--prefix') {
            prefixOverride = args[++i];
            if (!prefixOverride) throw new Error('Missing value for --prefix.');
        } else if (arg.startsWith('--prefix=')) {
            prefixOverride = arg.slice('--prefix='.length);
            if (!prefixOverride) throw new Error('Missing value for --prefix.');
        } else if (arg.startsWith('--')) {
            throw new Error(`Unknown option: ${arg}`);
        } else if (!name) {
            name = arg;
        } else {
            throw new Error(`Unexpected argument: ${arg}`);
        }
    }

    if (!name) throw new Error('Missing [name].');

    return { name, siteName, prefixOverride };
}

export function toKebabCase(value: string): string {
    return value
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

export function toPascalCase(value: string): string {
    return value
        .split('-')
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

export function toTitleCase(value: string): string {
    return value
        .split('-')
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function readTailwindPrefix(cssPath: string): string {
    if (!fs.existsSync(cssPath)) {
        throw new Error(`Tailwind CSS entry not found: ${cssPath}`);
    }

    const css = fs.readFileSync(cssPath, 'utf8');
    const match = css.match(
        /@import\s+["']tailwindcss["']\s+prefix\(\s*([a-zA-Z][\w-]*)\s*\)/
    );

    if (!match) {
        throw new Error(
            `Could not find Tailwind prefix(...) in ${cssPath}. Expected: @import "tailwindcss" prefix(wkf);`
        );
    }

    return match[1];
}

export function writeFile(filePath: string, content: string) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
}

export const consoleColors = {
    GREEN: '\x1b[32m',
    RESET: '\x1b[0m',
    YELLOW: '\x1b[33m',
    BOLD_YELLOW: '\x1b[1;33m',
    DIM: '\x1b[2m',
} 

