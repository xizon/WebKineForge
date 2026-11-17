# Component Rules

A component directory (kebab-case) in `sites/<site>/src/components/<name>/` contains 6 files in its full form:

```text
template.tsx
controller.ts
style.css
index.ts
manifest.json
examples.md
```

## Authoring forms (strongly recommended default, flexible when requested)

The **full three-layer form** (above; what `create:component` scaffolds) is the default. Keep Template / Controller / Style separated unless a lighter form is explicitly justified below. It is a recommended practice, not a hard rule, and lighter forms are fully supported:

| Form | Files | How |
|---|---|---|
| **Full three-layer** (default) | all 6 | Template / Controller / Style separated |
| **No stylesheet** | omit `style.css` | `template.tsx` has no `import './style.css'`; style with Tailwind utilities and/or inline `style={{ ... }}` (see `style-rules.md` section 8). Keep `controller.ts` if the component has interaction |
| **Static, no controller** | also omit `controller.ts` | Only for components with zero browser behavior. `index.ts` is identical to the other forms; the build uses a no-op mount automatically. |

When to use a lighter form:
- Use one **only when the user asks** for it ("inline styles", "single file", "lightweight"), or when **modifying a component that already uses it**. Preserve an existing component's form; never convert a component between forms unless asked.
- Otherwise use the full form, and especially for components that are interactive, animated, or reused across Sites.
- To grow a lightweight component: add `style.css` and import it in `template.tsx`, or add `controller.ts`.

Always required, in every form: `template.tsx`, `index.ts`, `manifest.json`, `examples.md`. **Browser code never goes in `template.tsx`**: templates are rendered on the server at build time, so `window` / `document` would throw `ReferenceError`. All interaction lives in `controller.ts`.

**Important:** Every component must include complete and accurate documentation in `examples.md`. Creating or modifying component source files must be accompanied by creating or updating the corresponding documentation. Do not consider a component complete until its documentation is also updated.

For complete styling, prefix, naming, escaping, and isolation rules, see **[style-rules.md](./style-rules.md)**. For end-to-end creation and modification steps, see **[create-component/SKILL.md](../skills/create-component/SKILL.md)**.

## template.tsx (Build-time Static HTML)

- Imports `./style.css` (full form; omitted in the no-stylesheet forms).
- Exports `Template` (named export, consumed by `index.ts`).
- Use typed props with defaults.
- Pass configuration to the controller through `data-*` attributes on the root node.
- The root element must exist.
- Comments are written as `{\`<!-- text -->\`}`.
- Accept `children` when the component is a container.
- No browser APIs. No side effects.
- Do not write `data-component` or any mount/registration script: the server injects them.

## controller.ts (Browser)

```ts
export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;

    // Listeners, observers, and animations scoped to `element`

    return () => {
        /* Undo everything */
    };
}
```

- The export must be named `mount`: the build finds and registers it automatically. Do not import it anywhere or call it yourself.
- Only modify or interact with the component's root node and its descendants.
- **Cleanup is mandatory.** It must undo everything created during mounting, including:
  - Event listeners.
  - `ResizeObserver`, `IntersectionObserver`, and `MutationObserver`.
  - Timers and `requestAnimationFrame`.
  - GSAP tweens, ScrollTriggers, and timelines (`kill()` / `revert()`).
  - Three.js geometries, materials, textures, and renderers (`dispose()`).
  - Dynamically added DOM elements.
- The function must be safe to run through mount → cleanup → mount again (e.g. React StrictMode and `export:react`).
- Import libraries as ES modules. External dependencies are handled by the build configuration.

## Styling

All styling rules live in **[style-rules.md](./style-rules.md)**. Component-specific points:
- Custom CSS (if any) lives in `style.css`, imported by `template.tsx`, namespaced with the component name (BEM-style: `__element`, `--modifier`), e.g. `.wkf-pricing-cards__title`.
- Tailwind utilities first; inline `style={{ ... }}` is allowed as described in `style-rules.md` section 8.
- In `controller.ts`, prefer `data-*` hooks or element references over querying prefixed class names.

## index.ts (Component Entry)

```ts
export { Template as default } from './template';
```

- The component entry exports the template as the default export.
- This one line is the whole file, in every form. Do not add `registerComponent`, runtime imports, or other code; do not rename `Template`.
- Component registration and mounting are handled automatically.
- The plugin reads `manifest.json` to get the registered component name and automatically detects whether `controller.ts` exists.
- If `controller.ts` exists, its *mount* function is registered as the component controller. Otherwise, a no-op mount function is used, equivalent to `mount(element) { if (element === null) return; return () => {}; }`.


## manifest.json

| Field | Required | Notes |
|---|---|---|
| `name` | ✅ | Same as directory name |
| `type` | ✅ | Always `"component"` |
| `version` | - | Component version |
| `description` | - | Component description |
| `dependencies` | - | JS libraries used (e.g. `gsap`, `three`) with versions; must exist in the target Site's `package.json` |
| `assets` | - | Static asset paths; files must exist in the Site's `public/` directory |

Write `description` so that `component-index.json` is useful for later component discovery and reuse.

## examples.md (Component Documentation)

**Every component must have a complete `examples.md` file.** This file is the component's usage documentation and must be maintained together with its source code.

### Documentation Requirements

- Create `examples.md` when creating a new component and update it whenever templates, props, behavior, dependencies, or usage change.
- Document the actual implementation. Never invent props, parameters, defaults, features, or dependencies.
- Basic Usage is required; Advanced Usage is optional (include only when genuinely supported).
- API Reference must document all public parameters (or explicitly state none exist).
- Dependencies must reflect actual external libraries in `manifest.json` / `package.json` (do not list built-in browser APIs).
- Use the target Site's actual Tailwind prefix in code examples (do not blindly copy `wkf` if the Site uses another prefix or none).

### Example Code Format

Every ` ```tsx ` block under `## Examples` is **one bare JSX expression**: the usage itself, as it would be written inside a page. Tooling (a component playground, validation) compiles and renders each block, so it must be complete on its own.

- Use `#` only for the component name.
- Use `## Overview` only for a general introduction to the component.
- Use `## Examples` as the entry point for the demo section.
- Each `###` corresponds to an individual demo.
- No `import`, no `export`, no function wrapper, no `return`. Import statements are not needed: the component name tells the reader and the tooling what to import.
- **Name components by their directory name in PascalCase**: `pricing-cards` -> `PricingCards`, `scene-item` -> `SceneItem`, `hero-3d` -> `Hero3D`. Do not invent aliases (no `SiteFooter` for `footer`, no `MyComponent`). Pages may import under any local name; examples always use this one.
- Other components used in the same example follow the same rule and are listed under Dependencies.
- One root element. For sibling roots, wrap them in a fragment: `<>...</>`.
- No placeholders (`...`, `// add here`, `{/* content */}`). Give children minimal real content so the example renders as written.
- Show only the usage. Page structure (`<main>`, other sections) appears only when the example is about it, for example a required sibling target.
- A component's import path is always `@/components/<directory-name>` (cross-Site: `@/site/<site>/components/<directory-name>`); it is not repeated in each example.

### Required Documentation Structure

````markdown
# {Component Name}

## Overview

[Briefly describe what this component does and its main behavior.]

## Examples

### Basic Usage

This example shows the basic usage.

```tsx
<ComponentName title="Hello World">
    <button className="wkf:rounded wkf:px-4 wkf:py-2">Click Me</button>
</ComponentName>
```

### Advanced Usage

[Add this section only if the component has advanced usage examples.]

```tsx
<ComponentName title="Hello World" size="large" />
```

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `name` | `string` | - | ✅ | Unique identification. |
| `attr` | `number` | `1` | - | Property description. |

[Replace the example parameters above with the actual component parameters.]

## Dependencies

- [Library Name](URL) - Version or usage notes
````

## Checklist

### Files & Structure
- [ ] Full form: all 6 files are present. Lightweight form: only `style.css` and/or (static components) `controller.ts` are omitted, the form was requested or already existed, and `template.tsx`, `index.ts`, `manifest.json`, `examples.md` are present.
- [ ] Directory name is kebab-case and matches `manifest.json` `name` (the registered component name comes from it).
- [ ] `index.ts` is exactly `export { Template as default } from './template';`.

### Template & Controller
- [ ] `template.tsx` has a root element, imports `./style.css` (if the component has one), and contains no browser APIs or side effects (it is server-rendered).
- [ ] `controller.ts` (if present) exports `mount` and scopes all DOM queries/mutations to `element` and returns a complete cleanup function (safe for mount → cleanup → mount).

### Styling
- [ ] Follows all rules and checklist items in **[style-rules.md](./style-rules.md)** (Tailwind first, Site prefix verified, component namespace on custom classes, `prefix:` only for Tailwind utilities and `prefix-` for custom classes and IDs (any colon-style custom name escaped), no mixing prefixed/unprefixed custom classes, inline styles only as allowed in section 8).

### Metadata & Documentation
- [ ] Dependencies and assets are declared in `manifest.json` and present in the target Site.
- [ ] `examples.md` follows the required structure and accurately matches the current implementation, props, prefix, and dependencies.
- [ ] Every example is a bare JSX expression following Example Code Format: no `import` / `export` / function wrapper, no `...` placeholders, components named by their PascalCase directory name.
