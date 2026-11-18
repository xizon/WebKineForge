
import './style.css';

import TextShimmer from '@/components/text-shimmer';
import Carousel from '@/components/carousel';


type TextRevealProps = {
    headline?: string;
    subline?: string;
    slides?: any[];
    note?: string;
};


export function Template({
    headline = '',
    subline = '',
    slides = [],
    note = '',
}: TextRevealProps) {
    return (
        <section className="wkf-text-reveal">

            {/* Main Content */}
            <div className="wkf-text-reveal__body">

                {/* Left Content */}
                <aside className="wkf-text-reveal__aside">
                    <h2 className="wkf-text-reveal__headline">
                        {headline ? (
                            <span>
                                {headline}
                            </span>
                        ) : null}
                        {subline ? (
                            <span className="wkf-text-reveal__subline">
                                {subline}
                            </span>
                        ) : null}
                    </h2>
                </aside>

                {/* Right Content */}
                <main className="wkf-text-reveal__content">
                    {slides.length > 0 ? (
                        <Carousel slides={slides} />
                    ) : null}
                </main>

            </div>

            {/* Footer */}
            {note ? (
                <footer className="wkf-text-reveal__footer">
                    <div className="wkf-text-reveal__footer-note">
                        <TextShimmer>{note}</TextShimmer>
                    </div>
                </footer>
            ) : null}

        </section>
    );
}
