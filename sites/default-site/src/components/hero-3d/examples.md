# Hero 3D

## Overview

A full-screen hero section featuring an interactive 3D particle field and an extruded SVG logo. Supports pointer interaction and smooth scrolling to the next section.

## Examples

### Basic Usage

A basic full-screen hero section using the default configuration.

```tsx
<Hero3D />
```

### Provide the Next Section Target

Customize the target section for the scroll interaction by passing a CSS selector through `nextSelector`.

```tsx
<>
  <Hero3D nextSelector="#next-section" />

  <section id="next-section">
    Next section
  </section>
</>
```

## API Reference

### Props

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `nextSelector` | `string` | - |  - | CSS selector of the target section to scroll to when the next button is clicked. |

## Dependencies

- `three` - WebGL scene, particle field, and extruded SVG logo.
- `gsap` and `gsap/ScrollTrigger` - Motion and scroll behavior.