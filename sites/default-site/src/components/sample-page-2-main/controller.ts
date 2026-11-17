
export function mount(): () => void {
    const cleanups: Array<() => void> = [];

    // 1. Scroll Reveal (IntersectionObserver)
    const revealEls = document.querySelectorAll<HTMLElement>('[data-wkf-reveal]');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target as HTMLElement;
                    const delay = el.dataset.wkfDelay || '0';
                    el.style.transitionDelay = `${delay}ms`;
                    el.classList.add('is-visible');
                    observer.unobserve(el);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
    cleanups.push(() => observer.disconnect());

    // 2. 3D Perspective Tilt & Pointer Spotlight Tracking
    const tiltCards = document.querySelectorAll<HTMLElement>('[data-wkf-tilt]');
    tiltCards.forEach((card) => {
        const maxTilt = Number(card.dataset.wkfTilt) || 6;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update radial spotlight coordinates
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Compute perspective rotation angles
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        };

        const handleMouseLeave = () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        cleanups.push(() => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        });
    });

    // 3. Magnetic Button Pull Effect
    const magneticBtns = document.querySelectorAll<HTMLElement>('[data-wkf-magnetic]');
    magneticBtns.forEach((btn) => {
        const strength = Number(btn.dataset.wkfMagnetic) || 0.25;

        const handleMove = (e: MouseEvent) => {
            const rect = btn.getBoundingClientRect();
            const deltaX = (e.clientX - (rect.left + rect.width / 2)) * strength;
            const deltaY = (e.clientY - (rect.top + rect.height / 2)) * strength;
            btn.style.transform = `translate(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px)`;
        };

        const handleLeave = () => {
            btn.style.transform = 'translate(0px, 0px)';
        };

        btn.addEventListener('mousemove', handleMove);
        btn.addEventListener('mouseleave', handleLeave);
        cleanups.push(() => {
            btn.removeEventListener('mousemove', handleMove);
            btn.removeEventListener('mouseleave', handleLeave);
        });
    });

    // 4. Animated Number Counters (Hero Stats)
    const counters = document.querySelectorAll<HTMLElement>('[data-wkf-count]');
    counters.forEach((el) => {
        const target = parseInt(el.dataset.wkfCount || '0', 10);
        const suffix = el.dataset.wkfSuffix || '';
        const padZero = el.dataset.wkfPad === 'true';
        const duration = 1400;
        const startTime = performance.now();

        const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out quartic curve
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(ease * target);
            const formatted = padZero && current < 10 ? `0${current}` : `${current}`;
            el.textContent = `${formatted}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };
        requestAnimationFrame(tick);
    });

    // 5. Client-Side Project Category Filtering
    const filterBtns = document.querySelectorAll<HTMLButtonElement>('[data-wkf-filter]');
    const projectItems = document.querySelectorAll<HTMLElement>('[data-wkf-category]');

    filterBtns.forEach((btn) => {
        const handleFilter = () => {
            const selected = btn.dataset.wkfFilter || 'all';

            // Update active button state
            filterBtns.forEach((b) => {
                b.classList.remove('wkf:bg-violet-600', 'wkf:text-white', 'wkf:shadow-md');
                b.classList.add('wkf:bg-white', 'wkf:text-slate-600');
            });
            btn.classList.remove('wkf:bg-white', 'wkf:text-slate-600');
            btn.classList.add('wkf:bg-violet-600', 'wkf:text-white', 'wkf:shadow-md');

            // Filter project cards
            projectItems.forEach((item) => {
                const cat = item.dataset.wkfCategory;
                if (selected === 'all' || cat === selected) {
                    item.style.display = '';
                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (btn.dataset.wkfFilter !== 'all' && item.dataset.wkfCategory !== btn.dataset.wkfFilter) {
                            item.style.display = 'none';
                        }
                    }, 220);
                }
            });
        };

        btn.addEventListener('click', handleFilter);
        cleanups.push(() => btn.removeEventListener('click', handleFilter));
    });

    // 6. Subtle Mouse Parallax for Ambient Orbs
    const parallaxOrbs = document.querySelectorAll<HTMLElement>('[data-wkf-parallax]');
    const handleGlobalMouseMove = (e: MouseEvent) => {
        const normX = (e.clientX / window.innerWidth - 0.5) * 2;
        const normY = (e.clientY / window.innerHeight - 0.5) * 2;

        parallaxOrbs.forEach((orb) => {
            const speed = Number(orb.dataset.wkfParallax) || 20;
            orb.style.marginLeft = `${(normX * speed).toFixed(1)}px`;
            orb.style.marginTop = `${(normY * speed).toFixed(1)}px`;
        });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    cleanups.push(() => window.removeEventListener('mousemove', handleGlobalMouseMove));

    return () => cleanups.forEach((fn) => fn());
}