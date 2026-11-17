
import {
    describe,
    it,
    expect,
    vi,
    afterEach,
} from 'vitest';

import type {
    DependencyManifest,
} from '../../core/utils/types.ts';

import {
    checkDependencies,
} from '../../core/dependencies/checker.ts';


describe('Dependency Version Checker', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return an empty array when manifests are empty', () => {
        const result = checkDependencies([]);

        expect(result).toEqual([]);
    });

    it('should return an empty array when manifests have no dependencies', () => {
        const manifests: DependencyManifest[] = [
            { name: 'site-a' },
            { name: 'site-b' },
        ];

        const result = checkDependencies(manifests);

        expect(result).toEqual([]);
    });

    it('should not report mismatches when dependency versions are identical', () => {
        const manifests: DependencyManifest[] = [
            {
                name: 'site-a',
                dependencies: {
                    gsap: '^3.12.0',
                    three: '^0.160.0',
                },
            },
            {
                name: 'site-b',
                dependencies: {
                    gsap: '^3.12.0',
                    three: '^0.160.0',
                },
            },
        ];

        const result = checkDependencies(manifests);

        expect(result).toEqual([]);
    });

    it('should detect different versions of the same dependency', () => {
        const manifests: DependencyManifest[] = [
            {
                name: 'site-a',
                dependencies: {
                    gsap: '^3.12.0',
                },
            },
            {
                name: 'site-b',
                dependencies: {
                    gsap: '^3.13.0',
                },
            },
        ];

        const result = checkDependencies(manifests);

        expect(result).toEqual([
            {
                name: 'gsap',
                usages: [
                    {
                        source: 'site-a',
                        version: '^3.12.0',
                    },
                    {
                        source: 'site-b',
                        version: '^3.13.0',
                    },
                ],
            },
        ]);
    });

    it('should detect multiple dependency mismatches', () => {
        const manifests: DependencyManifest[] = [
            {
                name: 'site-a',
                dependencies: {
                    gsap: '^3.12.0',
                    three: '^0.160.0',
                },
            },
            {
                name: 'site-b',
                dependencies: {
                    gsap: '^3.13.0',
                    three: '^0.161.0',
                },
            },
        ];

        const result = checkDependencies(manifests);

        expect(result.map(item => item.name)).toEqual([
            'gsap',
            'three',
        ]);

        expect(result).toHaveLength(2);
    });

    it('should record all sources using a mismatched dependency', () => {
        const manifests: DependencyManifest[] = [
            {
                name: 'site-a',
                dependencies: {
                    gsap: '^3.12.0',
                },
            },
            {
                name: 'site-b',
                dependencies: {
                    gsap: '^3.13.0',
                },
            },
            {
                name: 'hero-component',
                dependencies: {
                    gsap: '^3.14.0',
                },
            },
        ];

        const result = checkDependencies(manifests);

        expect(result[0].usages).toEqual([
            { source: 'site-a', version: '^3.12.0' },
            { source: 'site-b', version: '^3.13.0' },
            { source: 'hero-component', version: '^3.14.0' },
        ]);
    });

    it('should keep different dependency records independent', () => {
        const manifests: DependencyManifest[] = [
            {
                name: 'site-a',
                dependencies: {
                    gsap: '^3.12.0',
                    three: '^0.160.0',
                },
            },
            {
                name: 'site-b',
                dependencies: {
                    gsap: '^3.13.0',
                    three: '^0.160.0',
                },
            },
        ];

        const result = checkDependencies(manifests);

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('gsap');
    });

    it('should print warnings without blocking the result', () => {
        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => { });

        const manifests: DependencyManifest[] = [
            {
                name: 'site-a',
                dependencies: {
                    gsap: '^3.12.0',
                },
            },
            {
                name: 'site-b',
                dependencies: {
                    gsap: '^3.13.0',
                },
            },
        ];

        const result = checkDependencies(manifests);

        expect(result).toHaveLength(1);
        expect(warnSpy).toHaveBeenCalled();
    });
});
