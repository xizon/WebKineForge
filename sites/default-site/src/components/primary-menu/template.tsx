import './style.css';

type PrimaryMenuProps = {
    theme?: 'light' | 'dark' | string;
};

export function Template({ theme = 'dark' }: PrimaryMenuProps) {
    const links = [
        { href: './samplepage-1.html', page: 'samplepage-1', label: 'Sample Page 1' },
        { href: './samplepage-2.html', page: 'samplepage-2', label: 'Sample Page 2' },
        { href: './samplepage-3--home.html', page: 'samplepage-3', label: 'Sample Page 3', newWindow: true},
        
    ];

    return (
        <nav className={`wkf-primary-menu ${theme === 'light' ? 'is-light' : 'is-dark'}`} >

            <button class="wkf-primary-menu__hamburger" type="button">
                <span class="wkf-hamburger-line"></span>
                <span class="wkf-hamburger-line"></span>
                <span class="wkf-hamburger-line"></span>
            </button>

            <ul className="wkf-primary-menu__list">
                {/* Animated background indicator */}
                <li
                    className="wkf-primary-menu__indicator"
                />

                {links.map(({ href, page, label, newWindow }) => (
                    <li
                        key={page}
                        className="wkf-primary-menu__item"
                    >
                        <a
                            href={href}
                            data-page={page}
                            target={newWindow ? '_blank' : '_self'}
                            className="wkf-primary-menu__link"
                        >
                            {label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}