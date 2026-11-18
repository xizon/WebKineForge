import './style.css';

import TextShimmer from '@/components/text-shimmer';

type ParallaxProps = {
    id?: string;
    image?: string;
    imageAlt?: string;
    eyebrow?: string;
    title?: string;
    body?: string;
    figure?: string;
};

export function Template({
    id = '',
    image = '',
    imageAlt = '',
    eyebrow = '',
    title = '',
    body = '',
    figure = '',
}: ParallaxProps) {
    return (
        <section id={id || undefined} className="wkf-parallax">
            <div className="wkf-parallax__frame">
                {image ? (
                    <img
                        className="wkf-parallax__media"
                        data-parallax="1.2"
                        src={image}
                        alt={imageAlt}
                    />
                ) : null}
                <div className="wkf-parallax__scrim" aria-hidden="true"></div>
            </div>

            <div className="wkf-parallax__copy">
                {eyebrow ? (
                    <p className="wkf-parallax__eyebrow">{eyebrow}</p>
                ) : null}
                {title ? (
                    <h2 className="wkf-parallax__title"><TextShimmer>{title}</TextShimmer></h2>
                ) : null}
                <span className="wkf-parallax__rule" aria-hidden="true"></span>
                {body ? (
                    <p className="wkf-parallax__body">{body}</p>
                ) : null}
            </div>

            {figure ? (
                <span className="wkf-parallax__index" aria-hidden="true">{figure}</span>
            ) : null}
        </section>
    );
}
