# .agent/packs: solution packs

One file = one complete, ready-to-build solution: site type + sections + style + motion + interaction + wizard questions.
The wizard (`.agent/skills/wizard-generate-site/SKILL.md`) finds a pack through its frontmatter, so **the `description` line decides whether your pack is ever matched.**

## Language
Write packs in English only. The wizard translates questions for users on the fly. Do not add per-language copies.

## Add a pack
1. Copy `_template.md` to `<your-pack-name>.md` (lowercase, hyphens). Files starting with `_` are ignored by the wizard.
2. Fill the frontmatter. `description` = what it is + when to use + when NOT to use, in 1-2 sentences. `tags` = short lowercase keywords.
3. Fill the body. Keep the section headings exactly as in the template; the wizard looks for them. Write style, motion and interaction **per section** (they are hard to separate; do not force them into separate lists).
4. Test with one vague sentence, in English and in another language you care about, e.g. "make a company site for ...". Check: is the pack matched? Are the questions understandable to a non-designer?

## Rules
- Packs may narrow looks and interaction. They must not change architecture, registration, CLI usage or style-isolation rules (`.agent/knowledge/` wins).
- Never put real customer data, keys or personal info in a pack.
- Placeholders in a pack must be language-neutral templates (e.g. `[TO FILL: price]`); the wizard renders them in the site language.
- A pack that outgrows one file (> ~300 lines) can become a folder `<name>/PACK.md` plus extra files. Do that only when you actually hit the limit.
