import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Each SceneItem after the first covers the previous one.
 * The cover plays across at least half a viewport.
 * coverOffset moves the incoming panel; coveredOpacity fades the panel underneath.
 * The incoming panel stays at opacity 1. Only the covered part of the lower panel fades.
 * Transform is cleared once the cover finishes, so nested pin animations can take over.
 */
export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;

    const items = Array.from(
        element.querySelectorAll<HTMLElement>('[data-scene-item]')
    );

    if (items.length < 2) return;

    const panels = items.map((item) =>
        item.querySelector<HTMLElement>('.wkf-scene-item__panel')
    );

    if (panels.some((panel) => panel === null)) return;

    const clearMask = (panel: HTMLElement) => {
        panel.style.maskImage = '';
        panel.style.webkitMaskImage = '';
    };

    const apply = () => {
        const viewport = window.innerHeight || 1;

        items.forEach((item, index) => {
            const panel = panels[index];
            if (!panel) return;

            gsap.set(item, { zIndex: index + 1 });
            gsap.set(panel, { opacity: 1 });
            clearMask(panel);

            if (index === 0) return;

            const offset = resolveOffset(
                item.dataset.coverOffset ?? element.dataset.coverOffset
            );
            const coveredOpacity = resolveOpacity(
                item.dataset.coveredOpacity ?? element.dataset.coveredOpacity
            );
            const distance = Math.max(viewport * 0.5, offset);
            const travelled = viewport - item.getBoundingClientRect().top;
            const progress = gsap.utils.clamp(0, 1, travelled / distance);

            if (progress >= 1) {
                gsap.set(panel, { y: 0, opacity: 1, clearProps: 'transform' });
            } else {
                gsap.set(panel, { y: (1 - progress) * offset, opacity: 1 });
            }

            // opacity effect
            const previousPanel = panels[index - 1];
            if (!previousPanel) return;

            // Fade the previous scene as the next scene covers it.
            const fade = gsap.utils.interpolate(
                1,
                coveredOpacity,
                progress
            );

            gsap.set(previousPanel, {
                opacity: fade,
            }); 
        });
    };

    const ctx = gsap.context(() => {
        ScrollTrigger.create({
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: apply,
            onRefresh: apply,
        });

        apply();
    }, element);

    return () => {
        ctx.revert();
        panels.forEach((panel) => {
            if (!panel) return;
            clearMask(panel);
        });
    };
}

function resolveOffset(value: string | undefined) {
    const viewport = window.innerHeight || 1;
    const raw = (value ?? '50vh').trim();

    if (raw.endsWith('vh')) {
        return (Number.parseFloat(raw) / 100) * viewport;
    }

    if (raw.endsWith('%')) {
        return (Number.parseFloat(raw) / 100) * viewport;
    }

    const pixels = Number.parseFloat(raw);
    return Number.isFinite(pixels) ? pixels : viewport * 0.5;
}

function resolveOpacity(value: string | undefined) {
    const opacity = Number.parseFloat(value ?? '0.4');
    if (!Number.isFinite(opacity)) return 0.4;
    return Math.min(1, Math.max(0, opacity));
}
