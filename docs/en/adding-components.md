
# 7. Adding Components

[🏠 Back to Main README](../../README.md#table-of-contents)

Each Site can have its own component library. Components live in the Site's `src/components/` directory.

A component directory is recommended to consist of 6 files:

```sh
{your_component}/
├── template.tsx    
├── controller.ts   
├── style.css       
├── index.ts         
├── manifest.json    
└── examples.md   
```

> 💡 The structure below (Template / Controller / Style) is the **strongly recommended** way to organize a component, but it is **not mandatory**. Simple components can skip `style.css` (and `controller.ts`, if static) and use inline styles. See [7.3 Flexible Authoring](#73-flexible-authoring).

## 7.1 Option 1: Create with a Command (Recommended)

Use the CLI command to create a component:

```bash
npm run create:component -- "My Component" --site my-site
```

You can also specify a Tailwind CSS prefix:

```bash
npm run create:component -- "My Component" --site my-site --prefix myprefix
```

The command scaffolds the full three-layer structure. You are free to drop `style.css` (and `controller.ts` for static components) afterwards, as described in [7.3 Flexible Authoring](#73-flexible-authoring).


## 7.2 Option 2: Manual Setup (Advanced)

If you prefer not to use the one-command setup, you can create the files manually. Each section explains the files and key details.

<details>
<summary>👉 [Click to expand]</summary>

### Steps

**1. Create the directory**

Create a new component directory under `sites/{your_site_name}/src/components/`. The directory name uses kebab-case (for example, `pricing-cards`).

```text
sites/{your_site_name}/src/components/{your-component}/
```

**2. Write the style `style.css`**

Use the configured Site prefix followed by a hyphen for custom class names (for example, `wkf-pricing-cards`). Keep the colon form for Tailwind utilities only. See [Style Conventions](./style-conventions.md) for the naming example and selector rules.


```css
.wkf-pricing-cards {
    position: relative;
}

.wkf-pricing-cards__title {
    font-size: 2rem;
}

.wkf-pricing-cards:hover {
    opacity: 0.9;
}
```


**3. Write the template `template.tsx`**


```tsx
import './style.css';

export function Template({
    children,
    customAttr1 = 0.4,
    customAttr2 = '50vh',
}: {
    children?: any;
    customAttr1?: number;
    customAttr2?: number | string;
}) {
    return (
        <div
            className="wkf-pricing-cards"
            data-custom-attr1={customAttr1}
            data-custom-attr2={customAttr2}
        >
            {`<!-- Comment Here -->`}
            {children}
        </div>
    );
}
```

> `wkf-pricing-cards` is a custom class name using the Site prefix. If the Site uses another prefix, replace `wkf` accordingly. See [Style Conventions](./style-conventions.md).

**4. Write the interaction `controller.ts`**

Only handle interaction inside the component's root node, and return a cleanup function that undoes every listener, animation, and observer you created:

```ts
export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;

    const observer = new ResizeObserver(onResize);
    observer.observe(element);

    return () => observer.disconnect(); // Undo everything created above
}
```

**5. Add information `manifest.json`**

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | ✅ | Component name (must match the component directory name) |
| `version` | `string` | - | Component version |
| `type` | `string` | ✅ | Always `"component"` |
| `description` | `string` | - | Description of what the component does |
| `dependencies` | `object` | - | List of JS libraries the component depends on (such as `gsap` and `three`) with their versions |
| `assets` | `string[]` | - | List of static asset paths used by the component (make sure they are copied to the target Site's `public/` at build time) |

```json
{
    "name": "my-component-name",
    "version": "1.0.0",
    "type": "component",
    "description": "Description of the component.",
    "dependencies": {
        "gsap": "^3.15.1",
        "three": "^0.177.0"
    },
    "assets": [
        "./assets/models/test.glb",
        "./assets/images/bg.jpg"
    ]
}
```

**6. Component Entry `index.ts`**

```ts
export { Template as default } from './template';
```

- The component entry exports the template as the default export.
- Component registration is handled automatically.
- The plugin reads `manifest.json` to get the registered component name and automatically detects whether `controller.ts` exists.
- If `controller.ts` exists, its *mount* function is registered as the component controller. Otherwise, a no-op mount function is used, equivalent to `mount(element) { if (element === null) return; return () => {}; }`.


**7. It is recommended to include an example document, `examples.md`.**

> **Purpose**: Automatically discovers all components in development mode, allowing you to instantly preview their usage examples in the browser.

Supported sections include:

| Section | Supported headings |
|---|---|
| Overview | `Overview`, `Introduction`, `Description`, `About`, `Summary`, `Purpose` |
| Examples | `Examples`, `Example`, `Usage`, `Demos`, `Demo`, `Showcase`, `Code Examples`, `Live Examples`, `Use Cases` |
| API Reference | `API Reference`, `API`, `API Docs`, `Props`, `Properties`, `Parameters`, `Parameter` |
| Dependencies | `Dependencies`, `Dependency` |



````markdown
# {Component Name}

## Overview

[Briefly describe what this component does.]

## Examples

### Basic Usage

This example shows the basic usage.

```tsx
<MyComponentName />
```

### Advanced Usage

[Add this section only if the component has advanced usage examples. Write each example as a bare JSX expression in a `tsx` block: no import, no export, no placeholders.]

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `name` | `string` | - | ✅ | Unique identification. |
| `attr` | `number` | `1` | - | Property description. |

[Replace the example parameter above with the actual component parameters.]

## Dependencies

- [Library Name](URL) - Version or usage notes
````

> **Conventions for example code:**
>
> - Use `#` only for the component name.
> - Use `## Overview` only for a general introduction to the component.
> - Use `## Examples` as the entry point for the demo section.
> - Each `###` corresponds to an individual demo.
> - Each `tsx` block is one **bare JSX expression** showing the usage itself: no `import`, no `export`, no function wrapper.
> - Name the component by its **directory name in PascalCase** (for example `pricing-cards` becomes `PricingCards`). Do not invent aliases.
> - Wrap sibling elements in a fragment (`<>...</>`). Do not use `...` or comments as placeholders; give children minimal real content.
> - Only use props the component actually supports.


**8. Use it in a page**

Once the component is created, you can import and use it in any page of the same Site. See [Adding Pages](#8-adding-pages) for the details.

</details>

## 7.3 Flexible Authoring

We **strongly recommend** the three-layer structure (Template / Controller / Style) for components you plan to maintain, reuse across Sites, or let AI Agents work on. It keeps structure, behavior, and style separate, and it is what the CLI generates by default.

But it is a **recommended practice, not a hard rule**. For a small badge, a divider, or a quick prototype, six files can be overkill, so WebKineForge supports lighter forms. Pick the one that fits the component.

<details>
<summary>👉 [Click to expand]</summary>



### What can be dropped, and what must stay

| File | Flexible? | Notes |
| :--- | :--- | :--- |
| `template.tsx` | Required | The component itself. Can hold its styles inline (`style={{ ... }}`) or as Tailwind utilities. Never put browser code here |
| `style.css` | Optional | Replace with `style={{ ... }}` or Tailwind utility classes in the template |
| `controller.ts` | Optional | All browser code lives here. A static component can omit it (see Example 1); anything with interaction keeps it |
| `index.ts` | Keep | Component entry point, so it can be used in pages |
| `manifest.json` | Keep | Name, dependencies, and assets; feeds the component index for reuse and Agents |
| `examples.md` | Keep | Recommended for shared components |

### Example 1: Single file, inline styles (static component)

Only `template.tsx` carries the code. Styles are written as a `style` object directly on the elements, so there is no `style.css`, no `controller.ts`, and no class names to prefix. Remember that the template is rendered on the server at build time, so keep it free of browser code.

```text
promo-badge/
├── template.tsx
├── index.ts
└── manifest.json
```

```tsx
// template.tsx
export function Template({
    text = 'New',
    color = '#ff5a36',
}: {
    text?: string;
    color?: string;
}) {
    return (
        <span
            style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '999px',
                background: color,
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 600,
            }}
        >
            {text}
        </span>
    );
}
```

```ts
// index.ts
export { Template as default } from './template';
```

### Example 2: Interactive component, inline styles, no `style.css`

Styles stay inline in the template, but the interaction logic still lives in `controller.ts`. Do not mix browser code into `template.tsx`: templates are rendered on the server at build time, where `window` and `document` do not exist, so it would fail with errors such as `ReferenceError: document is not defined`.

```text
like-button/
├── template.tsx
├── controller.ts
├── index.ts
└── manifest.json
```

```tsx
// template.tsx
export function Template({ label = 'Likes' }: { label?: string }) {
    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
                type="button"
                style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
            >
                {label}
            </button>
            <span data-count>0</span>
        </div>
    );
}
```

```ts
// controller.ts
export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;

    const button = element.querySelector('button');
    const count = element.querySelector('[data-count]');
    let value = 0;

    const onClick = () => {
        value += 1;
        if (count) count.textContent = String(value);
    };
    button?.addEventListener('click', onClick);

    // Undo everything created above
    return () => button?.removeEventListener('click', onClick);
}
```

```ts
// index.ts
export { Template as default } from './template';
```

### Example 3: Tailwind utilities in the template, no `style.css`

If you prefer utility classes, write them directly in the template. Use the Site's global prefix (default `wkf`, see [9. Global Styles](./global-styles.md)):

```tsx
export function Template({ text = 'New' }: { text?: string }) {
    return (
        <span className="wkf:inline-block wkf:rounded-full wkf:bg-orange-500 wkf:px-3 wkf:py-1 wkf:text-sm wkf:font-semibold wkf:text-white">
            {text}
        </span>
    );
}
```

### Choosing a style

| If the component... | Use |
| :--- | :--- |
| is reused across Sites, is interactive or animated, or will be edited by several people or Agents | **Three-layer** (recommended) |
| is static but needs hover, `@media`, or `@keyframes` | Template + `style.css` |
| is small and static | **Single file** with `style={{ ... }}` or Tailwind utilities |
| is a small interactive widget | Inline styles + a real `controller.ts` |
| is a prototype you may throw away | Inline styles, add `style.css` later if it sticks |

</details>


---


[🏠 Back to Main README](../../README.md#table-of-contents)