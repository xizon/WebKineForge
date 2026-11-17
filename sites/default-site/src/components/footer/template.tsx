import './style.css';

type SiteFooterLink = {
    label: string;
    href: string;
};

type SiteFooterProps = {
    links?: SiteFooterLink[];
};

const defaultLinks: SiteFooterLink[] = [
    { label: 'GitHub', href: 'https://github.com/xizon/WebKineForge' },
    { label: 'Website', href: 'https://uiux.cc' }
];

export function Template({
    links = defaultLinks,
}: SiteFooterProps) {
    return (

        <footer className="wkf-site-footer">
            <div
                className="wkf-site-footer__orbit"
                aria-hidden="true"
            ></div>

            <p className="wkf-site-footer__eyebrow">
                Elsewhere
            </p>

            <p className="wkf-site-footer__title">
                UI-First, Always
            </p>



            <ul className="wkf-site-footer__links">
                {links.map((link) => (
                    <li key={link.label}>
                        <a
                            className="wkf-site-footer__link"
                            href={link.href}
                            {...(link.href.startsWith('http')
                                ? { target: '_blank', rel: 'noreferrer' }
                                : {})}
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>

            <div className="wkf-site-footer__bar">
                <span
                    className="wkf-site-footer__gem"
                    aria-hidden="true"
                ></span>

                <p className="wkf-site-footer__copy">
                    &copy; 2026 WebKineForge.
                </p>
            </div>
        </footer>

    );
}
