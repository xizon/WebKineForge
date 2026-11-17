
import type { SiteContext } from '../utils/types.ts';

import { escapeHtml } from '../utils/helper.ts';
import { renderDocument } from '../processors/html-shell.ts';

import type {
    PlaygroundIndexComponent,
} from '../utils/types.ts';


/**
 * Component icon.
 */
function getComponentIcon(): string {
    return `
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="m12 3 9 5-9 5-9-5 9-5Z"/>
            <path d="m3 12 9 5 9-5"/>
            <path d="m3 16 9 5 9-5"/>
        </svg>
    `;
}


/**
 * Render the Playground index page.
 *
 * Layout:
 * - Left: compact, independently scrollable component navigation.
 * - Right: AJAX/PJAX content area.
 *
 * Existing Demo HTML pages are fetched and displayed directly.
 * No iframe or duplicate Demo rendering is used.
 */
export function renderPlaygroundIndex(
    components: PlaygroundIndexComponent[],
    site: SiteContext,
    viteClient = false,
    initialDemoHref?: string
): string {

    // ----------------------------------------
    // Available components
    // ----------------------------------------

    const availableComponents = components
        .filter((component) => component.demos.length > 0)
        .sort((a, b) =>
            a.name.localeCompare(b.name, 'en', {
                sensitivity: 'base',
            })
        );

    // ----------------------------------------
    // Find initial Demo
    // ----------------------------------------

    const allDemos = availableComponents.flatMap(
        (component) => component.demos
    );

    // console.log('[WKF][PLAYGROUND] Demo matching:', {
    //     initialDemoHref,
    //     availableHrefs: allDemos.map((demo) => demo.href),
    // });


    // Select the requested Demo when opening a direct URL.
    // Otherwise use the first available Demo.
    const selectedDemo = initialDemoHref
        ? allDemos.find(
            (demo) => demo.href === initialDemoHref
        )
        : undefined;

    const firstDemo = selectedDemo ?? allDemos[0];

    const initialHref = firstDemo
        ? `./${firstDemo.href}`
        : '';

    const initialTitle = firstDemo?.title ?? 'No Demo available';


    // ----------------------------------------
    // Component navigation
    // ----------------------------------------

    const navigation = availableComponents.map(
        (component, componentIndex) => {

            const demos = component.demos.map(
                (demo, demoIndex) => {

                    const isActive = demo.href === firstDemo?.href;

                    return `
                        <a
                            class="wkf-preview-nav__demo${isActive ? ' is-active' : ''}"
                            href="./${escapeHtml(demo.href)}"
                            data-demo-link
                            data-demo-title="${escapeHtml(demo.title)}"
                            ${isActive ? 'aria-current="page"' : ''}
                        >
                            <span class="wkf-preview-nav__demo-title">
                                ${escapeHtml(demo.title)}
                            </span>
                        </a>
                    `;
                }
            ).join('');

            return `
                <details
                    class="wkf-preview-nav__component"
                    ${componentIndex === 0 ? 'open' : ''}
                >
                    <summary>

                        <span class="wkf-preview-nav__component-name">
                            ${escapeHtml(component.name)}
                        </span>

                  
                        <svg
                            class="wkf-preview-nav__chevron"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="m6 9 6 6 6-6"/>
                        </svg>

                    </summary>

                    <nav class="wkf-preview-nav__demos">
                        ${demos}
                    </nav>

                </details>
            `;
        }
    ).join('');


    // ----------------------------------------
    // Empty state
    // ----------------------------------------

    const emptyState = `
        <div class="wkf-preview-empty">

            <span class="wkf-preview-empty__icon">
                ${getComponentIcon()}
            </span>

            <h2>No Components Available</h2>

            <p>
                Add at least one Demo heading under the Examples
                section of your component examples.md file.
            </p>

        </div>
    `;



    // ----------------------------------------
    // PJAX Client Script
    // ----------------------------------------


    const clientScript = `
    (() => {

        const navigation = document.querySelector('.wkf-preview-nav');
        const content = document.querySelector('[data-preview-content]');
        const currentTitle = document.querySelector('[data-current-demo]');
        const openDemo = document.querySelector('[data-open-demo]');

        const links = Array.from(
            document.querySelectorAll('[data-demo-link]')
        );

        const initialDemoUrl = ${JSON.stringify(initialHref)};

        let currentCleanup = null;
        let activeRequest = null;
        let requestSequence = 0;

                
        let tocObserver = null;

        const toc = document.querySelector('[data-page-toc]');
        const tocLinks = document.querySelector('[data-page-toc-links]');

        const tocSections = [
            { id: 'overview', title: 'Overview' },
            { id: 'examples', title: 'Examples' },
            { id: 'api-reference', title: 'API Reference' },
            { id: 'dependencies', title: 'Dependencies' },
        ];


        // ----------------------------------------
        // Table of Contents
        // ----------------------------------------

        function initializePageToc() {

            if (!toc || !tocLinks || !content) return;

            // Disconnect the previous Demo observer.
            tocObserver?.disconnect();
            tocObserver = null;

            tocLinks.replaceChildren();

            const sections = tocSections
                .map((item) => ({
                    ...item,
                    element: content.querySelector('#' + item.id),
                }))
                .filter((item) => item.element);

            // Hide the TOC if this Demo has no sections.
            toc.hidden = sections.length === 0;

            if (!sections.length) return;

            const fragment = document.createDocumentFragment();

            sections.forEach((section) => {

                const link = document.createElement('a');

                link.className = 'wkf-preview-toc__link';
                link.href = '#' + section.id;
                link.textContent = section.title;

                link.dataset.tocTarget = section.id;

                fragment.appendChild(link);
            });

            tocLinks.className = 'wkf-preview-toc__links';
            tocLinks.appendChild(fragment);

            // Observe section visibility during window scrolling.
            tocObserver = new IntersectionObserver(
                (entries) => {

                    const visibleSections = entries
                        .filter((entry) => entry.isIntersecting)
                        .sort((a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top
                        );

                    if (!visibleSections.length) return;

                    const activeId = visibleSections[0].target.id;

                    updateActiveTocLink(activeId);
                },
                {
                    root: null,
                    rootMargin: '-15% 0px -70% 0px',
                    threshold: 0,
                }
            );

            sections.forEach((section) => {
                tocObserver.observe(section.element);
            });

            // The first section is active initially.
            updateActiveTocLink(sections[0].id);
        }


        // ----------------------------------------
        // Update Active TOC Link
        // ----------------------------------------

        function updateActiveTocLink(activeId) {

            if (!tocLinks) return;

            tocLinks
                .querySelectorAll('[data-toc-target]')
                .forEach((link) => {

                    const isActive =
                        link.dataset.tocTarget === activeId;

                    link.classList.toggle('is-active', isActive);

                    if (isActive) {
                        link.setAttribute('aria-current', 'location');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
        }


        // ----------------------------------------
        // TOC Navigation
        // ----------------------------------------

        tocLinks?.addEventListener('click', (event) => {

            if (!(event.target instanceof Element)) return;

            const link = event.target.closest('[data-toc-target]');

            if (!link || !tocLinks.contains(link)) return;

            const target = content?.querySelector(
                '#' + link.dataset.tocTarget
            );

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });

            updateActiveTocLink(link.dataset.tocTarget);

            // Update the URL hash without creating a history entry.
            history.replaceState(
                history.state,
                '',
                location.pathname +
                location.search +
                '#' +
                link.dataset.tocTarget
            );
        });
        

        // ----------------------------------------
        // Navigation state
        // ----------------------------------------

        function updateNavigation(activeLink) {

            links.forEach((item) => {
                item.classList.remove('is-active');
                item.removeAttribute('aria-current');
            });

            if (!activeLink) return;

            activeLink.classList.add('is-active');
            activeLink.setAttribute('aria-current', 'page');

            const component = activeLink.closest('details');

            if (component) {
                component.open = true;
            }

            activeLink.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            });

            if (currentTitle) {
                currentTitle.textContent =
                    activeLink.dataset.demoTitle || '';
            }

            if (openDemo) {
                openDemo.href = activeLink.href;
                openDemo.hidden = false;
            }
        }


        // ----------------------------------------
        // Load Demo HTML
        // ----------------------------------------

        async function fetchDemo(url, signal) {

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'text/html',
                    'X-Requested-With': 'PjaxRequest',
                },
                signal,
            });

            if (!response.ok) {
                throw new Error(
                    'Demo request failed: ' +
                    response.status +
                    ' ' +
                    response.statusText
                );
            }

            const html = await response.text();

            return new DOMParser().parseFromString(
                html,
                'text/html'
            );
        }


        // ----------------------------------------
        // Import Demo entry modules
        // ----------------------------------------
        async function loadDemoModules(parsedDocument, pageUrl) {

            const scripts = Array.from(
                parsedDocument.querySelectorAll(
                    'script[type="module"][src]'
                )
            );

            const moduleUrls = scripts
                .map((script) => script.getAttribute('src'))
                .filter(Boolean)
                .map((src) => new URL(src, pageUrl).href);

            // Remove duplicate module URLs.
            const uniqueUrls = [...new Set(moduleUrls)];

            // Exclude Vite's internal modules.
            const demoModuleUrls = uniqueUrls.filter((moduleUrl) => {

                const pathname = new URL(moduleUrl).pathname;

                return (
                    pathname !== '/@vite/client' &&
                    !moduleUrl.includes('virtual:auto-entry')
                );
            });

            // Documentation-only Demo:
            // No actual TSX entry module exists.
            if (demoModuleUrls.length === 0) {
                return null;
            }

            // Get mountComponents from the actual Demo entry.
            let mountComponents = null;

            for (const moduleUrl of demoModuleUrls) {

                const module = await import(
                    /* @vite-ignore */
                    moduleUrl
                );

                // Use the same Runtime instance as component registration.
                if (typeof module.mountComponents === 'function') {
                    mountComponents = module.mountComponents;
                }
            }

            if (!mountComponents) {
                throw new Error(
                    'mountComponents() was not exported by the Demo entry.'
                );
            }

            return mountComponents;
        }


        // ----------------------------------------
        // Load Demo styles
        // ----------------------------------------

        function updateDemoStyles(parsedDocument, pageUrl) {

            // Remove styles belonging to the previous Demo HTML.
            document.head
                .querySelectorAll('[data-wkf-demo-style]')
                .forEach((element) => element.remove());

            const styles = parsedDocument.head.querySelectorAll(
                'style, link[rel="stylesheet"]'
            );

            styles.forEach((source) => {

                const element = source.cloneNode(true);

                element.setAttribute(
                    'data-wkf-demo-style',
                    ''
                );

                if (element instanceof HTMLLinkElement) {

                    const href = element.getAttribute('href');

                    if (href) {
                        element.href = new URL(
                            href,
                            pageUrl
                        ).href;
                    }
                }

                document.head.appendChild(element);
            });
        }


        // ----------------------------------------
        // Execute Demo inline scripts
        // ----------------------------------------

        function executeDemoScripts(parsedDocument) {

            const scripts = Array.from(
                parsedDocument.body.querySelectorAll(
                    'script:not([src])'
                )
            );

            for (const source of scripts) {

                const type = (
                    source.getAttribute('type') || ''
                ).trim().toLowerCase();

                // Only execute ordinary inline JavaScript.
                // External modules are handled by loadDemoModules().
                if (
                    type &&
                    type !== 'text/javascript' &&
                    type !== 'application/javascript'
                ) {
                    continue;
                }

                const script = document.createElement('script');

                script.textContent = source.textContent || '';

                document.body.appendChild(script);

                script.remove();
            }
        }


        // ----------------------------------------
        // Cleanup previous Demo
        // ----------------------------------------

        function cleanupPreviousDemo() {

            if (typeof currentCleanup === 'function') {

                try {
                    currentCleanup();
                } catch (error) {
                    console.error(
                        '[WKF][PLAYGROUND] Demo cleanup failed:',
                        error
                    );
                }

                currentCleanup = null;
            }
        }


        // ----------------------------------------
        // Main PJAX navigation
        // ----------------------------------------

        async function loadDemo(
            url,
            {
                pushHistory = true,
                activeLink = null,
            } = {}
        ) {

            if (!content) return;

            const requestId = ++requestSequence;

            // Cancel the previous fetch request.
            activeRequest?.abort();

            const controller = new AbortController();

            activeRequest = controller;

            const pageUrl = new URL(
                url,
                window.location.href
            );

            content.setAttribute('aria-busy', 'true');

            try {

                // 1. Fetch original HTML.
                const parsedDocument = await fetchDemo(
                    pageUrl.href,
                    controller.signal
                );

                // 2. Extract original Demo root.
                const demoRoot = parsedDocument.body.querySelector(
                    '.wkf-playground'
                );

                if (!demoRoot) {
                    throw new Error(
                        'Demo HTML does not contain .wkf-playground.'
                    );
                }

                // 3. Import Demo entry and get its Runtime function.
                const mountComponents = await loadDemoModules(
                    parsedDocument,
                    pageUrl
                );

                // 4. Cleanup the previous Demo.
                cleanupPreviousDemo();

                // 5. Replace Demo-specific styles.
                updateDemoStyles(
                    parsedDocument,
                    pageUrl
                );

                // 6. Replace right-side content.
                content.replaceChildren(
                    demoRoot.cloneNode(true)
                );

                // 6.1 Rebuild the right-side Table of Contents.
                initializePageToc();

                // 7. Execute the original Demo inline scripts.
                // This initializes Preview/Code tabs and Copy buttons.
                executeDemoScripts(
                    parsedDocument
                );

                // 8. Mount all registered components inside the new content.
                // This is the key step for PJAX component initialization.
                currentCleanup = typeof mountComponents === 'function'
                    ? mountComponents(content)
                    : null;

                // 9. Update document title.
                if (parsedDocument.title) {
                    document.title = parsedDocument.title;
                }

                // 10. Update navigation state.
                if (!activeLink) {

                    activeLink = links.find((link) => {
                        return new URL(link.href).pathname ===
                            pageUrl.pathname;
                    }) || null;
                }

                updateNavigation(activeLink);

                // 11. Update browser history.
                if (pushHistory) {

                    const historyUrl =
                        pageUrl.pathname +
                        pageUrl.search +
                        pageUrl.hash;

                    if (
                        window.location.pathname +
                        window.location.search +
                        window.location.hash !== historyUrl
                    ) {
                        window.history.pushState(
                            { wkfPlayground: true },
                            '',
                            historyUrl
                        );
                    }
                }

                // 12. Return to the top of the preview.
                window.scrollTo(0, 0);

            } catch (error) {

                if (
                    error instanceof Error &&
                    error.name === 'AbortError'
                ) {
                    return;
                }

                console.error(
                    '[WKF][PLAYGROUND] PJAX navigation failed:',
                    error
                );

                const errorBox = document.createElement('div');

                errorBox.className = 'wkf-preview-error';

                errorBox.textContent =
                    error instanceof Error
                        ? error.message
                        : String(error);

                content.replaceChildren(errorBox);

            } finally {

                if (requestId === requestSequence) {
                    content.removeAttribute('aria-busy');
                    activeRequest = null;
                }
            }
        }


        // ----------------------------------------
        // Handle Demo navigation clicks
        // ----------------------------------------

        navigation?.addEventListener('click', (event) => {

            if (!(event.target instanceof Element)) {
                return;
            }

            const link = event.target.closest(
                '[data-demo-link]'
            );

            if (!link || !navigation.contains(link)) {
                return;
            }

            // Keep native browser behavior for opening a new tab.
            if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            event.preventDefault();

            loadDemo(
                link.href,
                {
                    pushHistory: true,
                    activeLink: link,
                }
            );
        });


        // ----------------------------------------
        // Browser Back / Forward
        // ----------------------------------------

        window.addEventListener('popstate', () => {

            const currentLink = links.find((link) => {
                return new URL(link.href).pathname ===
                    window.location.pathname;
            });

            const targetLink = currentLink || links[0];

            if (!targetLink) return;

            loadDemo(
                targetLink.href,
                {
                    pushHistory: false,
                    activeLink: targetLink,
                }
            );
        });


        // ----------------------------------------
        // Initial Demo
        // ----------------------------------------

        if (initialDemoUrl) {
            loadDemo(
                initialDemoUrl,
                {
                    pushHistory: false,
                    activeLink: null,
                }
            );
        }

    })();
    `;



    // ----------------------------------------
    // Main HTML
    // ----------------------------------------

    const body = `
        <main class="wkf-component-preview">

            <!-- Left Sidebar -->
            <aside class="wkf-preview-sidebar">

                <header class="wkf-preview-sidebar__header">

                    <a
                        href="/playground/"
                        class="wkf-preview-brand"
                    >
                        ${getComponentIcon()}

                        <span>Component Preview</span>
                    </a>

                </header>


                <div class="wkf-preview-sidebar__section-label">

                    <span>COMPONENTS</span>

                    <span class="wkf-preview-sidebar__total">
                        ${availableComponents.length}
                    </span>

                </div>


                <nav
                    class="wkf-preview-nav"
                >

                    ${navigation || emptyState}

                </nav>


            </aside>


            <!-- Right Preview -->
            <section class="wkf-preview-main">

                <header class="wkf-preview-toolbar">

                    <div class="wkf-preview-toolbar__title">

                        <span class="wkf-preview-toolbar__status"></span>

                        <span data-current-demo>
                            ${escapeHtml(initialTitle)}
                        </span>

                    </div>


                    <a
                        class="wkf-preview-toolbar__external"
                        href="${escapeHtml(initialHref)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-open-demo
                        title="Open in new tab"
                        ${firstDemo ? '' : 'hidden'}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M14 3h7v7"/>
                            <path d="M10 14 21 3"/>
                            <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>
                        </svg>
                    </a>

                </header>


                <div
                    class="wkf-preview-content"
                    data-preview-content
                >
                    <div class="wkf-preview-loading">
                        Loading component preview...
                    </div>
                </div>

            </section>

            <!-- Right Table of Contents -->
            <aside
                class="wkf-preview-toc"
                data-page-toc
                aria-label="On this page"
            >
                <div class="wkf-preview-toc__inner">
       
                    <nav data-page-toc-links></nav>
                </div>
            </aside>            

        </main>

        <script type="module">
            ${clientScript}
        </script>
    `;


    // ----------------------------------------
    // Styles
    // ----------------------------------------

    const styles = `

     /* ----------------------------------------
    Global Layout
    ---------------------------------------- */

    /*
    When one axis is set to "hidden" and the other to "visible", the "visible" value may 
    resolve to "auto" in the computed value. Furthermore, both "hidden" and "auto" can 
    establish a new scrolling container.

    This affects the reference frame for "sticky" positioning.

    DO NOT USE:
    -----------
    html,
    body {
        overflow-x: hidden;
    }

    .wkf-playground-index-page {
        overflow-x: hidden;
        overflow-y: auto;
    }

    */
   
    html,
    body {
        width: 100%;
        min-height: 100%;
        margin: 0;
        
        overflow-x: clip;
        overflow-y: visible;
    }

    .wkf-playground-index-page {
        min-height: 100%;
        overflow-x: clip;
        overflow-y: visible;

        background: #ffffff;
        color: #1f2937;
    }

    .wkf-component-preview {
        display: grid;
        grid-template-columns: 270px minmax(0, 1fr) 180px;
        align-items: stretch;
        width: 100%;
        min-height: 100vh;
        overflow: visible;
        background: #ffffff;
        color: #1f2937;
        font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
    }

    /* ----------------------------------------
    Right Table of Contents
    ---------------------------------------- */

    .wkf-preview-toc {
        position: sticky;
        top: 64px;
        align-self: start;

        width: 180px;
        max-height: calc(100vh - 80px);

        padding: 24px 16px 24px 0;

        overflow-y: auto;
    }

    .wkf-preview-toc__inner {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }


    .wkf-preview-toc__links {
        display: grid;
        gap: 4px;
        padding-left: 10px;
        border-left: 1px solid #e5e7eb;
    }

    .wkf-preview-toc__link {
        display: block;
        padding: 6px 8px;

        border-left: 2px solid transparent;
        margin-left: -11px;

        color: #94a3b8;
        font-size: 11px;
        line-height: 1.5;
        text-decoration: none;

        transition:
            color 0.15s ease,
            border-color 0.15s ease;
    }

    .wkf-preview-toc__link:hover {
        color: #475569;
    }

    .wkf-preview-toc__link.is-active {
        border-left-color: #8b5cf6;
        color: #6d48d7;
        font-weight: 600;
    }

    .wkf-preview-toc__link:focus-visible {
        outline: 2px solid #8b5cf6;
        outline-offset: 3px;
    }


    /* ----------------------------------------
        Sidebar
    ---------------------------------------- */

    .wkf-preview-sidebar {
        position: sticky;
        top: 0;
        align-self: start;

        display: flex;
        flex-direction: column;

        width: 100%;
        height: 100vh;
        min-width: 0;
        min-height: 0;

        overflow: hidden;

        border-right: 1px solid #e5e7eb;
        background: #ffffff;
    }

    .wkf-preview-sidebar__header {
        flex: 0 0 auto;
        padding: 19px 16px 14px;
        border-bottom: 1px solid #e5e7eb;
    }

    .wkf-preview-brand {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #1f2937;
        font-size: 15px;
        font-weight: 650;
        text-decoration: none;
    }

    .wkf-preview-brand svg {
        width: 23px;
        height: 23px;
        color: #64748b;
    }

    .wkf-preview-sidebar__header p {
        margin: 7px 0 0 32px;
        color: #94a3b8;
        font-size: 11px;
        line-height: 1.5;
    }

    .wkf-preview-sidebar__section-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 0 0 auto;
        padding: 13px 17px 7px;
        color: #94a3b8;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 1px;
    }

    .wkf-preview-sidebar__total {
        display: grid;
        place-items: center;
        min-width: 19px;
        height: 19px;
        padding: 0 5px;
        border-radius: 5px;
        color: #64748b;
        background: #f1f5f9;
        font-size: 10px;
        letter-spacing: 0;
    }


    /* ----------------------------------------
        Navigation: Independent Vertical Scroll
    ---------------------------------------- */

    .wkf-preview-nav {
        flex: 1 1 0;
        height: 0;

        min-width: 0;
        min-height: 0;

        overflow-x: hidden;
        overflow-y: auto;

        padding: 2px 9px 12px;

        overscroll-behavior: contain;

        scrollbar-width: thin;
        scrollbar-color: #d1d5db transparent;
    }

    .wkf-preview-nav::-webkit-scrollbar {
        width: 5px;
    }

    .wkf-preview-nav::-webkit-scrollbar-track {
        background: transparent;
    }

    .wkf-preview-nav::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #d1d5db;
    }


    /* ----------------------------------------
        Level 1: Component
    ---------------------------------------- */

    .wkf-preview-nav__component {
        margin: 0;
        padding: 0;
    }

    .wkf-preview-nav__component summary {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 34px;
        padding: 4px 8px;
        border-radius: 6px;
        color: #475569;
        cursor: pointer;
        list-style: none;
        user-select: none;
        transition:
            color 0.15s ease,
            background 0.15s ease;
    }

    .wkf-preview-nav__component summary::-webkit-details-marker {
        display: none;
    }

    .wkf-preview-nav__component summary:hover {
        color: #1f2937;
        background: #f8fafc;
    }

    .wkf-preview-nav__component[open] summary {
        color: #1f2937;
        font-weight: 600;
    }

    .wkf-preview-nav__component-icon {
        display: grid;
        place-items: center;
        flex: 0 0 17px;
    }

    .wkf-preview-nav__component-icon svg {
        width: 16px;
        height: 16px;
        color: #94a3b8;
    }

    .wkf-preview-nav__component-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }



    .wkf-preview-nav__chevron {
        flex: 0 0 12px;
        width: 12px;
        height: 12px;
        color: #9ca3af;
        transition: transform 0.15s ease;
    }

    .wkf-preview-nav__component[open] .wkf-preview-nav__chevron {
        transform: rotate(180deg);
    }


    /* ----------------------------------------
        Level 2: Demo Links
    ---------------------------------------- */

    .wkf-preview-nav__demos {
        display: grid;
        gap: 1px;
        margin: 1px 0 4px 15px;
        padding: 1px 0 2px 10px;
        border-left: 1px solid #e5e7eb;
    }

    .wkf-preview-nav__demo {
        display: flex;
        align-items: center;
        min-height: 27px;
        padding: 4px 8px;
        border-radius: 5px;
        color: #64748b;
        font-size: 11px;
        line-height: 1.35;
        text-decoration: none;
        transition:
            color 0.15s ease,
            background 0.15s ease;
    }

    .wkf-preview-nav__demo:hover {
        color: #334155;
        background: #f8fafc;
    }

    .wkf-preview-nav__demo.is-active {
        color: #6d48d7;
        background: #f3f0ff;
        font-weight: 600;
    }

    .wkf-preview-nav__demo:focus-visible {
        outline: 2px solid #8b5cf6;
        outline-offset: -2px;
    }

    .wkf-preview-nav__demo-title {
        display: block;
        min-width: 0;
        overflow-wrap: anywhere;
    }


    /* ----------------------------------------
        Sidebar Footer
    ---------------------------------------- */

    .wkf-preview-sidebar__footer {
        flex: 0 0 auto;
        padding: 11px 16px;
        border-top: 1px solid #e5e7eb;
        color: #9ca3af;
        font-size: 10px;
    }


    /* ----------------------------------------
        Main Preview
    ---------------------------------------- */

    .wkf-preview-main {
        display: flex;
        flex-direction: column;

        min-width: 0;
        min-height: 100vh;

        height: auto;
        overflow: visible;

        background: #ffffff;
    }

    .wkf-preview-toolbar {
        position: sticky;
        top: 0;
        z-index: 20;

        display: flex;
        align-items: center;
        justify-content: space-between;

        flex: 0 0 43px;
        gap: 12px;

        padding: 0 17px;

        border-bottom: 1px solid #e5e7eb;
        background: #ffffff;
    }

    .wkf-preview-toolbar__title {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        overflow: hidden;
        color: #64748b;
        font-size: 11px;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .wkf-preview-toolbar__status {
        flex: 0 0 6px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #22c55e;
    }

    .wkf-preview-toolbar__external {
        display: grid;
        place-items: center;
        flex: 0 0 29px;
        width: 29px;
        height: 29px;
        border-radius: 6px;
        color: #64748b;
        text-decoration: none;
        transition:
            color 0.15s ease,
            background 0.15s ease;
    }

    .wkf-preview-toolbar__external[hidden] {
        display: none;
    }

    .wkf-preview-toolbar__external svg {
        width: 16px;
        height: 16px;
    }

    .wkf-preview-toolbar__external:hover {
        color: #6d48d7;
        background: #f3f0ff;
    }


    /* ----------------------------------------
    AJAX Content Container
    ---------------------------------------- */

    .wkf-preview-content {
        flex: 1 0 auto;

        min-width: 0;
        min-height: calc(100vh - 43px);

        overflow: visible;

        background: #ffffff;
    }

    .wkf-preview-content[aria-busy="true"] {
        cursor: progress;
    }

    .wkf-preview-loading {
        display: grid;
        place-items: center;
        min-height: 200px;
        color: #94a3b8;
        font-size: 13px;
    }

    .wkf-preview-error {
        margin: 32px;
        padding: 20px;
        border: 1px solid #fecaca;
        border-radius: 8px;
        color: #b91c1c;
        background: #fef2f2;
        font-size: 13px;
        line-height: 1.6;
        overflow-wrap: anywhere;
    }


    /* ----------------------------------------
        Empty State
    ---------------------------------------- */

    .wkf-preview-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 220px;
        padding: 28px;
        text-align: center;
    }

    .wkf-preview-empty__icon {
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        margin-bottom: 13px;
        border-radius: 11px;
        color: #94a3b8;
        background: #f1f5f9;
    }

    .wkf-preview-empty__icon svg {
        width: 23px;
        height: 23px;
    }

    .wkf-preview-empty h2 {
        margin: 0 0 7px;
        color: #334155;
        font-size: 15px;
    }

    .wkf-preview-empty p {
        max-width: 340px;
        margin: 0;
        color: #94a3b8;
        font-size: 12px;
        line-height: 1.6;
    }


    /* ----------------------------------------
        Responsive
    ---------------------------------------- */

    @media (max-width: 760px) {


        .wkf-component-preview {
            grid-template-columns: 225px minmax(0, 1fr);
        }

        .wkf-preview-toc {
            display: none;
        }

        .wkf-component-preview {
            grid-template-columns: 225px minmax(0, 1fr);
        }

        .wkf-preview-sidebar__header {
            padding-left: 13px;
            padding-right: 13px;
        }

        .wkf-preview-nav {
            padding-left: 6px;
            padding-right: 6px;
        }
    }


    @media (max-width: 560px) {

        .wkf-component-preview {
            grid-template-columns: 1fr;
            min-height: 100vh;
            overflow: visible;
        }

        .wkf-preview-sidebar {
            position: relative;
            top: auto;

            height: auto;
            max-height: 42vh;

            border-right: 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .wkf-preview-sidebar__header {
            padding: 9px 13px 6px;
        }

        .wkf-preview-brand {
            font-size: 13px;
        }

        .wkf-preview-sidebar__header p {
            display: none;
        }

        .wkf-preview-sidebar__section-label {
            padding: 7px 13px 4px;
        }

        .wkf-preview-sidebar__footer {
            display: none;
        }

        .wkf-preview-nav {
            flex: 0 1 auto;
            height: auto;
            max-height: 24vh;
            min-height: 0;

            padding: 0 7px 6px;

            overflow-y: auto;
        }

        .wkf-preview-main {
            height: auto;
            min-height: 0;
            overflow: visible;
        }

        .wkf-preview-toolbar {
            position: sticky;
            top: 0;
            z-index: 20;

            flex-basis: 39px;
            padding: 0 11px;
        }

        .wkf-preview-content {
            min-height: calc(100vh - 42vh - 39px);
            overflow: visible;
        }
    }

    `;


    // ----------------------------------------
    // Render Document
    // ----------------------------------------

    return renderDocument(
        {
            seo: {
                lang: site.config.lang,
                title: 'Component Preview',
                description: 'Browse and preview WebKineForge components and interactive examples.',
            },

            bodyClass: 'wkf-playground-index-page',
            body,
            extraHead: `<style>${styles}</style>`,
            isIndex: false,
            viteClient,
        },
        site,
    );
}
