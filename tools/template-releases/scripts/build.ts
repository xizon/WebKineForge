
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import {
    mkdir,
    readFile,
    readdir,
    rm,
    writeFile
} from "node:fs/promises";
import AdmZip from "adm-zip";

import { discoverSites } from "../../../core/cli/discover-sites.ts";

interface TemplateRelease {
    name: string;
    description: string;
    filename: string;
    checksum: string;
    size: number;
}

const ROOT = process.cwd();

const PACKAGES_DIR = path.join(
    ROOT,
    "tools/template-releases",
    "packages"
);

const EXCLUDED_ENTRIES = new Set([
    ".DS_Store",
    ".vite"
]);

/**
 * Recursively add dist files to ZIP.
 * ZIP root directly contains the dist contents.
 */
async function addDirectoryToZip(
    zip: AdmZip,
    directory: string,
    baseDirectory: string
): Promise<void> {
    const entries = await readdir(directory, {
        withFileTypes: true
    });

    for (const entry of entries) {
        if (EXCLUDED_ENTRIES.has(entry.name)) {
            continue;
        }

        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            await addDirectoryToZip(
                zip,
                absolutePath,
                baseDirectory
            );
            continue;
        }

        // Ignore symlinks and other special file types.
        if (!entry.isFile()) {
            continue;
        }

        // 
        const relativePath = path
            .relative(baseDirectory, absolutePath)
            .split(path.sep)
            .join("/");

        // Exclude the automatically generated root "index.html".
        if (relativePath === "index.html") {
            continue;
        }

        const content = await readFile(absolutePath);

        zip.addFile(relativePath, content);
    }
}

async function createTemplateZip(
    siteName: string,
    distPath: string
): Promise<TemplateRelease> {
    const zip = new AdmZip();

    await addDirectoryToZip(
        zip,
        distPath,
        distPath
    );

    const entries = zip.getEntries();

    if (entries.length === 0) {
        throw new Error(
            `No files found in dist directory: ${distPath}`
        );
    }

    const buffer = zip.toBuffer();

    const filename = `${siteName}.zip`;
    const outputPath = path.join(PACKAGES_DIR, filename);

    await writeFile(outputPath, buffer);

    const checksum = createHash("sha256")
        .update(buffer)
        .digest("hex");

    return {
        name: siteName,
        description: `WebKineForge site template: ${siteName}`,
        filename,
        checksum,
        size: buffer.byteLength
    };
}

export async function buildTemplates(): Promise<TemplateRelease[]> {
    console.log("\n[WKF][Templates] Starting template packaging...\n");

    const sites = await discoverSites(ROOT);

    // Only clear the generated ZIP directory.
    await rm(PACKAGES_DIR, {
        recursive: true,
        force: true
    });

    await mkdir(PACKAGES_DIR, {
        recursive: true
    });

    const templates: TemplateRelease[] = [];

    for (const site of sites) {
        const distPath = path.join(site.root, "dist");

        console.log(`[WKF][Templates] Packaging: ${site.name}`);

        const template = await createTemplateZip(
            site.name,
            distPath
        );

        templates.push(template);

        console.log(`  File: ${template.filename}`);
        console.log(`  Size: ${template.size} bytes`);
        console.log(`  SHA256: ${template.checksum}\n`);
    }

    console.log(
        `[WKF][Templates] Completed: ${templates.length} template(s).`
    );

    return templates;
}

// Support direct execution.
const currentFile = fileURLToPath(import.meta.url);

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === currentFile
) {
    buildTemplates().catch((error: unknown) => {
        console.error("[WKF][Templates] Build failed:");

        console.error(
            error instanceof Error
                ? error.message
                : error
        );

        process.exitCode = 1;
    });
}
