// Global styles
import '@/styles/tailwind.css';

// Custom styles
import './style.css';

// Components
import SmplePage3Main from '@/components/sample-page-3-main';

export default function ContactPage() {
    return (
        <SmplePage3Main
            view="contact"
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
            contact={{
                title: 'Let’s build something that moves.',
                seal: 'Open for new projects',
                links: [
                    { label: 'GitHub', note: 'WebKineForge', href: '#' },
                    { label: 'X', note: 'Community Updates', href: '#' },
                    { label: 'Email', note: 'Work with me', href: '#' },
                ],
            }}
        />
    );
}
