
import path from "node:path";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";

import { buildTemplates } from "./build.ts";

const OWNER = "xizon";
const REPO = "webkineforge";
const REPOSITORY = `${OWNER}/${REPO}`;

const RELEASE_TAG = "templates-latest";

const ROOT = process.cwd();

const PACKAGES_DIR = path.join(
    ROOT,
    "tools/template-releases",
    "packages"
);

const REGISTRY_DIR = path.join(
    ROOT,
    "tools/template-releases",
    "registry"
);

const REGISTRY_PATH = path.join(
    REGISTRY_DIR,
    "templates.json"
);

function run(
    command: string,
    args: string[]
): Promise<void> {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: ROOT,
            stdio: "inherit"
        });

        child.on("error", reject);

        child.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(
                    new Error(
                        `${command} exited with code ${code}`
                    )
                );
            }
        });
    });
}

function capture(
    command: string,
    args: string[]
): Promise<string> {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: ROOT,
            stdio: ["ignore", "pipe", "pipe"]
        });

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (data: Buffer) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data: Buffer) => {
            stderr += data.toString();
        });

        child.on("error", reject);

        child.on("close", (code) => {
            if (code === 0) {
                resolve(stdout.trim());
            } else {
                reject(
                    new Error(
                        stderr.trim() ||
                        `${command} exited with code ${code}`
                    )
                );
            }
        });
    });
}

async function ensureRepository(): Promise<void> {
    const remote = await capture("git", [
        "remote",
        "get-url",
        "origin"
    ]);

    const normalizedRemote = remote
        .replace(/\.git$/, "")
        .toLowerCase();

    const validRemotes = [
        "github.com/xizon/webkineforge",
        "github.com:xizon/webkineforge"
    ];

    if (
        !validRemotes.some((item) =>
            normalizedRemote.endsWith(item)
        )
    ) {
        throw new Error(
            `Unexpected Git remote: ${remote}`
        );
    }

    await run("gh", ["auth", "status"]);

    console.log("[WKF][Publish] GitHub authentication verified.");
}

async function ensureRelease(): Promise<void> {
    try {
        await capture("gh", [
            "release",
            "view",
            RELEASE_TAG,
            "--repo",
            REPOSITORY
        ]);

        console.log("[WKF][Publish] Release already exists.");
    } catch {
        console.log("[WKF][Publish] Creating GitHub Release...");

        await run("gh", [
            "release",
            "create",
            RELEASE_TAG,
            "--repo",
            REPOSITORY,
            "--title",
            "WebKineForge Templates",
            "--notes",
            "Latest downloadable WebKineForge site templates."
        ]);
    }
}

async function uploadTemplates(
    templates: Awaited<ReturnType<typeof buildTemplates>>
): Promise<void> {
    const files = templates.map((template) =>
        path.join(PACKAGES_DIR, template.filename)
    );

    console.log("[WKF][Publish] Uploading template ZIP files...");

    await run("gh", [
        "release",
        "upload",
        RELEASE_TAG,
        ...files,
        "--repo",
        REPOSITORY,
        "--clobber"
    ]);

    console.log("[WKF][Publish] ZIP upload completed.");
}

async function updateRegistry(
    templates: Awaited<ReturnType<typeof buildTemplates>>
): Promise<void> {
    await mkdir(REGISTRY_DIR, {
        recursive: true
    });

    const updatedAt = new Date().toISOString();

    const registry = {
        version: 1,
        updatedAt,
        templates: templates.map((template) => ({
            name: template.name,
            description: template.description,
            downloadUrl:
                `https://github.com/${REPOSITORY}/releases/download/` +
                `${RELEASE_TAG}/${template.filename}`,
            checksum: template.checksum,
            size: template.size,
            updatedAt
        }))
    };

    await writeFile(
        REGISTRY_PATH,
        JSON.stringify(registry, null, 2) + "\n",
        "utf8"
    );

    console.log("[WKF][Publish] Registry generated.");
}

async function commitAndPushRegistry(): Promise<void> {
    // Avoid accidentally including files staged by the user.
    const existingStaged = await capture("git", [
        "diff",
        "--cached",
        "--name-only"
    ]);

    if (existingStaged) {
        throw new Error(
            "Git staging area is not empty. " +
            "Please commit or unstage existing changes first."
        );
    }

    await run("git", [
        "add",
        "tools/template-releases/registry/templates.json"
    ]);

    const staged = await capture("git", [
        "diff",
        "--cached",
        "--name-only"
    ]);

    if (!staged) {
        console.log("[WKF][Publish] No Registry changes to commit.");
        return;
    }

    await run("git", [
        "commit",
        "-m",
        "chore: update template registry"
    ]);

    const branch = await capture("git", [
        "branch",
        "--show-current"
    ]);

    if (!branch) {
        throw new Error(
            "Unable to determine current Git branch."
        );
    }

    await run("git", [
        "push",
        "origin",
        branch
    ]);

    console.log("[WKF][Publish] Registry pushed to GitHub.");
}

async function main(): Promise<void> {
    console.log(
        "\n========== WebKineForge Template Publisher ==========\n"
    );

    // 1. Verify repository and GitHub authentication.
    await ensureRepository();

    // 2. Build all discovered sites through the existing WKF CLI.
    console.log("\n[WKF][Publish] Building all sites...\n");

    await run("npm", [
        "run",
        "build",
        "--",
        "all"
    ]);

    // 3. Package dist directories and calculate SHA256.
    console.log("\n[WKF][Publish] Packaging templates...\n");

    const templates = await buildTemplates();

    // 4. Create or reuse the fixed GitHub Release.
    await ensureRelease();

    // 5. Upload ZIP assets.
    await uploadTemplates(templates);

    // 6. Update Registry after successful uploads.
    await updateRegistry(templates);

    // 7. Commit and push only the Registry file.
    await commitAndPushRegistry();

    console.log(
        "\n========== Publishing completed ==========\n"
    );
}

main().catch((error: unknown) => {
    console.error("\n[WKF][Publish] Failed:");

    console.error(
        error instanceof Error
            ? error.message
            : error
    );

    process.exitCode = 1;
});
