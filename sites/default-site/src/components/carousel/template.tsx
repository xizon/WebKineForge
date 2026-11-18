
import './style.css';

export interface CarouselProps {
    slides: any[];
    autoplay?: boolean;
    interval?: number;
    initialIndex?: number;
    showDots?: boolean;
    draggable?: boolean;
}

export function Template({
    slides = [],
    autoplay = true,
    interval = 3000,
    initialIndex = 0,
    showDots = true,
    draggable = true,
}: CarouselProps) {
    const validSlides = Array.isArray(slides) ? slides : [];

    const safeIndex = Math.max(
        0,
        Math.min(initialIndex, validSlides.length - 1)
    );

    return (
        <section
            className="wkf-carousel"
            data-carousel
            data-autoplay={String(autoplay)}
            data-interval={Math.max(500, interval)}
            data-initial-index={safeIndex}
            data-draggable={String(draggable)}
        >
            <div className="wkf-carousel__viewport">
                <div className="wkf-carousel__track">
                    {validSlides.map((slide, index) => (
                        <div
                            className="wkf-carousel__slide"
                            data-carousel-slide
                            aria-hidden={index !== safeIndex}
                            key={index}
                        >
                            {slide}
                        </div>
                    ))}
                </div>
            </div>

            {showDots && validSlides.length > 1 && (
                <ul
                    className="wkf-carousel__dots"
                    data-carousel-dots
                />
            )}
        </section>
    );
}
