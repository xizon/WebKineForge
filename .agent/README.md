# .agent: WebKineForge Agent Knowledge Pack

Development handbook for AI agents (Cursor, Codex, Claude Code, etc.).
Humans only need to describe tasks in plain language. Agents do not need to read this file at runtime; it explains how the pack is organized and how to maintain it.

## How it works

```
User request
   │
   ▼
AGENTS.md (project root, auto-loaded by the tool, kept short, routing only)
   │  routes by task type
   ▼
.agent/skills/<task>/SKILL.md      ← HOW to do this kind of task (step list)
   │  references
   ▼
.agent/knowledge/*.md              ← WHAT the rules are (read only when needed)

npm run create:component / create:page   ← scaffolds the starting files (CLI), then the agent edits them
```

Principles:

1. **Only `AGENTS.md` is auto-loaded.** Files in `.agent/` take effect only when `AGENTS.md` points to them.
2. **Progressive loading.** A small entry file, detailed rules in separate files. The agent reads only what the current task needs.
3. **Rules and steps are separate.** `knowledge/` holds facts and constraints, `skills/` holds procedures. Each fact lives in one place where practical; skills point to the rule instead of repeating it.
4. **Scaffold with the CLI, then edit.** Starting files come from the project's `create:*` commands. The pack documents the structure the result must have (for example the page `index.tsx` layout and the one-line component `index.ts`); it is a rule to check against, not a skeleton to hand-copy. If the CLI output and these rules ever diverge, fix them together (see Maintenance).
5. **One Site per task.** Every task resolves a target Site first and stays inside it. Other Sites are read-only and only reachable through the documented reuse path.

## Directory

| Path | Purpose |
| :--- | :--- |
| `knowledge/architecture.md` | Project model, Site directory map, template vs browser (controller) layers, automatic registration and mounting, three layers as recommended default, single-file page, hard rules, protected and generated files |
| `knowledge/style-rules.md` | **Single source of truth for styling**: reading `prefix(...)` (including unconfigured), Tailwind-first rule, custom class naming & namespacing, three-way syntax table, CSS/JS escaping, isolation, `bodyClass`, inline `style={{ ... }}` rules, style checklist |
| `knowledge/site-rules.md` | Access scope, `site.json`, Tailwind prefix summary & pointer, `site.html`, External dependencies, cross-Site reuse pointer |
| `knowledge/component-rules.md` | The six component files, **authoring forms (full three-layer default, lighter forms when requested)**, controller cleanup, component-specific styling highlights, manifest fields, `examples.md` documentation rules, checklist |
| `knowledge/page-rules.md` | The three page files, the single `index.tsx` entry and its required structure, page-specific styling highlights, manifest and SEO fields (`bodyClass`, no `entry`), checklist |
| `knowledge/cli.md` | Build, typecheck and create commands, single vs multi-Site usage, failure handling |
| `skills/find-component/` | Find reusable components (indexes only), locally then across Sites |
| `skills/reuse-cross-site/` | Use another Site's component or asset through `@/site/` |
| `skills/create-component/` | Create or modify a component, end to end |
| `skills/create-page/` | Create or modify a page, end to end |

## Wiring into AGENTS.md

The root `AGENTS.md` routes to these files. Claude Code reads `CLAUDE.md` instead of `AGENTS.md`: create a root `CLAUDE.md` containing the single line `@AGENTS.md`.

If this directory conflicts with `AGENTS.md`, `AGENTS.md` wins.

## Paths and commands this pack assumes

Check these when the project layout changes:

- Sites live in `sites/<site>/`. The directory name, `name` in that Site's `site.json`, and `name` in that Site's `package.json` must all be identical.
- Per-Site generated files: `component-index.json`, `page-index.json`, `tsconfig.json`, `dist/`. All are produced by `npm run build -- <site>`.
- Component directory: `sites/<site>/src/components/<name>/` with `template.tsx`, `controller.ts` (exports `mount`), `style.css`, `index.ts` (always the one line `export { Template as default } from './template';`), `manifest.json`, `examples.md` (full form; `style.css` and, for static components, `controller.ts` may be omitted in the lighter forms of `component-rules.md`). Browser code never goes in `template.tsx`: it is server-rendered.
- Page directory: `sites/<site>/src/pages/<name>/` with `index.tsx`, `style.css`, `manifest.json`. `index.tsx` is both the server and the client entry (page HTML structure and component placement only). It contains no browser code: components are registered and mounted automatically. The page `manifest.json` has no `entry` field.
- Path aliases: `@/` = the current Site's `src/`; `@/site/<site>/components/<component>` and `@/site/<site>/assets/<file-path>` (imported as a URL; `<file-path>` is the full path with subfolders + file name, as the file lives in the source Site's `public/assets/`) = cross-Site reuse
- Static assets live under the Site's `public/`. Paths in a component manifest's `assets` are relative to `public/` (for example `./assets/models/test.glb`).
- Style isolation: `.agent/knowledge/style-rules.md` is the single source of truth. Read the target Site's `src/styles/tailwind.css` for `prefix(...)` (default `wkf`, or none if unconfigured); default to Tailwind utilities; namespace custom classes with the component or page name (Tailwind utilities use `prefix:`, e.g. `wkf:flex`; custom classes and IDs use `prefix-`, e.g. `.wkf-pricing-cards`, which needs no escaping; a colon-style custom name must be escaped as `.wkf\:pricing-cards` in CSS and `'.wkf\\:pricing-cards'` in JS selector strings; unprefixed custom classes like `.my-pricing-cards` are also allowed without mixing styles in the same Site); never use CSS Modules or alter third-party library classes.
- External dependencies: configured per Site in `package.json` under `build.externals` (`"<npm package>": "<global variable>"`); the host page (including `dev` / `preview`) must load the scripts, typically through `site.html`.
- Protected: `core/`, `vite.config.ts`, `runtime/`, root `package.json`, root `tsconfig.json`.
- Commands:
  - `npm run build -- <site|all>`, `npm run typecheck`
  - `npm run create:site -- <site> [--prefix <p>]`
  - `npm run create:component -- "<Name>" --site <site> [--prefix <p>]`
  - `npm run create:page -- "<Name>" --site <site> [--prefix <p>]`
  - `npm run export:react -- <site|all>` (only when the user asks for a React export)
  - `dev` and `preview` use port 3000, one Site at a time; agents do not start them unless asked.

## Maintenance

- Rule changes: edit `knowledge/` only. Do not copy rules into skills.
- Procedure changes: edit the matching `skills/*/SKILL.md` only.
- Scaffold changes (files generated by `create:*`): change the CLI, then re-check `knowledge/component-rules.md`, `knowledge/page-rules.md` and the two create skills against its output.
- **`examples.md` format** (bare JSX examples named by the PascalCase directory name, no `import` / `export`) lives in `knowledge/component-rules.md` only (Example Code Format). Mirror changes in `docs/*/adding-components.md` (step on `examples.md`) and in the file that `create:component` scaffolds, then migrate existing components.
- When the product README changes (new CLI flags, new alias, new manifest field, new build option, new class or prefix convention), update `knowledge/` first, then check that skills and `AGENTS.md` still agree.
- **Authoring forms** (three-layer default vs lighter forms) live in `knowledge/component-rules.md` only. The product docs mirror them in `docs/*/system-architecture.md` (2.3) and `docs/*/adding-components.md` (7.3): when one changes, update the others. `AGENTS.md` keeps a one-line pointer.
- **Single source of truth for style rules**: All styling rules live in `knowledge/style-rules.md` (edit only this file when style conventions change). `AGENTS.md`, `.agent/README.md`, `site-rules.md`, `component-rules.md`, and `page-rules.md` keep only brief summaries pointing to `style-rules.md`, and skills reference it without duplicating rules.
