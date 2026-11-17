export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;

    const grid = element.querySelector<HTMLElement>('.wkf-pricing-cards__grid');
    const cards = Array.from(
        element.querySelectorAll<HTMLElement>('.wkf-pricing-cards__card')
    );

    if (!grid || cards.length === 0) return;

    const show = () => {
        cards.forEach((card) => {
            card.classList.add('is-visible');
        });
    };

    const reset = () => {
        cards.forEach((card) => {
            card.classList.remove('is-visible');
            card.style.transitionDelay = '';
        });
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reduceMotion.matches) {
        show();
        return reset;
    }

    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 140}ms`;
    });

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries.some((entry) => entry.isIntersecting);

            if (!visible) return;

            show();
            observer.disconnect();
        },
        {
            threshold: 0.2,
            rootMargin: '0px 0px -8% 0px',
        }
    );

    observer.observe(grid);

    return () => {
        observer.disconnect();
        reset();
    };
}
