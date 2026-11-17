/*
TEST：

npx tsx core/playground/__test__/_examples_s1.ts
*/
import { readFile } from 'node:fs/promises';
import {
    parseMarkdown,
    extractComponentInfo,
    extractDemos,
} from '../../core/playground/markdown-parser.ts';

async function main() {
    const components = [
        'hero-3d',
        'photo-scatter',
        'scenes',
    ];

    for (const component of components) {
        console.log(`\n========== ${component} ==========\n`);

        const filePath =
            `sites/default-site/src/components/${component}/examples.md`;

        const source = await readFile(filePath, 'utf8');
        const ast = parseMarkdown(source);

        const info = extractComponentInfo(ast);
        const demos = extractDemos(ast);

        console.log(
            JSON.stringify(
                {
                    ...info,
                    demos,
                },
                null,
                2
            )
        );
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});