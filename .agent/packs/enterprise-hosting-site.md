---
name: enterprise-hosting-site
type: solution
label: Hosting / cloud company site
description: Company or product marketing site for hosting, cloud servers, IDC or SaaS products. Use when the user wants an enterprise or product-promotion site for a technical product. Do not use for personal portfolios, blogs or content-only sites.
tags: [enterprise, hosting, server, cloud, idc, saas, product, company, marketing]
---

# Hosting / cloud company site

## Goal and audience
Within 10 seconds a visitor should understand what is sold, why it is reliable, and how to buy. Visitors are mostly developers, site owners and small-company technical leads: they value trust, specs and price, not decoration.

## Sections

| Section | Content | Visual | Motion / interaction | Component hints |
|---|---|---|---|---|
| Hero | One-line value proposition, primary button (view plans), secondary button (contact), 3 key numbers | Dark background, soft gradient glows, numbers in a monospace font | Numbers count up from 0 once when entering the viewport; background glows drift slowly | hero, stat-counter |
| Features | 4-6 selling points (performance, bandwidth, protection, backup, support), each with an icon and one sentence | Card grid, thin borders, subtle glow on hover | Cards fade in and rise on scroll, staggered by 80ms; border highlights on hover | feature-grid, feature-card |
| Pricing | 3 plans side by side, recommended plan highlighted, spec list | Recommended plan slightly larger with accent border | Lift on hover; monthly/yearly toggle animates the price number smoothly | pricing-cards, billing-toggle |
| Data center (optional) | Locations, network lines, topology | Dark map or wireframe, nodes as accent dots | Nodes pulse in sequence; if the user picked the 3D showcase, a draggable rack model that falls back to a static image on mobile | datacenter-map, model-viewer |
| History | Timeline of founding, milestones, scale figures | Vertical line with dot nodes and years | Line grows with scroll progress; each node lights up when reached | timeline |
| FAQ | 6-8 questions and answers | Accordion list | Smooth height transition; one item open at a time | faq-accordion |
| Contact | Form (name, email, need), contact details, live-chat entry | Continuous with the footer; accent outline on focused inputs | Instant validation messages; submit button has a loading state | contact-form, footer |

Component hints are keywords for `find-component`, not required names.

## Tokens
Default look: dark tech. Put these in the target Site's global styles under `@theme`, and follow the prefix rules in `.agent/knowledge/style-rules.md`.

```css
@theme {
  --color-bg: #0b1020;
  --color-surface: #131a2e;
  --color-border: #243050;
  --color-text: #e6ebf5;
  --color-text-muted: #94a3c0;
  --color-primary: #3b82f6;
  --color-accent: #22d3ee;
  --radius-card: 12px;
  --shadow-glow: 0 0 24px rgba(34, 211, 238, 0.25);
  --font-heading: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --duration-fast: 150ms;
  --duration-base: 400ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Responsive: mobile first; breakpoints 640 / 1024; pricing cards stack vertically on phones with the recommended plan first; body text at least 16px. For CJK sites, add a suitable CJK font to the font stack.

## Variants

| Variant | Changes relative to the default |
|---|---|
| Minimal business | Background `#ffffff`, surface `#f6f8fb`, text `#0f172a`, primary `#1d4ed8`; remove glow shadows and background glows; radius 8px; keep fade-in only |
| Cyberpunk | Background `#07060d`, primary `#ff2bd6`, accent `#00f0ff`; headings in monospace or a sci-fi font; glow blur at most 20px; optional glitch effect on headings, hover only |

## Motion and interaction principles
- Motion serves understanding: numbers appearing, grouping cards, state changes. No decorative endless movement.
- Durations 150-400ms, one shared easing (`--ease-out`); scroll-triggered animations play once per element.
- Respect `prefers-reduced-motion`: turn off movement and scroll animation, keep fades only.
- On mobile, do not load 3D models or heavy effects; use static images.
- All interaction logic lives in a component's `controller.ts`; pages contain no browser code.

## Wizard questions
- **Q1 Style**: "What kind of look do you want?"
  1. Dark tech (recommended): stresses performance and stability; developers read it as professional.
  2. Minimal business: white and clean, more formal, suits enterprise buyers.
  3. Cyberpunk: strong personality, a memorable brand.
  The user may also describe a look in their own words; map it to the closest variant.
- **Q2 Motion level**: "How much animation should the page have?"
  1. Light (recommended): fade-ins and hover feedback; loads fast and feels professional.
  2. Immersive scroll: a continuous storytelling effect from top to bottom; more impact, more work.
  3. With a 3D data-center showcase: a draggable rack model; needs a model file or accepts a placeholder.
- **Q3 Content and language**: "Please give me: company name, main product with 2-3 selling points, plans and prices, contact details. Skip anything you do not have yet and I will leave placeholders. Which language should the website use?"

## Content needed from the user
Company name and one-line intro; 3-6 selling points; plan names, prices and specs; data-center locations (optional); history milestones (optional); FAQ (optional; if missing, generate sample items marked as to be replaced); contact email / phone / address; logo (place in `public/assets/`); site language.

## Rules and acceptance
- Must not invent: prices, availability figures (such as 99.99% uptime), certifications, customer names, data-center addresses. Use obvious placeholders, e.g. `[TO FILL: monthly price]`.
- Must not: mix several accent colors; use body text with contrast below 4.5:1; put browser code in `template.tsx` or in pages.
- Done when: the first screen has a clear primary button; every section has a matching component; no horizontal scroll at phone width; no movement animation under reduced-motion; build and typecheck pass.
