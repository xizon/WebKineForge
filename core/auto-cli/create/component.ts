
/**
 * Creates a new "COMPONENT" using the system component template.
 * Automatically inherits the Tailwind CSS prefix from the target Site.
 */

/*
Usage:

npm run create:component -- "My Component" --site my-site
npm run create:component -- "My Component" --site my-site --prefix myprefix

*/

import fs from 'node:fs';
import path from 'node:path';
import { loadSite } from '../../site/load-site.ts';

import {
    parseArgs,
    toKebabCase,
    toPascalCase,
    consoleColors
} from '../../utils/helper.ts';

import {
    getPrefix
} from '../../utils/get-prefix.ts';


const {
    GREEN,
    RESET
} = consoleColors;

const DEFAULT_SITE = 'default-site';
const DEFAULT_GSAP_VERSION = '^3.15.1';


function createTemplates(name: string, prefix: string) {

    const utilityPrefix = `${prefix}:`;
    const escapedPrefix = `${prefix}-`;
    const controllerEscapedPrefix = `${prefix}-`;

    const manifest = {
        name,
        slug: name,
        version: '1.0.0',
        type: 'component',
        description: 'This is a component automatically created by the CLI.',
        dependencies: { gsap: DEFAULT_GSAP_VERSION },
        assets: ['./assets/images/avatar.png'],
    };
    const componentTag = toPascalCase(name);

    const examplesTemplate = `# {Component Name}

## Overview

[Briefly describe what this component does.]

## Examples

### Basic Usage

This example shows the basic usage.

\`\`\`tsx
<${componentTag} />
\`\`\`

### Advanced Usage

[Add this section only if the component has advanced usage examples. Write each example as a bare JSX expression in a \`tsx\` block: no import, no export, no placeholders.]

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| \`name\` | \`string\` | - | ✅ | Unique identification. |
| \`attr\` | \`number\` | \`1\` | - | Property description. |

[Replace the example parameter above with the actual component parameters.]

## Dependencies

- [Library Name](URL) - Version or usage notes
`;

    const examples = examplesTemplate.replace(
        '{Component Name}',
        manifest.name
    );

    return {
        'controller.ts': `import { gsap } from 'gsap';

export function mount(
    element: HTMLElement | null
): (() => void) | void {
    if (!element) return;

    const button = element.querySelector<HTMLButtonElement>(
        '.${controllerEscapedPrefix}${name}__button'
    );

    if (!button) return;

    const handleClick = () => {
        gsap.timeline()
            .to(button, {
                scale: 0.9,
                rotation: -5,
                duration: 0.15,
                ease: 'power2.out',
            })
            .to(button, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: 'elastic.out(1, 0.4)',
            });
    };

    button.addEventListener('click', handleClick);

    return () => {
        button.removeEventListener('click', handleClick);
        gsap.killTweensOf(button);
    };
}
`,

        'index.ts': `export { Template as default } from './template';
`,

        'manifest.json': JSON.stringify(
            manifest,
            null,
            4
        ) + '\n',

        'style.css': `.${escapedPrefix}${name} {
    padding: 24px;
    background: #111;
    color: white;
}

.${escapedPrefix}${name}__button {
    margin-top: 16px;
    padding: 10px 20px;
    border-radius: 6px;
    background: white;
    color: black;
    cursor: pointer;
}
`,

        'examples.md': examples,

        'template.tsx': `import './style.css';

export function Template() {
    return (
        <section
            className="${escapedPrefix}${name}"
        >
            <h2 className="${utilityPrefix}text-xl ${utilityPrefix}font-semibold">
                ${toPascalCase(name)}
            </h2>

            <button className="${escapedPrefix}${name}__button">
                Click Me
            </button>
        </section>
    );
}
`,
    };
}


function main() {
    try {
        const {
            name: inputName,
            siteName: siteOverride,
            prefixOverride,
        } = parseArgs(process.argv.slice(2));

        const name = toKebabCase(inputName);

        if (!name) {
            throw new Error('Component name must contain letters or numbers.');
        }

        // Resolve the target Site:
        // CLI option > inherited SITE environment variable > default Site.
        const siteName =
            siteOverride ||
            process.env.SITE ||
            DEFAULT_SITE;

        const siteRoot = path.resolve(process.cwd(), 'sites', siteName);
        const site = loadSite(siteRoot);

        // Get the Tailwind prefix from the target Site.
        // Falls back to "wkf" if the configuration cannot be read.
        const sitePrefix = getPrefix(site.paths.styles);
        const prefix = prefixOverride || sitePrefix;

        if (!/^[a-zA-Z][\w-]*$/.test(prefix)) {
            throw new Error(`Invalid Tailwind prefix: ${prefix}`);
        }

        const componentDir = path.join(site.paths.components, name);

        if (fs.existsSync(componentDir)) {
            throw new Error(`Component already exists: ${componentDir}`);
        }

        const files = createTemplates(name, prefix);

        fs.mkdirSync(componentDir, { recursive: true });

        for (const [fileName, content] of Object.entries(files)) {
            fs.writeFileSync(
                path.join(componentDir, fileName),
                content,
                'utf8'
            );
        }

        // Keep Site-level dependency declarations in sync with the component manifest.
        const sitePackagePath = path.join(site.root, 'package.json');

        if (fs.existsSync(sitePackagePath)) {
            const sitePackage = JSON.parse(
                fs.readFileSync(sitePackagePath, 'utf8')
            );

            sitePackage.dependencies ??= {};

            if (!sitePackage.dependencies.gsap) {
                sitePackage.dependencies.gsap = DEFAULT_GSAP_VERSION;

                fs.writeFileSync(
                    sitePackagePath,
                    JSON.stringify(sitePackage, null, 4) + '\n'
                );

                console.log(
                    'Added gsap to Site package.json. Run npm install from the repository root.'
                );
            }
        } else {
            console.warn(
                'Site package.json not found; install gsap manually to use this component.'
            );
        }

        console.log(
            `${GREEN}[WKF] Component created: ${path.relative(process.cwd(), componentDir)}${RESET}`
        );

        console.log(
            `${GREEN}[WKF] Site: ${siteName}${RESET}`
        );

        console.log(
            `${GREEN}[WKF] Tailwind prefix: ${prefix}${RESET}`
        );

    } catch (error) {
        console.error(
            `[WKF] ${error instanceof Error ? error.message : error}`
        );

        process.exitCode = 1;
    }
}

main();
