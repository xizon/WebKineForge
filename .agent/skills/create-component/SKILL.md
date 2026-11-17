---
name: create-component
description: Create or modify a component (template, controller, style, registration, manifest, examples) inside the target Site.
---

# Create / modify a component

Read first: `.agent/knowledge/style-rules.md` and `.agent/knowledge/component-rules.md` (including **Authoring forms**), then inspect one similar component in the same Site (found via `component-index.json`; see `find-component`).

Follow all component implementation, styling, and documentation requirements defined in `style-rules.md` and `component-rules.md`.

## Create

1. Resolve the target Site and read `src/styles/tailwind.css` to identify its configured Tailwind CSS prefix (or verify that no prefix is configured). Never assume its value.

2. Confirm that no existing component already provides the required functionality (`find-component`).

3. Scaffold the component:

   ```bash
   npm run create:component -- "My Component" --site <site> [--prefix <prefix>]
   ```

4. Edit the generated files. Preserve the generated structure (full three-layer form) and follow `style-rules.md` and `component-rules.md`. Use a lighter form (no `style.css`, or a static component without `controller.ts`) **only if the user asked for it**, exactly as defined in `component-rules.md`:

   - `template.tsx`:
     - Define the static HTML structure and import `./style.css`.
     - Map component props to appropriate HTML attributes or `data-*` attributes.
     - Do not use browser APIs or introduce runtime side effects (templates are server-rendered).
     - Follow `style-rules.md` for Tailwind utilities and custom class names.

   - `controller.ts`:
     - Implement browser-side behavior by exporting `mount(element)` (found and mounted automatically; never call it yourself).
     - Prefer `data-*` hooks or element references over querying prefixed class names.
     - Provide complete cleanup for all resources created or managed by the component (`component-rules.md`).

   - `style.css`:
     - Define component-scoped styles following `style-rules.md` (component namespace, `prefix-` for custom classes and IDs and `prefix:` only for Tailwind utilities, escaping any colon-style custom name, consistent prefix convention).

   - `manifest.json`:
     - Set `name` to the component directory name and `type` to `"component"`.
     - Provide an accurate description, dependencies, and assets.

   - `index.ts`:
     - Keep exactly `export { Template as default } from './template';`. Registration and mounting are automatic; add no `registerComponent`, runtime import, or other code.

   - `examples.md`:
     - Create complete component documentation following the required structure in `component-rules.md`.
     - Include an overview, valid usage examples, an accurate API reference, and dependencies matching the actual implementation and Site prefix.
     - Write each example as a bare JSX expression (no `import`, no `export`, no function wrapper, no `...` placeholders) and name components by their PascalCase directory name, per Example Code Format in `component-rules.md`.

   **Documentation is a required part of component creation.** Do not consider the component complete until `examples.md` has been written and verified against the actual implementation.

5. Dependencies:

   - Reuse dependencies already available in the target Site whenever possible.
   - Add dependencies to the Site's `package.json` only when required (`site-rules.md`).
   - Keep `manifest.json`, the Site's `package.json`, and `examples.md` consistent with the actual dependencies.

6. Using the component in a page: see `create-page`.

## Modify

- Inspect the existing component implementation and its `examples.md` before making changes.
- Preserve the component's existing form (full or lightweight). Do not add or remove `style.css` / `controller.ts` unless the user asks.
- Read the target Site's `src/styles/tailwind.css` to confirm its configured prefix.
- Keep public props backward compatible whenever possible.
- Whenever the component's template, public props, default values, behavior, usage, or dependencies change, update `examples.md` and `manifest.json` accordingly.
- If an existing `examples.md` still uses `import` / `export` or `...` placeholders, rewrite its examples to the bare JSX form in `component-rules.md` while you are editing it.
- If public props or component behavior change, inspect and update any pages that use the component.
- Follow `style-rules.md` and `component-rules.md` for all style and class updates.
- Animation problems: start with `controller.ts` and follow the cleanup rules in `component-rules.md`.
- If other Sites reference the component, build those Sites too:

  ```bash
  npm run build -- all
  ```

## Validate

Before building, run the **Quick checks** in `.agent/knowledge/cli.md`.

Before considering the task complete, verify all items in:
- The **Style Checklist** in `.agent/knowledge/style-rules.md`
- The **Checklist** in `.agent/knowledge/component-rules.md`


Then run:

```bash
npm run build -- <site>
npm run typecheck
```

Resolve any errors before reporting the task as complete.

If other Sites reference a modified component, also run:

```bash
npm run build -- all
```

Only report the component task as complete after the implementation, documentation, and required validation steps are finished.
