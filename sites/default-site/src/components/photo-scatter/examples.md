# Photo Scatter

## Overview

Displays a scattered photo board with up to seven positioned tiles. Each tile can show an image or a solid-color placeholder and can define its own parallax depth, horizontal shift, and caption.

## Examples

### Basic Usage

When `tiles` is omitted, three color-placeholder tiles are rendered.

```tsx
<PhotoScatter />
```

### Custom Image Tiles

Provide `src` to render an image. `color` remains required for every tile and is used as the placeholder color when `src` is omitted. The layout has seven named positions; additional tiles use the fallback slot.

```tsx
<PhotoScatter
    tiles={[
        {
            color: '#241c18',
            src: './assets/images/photo-01.jpg',
            alt: 'Mountain landscape',
            depth: 0.55,
            shift: -0.7,
            label: 'Mountains',
        },
        {
            color: '#102028',
            src: './assets/images/photo-02.jpg',
            alt: 'Coastline at dusk',
            depth: 0.22,
            shift: 0.85,
            label: 'Coast',
        },
    ]}
/>
```

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `tiles` | `PhotoTile[]` | Three built-in color tiles | - | Tile data. Each item supports the fields below. |

### PhotoTile

| Field | Type | Default | Required | Description |
|---|---|---|---|---|
| `color` | `string` | - | Yes | Placeholder background color. |
| `src` | `string` | - | - | Image URL/path. When provided, an image is rendered instead of the color placeholder. |
| `alt` | `string` | `''` | - | Image alternative text. |
| `depth` | `number` | `0.4` | - | Parallax depth stored in `data-parallax`. |
| `shift` | `number` | `0` | - | Horizontal shift stored in `data-shift`. |
| `label` | `string` | Generated image label | - | Tile caption. |

## Dependencies

- No external package is imported by the template. Parallax behavior is provided by the component controller.
