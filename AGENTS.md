# WebKineForge Agent

A static-first toolbox for interactive web pages, built on a multi-Site architecture. TypeScript + TSX (build-time templates only) · Tailwind CSS v4 · Vanilla CSS · native interaction (GSAP / Three.js, etc.).
All detailed development rules live in `.agent/`. Read them on demand through the routing table below; do not read them all.

## Core principles

- Templates output static HTML only: component -> `template.tsx`, page -> the default export of `index.tsx`. Controllers handle browser interaction and animation, and only components have them: `controller.ts` (exports `mount`). A page contains no browser code.
- A page is one `index.tsx` (client + server entry: page HTML structure and component placement) plus `style.css` and `manifest.json`. The page `manifest.json` has no `entry` field.
- Three layers (Template / Controller / Style) are the strongly recommended default, not a hard rule. Lighter forms (no `style.css`, inline `style={{ ... }}`, static component without `controller.ts`) are allowed only as defined in `.agent/knowledge/component-rules.md` (Authoring forms), normally when the user asks or the component already uses one. Browser code never goes in `template.tsx`: it is rendered on the server.
- Registration and mounting are automatic: a component's `index.ts` is only `export { Template as default } from './template';`. The server renders the component, injects `data-component` and the mount script, and uses `controller.ts`'s `mount` if the file exists (otherwise a no-op). Never write `registerComponent`, runtime imports, `data-component` or mount scripts by hand.
- No framework, no hydration. Never access browser APIs in `template.tsx` or `index.tsx` (both are server-rendered); all browser code lives in a component's `controller.ts`.
- Style isolation: Full rules live in `.agent/knowledge/style-rules.md` (single source of truth). Read `prefix(...)` from `src/styles/tailwind.css` (do not add a prefix if unconfigured); default to Tailwind utilities (inline `style={{ ... }}` only as allowed there); namespace custom classes by component or page (`prefix:` is reserved for Tailwind utilities; custom classes and IDs use `prefix-`, e.g. `wkf-pricing-cards`, or unprefixed custom classes without mixing styles in one Site; when a Site prefix is configured, every project-owned ID must use `prefix-` and all references must be updated together; any legacy colon-style custom name must be escaped as `\:` in CSS and `\\:` in JS selector strings); never use CSS Modules or modify third-party library classes.
- Dependencies and reuse: Reuse existing components and dependencies first. Do not install dependencies casually or introduce abstractions for a single component. Configure external dependencies only through the target Site's `package.json` `build.externals`; see `site-rules.md`.

## Site scope

- All websites live in `sites/<site>/`. One task works inside exactly one Site. **Resolve the target Site before doing anything**: use the one the user named; if `sites/` contains only one Site, use it; if there are several and the user did not say which, ask. Never guess. A freshly cloned Site may have no index files and no `tsconfig.json`; run `npm run build -- <site>` once to generate them.
- By default, read and write only the target Site's `src/` and `public/`. When the task requires it, you may also change its `site.json`, `site.html` and `package.json` (prefix, HTML shell, dependencies, Externals). Other Sites are read-only by default, and only their `component-index.json`, `page-index.json`, and the `template.tsx` / `manifest.json` of a component you intend to reuse may be read. To reuse a static asset, you may also list (not read) the source Site's `public/assets/` to get the file's exact path.
- Cross-Site reuse: components via `@/site/<site>/components/<component>`, static assets via `import url from '@/site/<site>/assets/<file-path>'` then `<img src={url} />` (`<file-path>` = full path including subfolders + file name, e.g. `images/bg.jpg`, never the bare file name). Never copy files, never modify the source Site, and confirm with the user before reusing. Details: `.agent/skills/reuse-cross-site/SKILL.md`.
- Never hand-edit build-generated files: `component-index.json`, `page-index.json`, each Site's `tsconfig.json`, and `dist/`.

## Off-limits

- Do not read or modify `core/`, `vite.config.ts`, `runtime/`, the root `package.json`, or the root `tsconfig.json`, unless the user explicitly asks you to change the build system.
- Do not change the existing architecture, registration mechanism, or public APIs on your own initiative.
- Do not crawl the whole project or any `src/components/` directory. To choose a component, read only `sites/<site>/component-index.json`.
- Do not start `dev` / `preview` (long-running processes that occupy port 3000) unless the user asks.

## Task routing

| Task | Read first | Then read |
|---|---|---|
| Find / reuse a component | `.agent/skills/find-component/SKILL.md` | `sites/<site>/component-index.json` |
| Reuse a component / asset across Sites | `.agent/skills/reuse-cross-site/SKILL.md` | `.agent/knowledge/site-rules.md` |
| Create / modify a Component | `.agent/skills/create-component/SKILL.md` | `.agent/knowledge/style-rules.md`, `.agent/knowledge/component-rules.md`, one similar component in the same Site |
| Create / modify a Page | `.agent/skills/create-page/SKILL.md` | `.agent/knowledge/style-rules.md`, `.agent/knowledge/page-rules.md`, `sites/<site>/page-index.json`, one existing page in the same Site |
| Change Site config / `site.html` / global styles / prefix / Externals | `.agent/knowledge/site-rules.md` | `.agent/knowledge/style-rules.md`, the target Site's `site.json` / `site.html` / `package.json` / `src/styles/` |
| Fix an animation problem | The component's `controller.ts` | `.agent/knowledge/component-rules.md` (cleanup rules) |
| Build / create / validate commands | `.agent/knowledge/cli.md` | — |
| Change the build system | Only after explicit user authorization, inspect the build files | `core/`, `vite.config.ts`, `runtime/` |

Project-level constraints: `.agent/knowledge/architecture.md`.

## Workflow

Understand (resolve the target Site, classify the task, read the rules and one similar implementation) → Plan (list the files to change; touch only files inside the target Site) → Implement (scaffold new components and pages with the CLI, see `cli.md`, then edit the content; keep Template / Controller / Style separated by default, see the flexibility rule in Core principles) → Validate.

Validate:
- Paths and names: import/export paths resolve; the component directory name equals the manifest `name` (the build registers components from it); manifest format is valid (a page manifest has no `entry`).
- Pages: every component imported in `index.tsx` is used in its JSX and vice versa; no browser APIs, no runtime import, and no mount code (components are mounted automatically).
- Styles: verify against `.agent/knowledge/style-rules.md` (read active prefix from `tailwind.css`, Tailwind utilities first, component/page namespace on custom classes, `prefix:` only for Tailwind utilities and `prefix-` for custom classes and IDs, consistent prefix usage within the Site).
- Externals: the `build.externals` configuration matches the scripts in `site.html`.
- Components: `template.tsx` contains no browser APIs (server-rendered); `index.ts` is exactly the one-line default re-export of `Template` (same in every form); `controller.ts`, if present, exports `mount`.
- Names: Site directory = `site.json` `name` = `package.json` `name`.
- Run the Quick checks in `.agent/knowledge/cli.md` before building.


Then run `npm run build -- <site>`, followed by `npm run typecheck` (build first, because the cross-Site `@/site/` path mappings are generated by the build).
If you changed a component that other Sites reference, also build the Sites that reference it (or run `npm run build -- all`).
When a build fails, distinguish problems introduced by this change from pre-existing ones. Do not work around failures by editing build configuration.

## Completion report

Briefly state: the target Site, which files changed, what was implemented, whether build and typecheck passed, and any open issues.
Never claim a check was run if it was not actually run.
