import { gsap } from 'gsap';
import type { Stage } from './scene';
import type { ViewKey } from './data';

/**
 * One controller per page. The router creates it when the page's markup is
 * in the DOM, calls `enter()` to play the entrance, and `leave()` before the
 * markup is replaced. Everything a controller starts, it must stop in `destroy()`.
 */

export interface Ctx {
    reduce: boolean;
    /** The stage if it has finished loading, otherwise null. */
    stage(): Stage | null;
    /** Waits (briefly) for the stage, so the entrance isn't held hostage by a slow download. */
    whenStage(): Promise<Stage | null>;
}

export interface ViewCtl {
    enter(): Promise<void>;
    leave(): Promise<void>;
    destroy(): void;
}

export type ViewFactory = (root: HTMLElement, ctx: Ctx) => ViewCtl;

const wait = (seconds: number) => new Promise<void>((res) => gsap.delayedCall(seconds, () => res()));

/** Resolve when a tween finishes (or immediately if it has nothing to do). */
const finish = (tween: gsap.core.Tween | gsap.core.Timeline) =>
    new Promise<void>((res) => {
        if (tween.duration() === 0) return res();
        tween.eventCallback('onComplete', () => res());
    });

const show = (el: HTMLElement) => {
    el.style.visibility = 'visible';
};

/** Wrap each character of an element in a span so it can be animated. */
function splitChars(el: HTMLElement): HTMLElement[] {
    const text = el.textContent || '';
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const out: HTMLElement[] = [];
    for (const ch of text) {
        const span = document.createElement('span');
        span.className = 'wkf-ch';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = ch === ' ' ? '\u00a0' : ch;
        el.appendChild(span);
        out.push(span);
    }
    return out;
}

/** Wrap each word in a mask + inner span (for a rise-from-below reveal). */
function splitWords(el: HTMLElement): HTMLElement[] {
    const text = (el.textContent || '').trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const inner: HTMLElement[] = [];
    text.split(/\s+/).forEach((word, i, all) => {
        const mask = document.createElement('span');
        mask.className = 'wkf-word';
        mask.setAttribute('aria-hidden', 'true');
        const span = document.createElement('span');
        span.className = 'wkf-word__in';
        span.textContent = word;
        mask.appendChild(span);
        el.appendChild(mask);
        if (i < all.length - 1) el.appendChild(document.createTextNode(' '));
        inner.push(span);
    });
    return inner;
}

/* -------------------------------------------------------------------------- */
/* Home                                                                       */
/* -------------------------------------------------------------------------- */

export const createHome: ViewFactory = (root, ctx) => {
    const title = root.querySelector<HTMLElement>('.wkf-hero__title')!;
    const sub = root.querySelector<HTMLElement>('.wkf-hero__sub')!;
    const chars = splitChars(title);
    let tl: gsap.core.Timeline | null = null;

    return {
        async enter() {
            gsap.set(chars, { autoAlpha: 0, y: 64, rotateX: -75, transformOrigin: '50% 100%' });
            gsap.set(sub, { autoAlpha: 0, y: 18 });
            show(root);

            const stage = await ctx.whenStage();
            stage?.showShards();

            const r = ctx.reduce;
            tl = gsap.timeline();
            tl.to(
                chars,
                {
                    autoAlpha: 1,
                    y: 0,
                    rotateX: 0,
                    duration: r ? 0.3 : 1.5,
                    ease: 'expo.out',
                    stagger: r ? 0 : 0.05,
                },
                r ? 0 : 0.9
            ).to(sub, { autoAlpha: 1, y: 0, duration: r ? 0.3 : 1.2, ease: 'power3.out' }, r ? 0 : 1.9);
            await wait(r ? 0.2 : 1.0);
        },

        async leave() {
            tl?.kill();
            gsap.killTweensOf([chars, sub]);
            const stage = ctx.stage();
            const r = ctx.reduce;
            const text = gsap
                .timeline()
                .to(chars, {
                    autoAlpha: 0,
                    y: -46,
                    rotateX: 40,
                    duration: r ? 0.2 : 0.55,
                    ease: 'power3.in',
                    stagger: r ? 0 : 0.02,
                })
                .to(sub, { autoAlpha: 0, y: -10, duration: r ? 0.15 : 0.35, ease: 'power2.in' }, 0);
            await Promise.all([stage ? stage.hideShards() : Promise.resolve(), finish(text)]);
        },

        destroy() {
            tl?.kill();
            gsap.killTweensOf([chars, sub]);
        },
    };
};

/* -------------------------------------------------------------------------- */
/* Works: an endless, eased gallery                                           */
/* -------------------------------------------------------------------------- */

export const createWorks: ViewFactory = (root, ctx) => {
    const wrap = root.querySelector<HTMLElement>('.wkf-works')!;
    const track = root.querySelector<HTMLElement>('.wkf-works__track')!;
    const originals = Array.from(track.querySelectorAll<HTMLElement>('.wkf-work'));
    const reduce = ctx.reduce;

    let items: HTMLElement[] = originals.slice();
    let lefts: number[] = [];
    let total = 1;
    let pad = 0;
    let vw = 1;

    let pos = 0;
    let target = 0;
    let lastPos = 0;
    let dragging = false;
    let dragLastX = 0;
    let dragV = 0;
    let hovering = false;
    let paused = true;
    let destroyed = false;
    let hot: HTMLElement | null = null;

    const tilts = new WeakMap<HTMLElement, { rx: (v: number) => void; ry: (v: number) => void }>();

    const measure = () => {
        items.forEach((el) => {
            if (el.dataset.clone) el.remove();
        });
        items = originals.slice();
        vw = wrap.clientWidth || window.innerWidth;
        const gap = parseFloat(getComputedStyle(wrap).getPropertyValue('--wkf-work-gap')) || 28;

        const widths = () => items.map((el) => el.offsetWidth);
        let w = widths();
        let maxW = Math.max(...w, 1);
        let sum = w.reduce((a, b) => a + b, 0) + gap * items.length;
        // clone until the loop is comfortably wider than the screen
        let guard = 0;
        while (sum < vw + maxW * 2 + gap * 2 && guard++ < 6) {
            originals.forEach((el) => {
                const c = el.cloneNode(true) as HTMLElement;
                c.dataset.clone = '1';
                c.setAttribute('aria-hidden', 'true');
                track.appendChild(c);
                items.push(c);
            });
            w = widths();
            maxW = Math.max(...w, 1);
            sum = w.reduce((a, b) => a + b, 0) + gap * items.length;
        }
        total = sum;
        pad = maxW + gap;
        lefts = [];
        let x = 0;
        w.forEach((width) => {
            lefts.push(x);
            x += width + gap;
        });
    };

    const wrapX = (v: number) => ((((v + pad) % total) + total) % total) - pad;

    const layout = () => {
        for (let i = 0; i < items.length; i++) {
            items[i].style.transform = `translate3d(${wrapX(lefts[i] - pos).toFixed(2)}px,0,0)`;
        }
    };

    const tick = () => {
        if (destroyed) return;
        const k = gsap.ticker.deltaRatio();
        if (!paused && !dragging && !reduce) target += (hovering ? 0.18 : 0.55) * k;
        pos += (target - pos) * Math.min(1, 0.085 * k);
        const v = pos - lastPos;
        lastPos = pos;
        layout();
        gsap.set(track, { skewX: gsap.utils.clamp(-7, 7, -v * 0.07) });
    };

    // ---- input -------------------------------------------------------------
    const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const unit = e.deltaMode === 1 ? 16 : 1;
        const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        target += d * unit * 1.1;
    };
    const onDown = (e: PointerEvent) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true;
        dragLastX = e.clientX;
        dragV = 0;
        wrap.classList.add('is-drag');
        wrap.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
        if (dragging) {
            const dx = e.clientX - dragLastX;
            dragLastX = e.clientX;
            dragV = dragV * 0.6 + dx * 0.4;
            target -= dx;
            return;
        }
        // 3D tilt on the card under the pointer
        const card = (e.target as Element).closest<HTMLElement>('.wkf-work');
        if (card !== hot) {
            if (hot) resetTilt(hot);
            hot = card;
        }
        if (!card || e.pointerType === 'touch') return;
        const face = card.querySelector<HTMLElement>('.wkf-work__face')!;
        const rect = face.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const t = getTilt(card);
        t.ry((px - 0.5) * 22);
        t.rx(-(py - 0.5) * 22);
        face.style.setProperty('--wkf-mx', `${(px * 100).toFixed(1)}%`);
        face.style.setProperty('--wkf-my', `${(py * 100).toFixed(1)}%`);
    };
    const onUp = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        wrap.classList.remove('is-drag');
        wrap.releasePointerCapture?.(e.pointerId);
        target -= dragV * 16; // let it coast
    };
    const onEnter = () => {
        hovering = true;
    };
    const onLeave = () => {
        hovering = false;
        if (hot) resetTilt(hot);
        hot = null;
    };
    const onKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') target += vw * 0.35;
        else if (e.key === 'ArrowLeft') target -= vw * 0.35;
    };

    const getTilt = (card: HTMLElement) => {
        let t = tilts.get(card);
        if (!t) {
            const tilt = card.querySelector<HTMLElement>('.wkf-work__tilt')!;
            gsap.set(tilt, { transformPerspective: 900 });
            t = {
                rx: gsap.quickTo(tilt, 'rotationX', { duration: 0.6, ease: 'power3.out' }),
                ry: gsap.quickTo(tilt, 'rotationY', { duration: 0.6, ease: 'power3.out' }),
            };
            tilts.set(card, t);
        }
        return t;
    };
    const resetTilt = (card: HTMLElement) => {
        const t = tilts.get(card);
        t?.rx(0);
        t?.ry(0);
    };

    wrap.addEventListener('wheel', onWheel, { passive: false });
    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerup', onUp);
    wrap.addEventListener('pointercancel', onUp);
    wrap.addEventListener('pointerenter', onEnter);
    wrap.addEventListener('pointerleave', onLeave);
    window.addEventListener('keydown', onKey);

    const ro = new ResizeObserver(() => {
        if (destroyed) return;
        measure();
        layout();
    });

    const risesOf = (list: HTMLElement[]) =>
        list.map((el) => el.querySelector<HTMLElement>('.wkf-work__rise')!).filter(Boolean);

    const onScreen = () =>
        items
            .map((el, i) => ({ el, x: wrapX(lefts[i] - pos), w: el.offsetWidth }))
            .filter((o) => o.x + o.w > 0 && o.x < vw)
            .sort((a, b) => a.x - b.x)
            .map((o) => o.el);

    return {
        async enter() {
            measure();
            pos = target = lastPos = -Math.round(vw * 0.07);
            layout();

            const below = window.innerHeight * 1.15;
            const all = risesOf(items);
            gsap.set(all, { y: below });
            const visible = risesOf(onScreen());
            gsap.set(
                all.filter((el) => !visible.includes(el)),
                { y: 0 }
            );
            show(root);
            ro.observe(wrap);
            gsap.ticker.add(tick);

            const tween = gsap.to(visible, {
                y: 0,
                duration: reduce ? 0.3 : 1.7,
                ease: 'expo.out',
                stagger: reduce ? 0 : 0.11,
                delay: reduce ? 0 : 0.15,
            });
            await wait(reduce ? 0.2 : 0.9);
            paused = false;
            void tween;
        },

        async leave() {
            paused = true;
            const visible = risesOf(onScreen());
            gsap.killTweensOf(visible);
            const tween = gsap.to(visible, {
                y: window.innerHeight * 1.15,
                duration: reduce ? 0.2 : 0.75,
                ease: 'power3.in',
                stagger: reduce ? 0 : { each: 0.05, from: 'end' },
            });
            await finish(tween);
        },

        destroy() {
            destroyed = true;
            gsap.ticker.remove(tick);
            ro.disconnect();
            wrap.removeEventListener('wheel', onWheel);
            wrap.removeEventListener('pointerdown', onDown);
            wrap.removeEventListener('pointermove', onMove);
            wrap.removeEventListener('pointerup', onUp);
            wrap.removeEventListener('pointercancel', onUp);
            wrap.removeEventListener('pointerenter', onEnter);
            wrap.removeEventListener('pointerleave', onLeave);
            window.removeEventListener('keydown', onKey);
            gsap.killTweensOf(track);
            gsap.killTweensOf(items);
        },
    };
};

/* -------------------------------------------------------------------------- */
/* About: text that resolves out of noise                                     */
/* -------------------------------------------------------------------------- */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>[]{}/\\|+*#%&=$@';

export const createAbout: ViewFactory = (root, ctx) => {
    const lines = Array.from(root.querySelectorAll<HTMLElement>('[data-line]'));
    const cursor = root.querySelector<HTMLElement>('.wkf-about__cursor');
    const texts = lines.map((l) => l.textContent || '');
    const tweens: gsap.core.Tween[] = [];

    const lives = lines.map((line, i) => {
        // keep the real text for readers (transparent), draw the decoding text on top
        const ghost = document.createElement('span');
        ghost.className = 'wkf-about__ghost';
        ghost.textContent = texts[i];
        const live = document.createElement('span');
        live.className = 'wkf-about__live';
        live.setAttribute('aria-hidden', 'true');
        const ok = document.createElement('span');
        const noise = document.createElement('span');
        noise.className = 'wkf-about__noise';
        live.append(ok, noise);
        line.textContent = '';
        line.append(ghost, live);
        return { ok, noise };
    });

    const decode = (i: number, duration: number, delay: number) => {
        const text = texts[i];
        const { ok, noise } = lives[i];
        const state = { p: 0 };
        const tw = gsap.to(state, {
            p: 1,
            duration,
            delay,
            ease: 'none',
            onUpdate: () => {
                const n = text.length;
                const k = Math.floor(state.p * n);
                let junk = '';
                const tail = Math.min(n - k, 8);
                for (let c = 0; c < tail; c++) {
                    junk += text[k + c] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
                }
                ok.textContent = text.slice(0, k);
                noise.textContent = junk;
            },
            onComplete: () => {
                ok.textContent = text;
                noise.textContent = '';
            },
        });
        tweens.push(tw);
        return tw;
    };

    return {
        async enter() {
            gsap.set(lines, { autoAlpha: 1, x: 0, skewX: 0 });
            lives.forEach(({ ok, noise }) => {
                ok.textContent = '';
                noise.textContent = '';
            });
            if (cursor) gsap.set(cursor, { autoAlpha: 0 });
            show(root);

            if (ctx.reduce) {
                lives.forEach(({ ok }, i) => (ok.textContent = texts[i]));
                if (cursor) gsap.set(cursor, { autoAlpha: 1 });
                return;
            }

            let at = 0.35;
            texts.forEach((t, i) => {
                const dur = Math.max(0.55, t.length * 0.012);
                decode(i, dur, at);
                at += dur * 0.72;
            });
            if (cursor) tweens.push(gsap.to(cursor, { autoAlpha: 1, duration: 0.2, delay: at }));
            await wait(0.9);
        },

        async leave() {
            tweens.forEach((t) => t.kill());
            tweens.length = 0;
            lives.forEach(({ ok }, i) => {
                ok.textContent = texts[i];
                lives[i].noise.textContent = '';
            });
            const r = ctx.reduce;
            const tween = gsap.to([...lines, ...(cursor ? [cursor] : [])], {
                autoAlpha: 0,
                x: () => (r ? 0 : gsap.utils.random(-26, 26)),
                skewX: () => (r ? 0 : gsap.utils.random(-18, 18)),
                duration: r ? 0.15 : 0.38,
                ease: 'power2.in',
                stagger: r ? 0 : 0.05,
            });
            await finish(tween);
        },

        destroy() {
            tweens.forEach((t) => t.kill());
            gsap.killTweensOf(lines);
        },
    };
};

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export const createContact: ViewFactory = (root, ctx) => {
    const title = root.querySelector<HTMLElement>('.wkf-contact__title')!;
    const words = splitWords(title);
    const items = Array.from(root.querySelectorAll<HTMLElement>('.wkf-contact__item'));
    const seal = root.querySelector<HTMLElement>('.wkf-seal');
    const rules = items.map((li) => {
        const rule = document.createElement('span');
        rule.className = 'wkf-contact__rule';
        li.appendChild(rule);
        return rule;
    });
    let tl: gsap.core.Timeline | null = null;

    return {
        async enter() {
            const r = ctx.reduce;
            gsap.set(words, { yPercent: 115 });
            gsap.set(items, { autoAlpha: 0, y: 26 });
            gsap.set(rules, { scaleX: 0, transformOrigin: '0% 50%' });
            if (seal) gsap.set(seal, { autoAlpha: 0, scale: 0.8, rotate: -40 });
            show(root);

            tl = gsap.timeline({ delay: r ? 0 : 0.1 });
            tl.to(words, { yPercent: 0, duration: r ? 0.3 : 1.25, ease: 'expo.out', stagger: r ? 0 : 0.09 }, 0)
                .to(
                    items,
                    { autoAlpha: 1, y: 0, duration: r ? 0.3 : 0.95, ease: 'power3.out', stagger: r ? 0 : 0.09 },
                    r ? 0 : 0.55
                )
                .to(rules, { scaleX: 1, duration: r ? 0.3 : 1.1, ease: 'expo.out', stagger: r ? 0 : 0.09 }, r ? 0 : 0.6);
            if (seal) tl.to(seal, { autoAlpha: 1, scale: 1, rotate: 0, duration: r ? 0.3 : 1.4, ease: 'expo.out' }, r ? 0 : 0.7);
            await wait(r ? 0.2 : 0.9);
        },

        async leave() {
            tl?.kill();
            gsap.killTweensOf([words, items, rules, seal]);
            const r = ctx.reduce;
            const out = gsap
                .timeline()
                .to(items, { autoAlpha: 0, y: -18, duration: r ? 0.15 : 0.4, ease: 'power2.in', stagger: r ? 0 : 0.04 }, 0)
                .to(words, { yPercent: -115, duration: r ? 0.15 : 0.5, ease: 'power3.in', stagger: r ? 0 : 0.03 }, 0);
            if (seal) out.to(seal, { autoAlpha: 0, scale: 0.85, duration: r ? 0.15 : 0.4, ease: 'power2.in' }, 0);
            await finish(out);
        },

        destroy() {
            tl?.kill();
            gsap.killTweensOf([words, items, rules, seal]);
        },
    };
};

export const FACTORIES: Record<ViewKey, ViewFactory> = {
    home: createHome,
    works: createWorks,
    about: createAbout,
    contact: createContact,
};
