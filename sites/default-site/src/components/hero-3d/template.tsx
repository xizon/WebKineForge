import './style.css';


interface Hero3DProps {
    eyebrow?: string;
    title?: string;
    accent?: string;
    description?: string;
    nextLabel?: string;
    nextSelector?: string;
}


export function Template({
    eyebrow = '',
    title = '',
    accent = '',
    description = '',
    nextLabel = '',
    nextSelector,
}: Hero3DProps) {
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
                {eyebrow ? (
                    <p className="wkf-hero__eyebrow">
                        <span className="wkf-hero__pip" aria-hidden="true"></span>
                        {eyebrow}
                    </p>
                ) : null}
                {title || accent ? (
                    <h1 className="wkf-hero__title">
                        {title}
                        {accent ? (
                            <span className="wkf-hero__accent">{accent}</span>
                        ) : null}
                    </h1>
                ) : null}
                {description ? (
                    <p className="wkf-hero__description">{description}</p>
                ) : null}
            </div>

            <button
                className="wkf-hero__next"
                type="button"
                data-scroll-next=""
            >
                {nextLabel && nextLabel !== '' ? (
                    <span className="wkf-hero__next-label">{nextLabel}</span>
                ) : null}
                <span className="wkf-hero__next-arrow" aria-hidden="true"></span>
            </button>
        </section>
    );
}
