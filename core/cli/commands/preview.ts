import { DiscoveredSite } from '../../utils/types.ts';
import { runProcess } from "./process.ts";

export async function runPreview(site: DiscoveredSite): Promise<void> {
    // Preview uses the Site selected by SITE; it does not trigger a build.
    await runProcess("npx", ["vite", "preview"], site, "Previewing Site");
}
