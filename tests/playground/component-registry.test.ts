import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
} from 'vitest';

import {
    mkdtemp,
    mkdir,
    writeFile,
    rm,
} from 'node:fs/promises';

import os from 'node:os';
import path from 'node:path';

import {
    createComponentRegistry,
    resolveComponentDirectory,
} from '../../core/playground/component-registry.ts';


describe('component-registry', () => {
    let componentsRoot: string;

    beforeEach(async () => {
        componentsRoot = await mkdtemp(
            path.join(os.tmpdir(), 'wkf-playground-')
        );
    });

    afterEach(async () => {
        await rm(componentsRoot, {
            recursive: true,
            force: true,
        });
    });


    describe('createComponentRegistry', () => {

        it('should discover component directories', async () => {
            await mkdir(
                path.join(componentsRoot, 'primary-menu')
            );

            await mkdir(
                path.join(componentsRoot, 'hero-3d')
            );

            const registry = await createComponentRegistry(
                componentsRoot
            );

            expect(registry.size).toBe(2);

            expect(registry.get('primarymenu')).toBe('primary-menu');
            expect(registry.get('hero3d')).toBe('hero-3d');
        });


        it('should ignore files that are not directories', async () => {
            await mkdir(
                path.join(componentsRoot, 'primary-menu')
            );

            await writeFile(
                path.join(componentsRoot, 'README.md'),
                '# Components'
            );

            const registry = await createComponentRegistry(
                componentsRoot
            );

            expect(registry.size).toBe(1);
            expect(registry.has('primarymenu')).toBe(true);
        });


        it('should return an empty registry when no component directories exist', async () => {
            const registry = await createComponentRegistry(
                componentsRoot
            );

            expect(registry.size).toBe(0);
        });


        it('should throw when two directories normalize to the same key', async () => {
            await mkdir(
                path.join(componentsRoot, 'hero-3d')
            );

            await mkdir(
                path.join(componentsRoot, 'hero3d')
            );

            await expect(
                createComponentRegistry(componentsRoot)
            ).rejects.toThrow(
                'Duplicate component directory mapping:'
            );
        });

    });


    describe('resolveComponentDirectory', () => {

        let registry: Awaited<
            ReturnType<typeof createComponentRegistry>
        >;

        beforeEach(async () => {
            await mkdir(
                path.join(componentsRoot, 'primary-menu')
            );

            await mkdir(
                path.join(componentsRoot, 'hero-3d')
            );

            await mkdir(
                path.join(componentsRoot, 'scene-item')
            );

            registry = await createComponentRegistry(
                componentsRoot
            );
        });


        it('should resolve PascalCase component names', () => {
            expect(
                resolveComponentDirectory('PrimaryMenu', registry)
            ).toBe('primary-menu');

            expect(
                resolveComponentDirectory('Hero3D', registry)
            ).toBe('hero-3d');

            expect(
                resolveComponentDirectory('SceneItem', registry)
            ).toBe('scene-item');
        });


        it('should resolve kebab-case component names', () => {
            expect(
                resolveComponentDirectory('primary-menu', registry)
            ).toBe('primary-menu');

            expect(
                resolveComponentDirectory('hero-3d', registry)
            ).toBe('hero-3d');
        });


        it('should ignore case and non-alphanumeric characters', () => {
            expect(
                resolveComponentDirectory('HERO_3D', registry)
            ).toBe('hero-3d');

            expect(
                resolveComponentDirectory('scene.item', registry)
            ).toBe('scene-item');
        });


        it('should throw when the component does not exist', () => {
            expect(() =>
                resolveComponentDirectory('UnknownComponent', registry)
            ).toThrow(
                'Component "UnknownComponent" does not exist in the component directory.'
            );
        });

    });

});