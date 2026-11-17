import { gsap } from 'gsap';

export function mount(element: HTMLElement | null): (() => void) | void {
    if (!element) return;

    const menu = element.querySelector<HTMLElement>(
        '.wkf-primary-menu__list'
    );

    const indicator = element.querySelector<HTMLElement>(
        '.wkf-primary-menu__indicator'
    );

    const links = Array.from(
        element.querySelectorAll<HTMLAnchorElement>(
            '.wkf-primary-menu__link'
        )
    );

    const hamburger = element.querySelector<HTMLButtonElement>('.wkf-primary-menu__hamburger');

    if (!menu || !indicator || links.length === 0) return;

    // 💡 Extract the hamburger click handler so we can remove it later
    const handleHamburgerClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
 
        const primaryMenuEl = menu.parentElement;
        if (primaryMenuEl !== null) {
            primaryMenuEl.classList.toggle('is-open');
        }
    };

    // mobile
    if (hamburger && menu) {
        hamburger.addEventListener('click', handleHamburgerClick);
    } else {
        console.warn('Hamburger element not found!');
    }

    const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    let activeLink: HTMLAnchorElement | null = null;
    let hoveredLink: HTMLAnchorElement | null = null;

    const getPageLink = () => {
        const pathname = window.location.pathname;

        return links.find((link) => {
            const page = link.dataset.page;
            return page && pathname.includes(`${page}.html`);
        }) ?? null;
    };

    const moveIndicator = (
        link: HTMLAnchorElement,
        immediate = false
    ) => {
        const menuRect = menu.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        const x = linkRect.left - menuRect.left;
        const y = linkRect.top - menuRect.top;

        gsap.killTweensOf(indicator);

        gsap.to(indicator, {
            x,
            y,
            width: linkRect.width,
            height: linkRect.height,
            opacity: 1,
            duration: immediate || reduceMotion ? 0 : 0.65,
            ease: 'power3.inOut',
            overwrite: true,
        });
    };

    const handleEnter = (event: Event) => {
        const link = event.currentTarget as HTMLAnchorElement;
        hoveredLink = link;
        moveIndicator(link);
    };

    const handleLeave = () => {
        hoveredLink = null;

        if (activeLink) {
            moveIndicator(activeLink);
        } else {
            gsap.to(indicator, {
                opacity: 0,
                duration: 0.25,
                ease: 'power2.out',
            });
        }
    };

    // Set active page
    activeLink = getPageLink();

    // Store link click handlers if we want to clean them up cleanly too (optional but recommended)
    const linkClickHandlerMap = new Map<HTMLAnchorElement, () => void>();

    links.forEach((link) => {
        link.removeAttribute('aria-current');
        if (link === activeLink) {
            link.setAttribute('aria-current', 'page');
        }
        link.addEventListener('mouseenter', handleEnter);
        link.addEventListener('focus', handleEnter);

        // Automatically collapse the menu after a menu item is clicked on mobile.
        const handleLinkClick = () => {
            const primaryMenuEl = menu.parentElement;
            if (primaryMenuEl !== null) {
                primaryMenuEl.classList.remove('is-open');
            }
        };

        link.addEventListener('click', handleLinkClick);
        linkClickHandlerMap.set(link, handleLinkClick);
    });

    menu.addEventListener('mouseleave', handleLeave);

    // Initial position
    if (activeLink) {
        moveIndicator(activeLink, true);
    }

    // Recalculate after viewport changes
    const handleResize = () => {
        const target = hoveredLink ?? activeLink;

        if (target) {
            moveIndicator(target, true);
        }
    };

    window.addEventListener('resize', handleResize);

    // 💡 Cleanup function
    return () => {
        // Remove hamburger listener
        if (hamburger) {
            hamburger.removeEventListener('click', handleHamburgerClick);
        }

        // Remove link listeners
        links.forEach((link) => {
            link.removeEventListener('mouseenter', handleEnter);
            link.removeEventListener('focus', handleEnter);
            const clickHandler = linkClickHandlerMap.get(link);
            if (clickHandler) {
                link.removeEventListener('click', clickHandler);
            }
        });

        menu.removeEventListener('mouseleave', handleLeave);
        window.removeEventListener('resize', handleResize);

        gsap.killTweensOf(indicator);
    };
}