import {
    describe,
    it,
    expect,
    vi,
} from 'vitest';

import {
    analyzeComponentExamples,
} from '../../core/playground/analyze-component.ts';

import type {
    ComponentRegistry,
} from '../../core/utils/types.ts';

describe('playground build pipeline', () => {
    it('should continue processing valid demos when one demo has invalid TSX', () => {
        const source = `
# Primary Menu

## Overview

A navigation component.

## Examples

### Broken Demo

\`\`\`tsx
<div>Home</div>，
\`\`\`

### Basic Usage

\`\`\`tsx
<PrimaryMenu />
\`\`\`

### Hero Example

\`\`\`tsx
<Hero3D />
\`\`\`
`;

        const registry = new Map([
            ['primarymenu', 'primary-menu'],
            ['hero3d', 'hero-3d'],
        ]) as ComponentRegistry;

        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});

        const result = analyzeComponentExamples(
            source,
            registry,
            'primary-menu'
        );

        // Broken Demo must not interrupt the pipeline.
        expect(result.demos).toHaveLength(2);

        expect(result.demos.map((demo) => demo.title)).toEqual([
            'Basic Usage',
            'Hero Example',
        ]);

        expect(result.demos[0].components).toEqual([
            {
                name: 'PrimaryMenu',
                directory: 'primary-menu',
            },
        ]);

        expect(result.demos[1].components).toEqual([
            {
                name: 'Hero3D',
                directory: 'hero-3d',
            },
        ]);

        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('primary-menu')
        );

        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('Broken Demo')
        );

        warnSpy.mockRestore();
    });

    it('should preserve documentation-only demos', () => {
        const source = `
# Primary Menu

## Examples

### Usage Notes

This demo only contains documentation.

### Basic Usage

\`\`\`tsx
<PrimaryMenu />
\`\`\`
`;

        const registry = new Map([
            ['primarymenu', 'primary-menu'],
        ]) as ComponentRegistry;

        const result = analyzeComponentExamples(
            source,
            registry,
            'primary-menu'
        );

        expect(result.demos).toHaveLength(2);

        expect(result.demos[0]).toMatchObject({
            title: 'Usage Notes',
            code: '',
            components: [],
        });

        expect(result.demos[1].components).toEqual([
            {
                name: 'PrimaryMenu',
                directory: 'primary-menu',
            },
        ]);
    });

    it('should not fail when Examples section is missing', () => {
        const source = `
# Primary Menu

## Overview

Navigation component.
`;

        const registry = new Map() as ComponentRegistry;

        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});

        const result = analyzeComponentExamples(
            source,
            registry,
            'primary-menu'
        );

        expect(result.demos).toEqual([]);

        warnSpy.mockRestore();
    });

    it('should throw when a valid demo references an unknown component', () => {
        const source = `
# Component

## Examples

### Basic Usage

\`\`\`tsx
<UnknownComponent />
\`\`\`
`;

        const registry = new Map() as ComponentRegistry;

        expect(() => {
            analyzeComponentExamples(
                source,
                registry,
                'test-component'
            );
        }).toThrow();
    });
});