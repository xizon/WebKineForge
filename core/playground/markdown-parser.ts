/**
 * Playground Demo Validation & Error Handling
 *
 * - Missing Examples section: Skip the component.
 * - Missing Demo headings: Skip the component.
 * - Missing TSX code block: Skip the Demo.
 * - Empty TSX code block: Skip the Demo.
 * - Multiple TSX code blocks: Skip the Demo.
 * - Import/export statements: Skip the Demo.
 * - Invalid TSX syntax: Skip the Demo.
 * - Missing component title or Overview: Use fallback values and continue.
 *
 * Invalid Demos must never interrupt the Playground generation
 * or prevent the Dev Server from starting.
 *
 * Valid Demos and other components should continue to be processed.
 */

import { marked } from 'marked';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

import type {
    MarkdownNode,
    ComponentInfo,
    ComponentDemo,
    PlaygroundMarkdownSection,
    PlaygroundSectionKey,
} from '../utils/types.ts';

import { parseDemoJSX } from './jsx-parser.ts';

import { consoleColors } from '../utils/helper.ts';

const {
    RESET,
    YELLOW,
    BOLD_YELLOW,
    DIM,
} = consoleColors;



/**
 * Render Markdown source into HTML.
 */
export function renderMarkdown(source: string): string {
    if (!source.trim()) return '';

    return marked.parse(source, {
        async: false,
    }) as string;
}


/**
 * Parse Markdown source into a Markdown AST.
 */
export function parseMarkdown(source: string) {
    return unified()
        .use(remarkParse)
        .use(remarkGfm)
        .parse(source);
}


/**
 * Extract original Markdown source from AST nodes.
 */
function getMarkdownSource(
    source: string,
    nodes: MarkdownNode[]
): string {
    if (!nodes.length) return '';

    const start = nodes[0].position?.start.offset;
    const end = nodes[nodes.length - 1].position?.end.offset;

    if (start === undefined || end === undefined) {
        return '';
    }

    return source.slice(start, end).trim();
}

/**
 * Extract text recursively from Markdown AST nodes.
 */
function getNodeText(node: MarkdownNode): string {
    if (typeof node.value === 'string') {
        return node.value;
    }

    if (node.children) {
        return node.children.map(getNodeText).join('');
    }

    return '';
}


const SECTION_ALIASES: Record<PlaygroundSectionKey, string[]> = {

    overview: [
        'Overview',
        'Introduction',
        'Description',
        'About',
        'Summary',
        'Purpose',
        '概述',
        '介绍',
        '组件概述',
        '组件介绍',
        '简介',
    ],

    examples: [
        'Examples',
        'Example',
        'Usage',
        'Demos',
        'Demo',
        'Showcase',
        'Code Examples',
        'Live Examples',
        'Use Cases',
        '示例',
        '使用示例',
        '示例用法',
        '用法示例',
    ],

    apiReference: [
        'API Reference',
        'API',
        'API Docs',
        'Props',
        'Properties',
        'Parameters',
        'Parameter',
        'API 参考',
        'API 文档',
        'API 参数',
        '接口说明',
        '接口参数',
        '参数',
        '参数表',
        '参数说明',
        '属性',
        '属性说明',
        '组件参数',
        '组件属性',
    ],

    dependencies: [
        'Dependencies',
        'Dependency',
        '依赖',
        '依赖项',
        '依赖关系',
        '外部依赖',
        '组件依赖',
        '项目依赖',
    ],
};


/**
 * Normalize Markdown section headings.
 */
function normalizeSectionHeading(value: string): string {
    return value
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[\s_\-:：/·]/g, '');
}


/**
 * Locate a level-two Markdown section.
 */
function findMarkdownSection(
    nodes: MarkdownNode[],
    key: PlaygroundSectionKey
): {
    title: string;
    content: MarkdownNode[];
} {

    const aliases = new Set(
        SECTION_ALIASES[key].map(normalizeSectionHeading)
    );

    const startIndex = nodes.findIndex((node) => {

        if (node.type !== 'heading' || node.depth !== 2) {
            return false;
        }

        return aliases.has(
            normalizeSectionHeading(getNodeText(node))
        );
    });

    if (startIndex === -1) {
        return {
            title: '',
            content: [],
        };
    }

    const heading = nodes[startIndex];

    const nextSectionIndex = nodes.findIndex(
        (node, index) =>
            index > startIndex &&
            node.type === 'heading' &&
            (node.depth ?? 0) <= 2
    );

    const endIndex = nextSectionIndex === -1
        ? nodes.length
        : nextSectionIndex;

    return {
        title: getNodeText(heading).trim(),
        content: nodes.slice(startIndex + 1, endIndex),
    };
}


/**
 * Extract paragraphs, lists and GFM tables from a Markdown section.
 */
function extractMarkdownSection(
    source: string,
    nodes: MarkdownNode[],
    key: PlaygroundSectionKey
): PlaygroundMarkdownSection {

    const section = findMarkdownSection(nodes, key);

    const paragraphs = section.content
        .filter((node) => node.type === 'paragraph')
        .map(getNodeText)
        .map((text) => text.trim())
        .filter(Boolean);

    const lists = section.content
        .filter((node) => node.type === 'list')
        .flatMap((list) =>
            (list.children ?? [])
                .filter((item) => item.type === 'listItem')
                .map(getNodeText)
                .map((text) => text.trim())
                .filter(Boolean)
        );

    const tables = section.content
        .filter((node) => node.type === 'table')
        .map((table) => {

            const rows = (table.children ?? [])
                .filter((row) => row.type === 'tableRow')
                .map((row) =>
                    (row.children ?? [])
                        .filter((cell) => cell.type === 'tableCell')
                        .map(getNodeText)
                        .map((text) => text.trim())
                );

            return {
                headers: rows[0] ?? [],
                rows: rows.slice(1),
            };
        })
        .filter((table) => table.headers.length > 0);

    return {
        title: section.title,
        markdown: getMarkdownSource(source, section.content),
        paragraphs,
        lists,
        tables,
    };
}


/**
 * Extract component name and overview from Markdown AST.
 *
 * Missing metadata should not interrupt Playground generation.
 */
export function extractComponentInfo(
    ast: ReturnType<typeof parseMarkdown>,
    source: string
): ComponentInfo {

    const nodes = ast.children as unknown as MarkdownNode[];

    // Component title
    const titleNode = nodes.find(
        (node) => node.type === 'heading' && node.depth === 1
    );

    const componentName = titleNode
        ? getNodeText(titleNode).trim()
        : 'Untitled Component';

    if (!titleNode || !componentName) {
        console.warn(
            '[WKF][PLAYGROUND][WARN] Component title (#) is missing.'
        );
    }

    // Overview
    const overviewSection = findMarkdownSection(
        nodes,
        'overview'
    );

    if (!overviewSection.title) {
        console.warn(
            `[WKF][PLAYGROUND][WARN] Overview section missing: ${componentName}`
        );
    }

    const overview = getMarkdownSource(
        source,
        overviewSection.content
    );



    // API Reference
    const apiReference = extractMarkdownSection(
        source,
        nodes,
        'apiReference'
    );


    // Dependencies
    const dependencies = extractMarkdownSection(
        source,
        nodes,
        'dependencies'
    );

    return {
        componentName,
        overview,
        apiReference,
        dependencies,
    };
}

/**
 * Check whether a TSX AST contains import/export syntax.
 *
 * This includes:
 * - import declarations
 * - export declarations
 * - dynamic import()
 * - TypeScript import types
 */
function containsImportExport(node: unknown): boolean {
    if (!node || typeof node !== 'object') {
        return false;
    }

    if (Array.isArray(node)) {
        return node.some(containsImportExport);
    }

    const astNode = node as Record<string, unknown>;

    const nodeType = typeof astNode.type === 'string'
        ? astNode.type
        : '';

    if (
        nodeType === 'ImportExpression' ||
        /^(Import|Export|TSImport|TSExport)/.test(nodeType)
    ) {
        return true;
    }

    return Object.values(astNode).some(
        containsImportExport
    );
}


/**
 * Log a skipped Demo without interrupting generation.
 */

function warnSkipDemo(
    componentDirectory: string,
    title: string,
    reason: string
): void {

    console.warn(
        `\n${BOLD_YELLOW}[${componentDirectory}]\n` +
        `  [WKF][PLAYGROUND][SKIP] "${title}": ${reason}.\n` +
        `${RESET}\n`
    );
}


/**
 * Extract demos from the Examples section.
 *
 * Invalid Demo examples are skipped instead of throwing errors.
 */

export function extractDemos(
    ast: ReturnType<typeof parseMarkdown>,
    source: string,
    componentDirectory: string
): ComponentDemo[] {

    const nodes = ast.children as unknown as MarkdownNode[];

    // Find ## Examples
    const examplesSection = findMarkdownSection(
        nodes,
        'examples'
    );

    if (!examplesSection.title) {
        console.warn(
            '[WKF][PLAYGROUND][WARN] Examples section not found.'
        );

        return [];
    }

    // Get all nodes inside the Examples section.
    const exampleNodes = examplesSection.content;

    // Find all ### Demo headings
    const demoIndexes = exampleNodes
        .map((node, index) => ({
            node,
            index,
        }))
        .filter(
            ({ node }) =>
                node.type === 'heading' && node.depth === 3
        );

    if (demoIndexes.length === 0) {
        console.warn(
            '[WKF][PLAYGROUND][WARN] No Demo headings found under ## Examples.'
        );

        return [];
    }

    const validDemos: ComponentDemo[] = [];

    for (const [i, item] of demoIndexes.entries()) {
        const heading = item.node;
        const index = item.index;

        const title = getNodeText(heading).trim()
            || 'Untitled Demo';

        const nextDemoIndex =
            demoIndexes[i + 1]?.index ?? exampleNodes.length;

        const content = exampleNodes.slice(
            index + 1,
            nextDemoIndex
        );

        // Extract description paragraphs
        const descriptionNodes = content.filter(
            (node) => !(
                node.type === 'code' &&
                node.lang?.toLowerCase() === 'tsx'
            )
        );

        const description = getMarkdownSource(
            source,
            descriptionNodes
        );

        // ----------------------------------------
        // 1. Find TSX code blocks
        // ----------------------------------------

        const codeBlocks = content.filter(
            (node) =>
                node.type === 'code' &&
                node.lang?.toLowerCase() === 'tsx'
        );

        if (codeBlocks.length === 0) {
            // Keep Demo metadata even when no TSX example exists.
            validDemos.push({
                title,
                description,
                code: '',
            });

            continue;
        }

        if (codeBlocks.length !== 1) {
            warnSkipDemo(
                componentDirectory,
                title,
                `Expected one TSX code block, found ${codeBlocks.length}.`
            );

            continue;
        }

        const code = codeBlocks[0].value?.trim() ?? '';

        if (!code) {
            // An empty TSX block is treated as a documentation-only Demo.
            validDemos.push({
                title,
                description,
                code: '',
            });

            continue;
        }

        // ----------------------------------------
        // 2. Parse TSX
        // ----------------------------------------

        let program;

        try {
            program = parseDemoJSX(code);
        } catch (error) {
            warnSkipDemo(
                componentDirectory,
                title,
                `Invalid TSX syntax: ${error instanceof Error
                    ? error.message
                    : String(error)
                }`
            );

            continue;
        }

        // ----------------------------------------
        // 3. Ignore import/export syntax
        // ----------------------------------------

        if (containsImportExport(program)) {
            warnSkipDemo(
                componentDirectory,
                title,
                'Import/export statements are not supported in Demo snippets.'
            );

            continue;
        }

        // ----------------------------------------
        // 4. Add valid Demo
        // ----------------------------------------

        validDemos.push({
            title,
            description,
            code,
        });
    }

    return validDemos;
}