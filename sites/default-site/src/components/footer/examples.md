# Site Footer

## Overview

A full-height footer with a decorative orbit, configurable external or internal links, and a copyright line.

## Examples

### Basic Usage

`links` is optional. When omitted, the component displays the GitHub and Website links defined by the component.

```tsx
<Footer />
```

### Custom Links

Pass a `links` array to replace the default links. Each item requires a visible `label` and an `href`.

```tsx
<Footer
    links={[
        { label: 'About', href: './about.html' },
        { label: 'GitHub', href: 'https://github.com/xizon/WebKineForge' },
    ]}
/>
```

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `links` | `SiteFooterLink[]` | GitHub and Website links | - | Footer links. Each item contains `label: string` and `href: string`. External `http` links open in a new tab. |

## Dependencies

- None. Visual effects use CSS animations.
