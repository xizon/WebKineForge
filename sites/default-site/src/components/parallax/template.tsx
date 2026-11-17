import './style.css';

import TextShimmer from '@/components/text-shimmer';

export function Template() {
    return (
        <section id="next-section" className="wkf-parallax">
            <div className="wkf-parallax__frame">
                <img
                    className="wkf-parallax__media"
                    data-parallax="1.2"
                    src="./assets/images/parallax-bg.jpg"
                    alt=""
                />
                <div className="wkf-parallax__scrim" aria-hidden="true"></div>
            </div>

            <div className="wkf-parallax__copy">
                <p className="wkf-parallax__eyebrow">01 — Portrait</p>
                <h2 className="wkf-parallax__title"><TextShimmer>A long attention span for short, exact interfaces</TextShimmer></h2>
                <span className="wkf-parallax__rule" aria-hidden="true"></span>
                <p className="wkf-parallax__body">People arrive asking for a page. They leave with the system around it: templates, data, deployment, and the small interactions a visitor actually feels. I like work that is quiet in the hand and precise in the code.</p>
            </div>

            <span className="wkf-parallax__index" aria-hidden="true">Fig. 01</span>
        </section>
    );
}


