# Sample Page 3 Main

## Overview

The site shell for a single-page, pjax-style site. One component holds everything that
persists between pages:

- a WebGL stage (Three.js): shader backdrop and the glass shards on Home
- the navigation, footer and small SVG decorations
- a tiny router that fetches `./samplepage-3--works.html` and friends and swaps only the page view
- one controller per page view (Home, Works, About, Contact) with enter and leave animations

Every page in `src/pages` renders this component with its own `view`, so each URL is
also a complete, crawlable HTML document.

## Examples

### Basic Usage

Valid only when used within a page.

`<SamplePage3Main view="works" />`


### Advanced Usage

Add a page: create `src/pages/<name>`, add it to `NAV` in `_scripts/data.ts`, add a view in
`_scripts/view-templates.tsx` and a controller in `_scripts/view-controllers.ts` (register it in `FACTORIES`).



## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `view` | `'home' \| 'works' \| 'about' \| 'contact'` | `'home'` | - | Which page view the shell renders on first load. |

## Files

| File | Role |
|---|---|
| `template.tsx` | Shell markup (stage, bar, nav, footer, decorations). |
| `view-templates.tsx` | Markup of the four page views. |
| `data.ts` | Navigation, works, About copy and Contact links. |
| `controller.ts` | Mounts once: fonts, stage, nav marker, router. |
| `router.ts` | pjax: fetch, swap, history, fallback to normal navigation. |
| `view-controllers.ts` | Enter and leave choreography per view. |
| `scene.ts` | Three.js stage (lazy-loaded chunk). |
| `shapes.ts` | Gear, hammer, skull, book and bolt silhouettes. |

## Dependencies

- `three`
- `gsap`
