import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * This section uses a GSAP-owned pinned timeline. Do not also attach another
 * smooth-scroll/pinning engine to this same section.
 */
export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;

    const text = element.querySelector('.wkf-product__text');
    const object = element.querySelector('.wkf-product__object');
    const ringA = element.querySelector('.wkf-product__ring--a');
    const ringB = element.querySelector('.wkf-product__ring--b');

    const ctx = gsap.context(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start: 'top top',
                end: '+=2500',
                scrub: 1,
                pin: '.wkf-product__sticky',
                anticipatePin: 1
            }
        });

        timeline
            .fromTo(text, { y: 70, opacity: 0.25 }, { y: 0, opacity: 1, duration: 0.35 })
            .to(object, { rotation: 160, scale: 1.08, duration: 0.55 }, 0)
            .to(ringA, { rotation: 220, scale: 1.2, duration: 0.8 }, 0)
            .to(ringB, { rotation: -180, scale: 0.85, duration: 0.8 }, 0);
    }, element);

    return () => ctx.revert();
}
