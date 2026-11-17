export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;

    const plates = Array.from(
        element.querySelectorAll<HTMLElement>('[data-parallax]')
    );

    if (!plates.length) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let rafId = 0;

    const update = () => {
        rafId = 0;
        const rect = element.getBoundingClientRect();
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

        plates.forEach((plate) => {
            const depth = Number(plate.dataset.parallax ?? 0.3);
            const shift = Number(plate.dataset.shift ?? 0);
            const moveY = (progress - 0.5) * depth * -240;
            const moveX = (progress - 0.5) * shift * 90;
            plate.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    };

    const requestUpdate = () => {
        if (!rafId) rafId = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(() => {
        requestUpdate();
    });

    observer.observe(element);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    requestUpdate();

    return () => {
        observer.disconnect();
        window.removeEventListener('scroll', requestUpdate);
        window.removeEventListener('resize', requestUpdate);
        if (rafId) cancelAnimationFrame(rafId);
        plates.forEach((plate) => {
            plate.style.removeProperty('transform');
        });
    };
}
