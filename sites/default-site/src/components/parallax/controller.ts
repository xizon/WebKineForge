export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;

    const layers = Array.from(
        element.querySelectorAll<HTMLElement>('[data-parallax]')
    );

    if (!layers.length) return;

    let rafId = 0;

    // Calculate parallax based on the current scroll position
    const update = () => {
        rafId = 0;

        const rect = element.getBoundingClientRect();

        // start: top bottom
        // end: bottom top
        const progress =
            (window.innerHeight - rect.top) /
            (window.innerHeight + rect.height);

        layers.forEach((layer) => {
            const depth = Number(layer.dataset.parallax ?? 0.2);
            const move = (progress - 0.2) * depth * -320;

            layer.style.transform = `translate3d(0, ${move}px, 0)`;
        });
    };

    // Schedule updates using requestAnimationFrame
    const requestUpdate = () => {
        if (!rafId) {
            rafId = requestAnimationFrame(update);
        }
    };

    // Observe element visibility and trigger an update
    const observer = new IntersectionObserver(() => {
        requestUpdate();
    });

    observer.observe(element);

    // Keep listening to scroll events continuously
    window.addEventListener('scroll', requestUpdate, {
        passive: true
    });

    window.addEventListener('resize', requestUpdate);

    requestUpdate();

    return () => {
        // Clean up observer and event listeners
        observer.disconnect();

        window.removeEventListener('scroll', requestUpdate);
        window.removeEventListener('resize', requestUpdate);

        if (rafId) {
            cancelAnimationFrame(rafId);
        }

        // Reset inline transforms
        layers.forEach((layer) => {
            layer.style.removeProperty('transform');
        });
    };
}