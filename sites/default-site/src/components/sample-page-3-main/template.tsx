import './style.css';
import type {
    AboutContent,
    ContactContent,
    FooterContent,
    HeroContent,
    NavItem,
    ViewKey,
    Work,
} from './_scripts/data';
import { renderView } from './_scripts/view-templates';
import Logo from '@/components/logo';

type SamplePage3MainProps = {
    view?: ViewKey;
    logoLink?: string;
    logoHighlight?: string;
    nav?: NavItem[];
    footer?: FooterContent;
    hero?: HeroContent;
    works?: Work[];
    about?: AboutContent;
    contact?: ContactContent;
};

/**
 * The site shell.
 *
 * Every page (home, works, about, contact) renders this same shell with its
 * own view inside <main>. All copy, links and works are passed in as props.
 * The first page you open is a complete document; after that the controller
 * swaps only the view, so the WebGL stage, the navigation and the footer
 * never reload.
 */
export function Template({
    view = 'home',
    logoLink = '',
    logoHighlight = '',
    nav = [],
    footer = {},
    hero,
    works,
    about,
    contact,
}: SamplePage3MainProps) {
    const footerHref = footer.href ?? '';

    return (
        <div className="wkf-app" data-view={view} data-boot="">
            <div className="wkf-stage" aria-hidden="true"></div>
            <div className="wkf-vignette" aria-hidden="true"></div>


            

            <header className="wkf-bar">
                <Logo highlight={logoHighlight || undefined} link={logoLink} pjax />

                <nav className="wkf-nav">
                    {nav.map((item, index) => (
                        
                        <a
                            className={`wkf-nav__link ${item.key === view ? 'is-active' : ''}`}
                            href={item.href}
                            data-pjax
                            data-key={item.key}
                            aria-current={item.key === view ? 'page' : undefined}
                            key={item.key}
                        >
                            <span className="wkf-nav__index">{String(index + 1).padStart(2, '0')}</span>
                            <span className="wkf-nav__label">{item.label}</span>

                        </a>
                    ))}
                    
                </nav>


                <nav className="wkf-nav">
                    
                    <span className="wkf-nav__mark" aria-hidden="true"></span>
                </nav>
            </header>

            <main className="wkf-main" id="wkf-main">
                {renderView(view, { hero, works, about, contact })}
            </main>

            <footer className="wkf-foot">
                {footer.text ? (
                    <a
                        className="wkf-foot__link"
                        href={footerHref || undefined}
                        {...(footerHref ? { target: '_blank', rel: 'noopener' } : {})}
                    >
                        {footer.text}
                    </a>
                ) : null}
            </footer>

            <div className="wkf-ornaments" aria-hidden="true">
                <svg width="10" className="wkf-ornament wkf-ornament--tl" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 5" />
                    <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="0.6" />
                    <path d="M32 2V12M32 52V62M2 32H12M52 32H62" stroke="currentColor" strokeWidth="0.75" />
                </svg>

                <svg width="10" className="wkf-ornament wkf-ornament--tr" viewBox="0 0 48 48" fill="none">
                    <path
                        d="M24 3C24.8 15.5 32.5 23.2 45 24C32.5 24.8 24.8 32.5 24 45C23.2 32.5 15.5 24.8 3 24C15.5 23.2 23.2 15.5 24 3Z"
                        stroke="currentColor"
                        strokeWidth="0.8"
                    />
                    <circle cx="24" cy="24" r="2" fill="currentColor" />
                </svg>

                <svg width="10" className="wkf-ornament wkf-ornament--bl" viewBox="0 0 56 56" fill="none">
                    <polygon points="28,4 50,44 6,44" stroke="currentColor" strokeWidth="0.75" />
                    <polygon points="28,14 42,39 14,39" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
                </svg>

                <svg width="10" className="wkf-ornament wkf-ornament--br" viewBox="0 0 60 60" fill="none">
                    <ellipse cx="30" cy="30" rx="25" ry="10" transform="rotate(-32 30 30)" stroke="currentColor" strokeWidth="0.75" />
                    <ellipse cx="30" cy="30" rx="25" ry="10" transform="rotate(32 30 30)" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4" />
                    <circle cx="30" cy="30" r="2.2" fill="currentColor" />
                </svg>

                <svg width="10" className="wkf-ornament2 wkf-ornament2--ring" viewBox="0 0 120 120" aria-hidden="true">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1.5 5" />
                    <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="0.6" />
                    <g className="wkf-ornament2__orbit">
                        <circle cx="60" cy="8" r="2.4" fill="currentColor" />
                    </g>
                    <g className="wkf-ornament2__orbit wkf-ornament2__orbit--slow">
                        <circle cx="60" cy="24" r="1.4" fill="currentColor" />
                    </g>
                </svg>

                <svg width="10" className="wkf-ornament2 wkf-ornament2--star" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.9"
                        strokeLinecap="round"
                    />
                </svg>

                <svg width="10" className="wkf-ornament2 wkf-ornament2--plus wkf-ornament2--plus-a" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M6 0v12M0 6h12" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </svg>
                <svg width="10" className="wkf-ornament2 wkf-ornament2--plus wkf-ornament2--plus-b" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M6 0v12M0 6h12" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </svg>

            </div> 


        </div>
    );
}
