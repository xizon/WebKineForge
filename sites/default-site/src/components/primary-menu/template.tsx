
import './style.css';

type PrimaryMenuLink = {
    href: string;
    page: string;
    label: string;
    newWindow?: boolean;
    active?: boolean;
};

type PrimaryMenuProps = {
    theme?: 'light' | 'dark' | string;
    links?: PrimaryMenuLink[];
    className?: string;
    style?: Record<string, string | number>;
    [key: string]: any;
};

const defaultLinks: PrimaryMenuLink[] = [];

export function Template({
    theme = 'dark',
    links = defaultLinks,
    className = '',
    style,
    ...props
}: PrimaryMenuProps) {
    return (
        <nav
            className={`wkf-primary-menu ${theme === 'light' ? 'is-light' : 'is-dark'} ${className}`.trim()}
            style={style}
            {...props}
        >
            <button className="wkf-primary-menu__hamburger" type="button">
                <span className="wkf-hamburger-line"></span>
                <span className="wkf-hamburger-line"></span>
                <span className="wkf-hamburger-line"></span>
            </button>

            <ul className="wkf-primary-menu__list">
                <li className="wkf-primary-menu__indicator" />

                {links.map(({ href, page, label, newWindow, active }) => (
                    <li key={page} className="wkf-primary-menu__item">
                        <a
                            href={href}
                            data-page={page}
                            target={newWindow ? '_blank' : '_self'}
                            rel={newWindow ? 'noopener noreferrer' : undefined}
                            className={`wkf-primary-menu__link ${active ? 'is-active' : ''}`.trim()}
                            aria-current={active ? 'page' : undefined}
                        >
                            {label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
