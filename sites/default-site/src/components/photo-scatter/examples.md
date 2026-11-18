# Photo Scatter

## Overview

Displays a scattered photo board with up to seven positioned tiles. 

## Examples

### Basic Usage

Pass the section copy and three color-placeholder tiles.

```tsx
<PhotoScatter
    title="Simple, enjoy it!"
    description="No React, Vue, or other front-end frameworks required at runtime, and no framework-specific syntax or APIs to learn."
    tiles={[
        { color: '#241c18', depth: 0.55, shift: -0.7, label: 'Image 01' },
        { color: '#102028', depth: 0.22, shift: 0.85, label: 'Image 02' },
        { color: '#2a1822', depth: 0.86, shift: 0.4, label: 'Image 03' },
    ]}
/>
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
| `title` | `string` | `""` | - | Section heading. Not rendered when empty. |
| `description` | `string` | `""` | - | Supporting paragraph next to the heading. Not rendered when empty. |
| `tiles` | `PhotoTile[]` | `[]` | - | Tile data. Each item supports the fields below. |

### PhotoTile

| Field | Type | Default | Required | Description |
|---|---|---|---|---|
| `color` | `string` | - | ✅ | Placeholder background color. |
| `src` | `string` | - | - | Image URL/path. When provided, an image is rendered instead of the color placeholder. |
| `alt` | `string` | `""` | - | Image alternative text. |
| `depth` | `number` | `0.4` | - | Parallax depth stored in `data-parallax`. |
| `shift` | `number` | `0` | - | Horizontal shift stored in `data-shift`. |
| `label` | `string` | - | - | Tile caption. No caption is rendered when omitted. |

## Dependencies

- None.
