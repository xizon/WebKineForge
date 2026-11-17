#!/usr/bin/env node
import { runDev } from "./commands/dev.ts";
import { runBuild } from "./commands/build.ts";
import { runPreview } from "./commands/preview.ts";
import { runExportReact } from "./commands/export-react.ts";
import { discoverSites } from "./discover-sites.ts";
import { resolveSites } from "./resolve-site.ts";
import type {
    CliCommand
} from '../utils/types.ts';

function printHelp() {
    console.log(`
CLI

Usage:
  npm run dev -- [site-name]
  npm run build -- [site-name|all]
  npm run preview -- [site-name]
  npm run export:react -- [site-name|all]

Rules:
  - A single discovered Site is selected automatically.
  - Multiple Sites require an explicit Site name.
  - "all" is supported only by build and export:react.
`);
}

async function main() {
    const [, , rawCommand, ...args] = process.argv;
    if (!rawCommand || rawCommand === "help" || rawCommand === "--help" || rawCommand === "-h") {
        printHelp();
        return;
    }

    const command = rawCommand as CliCommand;
    const supported: CliCommand[] = ["dev", "build", "preview", "export:react"];
    if (!supported.includes(command)) {
        console.error(`[WKF] Unknown command: ${rawCommand}`);
        printHelp();
        process.exitCode = 1;
        return;
    }

    if (args.length > 1) {
        throw new Error(`[WKF] Expected at most one Site argument, received: ${args.join(" ")}`);
    }

    const sites = await discoverSites();
    const selected = resolveSites(command, args[0], sites);

    switch (command) {
        case "dev":
            await runDev(selected[0]);
            break;
        case "build":
            await runBuild(selected);
            break;
        case "preview":
            await runPreview(selected[0]);
            break;
        case "export:react":
            await runExportReact(selected);
            break;
    }
}

main().catch((error: unknown) => {
    console.error("[WKF] CLI failed:");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
