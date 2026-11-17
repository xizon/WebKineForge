import fs from 'node:fs';
import path from 'node:path';


/**
 * Components excluded from standalone Playground.
 *
 * These components are internal dependencies
 * and do not need independent preview groups.
 */
const PLAYGROUND_EXCLUDED_COMPONENTS = new Set(['']);


/**
 * Discover all components that provide examples.md.
 */
export function discoverComponents(
    componentsRoot: string
): string[] {
    return fs.readdirSync(
        componentsRoot,
        { withFileTypes: true }
    )
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .filter((componentDirectory) => {
            // Skip internal components.
            if (PLAYGROUND_EXCLUDED_COMPONENTS.has(componentDirectory)) {
                return false;
            }

            // Only include components with examples.md.
            const examplesPath = path.join(
                componentsRoot,
                componentDirectory,
                'examples.md'
            );

            return fs.existsSync(examplesPath);
        })
        .sort();
}