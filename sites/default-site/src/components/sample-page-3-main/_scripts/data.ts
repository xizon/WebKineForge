/**
 * Types and routing keys for the single-page shell.
 *
 * This file holds NO copy. All text, links and works are passed in from the
 * page as props (see template.tsx), so the same shell can be reused anywhere.
 * Used by both the build-time template (template.tsx) and the client controller.
 */

/** The four views the shell knows how to render and animate. */
export const VIEW_KEYS = ['home', 'works', 'about', 'contact'] as const;

export type ViewKey = (typeof VIEW_KEYS)[number];

export interface NavItem {
    key: ViewKey;
    label: string;
    href: string;
}

export interface HeroContent {
    title?: string;
    subtitle?: string;
}

/**
 * `ratio` maps to an aspect-ratio in CSS (a: 4/5, b: 3/4, c: 1/1, d: 5/6, e: 2/3).
 * `motif` picks a decorative pattern in CSS (0..3).
 * `h1`, `h2` and `angle` build the colour-study gradient shown until an image is provided.
 */
export interface Work {
    title?: string;
    kind?: string;
    h1: number;
    h2: number;
    angle: number;
    ratio: 'a' | 'b' | 'c' | 'd' | 'e';
    motif: number;
    image?: string;   // optional, e.g. './assets/images/work-01.jpg'
}

export interface AboutContent {
    /** Visually hidden <h1> for screen readers and search engines. */
    title?: string;
    lines?: string[];
}

export interface ContactLink {
    label: string;
    note?: string;
    href: string;
}

export interface ContactContent {
    title?: string;
    /** Text repeated around the rotating seal. */
    seal?: string;
    links?: ContactLink[];
}

export interface FooterContent {
    text?: string;
    href?: string;
}

export interface ViewContent {
    hero?: HeroContent;
    works?: Work[];
    about?: AboutContent;
    contact?: ContactContent;
}

const fileOf = (pathname: string) =>
    (pathname.split('/').pop() || '').replace(/\.html?$/i, '').toLowerCase();

/**
 * Maps a URL path to a view key.
 * Matches "<anything>--<key>" (e.g. samplepage-3--works) or a bare "<key>"
 * (e.g. works.html). Links to any other file name are treated as normal navigation.
 */
export function viewFromPath(pathname: string): ViewKey | null {
    const file = fileOf(pathname);
    for (const key of VIEW_KEYS) {
        if (file === key || file.endsWith(`--${key}`)) return key;
    }
    return null;
}
