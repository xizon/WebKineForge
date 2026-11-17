
/**
 * Creates a new "PAGE" using the system page template.
 * Automatically inherits the Tailwind CSS prefix from the target Site.
 */

/*
Usage:

npm run create:page -- "My Page" --site my-site
npm run create:page -- "My Page" --site my-site --prefix myprefix

*/

import fs from 'node:fs';
import path from 'node:path';
import { loadSite } from '../../site/load-site.ts';
import {
    parseArgs,
    toKebabCase,
    toPascalCase,
    toTitleCase,
    consoleColors
} from '../../utils/helper.ts';
import { getPrefix } from '../../utils/get-prefix.ts';


const {
    GREEN,
    RESET
} = consoleColors;

const DEFAULT_SITE = 'default-site';


function createTemplates(name: string, prefix: string) {

    const utilityPrefix = `${prefix}:`;
    const escapedPrefix = `${prefix}-`;
    const title = toTitleCase(name);
    const componentName = toPascalCase(name);

    return {
        'index.tsx': `// Global styles
import '@/styles/tailwind.css';

// Custom styles
import './style.css';

// Components
import MyComponent from '@/components/my-component';

export default function ${componentName}() {
    return (
        <main className="${escapedPrefix}page-main">
            {\`<!-- This is a page automatically created by the CLI. -->\`}
            <MyComponent />
        </main>
    );
}
`,

        'manifest.json': JSON.stringify({
            name,
            version: '1.0.0',
            type: 'page',
            output: `${name}.html`,
            bodyClass: `${escapedPrefix}page ${escapedPrefix}samplepage`,
            seo: {
                lang: 'en-US',
                title,
                description: 'This is a page automatically created by the CLI.',
                keywords: [],
                canonical: '',
            },
            entry: {
                template: './index.tsx',
                client: './index.tsx',
                styles: './style.css',
            },
        }, null, 4) + '\n',

        'style.css': `/* Your extended style, such as: .${escapedPrefix}box { ... } */
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
            throw new Error('Page name must contain letters or numbers.');
        }

        // !!!IMPORTANT!!!
        // // Resolve the target Site: CLI option > inherited SITE environment variable > default Site.
        const siteName =
            siteOverride ||
            process.env.SITE ||
            DEFAULT_SITE;

        const siteRoot = path.resolve(process.cwd(), 'sites', siteName);
        const site = loadSite(siteRoot);

        const sitePrefix = getPrefix(site.paths.styles);
        const prefix = prefixOverride || sitePrefix;

        const pageDir = path.join(site.paths.pages, name);

        if (fs.existsSync(pageDir)) {
            throw new Error(`Page already exists: ${pageDir}`);
        }

        const files = createTemplates(name, prefix);

        fs.mkdirSync(pageDir, { recursive: true });

        for (const [fileName, content] of Object.entries(files)) {
            fs.writeFileSync(
                path.join(pageDir, fileName),
                content,
                'utf8'
            );
        }


        console.log(
            `${GREEN}[WKF] Page created: ${path.relative(process.cwd(), pageDir)}${RESET}`
        );

        console.log(
            `${GREEN}[WKF] Site: ${siteName}${RESET}`
        );

        console.log(
            `${GREEN}[WKF] Tailwind prefix: ${prefix}${RESET}`
        );

        if (prefixOverride && prefixOverride !== sitePrefix) {
            console.warn(
                `[WKF] Warning: prefix "${prefix}" differs from the Site Tailwind prefix "${sitePrefix}". The generated page classes may not receive styles until tailwind.css is updated.`
            );
        }

    } catch (error) {
        console.error(
            `[WKF] ${error instanceof Error ? error.message : error}`
        );

        process.exitCode = 1;
    }
}

main();
