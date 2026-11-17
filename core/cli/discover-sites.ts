import path from "node:path";
import { readdir, readFile, stat } from "node:fs/promises";
import { DiscoveredSite } from '../utils/types.ts';

/**
 * Finds Site directories under <projectRoot>/sites.
 * A directory is considered a Site when it contains a readable site.json
 * with a non-empty `name` matching the directory name.
 *
 * This discovery layer deliberately performs basic validation only.
 * The existing core/site/load-site.ts remains the authority for full
 * SiteConfig validation when a command loads the Site.
 */
export async function discoverSites(projectRoot = process.cwd()): Promise<DiscoveredSite[]> {
    const sitesRoot = path.join(projectRoot, "sites");
    let entries;

    try {
        entries = await readdir(sitesRoot, { withFileTypes: true });
    } catch {
        throw new Error(`[WKF] Sites directory not found: ${sitesRoot}`);
    }

    const sites: DiscoveredSite[] = [];

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const root = path.join(sitesRoot, entry.name);
        const configPath = path.join(root, "site.json");

        try {
            if (!(await stat(configPath)).isFile()) continue;
            const config = JSON.parse(await readFile(configPath, "utf8")) as { name?: unknown };

            if (typeof config.name !== "string" || !config.name.trim()) {
                console.warn(`[WKF] Ignoring "${entry.name}": site.json has no valid "name".`);
                continue;
            }

            if (config.name !== entry.name) {
                console.warn(
                    `[WKF] Ignoring "${entry.name}": site.json name "${config.name}" does not match its directory name.`,
                );
                continue;
            }

            sites.push({ name: config.name, root, configPath });
        } catch (error) {
            console.warn(`[WKF] Ignoring "${entry.name}": unable to read site.json.`);
        }
    }

    sites.sort((a, b) => a.name.localeCompare(b.name));

    if (sites.length === 0) {
        throw new Error(`[WKF] No valid Sites found in ${sitesRoot}.`);
    }

    return sites;
}
