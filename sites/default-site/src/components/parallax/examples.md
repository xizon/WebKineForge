# Parallax

## Overview

A portrait-style section containing a parallax image, overlay, and editorial copy. The image moves vertically in response to the section's scroll progress. The current template uses a bundled image path and includes `TextShimmer` for its heading.

## Examples

### Basic Usage

```tsx
<Parallax />
```


## API Reference

This component currently has no public props.

## Dependencies

- `text-shimmer` - Animated heading text.
- `IntersectionObserver` and `requestAnimationFrame` - Visibility and scroll update scheduling; no additional JavaScript package is required by the controller.
