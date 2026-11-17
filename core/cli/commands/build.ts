import { DiscoveredSite } from '../../utils/types.ts';
import { runProcess } from "./process.ts";

export async function runBuild(sites: DiscoveredSite[]): Promise<void> {
    // Build sequentially: each Site gets its own SITE and dist directory.
    for (const site of sites) {

        // [STEP 1] Generate index
        await runProcess("npx", ["tsx", "core/agent/generate-index.ts"], site, "Generating indexes");

        // [STEP 2] Generate Playground entries
        // !!! === You need to enable "allEntryFiles" and "playgroundEntries" in the Vite configuration. ===
        // await runProcess("npx", ["tsx", "core/playground/generate-entries.ts"], site, "Generate Playground entries");


        // [STEP 3] Generate Site tsconfig
        await runProcess("npx", ["tsx", "core/ts/generate-site-tsconfig.ts"], site, "Generate TypeScript configurations");

        // [STEP 4] VITE
        console.log('[WKF][CHECK] =========== [1] VITE BUILD START ===========');
        await runProcess("npx", ["vite", "build"], site, "Building Site");
        console.log('[WKF][CHECK] =========== [1] VITE BUILD FINISHED ===========');

        // [STEP 5] SSR
        console.log('[WKF][CHECK] =========== [2] SSR START ===========');
        await runProcess("npx", ["tsx", "core/processors/render-page.ts"], site, "Rendering pages");
        console.log('[WKF][CHECK] =========== [2] SSR FINISHED ===========');

        // [STEP 6] Render Playground demos
        // !!! === You need to enable "allEntryFiles" and "playgroundEntries" in the Vite configuration. ===
        // console.log('[WKF][CHECK] =========== [3] PLAYGROUND SSR START ===========');
        // await runProcess("npx", ["tsx", "core/playground/render-playground.ts"], site, "Rendering Playground demos");
        // console.log('[WKF][CHECK] =========== [3] PLAYGROUND SSR FINISHED ===========');


        // [STEP 7] Generate Playground index
        // !!! === You need to enable "allEntryFiles" and "playgroundEntries" in the Vite configuration. ===
        // console.log('[WKF][CHECK] =========== [4] PLAYGROUND INDEX START ===========');
        // await runProcess("npx", ["tsx", "core/playground/generate-playground-index.ts"], site, "Generating Playground index");
        // console.log('[WKF][CHECK] =========== [4] PLAYGROUND INDEX FINISHED ===========');


    }
}
