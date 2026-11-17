
# 9. Global Styles

[🏠 Back to Main README](../../README.md#table-of-contents)


WebKineForge uses Tailwind CSS v4 to manage global styles with a custom prefix (default `wkf`) to avoid naming collisions with external styles and host pages. Each Site has its own global styles stored in `src/styles/`. Entry file: `sites/{your_site_name}/src/styles/tailwind.css`.

## 9.1 Global Entry

Import Tailwind CSS in `tailwind.css`:

```css
@import "tailwindcss" prefix(wkf);
```

To change the prefix, for example to `app`, adjust it to:

```css
@import "tailwindcss" prefix(app);
```

Note: the prefix configured in the CSS entry must match the prefix used in page and component templates.

## 9.2 Using Prefixed Utility Classes

Once a custom prefix is enabled, Tailwind CSS utility classes need the prefix added in front of the original class name, separated by a colon.

For example, with the default `wkf` prefix:

```tsx
export default function Example() {
    return (
        <section className="wkf:bg-primary wkf:text-white wkf:p-8">
            <h1 className="wkf:font-display wkf:text-4xl">
                Hello World
            </h1>
        </section>
    );
}
```

<details>
<summary>👉 [Click to expand]</summary>

| Original utility class | With the prefix |
|---|---|
| `flex` | `wkf:flex` |
| `grid` | `wkf:grid` |
| `bg-primary` | `wkf:bg-primary` |
| `text-white` | `wkf:text-white` |
| `p-8` | `wkf:p-8` |
| `md:flex` | `wkf:md:flex` |
| `max-[760px]:grid-cols-1` | `wkf:max-[760px]:grid-cols-1` |

</details>

Note that the prefix must come before all responsive variants, state variants, and other variants.

> Use the colon prefix for Tailwind utilities and the hyphen prefix for custom classes and IDs. See [Style Conventions](./style-conventions.md) for the concise naming guide.

## 9.3 Defining Base Styles

<details>
<summary>👉 [Click to expand]</summary>

You can define the website's base styles with `@layer base`:

```css
@layer base {
    body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #ffffff;
        color: #111111;
    }
}
```

Base styles are Vanilla CSS and do not need the Tailwind prefix.

</details>

## 9.4 Defining Design Tokens

<details>
<summary>👉 [Click to expand]</summary>

Use Tailwind CSS v4's `@theme` to define design tokens:

```css
@theme {
    --color-primary: #2563eb;
    --color-secondary: #64748b;
    --font-display: "Inter", sans-serif;
}
```

For example, with the default `wkf` prefix:

```tsx
<section className="wkf:bg-primary wkf:text-secondary wkf:font-display">
    Hello World
</section>
```

</details>

## 9.5 Importing Global Styles in a Page

Import global styles in `index.tsx`:

```tsx
import '@/styles/tailwind.css';
```

The `@` alias here points to the `src/` directory of the current site.

Once imported, page and component templates can use configured Tailwind CSS utility classes directly.


---


[🏠 Back to Main README](../../README.md#table-of-contents)