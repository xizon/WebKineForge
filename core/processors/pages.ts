/**
 * Discover Pages
 */

import type { 
    PageDefinition,
} from '../utils/types.ts';

export { discoverPages } from '../discovery/pages.ts';


/**
 * Find a page by slug.
 */
export function findPage(
    pages: PageDefinition[],
    slug: string
): PageDefinition | undefined {
    return pages.find((page) => page.slug === slug);
}