---
name: wizard-generate-site
description: Conversational site/page generation from a vague request. Use when the user describes a website or page goal without specifics (e.g. "make an enterprise site for my hosting product", "build me a personal portfolio"). Matches a solution pack in .agent/packs/, asks at most 3 short questions with recommended defaults, then builds with find-component / create-component / create-page. Do not use when the user already gives exact component or page instructions.
---

# Wizard: generate a site or page from a vague request

Talk to the user in the language they write in. Assume they are not a designer: plain words, a recommended answer for every question, no design jargon.

## 1. Resolve the target Site
Follow the Site-scope rule in `AGENTS.md` (use the named Site; the only Site; otherwise ask). If no Site exists, ask whether to create one (`npm run create:site`, see `.agent/knowledge/cli.md`).

## 2. Match a solution pack
- List `.agent/packs/*.md`, ignoring files that start with `_`.
- Read **only the frontmatter** of each (first ~15 lines, e.g. `head -n 15`). Never read all pack bodies.
- Choose by `description` and `tags`.
  - One clear match: use it.
  - Several plausible: ask one question with at most 3 options.
  - None: say so plainly ("there is no pack for this kind of site yet"), offer the closest one or a generic build without a pack, and continue only if the user agrees. Never pretend a pack fits.

## 3. Read the matched pack in full
Then ask the questions listed in its **向导问题** section:
- One question per message, in the pack's order.
- Infer from the user's first message; skip anything already answered or already decided by the pack.
- Always mark the recommended option and say it can be accepted with "ok" / "you decide".
- Describe each option in one plain sentence (what the visitor will feel or see).
- Free-text answers: map to the closest variant; put the rest in the brief as notes.
- At most 3 questions in total. The content question counts as one.

## 4. Confirm the brief before building
Show: pack, style variant, motion level, the section list (mark which sections have no reusable component and need creating), and which content the user has not provided yet. Wait for a yes.

## 5. Build
1. Write the pack's tokens into the target Site's global styles, following `.agent/knowledge/style-rules.md` (read the prefix from `tailwind.css`).
2. For each section: run `find-component`; reuse if possible, otherwise `create-component`.
3. Assemble with `create-page`.
4. Missing content: use clearly marked placeholders. **Never invent facts** (prices, uptime figures, certifications, customer names, addresses).

Pack rules may narrow looks and interaction only. If a pack conflicts with `AGENTS.md` or `.agent/knowledge/`, the latter wins; tell the user what was skipped.

## 6. Validate and report
Run the validation steps of `create-page`, then `npm run build -- <site>` and `npm run typecheck`. Report: pack used, variant chosen, files changed, components reused vs created, placeholders still to fill, build/typecheck status. Never claim a check that was not run.
