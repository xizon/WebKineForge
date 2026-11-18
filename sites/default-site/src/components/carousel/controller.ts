
import { gsap } from 'gsap';

export function mount(element: HTMLElement | null): (() => void) | void {
    if (!element) return;

    const viewport = element.querySelector<HTMLElement>(
        '.wkf-carousel__viewport'
    );

    const track = element.querySelector<HTMLElement>(
        '.wkf-carousel__track'
    );

    if (!viewport || !track) return;

    const slides = Array.from(
        track.querySelectorAll<HTMLElement>('[data-carousel-slide]')
    );

    if (!slides.length) return;

    const dotsContainer = element.querySelector<HTMLUListElement>(
        '[data-carousel-dots]'
    );

    const autoplay = element.dataset.autoplay === 'true';
    const draggable = element.dataset.draggable !== 'false';

    const interval = Math.max(
        500,
        Number(element.dataset.interval) || 3000
    );

    const initialIndex = Number(element.dataset.initialIndex) || 0;

    let currentIndex = Math.min(
        Math.max(0, initialIndex),
        slides.length - 1
    );

    let timer: number | undefined;
    let pointerId: number | null = null;
    let startX = 0;
    let dragX = 0;
    let isDragging = false;
    let suppressClick = false;

    // Generate navigation dots.
    const dots: HTMLButtonElement[] = [];

    if (dotsContainer) {
        dotsContainer.replaceChildren();

        slides.forEach((_, index) => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.classList.add('wkf-carousel__dot');
            

            button.type = 'button';
            button.dataset.carouselDot = String(index);

            li.appendChild(button);
            dotsContainer.appendChild(li);

            dots.push(button);
        });
    }

    // Calculate the horizontal position of a slide.
    const getPosition = (index: number) => {
        return -index * viewport.clientWidth;
    };

    // Update accessibility and navigation states.
    const updateState = () => {
        slides.forEach((slide, index) => {
            const active = index === currentIndex;

            slide.setAttribute('aria-hidden', String(!active));
        });

        dots.forEach((dot, index) => {
            const active = index === currentIndex;

            dot.classList.toggle('is-active', active);
            dot.setAttribute('aria-current', String(active));
        });
    };

    // Animate to a specific slide.
    const goTo = (index: number, animate = true) => {
        if (slides.length < 2) return;

        currentIndex = (index + slides.length) % slides.length;

        gsap.to(track, {
            x: getPosition(currentIndex),
            duration: animate ? 0.65 : 0,
            ease: 'power3.out',
            overwrite: 'auto',
        });

        updateState();
    };

    // Navigate to the next slide.
    const next = () => {
        goTo(currentIndex + 1);
    };

    // Navigate to the previous slide.
    const previous = () => {
        goTo(currentIndex - 1);
    };

    // Start or restart autoplay.
    const startAutoplay = () => {
        window.clearInterval(timer);

        if (autoplay && slides.length > 1) {
            timer = window.setInterval(next, interval);
        }
    };

    // Handle navigation dot clicks.
    const handleDotClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        const button = target.closest<HTMLButtonElement>(
            '[data-carousel-dot]'
        );

        if (!button || !dotsContainer?.contains(button)) return;

        const index = Number(button.dataset.carouselDot);

        if (!Number.isInteger(index)) return;

        goTo(index);
        startAutoplay();
    };

    // Handle keyboard navigation.
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            next();
            startAutoplay();
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            previous();
            startAutoplay();
        }
    };

    // Begin dragging.
    const handlePointerDown = (event: PointerEvent) => {
        if (!draggable || slides.length < 2) return;
        if (!event.isPrimary || event.button !== 0) return;

        const target = event.target as HTMLElement;

        if (
            target.closest(
                'a, button, input, textarea, select, [contenteditable="true"]'
            )
        ) {
            return;
        }

        pointerId = event.pointerId;
        startX = event.clientX;
        dragX = 0;
        isDragging = true;
        suppressClick = false;

        track.classList.add('is-dragging');

        gsap.killTweensOf(track);

        viewport.setPointerCapture(event.pointerId);

        window.clearInterval(timer);
    };

    // Move the track with the pointer.
    const handlePointerMove = (event: PointerEvent) => {
        if (!isDragging || event.pointerId !== pointerId) return;

        dragX = event.clientX - startX;

        if (Math.abs(dragX) > 5) {
            suppressClick = true;
        }

        gsap.set(track, {
            x: getPosition(currentIndex) + dragX,
        });
    };

    // Finish dragging and navigate if the threshold is reached.
    const handlePointerUp = (event: PointerEvent) => {
        if (!isDragging || event.pointerId !== pointerId) return;

        const threshold = Math.max(40, viewport.clientWidth * 0.15);

        isDragging = false;
        pointerId = null;

        track.classList.remove('is-dragging');

        if (dragX < -threshold) {
            next();
        } else if (dragX > threshold) {
            previous();
        } else {
            goTo(currentIndex);
        }

        startAutoplay();
    };

    // Cancel an interrupted drag gesture.
    const handlePointerCancel = (event: PointerEvent) => {
        if (!isDragging || event.pointerId !== pointerId) return;

        isDragging = false;
        pointerId = null;

        track.classList.remove('is-dragging');

        goTo(currentIndex);
        startAutoplay();
    };

    // Prevent clicks immediately after dragging.
    const handleClickCapture = (event: MouseEvent) => {
        if (!suppressClick) return;

        event.preventDefault();
        event.stopPropagation();

        suppressClick = false;
    };

    // Recalculate positions when the viewport changes size.
    const handleResize = () => {
        gsap.set(track, {
            x: getPosition(currentIndex),
        });
    };

    // Initialize the carousel.
    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-roledescription', 'carousel');

    gsap.set(track, {
        x: getPosition(currentIndex),
    });

    updateState();

    if (dotsContainer) {
        dotsContainer.addEventListener('click', handleDotClick);
    }

    viewport.addEventListener('keydown', handleKeyDown);
    viewport.addEventListener('pointerdown', handlePointerDown);
    viewport.addEventListener('pointermove', handlePointerMove);
    viewport.addEventListener('pointerup', handlePointerUp);
    viewport.addEventListener('pointercancel', handlePointerCancel);
    viewport.addEventListener('click', handleClickCapture, true);

    window.addEventListener('resize', handleResize);

    startAutoplay();

    // Clean up animations, timers, and event listeners.
    return () => {
        window.clearInterval(timer);

        gsap.killTweensOf(track);

        if (dotsContainer) {
            dotsContainer.removeEventListener('click', handleDotClick);
            dotsContainer.replaceChildren();
        }

        viewport.removeEventListener('keydown', handleKeyDown);
        viewport.removeEventListener('pointerdown', handlePointerDown);
        viewport.removeEventListener('pointermove', handlePointerMove);
        viewport.removeEventListener('pointerup', handlePointerUp);
        viewport.removeEventListener('pointercancel', handlePointerCancel);
        viewport.removeEventListener('click', handleClickCapture, true);

        window.removeEventListener('resize', handleResize);
    };
}
