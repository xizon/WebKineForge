import { 
    DiscoveredSite,
    CliCommand
} from '../utils/types.ts';


const ALL_SUPPORTED_COMMANDS: CliCommand[] = ["build", "export:react"];

const colors = {
    cyan: "\x1b[96m",
    green: "\x1b[92m",
    bold: "\x1b[1m",
    reset: "\x1b[0m",
};

function printAvailableSites(sites: DiscoveredSite[]) {
    const title = `${colors.bold}${colors.cyan}Available Sites:${colors.reset}`;

    const names = sites
        .map((site) => `  ${colors.green}${site.name}${colors.reset}`)
        .join("\n");

    return `${title}\n${names}`;
}

/**
 * Resolves the target Site(s) for a CLI command.
 * Returns one or more Sites; "all" is expanded here so command handlers
 * do not need to implement Site-selection rules themselves.
 */
export function resolveSites(
    command: CliCommand,
    argument: string | undefined,
    sites: DiscoveredSite[],
): DiscoveredSite[] {
    if (argument === "all") {
        if (!ALL_SUPPORTED_COMMANDS.includes(command)) {
            throw new Error(`[WKF] "${command} all" is not supported.`);
        }
        return sites;
    }

    if (argument) {
        const site = sites.find((item) => item.name === argument);
        if (!site) {
            throw new Error(
                `[WKF] Site "${argument}" was not found.\n${printAvailableSites(sites)}`,
            );
        }
        return [site];
    }

    if (sites.length === 1) return [sites[0]];

    throw new Error(
        `[WKF] Multiple Sites were found. Please specify a Site name.\n\n` +
        `${printAvailableSites(sites)}\n\n` +
        `Examples:\n` +
        `  npm run ${command} -- ${sites[0].name}` +
        (ALL_SUPPORTED_COMMANDS.includes(command) ? `\n  npm run ${command} -- all` : ""),
    );
}