---
name: reuse-cross-site
description: Reuse a component or static asset from another Site via @/site/ references, without copying files.
---

# Reuse across Sites

Read `.agent/knowledge/site-rules.md` first.

## Rules
- Components: `import X from '@/site/<source-site>/components/<component>'`
- Assets: `@/site/<source-site>/assets/<file-path>`, where `<file-path>` is the **full path including every subfolder plus the file name** (`images/parallax-bg.jpg`, not `parallax-bg.jpg`). Import it as a URL, then use it: `import imageUrl from '@/site/<source-site>/assets/images/parallax-bg.jpg';` and `<img src={imageUrl} />`. Do not write the alias directly in `src="..."`.
- **Never copy files. Never modify the source Site.** Confirm with the user before reusing.
- Source Site is read-only: only its `component-index.json`, `page-index.json`, and the `template.tsx` / `manifest.json` of the component being reused. For an asset, only list the source's `public/assets/` to find the exact file path.

## Steps
1. Resolve the target Site (where the work happens) and the source Site.
2. Find the component via the source's `component-index.json`. Verify the asset file exists in the source's `public/assets/` and take its exact subfolder path from there (e.g. `public/assets/images/parallax-bg.jpg` -> `images/parallax-bg.jpg`).
3. Confirm with the user.
4. Run `npm run build -- all` so the `@/site/` path mappings exist, then import it in the target page.
5. Check the component's `dependencies` exist in the **target** Site's `package.json`. Add dependencies to the target Site only. Do not check or copy the reused component's `assets`: they resolve by their paths automatically.
6. **Tailwind prefix check**: Check both Sites' `src/styles/tailwind.css`. When the source Site and target Site have different prefixes, Tailwind utility classes inside the source component's template may not have matching CSS generated in the target Site, whereas custom classes defined in the source component's own `style.css` remain unaffected. Inform the user of this behavior; **never modify the source component** to force-match the target prefix. Styles written as inline `style={{ ... }}` do not depend on generated CSS and are unaffected.
7. Validate: `npm run build -- <target>`, then `npm run typecheck`.

## If the reused component needs changes
Ask the user:
> Modify the source component (every Site that references it will be affected), or create a local variant in the current Site?

Do not decide on your own. A local variant is a new component in the target Site (`create-component`). After modifying a shared source component, also build every Site that references it (or `npm run build -- all`).
