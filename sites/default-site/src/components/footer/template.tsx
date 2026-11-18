import './style.css';

type SiteFooterLink = {
    label: string;
    href: string;
};

type SiteFooterProps = {
    eyebrow?: string;
    title?: string;
    links?: SiteFooterLink[];
    copyright?: string;
};

export function Template({
    eyebrow = '',
    title = '',
    links = [],
    copyright = '',
}: SiteFooterProps) {
    return (

        <footer className="wkf-site-footer">
            <div
                className="wkf-site-footer__orbit"
                aria-hidden="true"
            ></div>

            {eyebrow ? (
                <p className="wkf-site-footer__eyebrow">
                    {eyebrow}
                </p>
            ) : null}

            {title ? (
                <p className="wkf-site-footer__title">
                    {title}
                </p>
            ) : null}

            {links.length > 0 ? (
                <ul className="wkf-site-footer__links">
                    {links.map((link, index) => (
                        <li key={`${link.label}-${index}`}>
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
            ) : null}

            <div className="wkf-site-footer__bar">
                <span
                    className="wkf-site-footer__gem"
                    aria-hidden="true"
                ></span>

                {copyright ? (
                    <p className="wkf-site-footer__copy">
                        {copyright}
                    </p>
                ) : null}
            </div>
        </footer>

    );
}
