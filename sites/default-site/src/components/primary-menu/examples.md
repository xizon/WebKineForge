# Primary Menu

## Overview

A compact primary navigation with an animated active/hover indicator. The controller identifies the current page from each link's `data-page` value and responds to pointer, focus, and navigation interactions.

## Examples

### Basic Usage

The default theme is dark. The component currently provides links to the two sample pages.

```tsx
<PrimaryMenu />
```

### Light Theme

Set `theme` to `light` when the menu is placed on a light surface.

```tsx
<PrimaryMenu theme="light" />
```

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `theme` | `string` | `'dark'` | - | Selects the visual theme. Use `'light'` for the light variant; other values render the dark variant. |

## Dependencies

- `gsap` - Animates the navigation indicator.
