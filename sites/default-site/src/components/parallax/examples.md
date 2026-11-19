# Parallax

## Overview

A portrait-style section containing a parallax image, overlay, and editorial copy. The image moves vertically in response to the section's scroll progress.

## Examples

### Basic Usage

Effect of the image background.

```tsx
<Parallax
    id="wkf-next-section"
    image="./assets/images/parallax-bg.jpg"
    imageAlt=""
    eyebrow="01 — Portrait"
    title="A long attention span for short, exact interfaces"
    body="People arrive asking for a page. They leave with the system around it: templates, data, deployment, and the small interactions a visitor actually feels. I like work that is quiet in the hand and precise in the code."
    figure="Fig. 01"
/>
```


## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `id` | `string` | `""` | - | HTML `id` of the section, e.g. a scroll target. Not rendered when empty. |
| `image` | `string` | `""` | - | URL/path of the parallax image. The `<img>` is not rendered when empty. |
| `imageAlt` | `string` | `""` | - | Alternative text of the image. Leave empty for decorative images. |
| `eyebrow` | `string` | `""` | - | Small label above the heading. |
| `title` | `string` | `""` | - | Heading text, displayed with the shimmer effect. |
| `body` | `string` | `""` | - | Body paragraph. |
| `figure` | `string` | `""` | - | Decorative figure index, e.g. `Fig. 01`. |

## Dependencies

- `text-shimmer`

## Assets

- Provide the image through `image`. The sample page uses `./assets/images/parallax-bg.jpg`, which is declared in this component's `manifest.json`.
