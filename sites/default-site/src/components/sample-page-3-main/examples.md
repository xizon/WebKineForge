# Sample Page 3 Main

## Overview

The site shell for a single-page, pjax-style site. One component holds everything that persists between pages:

- a WebGL stage (Three.js): shader backdrop and the glass shards on Home
- the navigation, footer and small SVG decorations
- a tiny router that fetches the other page files (for example `./samplepage-3--works.html`) and swaps only the page view
- one controller per page view (Home, Works, About, Contact) with enter and leave animations


Every page in `src/pages` renders this component with its own `view`, so each URL is also a complete, crawlable HTML document.

The component contains **no built-in copy**. Navigation, logo link, footer text, hero text, works, About text and Contact links are all passed in as props, and every text field defaults to empty.

Because every page is a complete document, **every page must pass the shell props** (`logoLink`, `logoHighlight`, `nav`, `footer`) so the shared navigation and footer look the same everywhere. Each page only needs to pass the content of **its own view** (`hero`, `works`, `about` or `contact`).

## Examples

### Basic Usage

Valid only when used within a page. With no content props, the shell renders its stage, decorations and an empty view.

`<SamplePage3Main view="works" />`


### Advanced Usage

Add a page: create `src/pages/<name>`, add a matching item to the `nav` prop on every page, add a view in `_scripts/view-templates.tsx`, add its key to `VIEW_KEYS` in `_scripts/data.ts`, and add a controller in `_scripts/view-controllers.ts` (register it in `FACTORIES`).

> **Routing note:** the pjax router recognizes a page by its file name: `<anything>--<key>.html` (for example `samplepage-3--works.html`) or `<key>.html`. A `nav` link to any other file name still works, but is handled as a normal page load instead of a pjax transition.

## API Reference

### Props

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `view` | `'home' \| 'works' \| 'about' \| 'contact'` | `'home'` | - | Which page view the shell renders on first load. |
| `logoLink` | `string` | `""` | - | Link of the logo in the header. No `href` is rendered when empty. |
| `logoHighlight` | `string` | `""` (Logo default color) | - | Highlight color of the logo. When empty, `Logo`'s default is used. |
| `nav` | `NavItem[]` | `[]` | - | Navigation items. Must be passed on every page. |
| `footer` | `FooterContent` | `{}` | - | Footer link. Must be passed on every page. |
| `hero` | `HeroContent` | - | - | Content of the Home view. |
| `works` | `Work[]` | `[]` | - | Content of the Works view. |
| `about` | `AboutContent` | - | - | Content of the About view. |
| `contact` | `ContactContent` | - | - | Content of the Contact view. |

### NavItem

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | `'home' \| 'works' \| 'about' \| 'contact'` | ✅ | View this link belongs to. Also used to highlight the active link. |
| `label` | `string` | ✅ | Visible link text. |
| `href` | `string` | ✅ | Page URL, e.g. `./samplepage-3--works.html`. |

### FooterContent

| Field | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | `undefined` | Footer text. The footer link is not rendered when empty. |
| `href` | `string` | `undefined` | Footer link target. When set, the link opens in a new tab. |

### HeroContent

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `""` | Large animated title. |
| `subtitle` | `string` | `""` | Line below the title. |

### Work

| Field | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | `""` | - | Work title. |
| `kind` | `string` | `""` | - | Work category label. |
| `h1` | `number` | - | ✅ | Start hue of the placeholder gradient. |
| `h2` | `number` | - | ✅ | End hue of the placeholder gradient. |
| `angle` | `number` | - | ✅ | Gradient angle in degrees. |
| `ratio` | `'a' \| 'b' \| 'c' \| 'd' \| 'e'` | - | ✅ | Aspect ratio: a = 4/5, b = 3/4, c = 1/1, d = 5/6, e = 2/3. |
| `motif` | `number` | - | ✅ | Decorative pattern, `0` to `3`. |
| `image` | `string` | `""` | - | Optional image URL/path, e.g. `./assets/images/work-01.jpg`. Replaces the motif when set. |

### AboutContent

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `""` | Visually hidden `<h1>` for screen readers and search engines. |
| `lines` | `string[]` | `[]` | Paragraphs that resolve out of noise, one after another. |

### ContactContent

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `""` | Large headline revealed word by word. |
| `seal` | `string` | `""` | Text repeated around the rotating seal. The ring text is not rendered when empty. |
| `links` | `ContactLink[]` | `[]` | Contact links. Each has `label: string`, `note?: string` and `href: string`. `mailto:` links open in the same tab; other links open in a new tab. |

## Files

| File | Role |
|---|---|
| `template.tsx` | Shell markup (stage, bar, nav, footer, decorations). |
| `_scripts/view-templates.tsx` | Markup of the four page views. Renders content passed from props. |
| `_scripts/data.ts` | View keys, prop types, and the path-to-view helper. Contains no copy. |
| `controller.ts` | Mounts once: fonts, stage, nav marker, router. |
| `_scripts/router.ts` | pjax: fetch, swap, history, fallback to normal navigation. |
| `_scripts/view-controllers.ts` | Enter and leave choreography per view. |
| `_scripts/scene.ts` | Three.js stage (lazy-loaded chunk). |
| `_scripts/shapes.ts` | Gear, hammer, skull, book and bolt silhouettes. |

## Dependencies

- `three`
- `gsap`
- `logo`
