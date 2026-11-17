
/**
 * Cross-site dependency version checker.
 *
 * Checks dependencies declared by site/component manifests.
 * Version differences only produce warnings.
 * They never block development or production builds.
 */

import type {
    DependencyManifest,
    DependencyMismatch,
    DependencyUsage
} from '../utils/types.ts';
import { consoleColors } from '../utils/helper.ts';

const {
    RESET,
    YELLOW,
    BOLD_YELLOW,
    DIM,
} = consoleColors;



/**
 * Find dependencies that have different version declarations
 * across multiple site/component manifests.
 */
export function checkDependencies(
    manifests: DependencyManifest[]
): DependencyMismatch[] {
    const dependencyMap = new Map<string, DependencyUsage[]>();

    // Collect dependency declarations.
    for (const manifest of manifests) {
        const dependencies = manifest.dependencies ?? {};

        for (const [name, version] of Object.entries(dependencies)) {
            const usages = dependencyMap.get(name) ?? [];

            usages.push({
                source: manifest.name,
                version,
            });

            dependencyMap.set(name, usages);
        }
    }

    // Find dependencies with different version declarations.
    const mismatches: DependencyMismatch[] = [];

    for (const [name, usages] of dependencyMap) {
        const versions = new Set(usages.map(item => item.version));

        if (versions.size > 1) {
            mismatches.push({
                name,
                usages,
            });
        }
    }

    // Print warnings.
    if (mismatches.length > 0) {

        const line = '━'.repeat(60);

        console.warn(
            `\n${BOLD_YELLOW}${line}\n` +
            `  [WKF][DEPENDENCY] VERSION MISMATCH WARNING\n` +
            `${line}${RESET}\n`
        );

        for (const mismatch of mismatches) {
            console.warn(
                `${BOLD_YELLOW}  ◆ ${mismatch.name}${RESET}`
            );

            for (const usage of mismatch.usages) {
                console.warn(
                    `${YELLOW}      ${usage.source.padEnd(35)} ${usage.version}${RESET}`
                );
            }

            console.warn('');
        }

        console.warn(
            `${DIM}${line}${RESET}\n` +
            `${YELLOW}  Please review dependency versions.${RESET}\n` +
            `${YELLOW}  Dev/Build will continue.${RESET}\n` +
            `${DIM}${line}${RESET}\n`
        );
    }

    return mismatches;
}
