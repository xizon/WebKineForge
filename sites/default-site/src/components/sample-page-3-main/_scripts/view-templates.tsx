import { ABOUT_LINES, CONTACT, HERO, WORKS, type ViewKey } from './data';

/**
 * Markup for each page's content.
 * The shell (template.tsx) puts exactly one of these inside <main>.
 * The router later reads `.wkf-view` out of the fetched HTML and swaps it in.
 */

function HomeView() {
    return (
        <section className="wkf-view wkf-view--home" data-view="home">
            <div className="wkf-hero">
                <h1 className="wkf-hero__title" data-split>
                    {HERO.title}
                </h1>
                <p className="wkf-hero__sub">{HERO.subtitle}</p>
            </div>
        </section>
    );
}

function WorksView() {
    return (
        <section className="wkf-view wkf-view--works" data-view="works">
            <div className="wkf-works">
                <div className="wkf-works__track">
                    {WORKS.map((w, i) => (
                        <article className="wkf-work" data-ratio={w.ratio} data-motif={w.motif} key={w.title}>
                            <div className="wkf-work__rise">
                                <div className="wkf-work__tilt">
                                    <div
                                        className="wkf-work__face"
                                        style={{
                                            background: `linear-gradient(${w.angle}deg, hsl(${w.h1} 64% 46%) 0%, hsl(${w.h2} 72% 16%) 100%)`,
                                        }}
                                    >
                                        {w.image ? (
                                            <img
                                                className="wkf-work__img"
                                                src={w.image}
                                                alt={w.title}
                                                loading={i < 4 ? 'eager' : 'lazy'}
                                                decoding="async"
                                                draggable={false}
                                            />
                                        ) : (
                                            <span className="wkf-work__motif"></span>
                                        )}
                                        <span className="wkf-work__sheen"></span>
                                        <span className="wkf-work__edge"></span>
                                        <h2 className="wkf-work__title">{w.title}</h2>
                                        <p className="wkf-work__kind">{w.kind}</p>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AboutView() {
    return (
        <section className="wkf-view wkf-view--about" data-view="about">
            <div className="wkf-about">
                <h1 className="wkf-visually-hidden">About WebKineForge</h1>
                {ABOUT_LINES.map((line) => (
                    <p className="wkf-about__line" data-line key={line}>
                        {line}
                    </p>
                ))}
                <span className="wkf-about__cursor" aria-hidden="true"></span>
            </div>
        </section>
    );
}

function ContactView() {
    const sealText = Array(3).fill(CONTACT.seal).join('\u00a0\u00a0\u00a0\u00a0\u00a0') + '\u00a0\u00a0\u00a0\u00a0\u00a0';
    return (
        <section className="wkf-view wkf-view--contact" data-view="contact">
            <div className="wkf-contact">
                <h1 className="wkf-contact__title" data-words>
                    {CONTACT.title}
                </h1>
                <ul className="wkf-contact__list">
                    {CONTACT.links.map((l) => (
                        <li className="wkf-contact__item" key={l.label}>
                            <a
                                className="wkf-contact__link"
                                href={l.href}
                                target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                                rel={l.href.startsWith('mailto:') ? undefined : 'noopener'}
                            >
                                <span className="wkf-contact__label">{l.label}</span>
                                <span className="wkf-contact__note">{l.note}</span>
                                <svg className="wkf-contact__icon" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="M6 18L18 6M9 6h9v9"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                        </li>
                    ))}
                </ul>
                <svg className="wkf-seal" viewBox="0 0 200 200" aria-hidden="true">
                    <defs>
                        <path id="wkf-seal-path" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
                    </defs>
                    <g className="wkf-seal__ring">
                        <text className="wkf-seal__text">
                            <textPath href="#wkf-seal-path" textLength="458">
                                {sealText}
                            </textPath>
                        </text>
                    </g>
                    <g className="wkf-seal__star">
                        <path
                            d="M100 80v40M80 100h40M86 86l28 28M114 86L86 114"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                        />
                    </g>
                </svg>
            </div>
        </section>
    );
}

export function renderView(view: ViewKey) {
    switch (view) {
        case 'works':
            return <WorksView />;
        case 'about':
            return <AboutView />;
        case 'contact':
            return <ContactView />;
        default:
            return <HomeView />;
    }
}
