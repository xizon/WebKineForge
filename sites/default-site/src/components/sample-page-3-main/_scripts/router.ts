import { viewFromPath, type ViewKey } from './data';
import type { Ctx, ViewCtl, ViewFactory } from './view-controllers';

/**
 * A tiny pjax-style router.
 *
 * Links stay ordinary relative links (./samplepage-3--works.html), so the site still works
 * without JavaScript, from a search engine, or when opened directly.
 * With JavaScript, a click:
 *   1. fetches the target page and plays the current view's exit,
 *   2. takes the `.wkf-view` out of the fetched document and swaps it in,
 *   3. updates the title and the address bar (history API), and plays the entrance.
 * If anything goes wrong (offline, file://, unexpected markup) it falls back
 * to a normal navigation.
 */

interface Current {
    key: ViewKey;
    el: HTMLElement;
    ctl: ViewCtl;
}

export interface RouterOptions {
    app: HTMLElement;
    host: HTMLElement;
    ctx: Ctx;
    factories: Record<ViewKey, ViewFactory>;
    initial: Current;
    onChange(key: ViewKey): void;
}

export function createRouter(o: RouterOptions) {
    const { app, host, ctx, factories } = o;
    let current = o.initial;
    let busy = false;
    let pending: { href: string; push: boolean } | null = null;
    const cache = new Map<string, Promise<string>>();

    const load = (href: string): Promise<string> => {
        let p = cache.get(href);
        if (!p) {
            p = fetch(href, { credentials: 'same-origin' }).then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.text();
            });
            p.catch(() => cache.delete(href));
            cache.set(href, p);
        }
        return p;
    };

    const setActive = (key: ViewKey) => {
        app.querySelectorAll<HTMLAnchorElement>('.wkf-nav__link').forEach((a) => {
            if (a.dataset.key === key) {
                a.setAttribute('aria-current', 'page');
                a.classList.add('is-active');
            } else {
                a.removeAttribute('aria-current');
                 a.classList.remove('is-active');
            }
        });
    };

    const syncHead = (doc: Document) => {
        if (doc.title) document.title = doc.title;
        const next = doc.querySelector<HTMLMetaElement>('meta[name="description"]');
        const here = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (next && here) here.content = next.content;
        document.body.className = doc.body.className;
    };

    async function go(href: string, push: boolean): Promise<void> {
        const url = new URL(href, location.href);
        const key = viewFromPath(url.pathname);
        if (!key) {
            location.href = url.href;
            return;
        }
        if (busy) {
            pending = { href: url.href, push };
            return;
        }
        if (key === current.key) return;

        busy = true;
        try {
            app.classList.add('is-changing');
            const [html] = await Promise.all([load(url.href), current.ctl.leave()]);
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const incoming = doc.querySelector<HTMLElement>('.wkf-view[data-view]');
            if (!incoming) throw new Error('No view found in the fetched page');

            current.ctl.destroy();
            const el = document.importNode(incoming, true) as HTMLElement;
            el.style.visibility = 'hidden';
            host.replaceChildren(el);
            host.scrollTop = 0;

            syncHead(doc);
            if (push) history.pushState({ key }, '', url.href);
            app.dataset.view = key;
            setActive(key);
            o.onChange(key);

            const ctl = factories[key](el, ctx);
            current = { key, el, ctl };
            app.classList.remove('is-changing');
            await ctl.enter();
        } catch (err) {
            // Anything unexpected: let the browser do a normal navigation.
            location.href = url.href;
            return;
        } finally {
            busy = false;
            app.classList.remove('is-changing');
        }
        if (pending) {
            const next = pending;
            pending = null;
            void go(next.href, next.push);
        }
    }

    const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-pjax]');
        if (!a) return;
        if (a.target && a.target !== '_self') return;
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin || !viewFromPath(url.pathname)) return;
        e.preventDefault();
        void go(url.href, true);
    };

    const onPrefetch = (e: Event) => {
        const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[data-pjax]');
        if (!a) return;
        const url = new URL(a.href, location.href);
        if (viewFromPath(url.pathname)) load(url.href).catch(() => undefined);
    };

    const onPop = () => {
        void go(location.href, false);
    };

    return {
        start() {
            if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
            history.replaceState({ key: current.key }, '', location.href);
            app.addEventListener('click', onClick);
            app.addEventListener('pointerover', onPrefetch);
            app.addEventListener('focusin', onPrefetch);
            window.addEventListener('popstate', onPop);
        },
        destroy() {
            app.removeEventListener('click', onClick);
            app.removeEventListener('pointerover', onPrefetch);
            app.removeEventListener('focusin', onPrefetch);
            window.removeEventListener('popstate', onPop);
            current.ctl.destroy();
        },
        go,
    };
}
