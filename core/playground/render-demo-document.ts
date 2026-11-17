import type { SiteContext } from '../utils/types.ts';
import type {
    PlaygroundDocumentOptions,
} from '../utils/types.ts';

import { escapeHtml } from '../utils/helper.ts';
import { renderDocument } from '../processors/html-shell.ts';

import type {
    PlaygroundMarkdownSection,
} from '../utils/types.ts';

/**
 * Render an extracted Markdown documentation section.
 */
function renderDocumentationSection(
    section: PlaygroundMarkdownSection,
    className: string
): string {

    const hasContent =
        section.paragraphs.length > 0 ||
        section.lists.length > 0 ||
        section.tables.length > 0;

    if (!hasContent) {
        return '';
    }

    const paragraphsHtml = section.paragraphs
        .map((paragraph) => `
            <p>${escapeHtml(paragraph)}</p>
        `)
        .join('');

    const listsHtml = section.lists.length
        ? `
            <ul>
                ${section.lists.map((item) => `
                    <li>${escapeHtml(item)}</li>
                `).join('')}
            </ul>
        `
        : '';

    const tablesHtml = section.tables
        .map((table) => {

            const headersHtml = table.headers
                .map((header) => `
                    <th scope="col">${escapeHtml(header)}</th>
                `)
                .join('');

            const rowsHtml = table.rows
                .map((row) => `
                    <tr>
                        ${row.map((cell) => `
                            <td>${escapeHtml(cell)}</td>
                        `).join('')}
                    </tr>
                `)
                .join('');

            return `
                <div class="wkf-playground__table-wrap">
                    <table>
                        <thead>
                            <tr>${headersHtml}</tr>
                        </thead>

                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>
            `;
        })
        .join('');

    const heading = section.title ||
        (className === 'api-reference'
            ? 'API Reference'
            : 'Dependencies');

    return `
        <section
            id="${className}"
            class="wkf-playground__documentation wkf-playground__documentation--${className}"
        >
            <h2>${escapeHtml(heading)}</h2>

            ${paragraphsHtml}
            ${tablesHtml}
            ${listsHtml}
        </section>
    `;
}

/**
 * Render a standalone Playground HTML document.
 */
export function renderPlaygroundDocument(
    options: PlaygroundDocumentOptions,
    site: SiteContext
): string {
    const {
        componentName,
        overview,
        demoTitle,
        demoDescription,
        previewHtml,
        demoCode,
        apiReference,
        dependencies,
        assets,
        viteClient,
    } = options;

    const hasDemoCode = demoCode.trim().length > 0;

    // Resolve Site public asset paths for nested Playground pages.
    const resolvedPreviewHtml = previewHtml.replace(
        /(\b(?:src|href|poster)\s*=\s*["'])\.\/assets\//g,
        '$1../assets/'
    );

    const apiReferenceHtml = renderDocumentationSection(
        apiReference,
        'api-reference'
    );

    const dependenciesHtml = renderDocumentationSection(
        dependencies,
        'dependencies'
    );

    const body = `
        <main class="wkf-playground">

            <nav class="wkf-playground__navigation">
                <a
                    href="./index.html"
                    class="wkf-playground__back"
                    title="Back to Playground"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M19 12H5" />
                        <path d="m12 19-7-7 7-7" />
                    </svg>
                </a>
            </nav>

            <header
                id="overview"
                class="wkf-playground__header"
            >

                <h1>
                    ${escapeHtml(componentName)}
                </h1>

                <p class="wkf-playground__overview">
                    ${escapeHtml(overview)}
                </p>

            </header>

            <section
                id="examples"
                class="wkf-playground__demo"
            >

                <h2>
                    ${escapeHtml(demoTitle)}
                </h2>

                <p>
                    ${escapeHtml(demoDescription)}
                </p>

            ${hasDemoCode ? `
                <div
                    class="wkf-playground__tabs"
                    data-playground-tabs
                >

                    <div
                        class="wkf-playground__tab-list"
                        role="tablist"
                    >
                        <button
                            id="playground-tab-preview"
                            class="wkf-playground__tab"
                            type="button"
                            role="tab"
                            aria-selected="true"
                            aria-controls="playground-panel-preview"
                            data-tab="preview"
                        >
                            Preview
                        </button>

                        <button
                            id="playground-tab-code"
                            class="wkf-playground__tab"
                            type="button"
                            role="tab"
                            aria-selected="false"
                            aria-controls="playground-panel-code"
                            data-tab="code"
                            tabindex="-1"
                        >
                            Code
                        </button>
                    </div>

                    <section
                        id="playground-panel-preview"
                        class="wkf-playground__panel"
                        role="tabpanel"
                    >
                        <div
                            class="wkf-playground__preview"
                            data-playground-preview
                        >
                            ${resolvedPreviewHtml}
                        </div>
                    </section>

                    <section
                        id="playground-panel-code"
                        class="wkf-playground__panel"
                        role="tabpanel"
                        tabindex="0"
                        hidden
                    >
                        <div class="wkf-playground__code-header">
                            <span>TSX</span>

                            <button
                                type="button"
                                class="wkf-playground__copy"
                                data-copy-code
                            >
                                Copy
                            </button>
                        </div>

                        <pre class="wkf-playground__code"><code>${escapeHtml(demoCode)}</code></pre>

                        <p
                            class="wkf-playground__copy-status"
                            data-copy-status
                            aria-live="polite"
                        ></p>
                    </section>

                </div>
            ` : `
                <div class="wkf-playground__no-preview" role="status">
                    <p>
                        This example does not include a TSX preview.
                    </p>
                </div>
            `}

            </section>

            ${apiReferenceHtml}

            ${dependenciesHtml}

        </main>

        <script>
        (() => {
            document.querySelectorAll('[data-playground-tabs]').forEach((root) => {
                const tabs = [
                    ...root.querySelectorAll('[role="tab"]')
                ];

                const panels = [
                    ...root.querySelectorAll('[role="tabpanel"]')
                ];

                // Copy elements must be queried inside root.
                const copyButton = root.querySelector('[data-copy-code]');
                const codeElement = root.querySelector('.wkf-playground__code code');
                const copyStatus = root.querySelector('[data-copy-status]');

                // ----------------------------------------
                // Tab switching
                // ----------------------------------------

                function activate(tab, moveFocus = false) {
                    const targetId = tab.getAttribute('aria-controls');

                    tabs.forEach((item) => {
                        const selected = item === tab;

                        item.setAttribute(
                            'aria-selected',
                            String(selected)
                        );

                        item.tabIndex = selected ? 0 : -1;
                    });

                    panels.forEach((panel) => {
                        panel.hidden = panel.id !== targetId;
                    });

                    if (moveFocus) {
                        tab.focus();
                    }
                }

                tabs.forEach((tab) => {
                    tab.addEventListener('click', () => {
                        activate(tab);
                    });

                    tab.addEventListener('keydown', (event) => {
                        const index = tabs.indexOf(tab);
                        let next = index;

                        if (event.key === 'ArrowRight') {
                            next = (index + 1) % tabs.length;
                        } else if (event.key === 'ArrowLeft') {
                            next = (index - 1 + tabs.length) % tabs.length;
                        } else if (event.key === 'Home') {
                            next = 0;
                        } else if (event.key === 'End') {
                            next = tabs.length - 1;
                        } else {
                            return;
                        }

                        event.preventDefault();
                        activate(tabs[next], true);
                    });
                });


                // ----------------------------------------
                // Copy code
                // ----------------------------------------

                async function copyText(text) {
                    // Modern Clipboard API
                    if (navigator.clipboard && window.isSecureContext) {
                        try {
                            await navigator.clipboard.writeText(text);
                            return true;
                        } catch (error) {
                            console.warn(
                                '[WKF] Clipboard API failed:',
                                error
                            );
                        }
                    }

                    // Fallback for unsupported environments
                    const textarea = document.createElement('textarea');

                    textarea.value = text;
                    textarea.setAttribute('readonly', '');

                    Object.assign(textarea.style, {
                        position: 'fixed',
                        left: '-9999px',
                        top: '0',
                        opacity: '0',
                        pointerEvents: 'none',
                    });

                    document.body.appendChild(textarea);

                    textarea.focus();
                    textarea.select();
                    textarea.setSelectionRange(0, text.length);

                    let success = false;

                    try {
                        success = document.execCommand('copy');
                    } catch (error) {
                        console.error('[WKF] Fallback copy failed:', error);
                    } finally {
                        textarea.remove();
                    }

                    return success;
                }

                copyButton?.addEventListener('click', async () => {
                    if (!codeElement) return;

                    const text = codeElement.textContent || '';

                    try {
                        const success = await copyText(text);

                        if (success) {
                            copyButton.textContent = 'Copied';
                            copyStatus.textContent = 'Code copied successfully.';
                        } else {
                            copyButton.textContent = 'Failed';
                            copyStatus.textContent = 'Unable to copy code. Please copy it manually.';
                        }
                    } catch (error) {
                        console.error('[WKF] Copy failed:', error);

                        copyButton.textContent = 'Failed';
                        copyStatus.textContent = 'Unable to copy code.';
                    }

                    window.setTimeout(() => {
                        copyButton.textContent = 'Copy';
                        copyStatus.textContent = '';
                    }, 2000);
                });
            });
        })();
        </script>
    `;

    const styles = `

        /* ----------------------------------------
           Navigation
        ---------------------------------------- */

        .wkf-playground__navigation {
            margin-bottom: 36px;
            display: none;
        }

        .wkf-playground__back {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border: 1px solid rgba(128, 128, 128, 0.3);
            border-radius: 50%;
            color: inherit;
            background: rgba(128, 128, 128, 0.08);
            text-decoration: none;
            transition:
                background 0.2s ease,
                border-color 0.2s ease,
                transform 0.2s ease;
        }

        .wkf-playground__back:hover {
            background: rgba(128, 128, 128, 0.16);
            border-color: #8b5cf6;
            transform: translateX(-3px);
        }

        .wkf-playground__back:focus-visible {
            outline: 2px solid #8b5cf6;
            outline-offset: 3px;
        }


        /* ----------------------------------------
           Page Layout
        ---------------------------------------- */

        .wkf-playground {
            width: min(1200px, calc(100% - 48px));
            margin: 0 auto;
            padding: 72px 0;
        }

        .wkf-playground__header {
            margin-bottom: 48px;
        }

        .wkf-playground__header h1 {
            margin: 12px 0;
            font-size: clamp(32px, 5vw, 52px);
        }

        .wkf-playground__overview {
            max-width: 680px;
            color: #888;
            line-height: 1.7;
        }

        .wkf-playground__demo h2 {
            font-size: 24px;
        }

        .wkf-playground__demo > p {
            color: #888;
            line-height: 1.7;
        }

        /* ----------------------------------------
        API Reference & Dependencies
        ---------------------------------------- */

        .wkf-playground__documentation {
            margin-top: 64px;
            padding-top: 32px;
            border-top: 1px solid rgba(128, 128, 128, 0.2);
        }

        .wkf-playground__documentation h2 {
            margin: 0 0 22px;
            font-size: 21px;
            font-weight: 650;
        }

        .wkf-playground__documentation p {
            color: #888;
            font-size: 13px;
            line-height: 1.8;
            white-space: pre-line;
        }

        .wkf-playground__table-wrap {
            width: 100%;
            margin: 20px 0;
            overflow-x: auto;
            border: 1px solid rgba(128, 128, 128, 0.2);
            border-radius: 9px;
        }

        .wkf-playground__documentation table {
            width: 100%;
            min-width: 560px;
            border-collapse: collapse;
            font-size: 12px;
            line-height: 1.6;
            text-align: left;
        }

        .wkf-playground__documentation th,
        .wkf-playground__documentation td {
            padding: 12px 15px;
            border-bottom: 1px solid rgba(128, 128, 128, 0.15);
            vertical-align: top;
        }

        .wkf-playground__documentation th {
            background: rgba(128, 128, 128, 0.06);
            font-weight: 650;
            white-space: nowrap;
        }

        .wkf-playground__documentation td {
            color: #777;
        }

        .wkf-playground__documentation td:first-child {
            color: inherit;
            font-family:
                "SFMono-Regular",
                Consolas,
                monospace;
        }

        .wkf-playground__documentation tbody tr:last-child td {
            border-bottom: 0;
        }

        .wkf-playground__documentation ul {
            display: grid;
            gap: 9px;
            padding-left: 21px;
            color: #777;
            font-size: 13px;
            line-height: 1.7;
        }

        .wkf-playground__documentation li {
            padding-left: 3px;
        }


        /* ----------------------------------------
           Tabs
        ---------------------------------------- */

        .wkf-playground__tabs {
            margin-top: 32px;
        }

        .wkf-playground__tab-list {
            display: flex;
            align-items: center;
            gap: 24px;
            margin-bottom: 24px;
            border-bottom: 1px solid rgba(128, 128, 128, 0.25);
        }

        .wkf-playground__tab {
            position: relative;
            padding: 12px 2px;
            border: 0;
            background: transparent;
            color: #888;
            font: inherit;
            font-size: 14px;
            cursor: pointer;
            transition: color 0.2s ease;
        }

        .wkf-playground__tab:hover {
            color: inherit;
        }

        .wkf-playground__tab[aria-selected="true"] {
            color: inherit;
        }

        .wkf-playground__tab[aria-selected="true"]::after {
            content: "";
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 2px;
            background: currentColor;
        }

        .wkf-playground__tab:focus-visible {
            outline: 2px solid #8b5cf6;
            outline-offset: 4px;
        }

        .wkf-playground__panel[hidden] {
            display: none;
        }


        /* ----------------------------------------
           Preview
        ---------------------------------------- */

        .wkf-playground__preview {
            min-height: 100px;
        }

        /* ----------------------------------------
        No TSX Preview
        ---------------------------------------- */

        .wkf-playground__no-preview {
            display: grid;
            place-items: center;
            min-height: 220px;
            padding: 32px;
            border: 1px dashed rgba(128, 128, 128, 0.3);
            border-radius: 10px;
            background: rgba(128, 128, 128, 0.04);
            text-align: center;
        }

        .wkf-playground__no-preview p {
            max-width: 420px;
            margin: 0;
            color: #888;
            font-size: 13px;
            line-height: 1.7;
        }


        /* ----------------------------------------
           Code
        ---------------------------------------- */

        .wkf-playground__code {
            margin: 0;
            padding: 24px;
            overflow-x: auto;
            border-radius: 10px;
            background: #171717;
            color: #e5e7eb;
            font-size: 13px;
            line-height: 1.7;
            tab-size: 2;
        }

        .wkf-playground__code code {
            font-family:
                "SFMono-Regular",
                Consolas,
                monospace;
            white-space: pre;
        }

        .wkf-playground__code-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-radius: 10px 10px 0 0;
            background: #202020;
            color: #999;
            font-size: 12px;
        }

        .wkf-playground__copy {
            padding: 5px 12px;
            border: 1px solid #444;
            border-radius: 6px;
            background: transparent;
            color: #ddd;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .wkf-playground__copy:hover {
            background: #363636;
        }

        .wkf-playground__code {
            border-radius: 0 0 10px 10px;
        }

        .wkf-playground__copy-status {
            min-height: 20px;
            margin: 8px 0 0;
            color: #888;
            font-size: 12px;
        }


        /* ----------------------------------------
           Other
        ---------------------------------------- */

        .wkf-playground__header,
        .wkf-playground__demo,
        .wkf-playground__documentation {
            scroll-margin-top: 72px;
        }


        /* ----------------------------------------
           Responsive
        ---------------------------------------- */

        @media (max-width: 600px) {
            .wkf-playground {
                width: calc(100% - 32px);
                padding: 40px 0;
            }

            .wkf-playground__navigation {
                margin-bottom: 28px;
            }

            .wkf-playground__code {
                padding: 16px;
                font-size: 12px;
            }
        }
    `;

    return renderDocument(
        {
            seo: {
                lang: site.config.lang,
                title: `${demoTitle} - ${componentName}`,
                description: overview,
            },

            bodyClass: 'wkf-playground-page',

            body,

            extraHead: `<style>${styles}</style>`,

            cssHrefs: assets.css,
            jsHrefs: assets.js,

            isIndex: false,
            viteClient
            
        },
        site
    );
}