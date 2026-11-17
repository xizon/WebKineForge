---
name: find-component
description: Find or reuse an existing component in the target Site (or another Site) before creating a new one.
---

# Find / reuse a component

1. Resolve the target Site (`.agent/knowledge/site-rules.md`).
2. Read **only** `sites/<site>/component-index.json`. Do not browse `src/components/`.
   - Missing or stale -> `npm run build -- <site>`.
3. Match the need against names and descriptions. Prefer, in order:
   1. Use an existing component as-is (props / children).
   2. Extend it if a small, backward-compatible change is enough.
   3. Create a new one (`.agent/skills/create-component/SKILL.md`).
4. For a matching component, read its `manifest.json` and `examples.md` for props and usage. Read `template.tsx` only if needed.
5. Use it in a page: `import X from '@/components/<name>'`, place it in `index.tsx`. `examples.md` shows bare JSX only; the component is named by the PascalCase of its directory name (`scene-item` -> `SceneItem`).
6. Not found in the target Site but maybe elsewhere -> read other Sites' `component-index.json` only, then follow `.agent/skills/reuse-cross-site/SKILL.md`. Confirm with the user before reusing.

Report which component was chosen and why.
