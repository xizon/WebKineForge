# Product Scroll

## Overview

A scroll-driven product-story section with a pinned composition, editorial copy, and decorative rings/object.

## Examples

### Basic Usage

A basic effect.

```tsx
<ProductScroll
    title="Every detail has a"
    accent="purpose."
    description="Bringing static website development back to the joy of creation."
/>
```


## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | `""` | - | Heading text before the emphasized part. |
| `accent` | `string` | `""` | - | Emphasized (`<em>`) part of the heading, displayed after `title`. |
| `description` | `string` | `""` | - | Supporting paragraph below the heading. |

## Dependencies

- `gsap`
