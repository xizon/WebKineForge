/**
 * HTML beautifier
 */
import prettierSync from '@prettier/sync';

// @prettier/sync is a CommonJS package, so `format` is taken from the default export
const { format } = prettierSync;

export interface FormatHtmlOptions {
    /** Spaces per indentation level. Default: 4 */
    tabWidth?: number;
    /** Maximum line width. Default: 120 */
    printWidth?: number;
    /**
     * Whitespace sensitivity:
     * - 'css' (default): never changes how the page renders; adjacent inline
     *   elements may be hugged like `</a\n><a`
     * - 'ignore': tidiest output, but inline text may be split across lines,
     *   which can add visible spaces in the browser
     */
    whitespace?: 'css' | 'strict' | 'ignore';
}

/**
 * Formats an HTML document or fragment. The result has no trailing newline.
 * Do not re-indent the returned string by hand: that would corrupt the
 * content of <pre> / <textarea>.
 */
export function formatHtml(html: string, options: FormatHtmlOptions = {}): string {
    if (!html.trim()) return '';

    const out = format(html, {
        parser: 'html',
        tabWidth: options.tabWidth ?? 4,
        printWidth: options.printWidth ?? 120,
        htmlWhitespaceSensitivity: options.whitespace ?? 'css',
    }).trimEnd();

    return out;
}

/* -------------------------------------------------------------------------- */
/* HTML comment support                                                         */
/* -------------------------------------------------------------------------- */

const ENTITIES: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#60;': '<',
    '&#62;': '>',
    '&#x3c;': '<',
    '&#x3e;': '>',
};

// Opening "<" is always escaped by the renderer. The closing ">" is escaped by
// some renderers (React) and left as-is by others, so both forms are accepted.
const ESCAPED_COMMENT = /&(?:lt|#60|#x3c);!--([\s\S]*?)--(?:&(?:gt|#62|#x3e);|>)/gi;

/**
 * When TSX contains {`<!-- Primary Menu -->`}, the renderer escapes the text to
 * `&lt;!-- Primary Menu --&gt;` (or `&lt;!-- Primary Menu -->` when the renderer
 * leaves ">" alone). This turns it back into a real HTML comment.
 *
 * Note: a JSX comment like {/* ... *\/} is a JS comment that is dropped at
 * compile time, so it cannot be restored.
 * Also, text that is meant to show a literal "<!-- xx -->" on the page will be
 * turned into a comment too. That is rare; use &amp;lt; style escaping to avoid it.
 */
export function restoreComments(html: string): string {
    return html.replace(ESCAPED_COMMENT, (_match, inner: string) => {
        const text = inner
            .replace(/&(?:amp|lt|gt|quot|#39|#x27|#60|#62|#x3c|#x3e);/gi, (e) => ENTITIES[e.toLowerCase()] ?? e)
            .replace(/-{2,}/g, '-') // "--" is not allowed inside an HTML comment
            .trim();
        return text ? `<!-- ${text} -->` : '';
    });
}