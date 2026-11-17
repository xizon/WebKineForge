
/**
 * Site Discovery Service
 *
 * 1. Locate `site.json` based on the provided Site directory.
 * 2. Read and parse the Site configuration.
 * 3. Resolve all directory paths according to the configuration, and return a unified `SiteContext`.
 */

import fs from "node:fs";
import path from "node:path";
import type {
    SiteContext,
    SiteConfig
} from "../utils/types.ts";
import { resolveSitePaths } from "./resolve-paths.ts";

export function loadSite(siteRoot: string): SiteContext {
    const root = path.resolve(siteRoot);
    const configPath = path.join(root, "site.json");

    if (!fs.existsSync(configPath)) {
        throw new Error(
            `[WKF] site.json not found: ${configPath}`
        );
    }

    let config: SiteConfig;

    try {
        config = JSON.parse(
            fs.readFileSync(configPath, "utf-8")
        );
    } catch (error) {
        throw new Error(
            `[WKF] Failed to parse site.json: ${configPath}`,
            { cause: error }
        );
    }

    // Required fields
    const requiredFields = [
        "name",
        "version",
        "lang",
        "title",
    ] as const;

    for (const field of requiredFields) {
        if (!config[field]) {
            throw new Error(
                `[WKF] Missing required field "${field}" in ${configPath}`
            );
        }
    }


    // Validate Author
    if (config.author !== undefined) {
        if (
            !config.author ||
            typeof config.author !== 'object' ||
            Array.isArray(config.author)
        ) {
            throw new Error(
                `[WKF] Invalid author configuration in ${configPath}`
            );
        }

        for (const field of ['name', 'website', 'email'] as const) {
            const value = config.author[field];

            if (value !== undefined && typeof value !== 'string') {
                throw new Error(
                    `[WKF] Invalid author.${field} in ${configPath}`
                );
            }
        }
    }

    // Validate Site name against directory name
    const directoryName = path.basename(root);

    if (config.name !== directoryName) {
        throw new Error(
            `[WKF] Site name "${config.name}" does not match directory name "${directoryName}"`
        );
    }

    const paths = resolveSitePaths(root, config);

    return {
        name: config.name,
        title: config.title,
        root,
        config,
        paths: {
            ...paths,
            template: config.template
                ? path.resolve(root, config.template)
                : undefined,
        },
    };
}
