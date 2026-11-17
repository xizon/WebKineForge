# Logo

## Overview

Renders the brand mark.

## Examples

### Basic Usage

```tsx
<Logo />
```

### Light Theme

Use `theme="light"` when the logo appears on a light background.

```tsx
<Logo theme="light" />
```

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `theme` | `string` | `undefined` (dark palette) | - | Set to `'light'` to use the light palette. Any other value uses the dark palette. |
| `highlight` | `string` | `rgb(236, 27, 111)` | - | Highlighted parts of the SVG. |
| `link` | `string` | `./samplepage-1.html` | - | Hyperlink for the identifier. |



## Dependencies

- None. The logo is embedded as inline SVG.
