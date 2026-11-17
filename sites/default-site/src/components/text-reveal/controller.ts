export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;

    const headline = element.querySelector<HTMLElement>(
        '.wkf-text-reveal__headline'
    );

    if (!headline) return;

    const lines = headline.querySelectorAll<HTMLElement>('span');

    if (!lines.length) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            lines.forEach((line, index) => {
                if (entry.isIntersecting) {
                    line.classList.add('is-visible');
                } else {
                    line.classList.remove('is-visible');
                }
            });
        },
        {
            threshold: 0,
            rootMargin: '0px 0px -30% 0px',
        }
    );

    lines.forEach((line, index) => {
        line.style.transitionDelay = `${index * 0.18}s`;
    });

    observer.observe(headline);

    return () => observer.disconnect();
}