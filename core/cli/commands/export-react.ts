import { loadSite } from '../../site/load-site.ts';
import { exportComponentsToReact } from '../../export/react.ts';
import type { DiscoveredSite } from '../../utils/types.ts';

export async function runExportReact(sites: DiscoveredSite[]): Promise<void> {
    for (const item of sites) {
        console.log(`\n[WKF] Exporting React components: ${item.name}`);

        const site = loadSite(item.root);

        await exportComponentsToReact(site);
    }
}