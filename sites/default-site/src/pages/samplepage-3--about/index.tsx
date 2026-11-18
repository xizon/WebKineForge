// Global styles
import '@/styles/tailwind.css';

// Custom styles
import './style.css';

// Components
import SmplePage3Main from '@/components/sample-page-3-main';

export default function AboutPage() {
    return (
        <SmplePage3Main
            view="about"
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
            about={{
                title: 'About WebKineForge',
                lines: [
                    'WebKineForge is a web creation toolkit for developers.',
                    'Build interactive websites with clean, maintainable HTML and built-in AI Agent support..',
                    'No React, Vue, or other front-end frameworks required at runtime, and no framework-specific syntax or APIs to learn. Build reusable components and pages directly with HTML, TypeScript, Tailwind CSS, and vanilla CSS.',
                    'The build outputs standalone HTML pages and assets, ready for direct deployment or integration into any tech stack, including PHP, Java, WordPress, and Next.js.',
                ],
            }}
        />
    );
}
