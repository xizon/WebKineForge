---
name: personal-portfolio-site
type: solution
label: Personal portfolio page
description: Personal portfolio or introduction page with photo, bio, work showcase and contact details, for designers, developers, photographers and other individuals. Do not use for company sites or product marketing sites.
tags: [personal, portfolio, resume, creative, showcase, profile]
---

# Personal portfolio page

## Goal and audience
Help a visitor remember who the person is, what they do and how good it is, and make contact easy. Visitors are potential employers, clients and peers who judge by work quality and first impression.

## Sections

| Section | Content | Visual | Motion / interaction | Component hints |
|---|---|---|---|---|
| Hero | Name, one-line positioning, personal photo | Lots of white space, photo as the visual center | Name appears letter by letter; photo has a light parallax | hero, portrait |
| About | 100-200 word bio and skill tags | Two columns: text and tags | Fade in on scroll | about, tag-list |
| Works | 6-12 projects with thumbnail, title and category | Grid or masonry | Title and category appear on hover; click opens details (modal or detail page) | project-grid, project-modal |
| Contact | Email, social links, optional form | Simple, large clickable email | Underline animation on link hover | contact, footer |

## Tokens
Default look: minimal and clean. Put these in the target Site's global styles under `@theme`, following `.agent/knowledge/style-rules.md`.

```css
@theme {
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-text: #111111;
  --color-text-muted: #6b7280;
  --color-primary: #111111;
  --color-accent: #4f46e5;
  --radius-card: 8px;
  --font-heading: "Inter", sans-serif;
  --duration-base: 350ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Responsive: mobile first; works grid is 1 column on phones, 2 on tablets, 3 on desktop; photos use `loading="lazy"` and a fixed aspect ratio to avoid layout shift.

## Variants

| Variant | Changes relative to the default |
|---|---|
| Cyberpunk | Dark background `#07060d`, neon accents `#00f0ff` / `#ff2bd6`, glow blur at most 20px, sci-fi heading font |
| Dark and quiet | Near-black background `#0c0c0e`, low-saturation gray text, a single accent color, very little and very slow motion |
| Anime | Bright high-saturation palette, large radius, sticker or outline decorations, bouncy hover motion |
| Creative motion | Oversized typography, cursor-following elements, strong movement and mask animation on work hover |
| Traditional business | White with deep blue, serif or steady sans-serif font, no decoration, fade-in only |

## Motion and interaction principles
- One main interaction per page; do not stack several.
- Durations 200-500ms; respect `prefers-reduced-motion`.
- On mobile, disable cursor-following and 3D; use static replacements.
- Interaction logic lives only in a component's `controller.ts`.

## Wizard questions
- **Q1 Style**: "Which style do you prefer?" Minimal and clean (recommended, the safest choice), Cyberpunk, Dark and quiet, Anime, Creative motion, Traditional business. One plain sentence per option.
- **Q2 Main interaction**: "What kind of main interaction do you want?"
  1. Simple component animations (recommended): fades and hover feedback, light and unobtrusive.
  2. Immersive scroll storytelling: the page tells a story as you scroll.
  3. Multi-page switching without reload: feels like an app.
  4. 3D showcase: 3D for the works or the hero; needs a model file or accepts a placeholder.
  Compatibility notes: "Dark and quiet" does not pair well with strong motion such as "Creative motion"; "Traditional business" does not pair well with 3D. When this happens, tell the user and suggest an alternative; the user decides.
- **Q3 Content and language**: "Please give me: name, one-line positioning, bio, works list (title, one sentence, image path), and contact details. Put your photo in `public/assets/`. Which language should the website use?"

## Content needed from the user
Name, positioning, bio, photo (`public/assets/`), work titles and thumbnails, contact email and social links, site language. Missing items become placeholders; never invent experience, awards or clients.

## Rules and acceptance
- Must not invent experience, awards or client names; must not use images of unknown origin.
- Done when: hero photo and name are clear; the works grid has no horizontal scroll on phones; no movement animation under reduced-motion; build and typecheck pass.
