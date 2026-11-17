import { readdir } from 'node:fs/promises';

import type {
    ComponentRegistry
} from '../utils/types.ts';


/**
 * Normalize component names for directory matching.
 *
 * Hero3D    -> hero3d
 * hero-3d   -> hero3d
 * SceneItem -> sceneitem
 * scene-item -> sceneitem
 */
function normalizeName(name: string): string {
    return name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}


/**
 * Discover component directories and build a registry.
 */
export async function createComponentRegistry(
    componentsRoot: string
): Promise<ComponentRegistry> {
    const entries = await readdir(componentsRoot, {
        withFileTypes: true,
    });

    const registry: ComponentRegistry = new Map();

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const key = normalizeName(entry.name);

        if (registry.has(key)) {
            throw new Error(
                `Duplicate component directory mapping: ${entry.name}`
            );
        }

        registry.set(key, entry.name);
    }

    return registry;
}

/**
 * Resolve a JSX component name to its actual directory.
 */
export function resolveComponentDirectory(
    componentName: string,
    registry: ComponentRegistry
): string {
    const key = normalizeName(componentName);
    const directory = registry.get(key);

    if (!directory) {
        throw new Error(
            `Component "${componentName}" does not exist in the component directory.`
        );
    }

    return directory;
}