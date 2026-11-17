import { gsap } from 'gsap';
import { viewFromPath, type ViewKey } from './_scripts/data';
import { createRouter } from './_scripts/router';
import { FACTORIES, type Ctx } from './_scripts/view-controllers';
import type { Stage } from './_scripts/scene';

const FONT_URL =
    'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700' +
    '&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&display=swap';

let booted = false;

function loadFonts() {
    if (document.querySelector('link[data-wkf-fonts]')) return;
    const pre = (href: string, cross: boolean) => {
        const l = document.createElement('link');
        l.rel = 'preconnect';
        l.href = href;
        if (cross) l.crossOrigin = '';
        document.head.appendChild(l);
    };
    pre('https://fonts.googleapis.com', false);
    pre('https://fonts.gstatic.com', true);
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = FONT_URL;
    css.dataset.wkfFonts = '';
    document.head.appendChild(css);
}

const sleep = (ms: number) => new Promise<void>((res) => window.setTimeout(res, ms));

/**
 * Mounted once per full page load. Everything after that happens
 * inside this one shell, so it must survive page changes.
 */
export function mount(element: HTMLElement | null): (() => void) | void {
    // The system may also hand us inner elements; only the shell root counts.
    if (!element || !element.classList.contains('wkf-app') || booted) return;
    booted = true;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const host = element.querySelector<HTMLElement>('.wkf-main')!;
    const stageHost = element.querySelector<HTMLElement>('.wkf-stage')!;
    const viewEl = host.querySelector<HTMLElement>('.wkf-view[data-view]')!;
    const nav = element.querySelector<HTMLElement>('.wkf-nav')!;
    const mark = element.querySelector<HTMLElement>('.wkf-nav__mark')!;

    let currentKey: ViewKey = (viewEl.dataset.view as ViewKey) || viewFromPath(location.pathname) || 'home';

    loadFonts();

    // ---- stage (lazy: three.js is a separate chunk) ------------------------
    let stage: Stage | null = null;
    const stagePromise: Promise<Stage | null> = import('./_scripts/scene')
        .then((m) => m.createStage(stageHost, reduce))
        .then((s) => {
            stage = s;
            if (!s) element.classList.add('wkf-nowebgl');
            else s.setView(currentKey);
            return s;
        })
        .catch(() => {
            element.classList.add('wkf-nowebgl');
            return null;
        });

    const ctx: Ctx = {
        reduce,
        stage: () => stage,
        whenStage: () => Promise.race([stagePromise, sleep(2400).then(() => null)]),
    };

    // ---- nav marker ---------------------------------------------------------
    const placeMark = (animate: boolean) => {
        const link = nav.querySelector<HTMLElement>(`.wkf-nav__link[data-key="${currentKey}"]`);
        if (!link) return;
        const vars = { x: link.offsetLeft, width: link.offsetWidth, opacity: 1 };
        if (animate && !reduce) gsap.to(mark, { ...vars, duration: 0.8, ease: 'expo.out' });
        else gsap.set(mark, vars);
    };
    const onResize = () => placeMark(false);
    window.addEventListener('resize', onResize);

    // ---- first view ------------------------------------------------------------
    const ctl = FACTORIES[currentKey](viewEl, ctx);
    const router = createRouter({
        app: element,
        host,
        ctx,
        factories: FACTORIES,
        initial: { key: currentKey, el: viewEl, ctl },
        onChange: (key) => {
            currentKey = key;
            placeMark(true);
            stage?.setView(key);
            if (!stage) void stagePromise;
        },
    });
    router.start();

    placeMark(false);
    // Fonts change link widths; re-measure once they are in.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    const ready = fonts ? Promise.race([fonts.ready, sleep(1500)]) : sleep(0);

    ready.then(() => {
        placeMark(false);
        // The controller sets its own start state synchronously, so the
        // page is never shown half-built.
        void ctl.enter();
        element.removeAttribute('data-boot');
    });

    return () => {
        window.removeEventListener('resize', onResize);
        router.destroy();
        stage?.destroy();
        booted = false;
    };
}
