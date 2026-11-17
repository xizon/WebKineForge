# Text Reveal

## Overview

A self-contained editorial section with a two-line headline that reveals each line as the heading enters the viewport. The reveal reverses when the heading leaves the observer's active area. The template also uses `TextShimmer` for the supporting statement.

## Examples

### Basic Usage

```tsx
<TextReveal />
```

## API Reference

This component currently has no public props.

## Dependencies

- `text-shimmer` - Supporting animated text.
- `IntersectionObserver` - Triggers and reverses the line reveal; no external animation package is required by the controller.
