import { describe, it, expect, vi } from 'vitest';

import {
    parseMarkdown,
    extractDemos,
} from '../../core/playground/markdown-parser.ts';

describe('markdown-parser', () => {
    it('should extract valid TSX demos', () => {
        const source = `
# PrimaryMenu

## Examples

### Basic Usage

\`\`\`tsx
<PrimaryMenu />
\`\`\`

### Dark Theme

\`\`\`tsx
<PrimaryMenu theme="dark" />
\`\`\`
`;

        const ast = parseMarkdown(source);
        const demos = extractDemos(
            ast,
            source,
            'primary-menu'
        );

        expect(demos).toHaveLength(2);
        expect(demos[0].title).toBe('Basic Usage');
        expect(demos[1].title).toBe('Dark Theme');
    });

    it('should preserve documentation-only demos', () => {
        const source = `
# Component

## Examples

### Installation

Installation instructions only.

### Basic Usage

\`\`\`tsx
<div>Hello</div>
\`\`\`
`;

        const ast = parseMarkdown(source);
        const demos = extractDemos(ast, source, 'test-component');

        expect(demos).toHaveLength(2);
        expect(demos[0].code).toBe('');
        expect(demos[1].code).toContain('<div>');
    });

    it('should skip empty TSX blocks without interrupting other demos', () => {
        const source = `
# Component

## Examples

### Empty Demo

\`\`\`tsx
\`\`\`

### Valid Demo

\`\`\`tsx
<div>Hello</div>
\`\`\`
`;

        const ast = parseMarkdown(source);
        const demos = extractDemos(ast, source,  'test-component');

        expect(demos).toHaveLength(2);
        expect(demos[0].code).toBe('');
        expect(demos[1].code).toContain('Hello');
    });

    it('should skip demos with multiple TSX blocks', () => {
        const source = `
# Component

## Examples

### Invalid Demo

\`\`\`tsx
<div />
\`\`\`

\`\`\`tsx
<span />
\`\`\`

### Valid Demo

\`\`\`tsx
<div>Hello</div>
\`\`\`
`;

        const ast = parseMarkdown(source);
        const demos = extractDemos(ast, source,  'test-component');

        expect(demos).toHaveLength(1);
        expect(demos[0].title).toBe('Valid Demo');
    });

    it('should skip invalid TSX and continue processing', () => {
        const source = `
# Primary Menu

## Examples

### Broken Demo

\`\`\`tsx
<div>Home</div>，
\`\`\`

### Valid Demo

\`\`\`tsx
<div>About</div>
\`\`\`
`;

        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});

        const ast = parseMarkdown(source);
        const demos = extractDemos(ast, source, 'primary-menu');

        expect(demos).toHaveLength(1);
        expect(demos[0].title).toBe('Valid Demo');

        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('primary-menu')
        );

        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('Broken Demo')
        );

        warnSpy.mockRestore();
    });

    it('should return empty demos when Examples section is missing', () => {
        const source = `
# Component

## Overview

A component description.
`;

        const ast = parseMarkdown(source);
        const demos = extractDemos(ast, source,  'test-component');

        expect(demos).toEqual([]);
    });

    it('should return empty demos when Demo headings are missing', () => {
        const source = `
# Component

## Examples

Just a paragraph.
`;

        const ast = parseMarkdown(source);
        const demos = extractDemos(ast, source,  'test-component');

        expect(demos).toEqual([]);
    });
});