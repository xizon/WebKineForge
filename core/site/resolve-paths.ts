/**
 * Resolve true site paths
 */
import path from "node:path";
import type { 
    SiteConfig, 
    SitePaths 
} from '../utils/types.ts';

export function resolveSitePaths(
    siteRoot: string,
    config: SiteConfig
): Omit<SitePaths, "template"> {
    const resolve = (value: string) =>
        path.resolve(siteRoot, value);

    return {
        src: resolve(config.paths?.src ?? "./src"),
        public: resolve(config.paths?.public ?? "./public"),
        dist: resolve(config.paths?.dist ?? "./dist"),
        pages: resolve(config.entries?.pages ?? "./src/pages"),
        components: resolve(config.entries?.components ?? "./src/components"),
        styles: resolve(config.entries?.styles ?? "./src/styles"),
    };
}