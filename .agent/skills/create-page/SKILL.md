---
name: create-page
description: Create or modify a page (single index.tsx entry, style.css, manifest.json) inside the target Site.
---

# Create / modify a page

Read first: `.agent/knowledge/style-rules.md`, `.agent/knowledge/page-rules.md`, `sites/<site>/page-index.json`, and one existing page in the same Site.

## Create
1. Resolve the target Site; read `src/styles/tailwind.css` to check its prefix configuration.
2. Pick components from `component-index.json` (`find-component`). Create missing ones first (`create-component`).
3. Scaffold:
   `npm run create:page -- "My Page" --site <site> [--prefix <prefix>]`
4. Edit `index.tsx`: keep the standard structure (global styles, page style, components, default export). Do not import a runtime or write any mount code: components are registered and mounted automatically. Add component imports and place them in the JSX in order. **Everything lives in this one file.**
5. Edit `style.css` and `manifest.json` (`name`, `type: "page"`, `output`, `bodyClass`, `seo`) following `style-rules.md` and `page-rules.md`. Do not add an `entry` field.
6. Links to other pages: `./<output>.html`; the target must exist in `page-index.json`.

## Modify
- Add/remove/reorder components in `index.tsx`; keep imports and JSX in sync.
- Do not move interaction logic into the page; use components.
- If an old page still has a runtime import or a `typeof window !== 'undefined'` mount block, remove it (mounting is automatic) and tell the user.
- Follow `style-rules.md` and `page-rules.md` for all styling and `bodyClass` updates.
- If an old page still has a separate entry file or a manifest `entry`, merge it into `index.tsx` and remove the field (tell the user).

## Validate

Before building, run the **Quick checks** in `.agent/knowledge/cli.md`.

Verify all items in:
- The **Style Checklist** in `.agent/knowledge/style-rules.md`
- The **Checklist** in `.agent/knowledge/page-rules.md`

Then run `npm run build -- <site>` and `npm run typecheck`. Confirm the page appears in the regenerated `page-index.json` and `dist/<output>`.
