
/**
 * Adds a configurable Tailwind CSS prefix to component and page templates.
 */
/*
Scope of Support in the Current Version

✅ className="flex gap-4"	
✅ class="grid grid-cols-2"	
✅ max-[760px]:grid-cols-1	
✅ [&>svg]:size-4	
❌ className={condition ? 'flex' : 'grid'}
❌ className={cn('flex', 'gap-4')}	

Usage:

npm run prefix:tailwind -- --site my-site --prefix wkf --dry-run
npm run prefix:tailwind -- --site my-site --prefix wkf

*/

import {
    readFileSync,
    writeFileSync,
} from 'node:fs';

import path from 'node:path';
import url from 'node:url';

import { loadSite } from '../../site/load-site.ts';

import type {
    SiteContext,
} from '../../utils/types.ts';

import { discoverTemplates } from '../../discovery/templates.ts';


const args = process.argv.slice(2);

const DRY_RUN = args.includes('--dry-run');

/**
 * Reads a CLI option in either form:
 * --prefix wkf
 * --prefix=wkf
 */
function getOptionValue(name: string): string | undefined {
    const optionIndex = args.findIndex(arg => arg === name);

    if (optionIndex !== -1) {
        return args[optionIndex + 1];
    }

    const option = args.find(arg => arg.startsWith(`${name}=`));

    return option?.slice(name.length + 1);
}

const SITE_ARG = getOptionValue('--site');
const PREFIX_ARG = getOptionValue('--prefix');

if (SITE_ARG?.startsWith('--')) {
    console.error('[WKF] Error: Missing value for --site.');
    process.exit(1);
}

if (!PREFIX_ARG || PREFIX_ARG.startsWith('--')) {
    console.error('[WKF] Error: Missing Tailwind prefix.');
    console.error('[WKF] Usage: npm run prefix:tailwind -- --prefix wkf');
    process.exit(1);
}

const PREFIX_NAME = PREFIX_ARG.replace(/:$/, '');

if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(PREFIX_NAME)) {
    console.error(`[WKF] Error: Invalid Tailwind prefix: ${PREFIX_ARG}`);
    console.error('[WKF] Prefix must start with a letter and contain only letters, numbers, hyphens, or underscores.');
    process.exit(1);
}

const PREFIX = `${PREFIX_NAME}:`;


/**
 * Known Tailwind utility class names.
 */
const UTILITY_NAMES = new Set([
    'container',
    'sr-only',
    'not-sr-only',
    'static',
    'fixed',
    'absolute',
    'relative',
    'sticky',
    'visible',
    'invisible',
    'collapse',
    'block',
    'inline',
    'inline-block',
    'inline-flex',
    'inline-grid',
    'flex',
    'grid',
    'hidden',
    'contents',
    'flow-root',
    'table',
    'isolate',
    'isolation-auto',
    'grow',
    'shrink',
    'truncate',
    'italic',
    'not-italic',
    'uppercase',
    'lowercase',
    'capitalize',
    'normal-case',
    'antialiased',
    'subpixel-antialiased',
    'underline',
    'overline',
    'line-through',
    'no-underline',
    'pointer-events-none',
    'pointer-events-auto',
    'select-none',
    'select-text',
    'mx-auto',
    'my-auto',
    'size-auto',
]);


/**
 * Tailwind utility class prefixes.
 */
const UTILITY_PREFIXES = [
    'w-', 'h-', 'min-w-', 'min-h-', 'max-w-', 'max-h-', 'size-',
    'p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-', 'ps-', 'pe-',
    'm-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-', 'ms-', 'me-',
    'gap-', 'gap-x-', 'gap-y-', 'space-x-', 'space-y-',
    'top-', 'right-', 'bottom-', 'left-', 'inset-', 'inset-x-', 'inset-y-',
    'z-', 'order-', 'basis-', 'grow-', 'shrink-',
    'grid-cols-', 'grid-rows-', 'col-span-', 'row-span-',
    'col-start-', 'col-end-', 'row-start-', 'row-end-',
    'auto-cols-', 'auto-rows-',
    'items-', 'justify-', 'self-', 'place-items-', 'place-content-',
    'flex-', 'overflow-', 'overscroll-', 'object-',
    'rounded-', 'border-', 'bg-', 'text-', 'font-',
    'leading-', 'tracking-', 'decoration-', 'underline-offset-',
    'opacity-', 'shadow-', 'outline-', 'ring-', 'blur-',
    'brightness-', 'contrast-', 'grayscale-', 'saturate-',
    'duration-', 'delay-', 'ease-', 'animate-',
    'scale-', 'rotate-', 'translate-x-', 'translate-y-',
    'skew-x-', 'skew-y-', 'origin-',
    'cursor-', 'transition-', 'will-change-',
    'aspect-', 'columns-', 'break-', 'whitespace-', 'hyphens-',
    'list-', 'fill-', 'stroke-', 'accent-', 'caret-',
    'from-', 'via-', 'to-',
];


/**
 * Splits Tailwind variants while preserving colons inside brackets.
 *
 * Example:
 * max-[760px]:grid-cols-1
 */
function splitVariants(token: string): string[] {
    const result: string[] = [];

    let start = 0;
    let squareDepth = 0;
    let roundDepth = 0;

    for (let i = 0; i < token.length; i++) {
        const char = token[i];

        if (char === '[') {
            squareDepth++;
        } else if (char === ']') {
            squareDepth--;
        } else if (char === '(') {
            roundDepth++;
        } else if (char === ')') {
            roundDepth--;
        } else if (
            char === ':' &&
            squareDepth === 0 &&
            roundDepth === 0
        ) {
            result.push(token.slice(start, i));
            start = i + 1;
        }
    }

    result.push(token.slice(start));

    return result;
}


/**
 * Determines whether a class name is a Tailwind utility.
 */
function isTailwindUtility(base: string): boolean {
    let name = base;

    name = name.replace(/^!/, '');
    name = name.replace(/^-/, '');

    if (UTILITY_NAMES.has(name)) {
        return true;
    }

    if (/^\[[\w-]+:.+\]$/.test(name)) {
        return true;
    }

    if (/^[\w-]+-\[.+\]$/.test(name)) {
        return true;
    }

    if (/^[\w-]+-\(--[\w-]+\)$/.test(name)) {
        return true;
    }

    return UTILITY_PREFIXES.some(
        prefix => name.startsWith(prefix)
    );
}


/**
 * Adds the configured prefix to a Tailwind utility class.
 */
function prefixClass(token: string): string {
    if (token.startsWith(PREFIX)) {
        return token;
    }

    const parts = splitVariants(token);
    const base = parts.pop() || '';

    if (!isTailwindUtility(base)) {
        return token;
    }

    return [
        PREFIX.slice(0, -1),
        ...parts,
        base,
    ].join(':');
}


/**
 * Converts a whitespace-separated class string.
 */
function convertClassNames(value: string): string {
    return value.replace(/\S+/g, prefixClass);
}


/**
 * Collects source edits for JSX class attributes.
 */
interface SourceEdit {
    start: number;
    end: number;
    text: string;
}

/**
 * Collects source edits for static JSX class attributes.
 */
function collectClassEdits(source: string): SourceEdit[] {
    const edits: SourceEdit[] = [];

    const tagRegex = /<[A-Za-z][^<>]*>/gs;
    let tagMatch: RegExpExecArray | null;

    while ((tagMatch = tagRegex.exec(source)) !== null) {
        const tag = tagMatch[0];
        const tagStart = tagMatch.index;

        const attributeRegex =
            /\b(class|className)\s*=\s*(["'])(.*?)\2/gs;

        let attributeMatch: RegExpExecArray | null;

        while (
            (attributeMatch = attributeRegex.exec(tag)) !== null
        ) {
            const classValue = attributeMatch[3];

            if (!classValue.trim()) {
                continue;
            }

            const converted = convertClassNames(classValue);

            if (converted === classValue) {
                continue;
            }

            const valueStart =
                tagStart +
                attributeMatch.index +
                attributeMatch[0].indexOf(classValue);

            edits.push({
                start: valueStart,
                end: valueStart + classValue.length,
                text: converted,
            });
        }
    }

    return edits;
}

/**
 * Transforms static JSX class and className attributes.
 */
function transformTSX(content: string): string {
    const edits = collectClassEdits(content);

    edits.sort((a, b) => b.start - a.start);

    let output = content;

    for (const edit of edits) {
        output =
            output.slice(0, edit.start) +
            edit.text +
            output.slice(edit.end);
    }

    return output;
}


/**
 * Transforms all discovered templates.
 */
function transformFiles(files: string[]): void {
    let changedCount = 0;

    for (const file of files) {
        const original = readFileSync(file, 'utf8');
        const transformed = transformTSX(original);

        if (original === transformed) {
            continue;
        }

        changedCount++;

        const relativePath = path.relative(
            process.cwd(),
            file
        );

        console.log(
            `${DRY_RUN ? '[PREVIEW]' : '[UPDATED]'} ${relativePath}`
        );

        if (!DRY_RUN) {
            writeFileSync(file, transformed, 'utf8');
        }
    }

    console.log('');
    console.log('----------------------------');
    console.log(`[WKF] Files discovered: ${files.length}`);
    console.log(`[WKF] Files changed: ${changedCount}`);
    console.log(`[WKF] Prefix: ${PREFIX}`);
    console.log(`[WKF] Mode: ${DRY_RUN ? 'Dry Run' : 'Write'}`);
}


/**
 * Runs the prefix transformation for the selected Site.
 */
export function prefixTailwind(site: SiteContext): void {
    console.log(`[WKF] Processing Site: ${site.root}`);

    const files = discoverTemplates(site);

    transformFiles(files);
}


// Automatically execute when invoked directly.
const currentFilePath = url.fileURLToPath(import.meta.url);

const invokedFilePath = process.argv[1]
    ? path.resolve(process.argv[1])
    : '';

if (
    currentFilePath === invokedFilePath ||
    invokedFilePath.endsWith('prefix-tailwind.ts')
) {
    try {
        const projectRoot = process.cwd();
        const siteName = SITE_ARG || 'default-site';

        const siteRoot = path.resolve(
            projectRoot,
            'sites',
            siteName
        );

        const site = loadSite(siteRoot);

        prefixTailwind(site);
    } catch (error) {
        console.error('[WKF] Error prefixing Tailwind classes:', error);
        process.exitCode = 1;
    }
}
