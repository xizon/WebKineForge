# Text Shimmer

## Overview

A lightweight inline wrapper that applies the component's animated shimmer treatment to its child content. It accepts arbitrary child content and exposes no other props.

## Examples

### Basic Usage

```tsx
<h2>
    <TextShimmer>Ideas become interfaces.</TextShimmer>
</h2>
```

### Wrap Inline Text

Use it around a phrase inside a paragraph or heading. The component renders a `span`, so place it where phrasing content is valid.

```tsx
<p>
    Built for the web, <TextShimmer>designed to feel alive</TextShimmer>.
</p>
```

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `any` | - | - | Text or inline content displayed with the shimmer effect. |

## Dependencies

- None.
