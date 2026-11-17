/**
 * Shared content for the single-page shell.
 * Used by both the build-time template (template.tsx) and the client controller.
 */

export const NAV = [
    { key: 'home', label: 'Home', href: './samplepage-3--home.html' },
    { key: 'works', label: 'Works', href: './samplepage-3--works.html' },
    { key: 'about', label: 'About', href: './samplepage-3--about.html' },
    { key: 'contact', label: 'Contact', href: './samplepage-3--contact.html' },
] as const;

export type ViewKey = (typeof NAV)[number]['key'];

export const BRAND = 'WebKineForge';
export const REPO_URL = 'https://github.com/xizon/WebKineForge';

export const HERO = {
    title: 'WebKineForge',
    subtitle: 'A web creation toolkit for developers.',
};

/**
 * Works are placeholders: each one is a colour study.
 * `ratio` maps to an aspect-ratio in CSS (a: 4/5, b: 3/4, c: 1/1, d: 5/6, e: 2/3).
 * `motif` picks a decorative pattern in CSS (0..3).
 */
export interface Work {
    title: string;
    kind: string;
    h1: number;
    h2: number;
    angle: number;
    ratio: 'a' | 'b' | 'c' | 'd' | 'e';
    motif: number;
    image?: string;   // optional, e.g. './assets/images/work-01.jpg'
}


export const WORKS: Work[] = [
    { title: 'Product 1', kind: 'UI Design', h1: 212, h2: 268, angle: 160, ratio: 'a', motif: 0, image: '' },
    { title: 'Product 2', kind: 'Web Development', h1: 168, h2: 204, angle: 200, ratio: 'e', motif: 1, image: '' },
    { title: 'Product 3', kind: 'Web Development', h1: 24, h2: 350, angle: 140, ratio: 'c', motif: 2, image: '' },
    { title: 'Product 4', kind: 'UI Design', h1: 48, h2: 12, angle: 175, ratio: 'b', motif: 3, image: '' },
    { title: 'Product 5', kind: 'Web Development', h1: 276, h2: 220, angle: 120, ratio: 'd', motif: 0, image: '' },
    { title: 'Product 6', kind: 'UI Design', h1: 190, h2: 140, angle: 210, ratio: 'a', motif: 2, image: '' },
    { title: 'Product 7', kind: 'Art', h1: 330, h2: 20, angle: 150, ratio: 'e', motif: 1, image: '' },
    { title: 'Product 8', kind: 'UI Design', h1: 150, h2: 186, angle: 185, ratio: 'c', motif: 3, image: '' },
    { title: 'Product 9', kind: 'Art', h1: 38, h2: 300, angle: 130, ratio: 'b', motif: 0, image: '' },
    { title: 'Product 10', kind: 'Art', h1: 232, h2: 196, angle: 195, ratio: 'd', motif: 2, image: '' },
];

export const ABOUT_LINES = [
    'WebKineForge is a web creation toolkit for developers.',
    'Build interactive websites with clean, maintainable HTML and built-in AI Agent support..',
    'No React, Vue, or other front-end frameworks required at runtime, and no framework-specific syntax or APIs to learn. Build reusable components and pages directly with HTML, TypeScript, Tailwind CSS, and vanilla CSS.',
    'The build outputs standalone HTML pages and assets, ready for direct deployment or integration into any tech stack, including PHP, Java, WordPress, and Next.js.',
];

export const CONTACT = {
    title: 'Let’s build something that moves.',
    seal: 'Open for new projects',
    links: [
        { label: 'GitHub', note: 'WebKineForge', href: '#' },
        { label: 'X', note: 'Community Updates', href: '#' },
        { label: 'Email', note: 'Work with me', href: '#' },
    ],
};

const fileOf = (pathname: string) =>
    (pathname.split('/').pop() || '').replace(/\.html?$/i, '').toLowerCase();

/**
 * Maps a URL path to a view key.
 * Matches the file names listed in NAV first, then falls back to
 * "<anything>--<key>" (e.g. samplepage-3--works) or a bare "<key>".
 */
export function viewFromPath(pathname: string): ViewKey | null {
    const file = fileOf(pathname);
    for (const n of NAV) {
        if (fileOf(n.href) === file) return n.key;
    }
    for (const n of NAV) {
        if (file === n.key || file.endsWith(`--${n.key}`)) return n.key;
    }
    return null;
}