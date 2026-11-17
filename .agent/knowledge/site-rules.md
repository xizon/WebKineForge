# Site rules

## Resolve the target Site first
1. User named a Site -> use it.
2. `sites/` has exactly one Site -> use it.
3. Several Sites and none named -> ask. Never guess.

Directory name = `name` in `site.json` = `name` in `package.json` (kebab-case).

## Scope
- Read/write: target Site's `src/` and `public/`. When the task needs it, also `site.json`, `site.html`, `package.json`.
- Other Sites: read-only. Only their `component-index.json`, `page-index.json`, and the `template.tsx` / `manifest.json` of a component you intend to reuse. To reuse a static asset, you may also list (not read) the source Site's `public/assets/` to get the file's exact path.
- Never hand-edit `component-index.json`, `page-index.json`, `tsconfig.json`, `dist/`.

## site.json
Required: `name`, `version`, `lang`, `title`. Optional: `description`, `author{name,website,email}`, `template`, `paths{src,public,dist}`, `entries{pages,components,styles}`. `paths` and `entries` default to the standard layout and can be omitted.
Page SEO lives in each page's `manifest.json` (`seo`), falling back to Site defaults.

## Tailwind prefix & global styles
- Entry: `src/styles/tailwind.css`, e.g., `@import "tailwindcss" prefix(wkf);` (or `@import "tailwindcss";` when no prefix is configured). **Read it first; never assume a prefix value.**
- Naming split: Tailwind utilities use `prefix:` (e.g., `wkf:flex`); custom classes and IDs use `prefix-` (e.g., `wkf-pricing-cards`). Details in **[style-rules.md](./style-rules.md)**.
- Base styles (`@layer base`) are plain CSS: no prefix. Design tokens go in `@theme` and are used as utilities (prefixed if a prefix is configured, e.g., `wkf:bg-primary`).
- For complete prefix, Tailwind-first, custom class naming, escaping, and isolation rules, see **[style-rules.md](./style-rules.md)**, as well as **[component-rules.md](./component-rules.md)** and **[page-rules.md](./page-rules.md)**.
- Changing a Site's prefix requires updating every template, `style.css`, and `manifest.json` (`bodyClass`) in that Site together. Confirm with the user first.

## site.html (optional HTML shell)
- `site.json` `template` must point to it (`"./site.html"`); fix whichever side is wrong.
- Placeholders: `${lang}` `${title}` `${description}` `${keywords}` `${bodyClass}` `${siteTitle}`.
- Markers: `<!--app-meta-->` `<!--app-canonical-->` `<!--app-styles-->` `<!--app-container-->` `<!--app-scripts-->`.
- Third-party `<script>` tags go **before** `<!--app-scripts-->`.
- Three.js r161+ has no official global build; do not point to a CDN `three.min.js`. Suggest threejs-dist-builder.
- CDN URLs must be real and version-compatible with `package.json`.

## Dependencies and Externals
- Add dependencies only to the target Site's `package.json`, and only when reuse of existing ones is not enough.
- Default: dependencies are bundled. To keep one out of the bundle:
```json
{ "build": { "externals": { "gsap": "gsap", "three": "THREE" } } }
```
- Components still `import` normally. The host HTML must load the script before `<!--app-scripts-->`.
- **Consistency check:** every key in `build.externals` has a matching `<script>` in `site.html` (and vice versa).

## Cross-Site references
See `.agent/skills/reuse-cross-site/SKILL.md`.
