# Primary Menu

## Overview

A compact primary navigation with an animated active/hover indicator. The controller identifies the current page from each link's `data-page` value and responds to pointer, focus, and navigation interactions.


## Examples

### Basic Usage

The default theme is dark. The component currently provides links to the sample pages.

```tsx
<div style={{ background: '#333', position: 'relative', width: '100%', height: '100px' }}>
    <PrimaryMenu 
        style={{ position: 'absolute' }} 
        links={[
            { href: './index.html', page: 'index', label: 'Home', active: true },
            { href: './about.html', page: 'about', label: 'About' },
            {
                href: 'https://github.com',
                page: 'github',
                label: 'GitHub',
                newWindow: true,
            },
        ]}
    />
</div>
```


## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `theme` | `string` | `'dark'` | - | Selects the visual theme. Use `'light'` for the light variant; other values render the dark variant. |
| `links` | `PrimaryMenuLink[]` | `defaultLinks` | - | Defines the navigation items. Each item specifies its destination, page identifier, label, and optional new-window behavior. |
| `className` | `string` | `""` | - | Adds custom CSS classes to the navigation element. |
| `style` | `Record<string, string \| number>` | - | - | Applies custom inline CSS styles to the navigation element. |
| `...props` | `object` | - | - | Accepts additional HTML attributes and forwards them to the root `<nav>` element. |


**PrimaryMenuLink Properties**

| Property | Type | Required | Description |
|---|---|---|---|
| `href` | `string` | ✅ | Destination URL of the link. |
| `page` | `string` | ✅ | Page identifier used by the controller to detect the active page. |
| `label` | `string` | ✅ | Visible link text. |
| `newWindow` | `boolean` | false | Opens the link in a new tab when set to `true`. |
| `active` | `boolean` | - | Sets the navigation item as active by default. |


## Dependencies

- `gsap`