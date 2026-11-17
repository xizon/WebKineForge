import { DiscoveredSite } from '../../utils/types.ts';
import { runProcess } from "./process.ts";

export async function runDev(site: DiscoveredSite): Promise<void> {

    // [STEP 1] Generate Playground entries
    await runProcess("npx", ["tsx", "core/playground/generate-entries.ts"], site, "Generating Playground entries");

    // [STEP 2] Start Vite Dev Server
    await runProcess("npx", ["vite"], site, "Starting dev server");
}