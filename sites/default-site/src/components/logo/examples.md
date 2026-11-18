# Logo

## Overview

Renders the brand mark as an SVG. 

## Examples

### Basic Usage

Renders the mark without a link.

```tsx
<Logo />
```

### With a Link

```tsx
<Logo link="./samplepage-1.html" />
```

### Light Theme

Use another style via light.

```tsx
<Logo theme="light" link="./samplepage-1.html" />
```

### Custom Highlight and pjax Navigation

Change the highlighted part of the mark, and mark the link with `data-pjax` when it is handled by a pjax-style router.

```tsx
<Logo highlight="#d6a319" link="./samplepage-3--home.html" pjax />
```

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `theme` | `string` | `undefined` (dark palette) | - | Set to `'light'` to use the light palette. Any other value uses the dark palette. |
| `highlight` | `string` | `rgb(236, 27, 111)` | - | Fill color of the highlighted part of the SVG. |
| `link` | `string` | `""` | - | Hyperlink for the mark. When empty, no `href` is rendered. |
| `pjax` | `boolean` | `false` | - | Adds the `data-pjax` attribute to the link so a pjax-style router can handle it. |

## Dependencies

- None.
