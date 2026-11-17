/**
 * Component registry: registers TSX templates and their controllers
 */

/**
 * Examples:


-----------------------------------------
### How it works 
-----------------------------------------
1. Writing a controller and template

export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;
    
    const observer = new ResizeObserver(onResize);
    observer.observe(element);

    return () => observer.disconnect();   // undo everything created above
}

export function Template(props: Record<string, any>) {
    return (
        <section
            className="hero section"
            {...props}
        >
            ...
        </section>
    );
}


2. Each component's index.ts registers its controller:

import { mount } from './controller';
import { Template } from './template';
const currentComponent = registerComponent(
    manifest.name,
    Template,
    mount
);

3. mountComponents() finds those elements and calls the controllers.
   Each controller may return a cleanup function; mountComponents() returns
   one function that runs all of them.


-----------------------------------------
### Usage: static page (client entry) 
-----------------------------------------
import '@/components/my-name-here';            // registers the controller
import { mountComponents } from '@/runtime/bridge/register';

const cleanup = mountComponents();        // mount everything on the page
// cleanup();                             // optional: unmount everything
-----------------------------------------
### Usage: React 
-----------------------------------------
import MyComponent1 from '@/components/my-name-here';
import { mountComponents } from '@/runtime/bridge/register';

export function Demo() {
    useEffect(() => mountComponents(), []);   // cleanup runs on unmount
    return <MyComponent1 />;
}
// Next.js: add 'use client' at the top of the file.

-----------------------------------------
###  Usage: only part of the page 
-----------------------------------------
mountComponents(containerElement);        // `root` itself is checked too

-----------------------------------------
### Usage: content added later (conditional render, lazy load) 
-----------------------------------------
mountComponents();                        // safe to call again: elements
                                            // that are already mounted are skipped
-----------------------------------------
### Usage: unmount a single element 
-----------------------------------------
unmountElement(document.querySelector('[data-component="my-name-here"]')!);

 */
import { debugBrowser } from '../../utils/debug.ts';

/**
 * A function that undoes everything a controller set up when it mounted.
 */
export type Cleanup = () => void;

/**
 * A controller receives the root element of a component and wires up its
 * behavior (animations, observers, event listeners, ...).
 */
export type MountController = (element: HTMLElement) => void | Cleanup;

/**
 * Registered controllers, keyed by component slug.
 */
const controllers = new Map<string, MountController>();

/**
 * Mounted element -> its cleanup function.
 */
const mounted = new WeakMap<HTMLElement, Cleanup>();

const noop: Cleanup = () => {};

/**
 * Escape a value before using it in an HTML attribute.
 */
function escapeAttribute(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Register a component and automatically inject "data-component"
 * into its template root element.
 */
export function registerComponent<P extends object>(
    slug: string,
    template: (props: P) => any,
    controller: MountController
) {
    controllers.set(slug, controller);

    debugBrowser('[WKF][ONLY DEV] Component registered:', slug);

    return (props: P) =>
        template({
            ...props,
            'data-component': slug,
        });
}

/**
 * Unmount a single element by running its cleanup function.
 *
 * Idempotent: calling it again, or on an element that was never mounted,
 * does nothing.
 */
export function unmountElement(element: HTMLElement) {
    const cleanup = mounted.get(element);
    if (!cleanup) return;

    // Forget the element first, so it can be mounted again later.
    mounted.delete(element);

    try {
        cleanup();
    } catch (error) {
        console.error('[register] Cleanup failed', error, element);
    }
}

/**
 * Mount every registered component found inside root (defaults to document).
 *
 * - Idempotent: an element is never mounted twice.
 * - Isolated: if one controller throws, the others still mount.
 * - The returned function only cleans up elements mounted by this call.
 * - Cleanup runs in reverse mount order.
 */
export function mountComponents(root?: ParentNode): Cleanup {
    if (typeof document === 'undefined') return noop;

    const scope = root ?? document;
    const mountedNow: HTMLElement[] = [];


    // console.log('[WKF][RUNTIME][CHECK] Mount request:', {
    //     registeredControllers: [...controllers.keys()],
    //     rootElement: scope instanceof HTMLElement
    //         ? scope.tagName
    //         : 'document',
    //     componentElements: scope.querySelectorAll('[data-component]').length,
    // });

    controllers.forEach((controller, name) => {
        const selector = `[data-component="${CSS.escape(name)}"]`;
        const elements = Array.from(
            scope.querySelectorAll<HTMLElement>(selector)
        );


       debugBrowser(`[WKF][RUNTIME][CHECK] Matching "${name}":`, elements.length);

        // querySelectorAll only returns descendants, so also check root itself.
        if (
            scope instanceof HTMLElement &&
            scope.matches(selector)
        ) {
            elements.unshift(scope);
        }

        for (const element of elements) {
            // Skip elements that have already been mounted.
            if (mounted.has(element)) continue;

            try {

                // console.log(`[WKF][RUNTIME][CHECK] Executing controller: ${name}`);

                const cleanup = controller(element);

                // console.log(`[WKF][RUNTIME][CHECK] Controller executed: ${name}`);


                

                mounted.set(
                    element,
                    typeof cleanup === 'function' ? cleanup : noop
                );

                mountedNow.push(element);
            } catch (error) {
                console.error(
                    `[register] Failed to mount component "${name}"`,
                    error,
                    element
                );
            }
        }
    });

    return () => {
        mountedNow.reverse().forEach(unmountElement);
        mountedNow.length = 0;
    };
}

