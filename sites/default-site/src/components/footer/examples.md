# Footer

## Overview

A full-height footer with a decorative orbit.

## Examples

### Basic Usage

Pass the props from the page.

```tsx
<Footer
    eyebrow="Elsewhere"
    title="UI-First, Always"
    links={[
        { label: 'GitHub', href: 'https://github.com/xizon/WebKineForge' },
        { label: 'Website', href: 'https://uiux.cc' },
    ]}
    copyright="© 2026 WebKineForge."
/>
```

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `eyebrow` | `string` | `""` | - | Small label above the title. Not rendered when empty. |
| `title` | `string` | `""` | - | Main footer headline. Not rendered when empty. |
| `links` | `SiteFooterLink[]` | `[]` | - | Footer links. Each item contains `label: string` and `href: string`. External `http` links open in a new tab. The list is not rendered when empty. |
| `copyright` | `string` | `""` | - | Copyright line shown in the bottom bar. Not rendered when empty. |

## Dependencies

- None.
