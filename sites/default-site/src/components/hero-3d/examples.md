# Hero 3D

## Overview

A full-screen hero section featuring an interactive 3D particle field and an extruded SVG logo. Supports pointer interaction and smooth scrolling to the next section. 

## Examples

### Basic Usage


```tsx
<Hero3D
    eyebrow="Full-stack developer"
    title="I build the product"
    accent="from the pixel to the process."
    description="Interface, application, and infrastructure. Motion belongs to the work, not a coat of paint added at the end."
/>
```

### Provide the Next Section Target

Customize the target section for the scroll interaction by passing a CSS selector through `nextSelector`.

```tsx
<>
  <Hero3D
    eyebrow="Full-stack developer"
    title="I build the product"
    accent="from the pixel to the process."
    description="Interface, application, and infrastructure. Motion belongs to the work, not a coat of paint added at the end."
    nextLabel="Scroll"
    nextSelector="#wkf-next-section"
  />

  <section id="wkf-next-section">
    Next section
  </section>
</>
```

## API Reference

### Props

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `eyebrow` | `string` | `""` | - | Small label above the headline. Not rendered when empty. |
| `title` | `string` | `""` | - | First line of the headline. |
| `accent` | `string` | `""` | - | Second, highlighted line of the headline (rendered as a block below `title`). |
| `description` | `string` | `""` | - | Supporting paragraph below the headline. Not rendered when empty. |
| `nextLabel` | `string` | `""` | - | Text of the scroll button. Not rendered when empty. |
| `nextSelector` | `string` | - | - | CSS selector of the target section to scroll to when the next button is clicked. |

## Dependencies

- `three`
- `gsap`
