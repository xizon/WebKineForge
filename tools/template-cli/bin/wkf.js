#!/usr/bin/env node

import { constants } from "node:fs";
import os from "node:os";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import AdmZip from "adm-zip";


const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    gray: "\x1b[90m",
    blue: "\x1b[34m",
    bold: "\x1b[1m"
};

const REGISTRY_URL =
    "https://raw.githubusercontent.com/xizon/webkineforge/main/tools/template-releases/registry/templates.json";

function printHelp() {
    console.log(`
WebKineForge Template CLI

Usage:
  wkf list
  wkf add <template-name> [--path <directory>]

Commands:
  list                  List available templates
  add <name>            Download and install a template

Options:
  --path <directory>    Specify installation directory
  -h, --help            Show help
`);
}

async function getRegistry() {
    const response = await fetch(REGISTRY_URL);

    if (!response.ok) {
        throw new Error(
            `Unable to fetch template registry: HTTP ${response.status}`
        );
    }

    const registry = await response.json();

    if (!Array.isArray(registry.templates)) {
        throw new Error("Invalid template registry format.");
    }

    return registry;
}

async function listTemplates() {
    console.log("\nFetching available templates...\n");

    const registry = await getRegistry();

    if (registry.templates.length === 0) {
        console.log("No templates available.");
        return;
    }

    console.log(`\n${colors.bold}${colors.cyan}Available WebKineForge Templates${colors.reset}\n`);

    for (const template of registry.templates) {
        console.log(`  ${colors.bold}${colors.green}${template.name}${colors.reset}`);
        console.log(`  ${colors.gray}${template.description || "No description"}${colors.reset}`);
        // console.log(`  ${colors.blue}Download: ${template.downloadUrl}${colors.reset}`);
        console.log("");
    }

    console.log(`${registry.templates.length} template(s) available.\n`);
}

function parseAddArguments(args) {
    const templateName = args[0];

    if (!templateName || templateName.startsWith("--")) {
        throw new Error("Please specify a template name.");
    }

    let targetPath = ".";

    for (let i = 1; i < args.length; i++) {
        if (args[i] === "--path") {
            if (!args[i + 1]) {
                throw new Error("Missing directory after --path.");
            }

            targetPath = args[++i];
        } else {
            throw new Error(`Unknown option: ${args[i]}`);
        }
    }

    return { templateName, targetPath };
}

async function downloadTemplate(template) {
    console.log("\nDownloading template...\n");

    const response = await fetch(template.downloadUrl);

    if (!response.ok) {
        throw new Error(
            `Download failed: HTTP ${response.status}`
        );
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    if (template.size && buffer.length !== template.size) {
        throw new Error(
            `File size mismatch. Expected ${template.size}, received ${buffer.length}.`
        );
    }

    console.log("Verifying SHA256 checksum...");

    const checksum = crypto
        .createHash("sha256")
        .update(buffer)
        .digest("hex");

    if (
        !template.checksum ||
        checksum.toLowerCase() !== template.checksum.toLowerCase()
    ) {
        throw new Error("SHA256 verification failed. The downloaded file may be corrupted.");
    }

    console.log("SHA256 verification passed.");

    return buffer;
}


async function extractTemplate(buffer, targetPath) {
    const destination = path.resolve(process.cwd(), targetPath);
    const tempDirectory = await fs.mkdtemp(
        path.join(os.tmpdir(), "wkf-")
    );

    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    const files = [];
    const createdFiles = [];
    const createdDirectories = [];

    try {
        // 1. Validate ZIP entries and extract into a temporary directory.
        for (const entry of entries) {
            const entryName = entry.entryName.replace(/\\/g, "/");

            if (
                entryName.startsWith("/") ||
                /^[a-zA-Z]:/.test(entryName) ||
                entryName.split("/").includes("..")
            ) {
                throw new Error(`Unsafe ZIP entry: ${entry.entryName}`);
            }

            const tempPath = path.resolve(tempDirectory, entryName);

            if (
                tempPath !== tempDirectory &&
                !tempPath.startsWith(tempDirectory + path.sep)
            ) {
                throw new Error(`ZIP path traversal detected: ${entry.entryName}`);
            }

            // Reject symbolic links.
            const unixMode = (entry.header.attr >>> 16) & 0o170000;

            if (unixMode === 0o120000) {
                throw new Error(`Symbolic links are not supported: ${entry.entryName}`);
            }

            if (entry.isDirectory) {
                continue;
            }

            const content = entry.getData();

            await fs.mkdir(path.dirname(tempPath), { recursive: true });
            await fs.writeFile(tempPath, content, { flag: "wx" });

            files.push({
                entryName,
                tempPath,
                outputPath: path.resolve(destination, entryName)
            });
        }

        // 2. Check the destination directory.
        try {
            const destinationStat = await fs.lstat(destination);

            if (!destinationStat.isDirectory()) {
                throw new Error(
                    `Installation path is not a directory: ${destination}`
                );
            }
        } catch (error) {
            if (error.code !== "ENOENT") {
                throw error;
            }
        }

        // 3. Check all file conflicts before installation.
        for (const file of files) {
            try {
                await fs.lstat(file.outputPath);

                throw new Error(
                    `File already exists: ${path.relative(destination, file.outputPath)}`
                );
            } catch (error) {
                if (error.code !== "ENOENT") {
                    throw error;
                }
            }
        }

        // 4. Create missing directories and track them for cleanup.
        async function ensureDirectory(directory) {
            const missing = [];
            let current = directory;

            while (true) {
                try {
                    const stat = await fs.lstat(current);

                    if (!stat.isDirectory()) {
                        throw new Error(
                            `Installation path is not a directory: ${current}`
                        );
                    }

                    break;
                } catch (error) {
                    if (error.code !== "ENOENT") {
                        throw error;
                    }
                }

                missing.push(current);

                const parent = path.dirname(current);

                if (parent === current) {
                    throw new Error(`Unable to create directory: ${directory}`);
                }

                current = parent;
            }

            for (const dir of missing.reverse()) {
                await fs.mkdir(dir);
                createdDirectories.push(dir);
            }
        }

        await ensureDirectory(destination);

        // 5. Copy staged files into the destination.
        for (const file of files) {
            await ensureDirectory(path.dirname(file.outputPath));

            await fs.copyFile(
                file.tempPath,
                file.outputPath,
                constants.COPYFILE_EXCL
            );

            createdFiles.push(file.outputPath);
        }

        return destination;
    } catch (error) {
        // 6. Remove files created during this installation.
        for (const file of createdFiles.reverse()) {
            await fs.rm(file, { force: true }).catch(() => {});
        }

        // Remove newly created directories, from deepest to shallowest.
        for (const directory of createdDirectories.reverse()) {
            await fs.rmdir(directory).catch(() => {});
        }

        throw error;
    } finally {
        // Always remove the temporary extraction directory.
        await fs.rm(tempDirectory, {
            recursive: true,
            force: true
        });
    }
}



async function addTemplate(args) {
    const { templateName, targetPath } = parseAddArguments(args);

    console.log(`\nLooking for template: ${templateName}\n`);

    const registry = await getRegistry();

    const template = registry.templates.find(
        (item) => item.name === templateName
    );

    if (!template) {
        throw new Error(
            `Template "${templateName}" was not found. Run "wkf list" to see available templates.`
        );
    }

    if (
        typeof template.downloadUrl !== "string" ||
        !template.downloadUrl.startsWith("https://")
    ) {
        throw new Error("Invalid template download URL.");
    }

    const buffer = await downloadTemplate(template);

    console.log("\nExtracting template...\n");

    const destination = await extractTemplate(buffer, targetPath);

    console.log(`\n${colors.bold}${colors.green}✓ Template installed successfully!${colors.reset}\n`);
    console.log(`  ${colors.gray}Template:${colors.reset} ${colors.bold}${colors.cyan}${template.name}${colors.reset}`);
    console.log(`  ${colors.gray}Location:${colors.reset} ${colors.blue}${destination}${colors.reset}\n`);

}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (
        !command ||
        command === "help" ||
        command === "--help" ||
        command === "-h"
    ) {
        printHelp();
        return;
    }

    switch (command) {
        case "list":
            if (args.length > 1) {
                throw new Error("The list command does not accept arguments.");
            }

            await listTemplates();
            break;

        case "add":
            await addTemplate(args.slice(1));
            break;

        default:
            console.error(`Unknown command: ${command}`);
            printHelp();
            process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error("\n[WKF] Error:");
    console.error(error.message);
    process.exitCode = 1;
});
