import './style.css';


interface Hero3DProps {
    nextSelector?: string;
}


export function Template({ nextSelector }: Hero3DProps) {
    return (
        <section
            className="wkf-hero"
            data-next={nextSelector}
        >
            <canvas
                className="wkf-hero__canvas"
                aria-hidden="true"
            ></canvas>

            <div className="wkf-hero__rail" aria-hidden="true"></div>
            <div className="wkf-hero__cross" aria-hidden="true"></div>

            <div className="wkf-hero__copy">
                <p className="wkf-hero__eyebrow">
                    <span className="wkf-hero__pip" aria-hidden="true"></span>
                    Full-stack developer
                </p>
                <h1 className="wkf-hero__title">
                    I build the product
                    <span className="wkf-hero__accent">from the pixel to the process.</span>
                </h1>
                <p className="wkf-hero__description">Interface, application, and infrastructure. Motion belongs to the work, not a coat of paint added at the end.</p>
            </div>

            <button
                className="wkf-hero__next"
                type="button"
                data-scroll-next=""
            >
                <span className="wkf-hero__next-label">Scroll</span>
                <span className="wkf-hero__next-arrow" aria-hidden="true"></span>
            </button>
        </section>
    );
}
