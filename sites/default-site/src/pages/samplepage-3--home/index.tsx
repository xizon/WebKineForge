// Global styles
import '@/styles/tailwind.css';

// Custom styles
import './style.css';

// Components
import SmplePage3Main from '@/components/sample-page-3-main';

export default function HomePage() {
    return (
        <SmplePage3Main
            view="home"
            logoLink="./samplepage-3--home.html"
            logoHighlight="#d6a319"
            nav={[
                { key: 'home', label: 'Home', href: './samplepage-3--home.html' },
                { key: 'works', label: 'Works', href: './samplepage-3--works.html' },
                { key: 'about', label: 'About', href: './samplepage-3--about.html' },
                { key: 'contact', label: 'Contact', href: './samplepage-3--contact.html' },
            ]}
            footer={{
                text: '© 2026 WebKineForge.',
                href: 'https://github.com/xizon/WebKineForge',
            }}
            hero={{
                title: 'WebKineForge',
                subtitle: 'A web creation toolkit for developers.',
            }}
        />
    );
}
