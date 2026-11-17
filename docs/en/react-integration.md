
# 12. Using Components with React

[🏠 Back to Main README](../../README.md#table-of-contents)


Components in a Site can be reused in a standalone React project. Depending on your needs, choose one of the following two options:

The examples use `my-component1`.

## 12.1 Option 1: Export with a Command (Recommended)

If there is only one Site:
```bash
npm run export:react
```

Specify a Site:
```bash
npm run export:react -- {your_site_name}
```

Export all Sites:
```bash
npm run export:react -- all
```

## 12.2 Option 2: Adapt Manually into a React Component (Advanced)

<details>
<summary>👉 [Click to expand]</summary>

If you want a component to integrate more naturally into a React project, you can reuse only the original component’s interaction logic and styles, while rewriting `template.tsx` as a React component.

### Steps

1. Copy `controller.ts` and `style.css`.
2. Rewrite `template.tsx` as a React component:

Import `controller.ts`, add a `ref` to the root node while preserving the existing `className`, and call `mount` within a `useEffect` hook:

```tsx
import { useEffect, useRef } from 'react';
import { mount } from './controller';
import './style.css';

export function Template() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cleanup = mount(ref.current);
        return () => {
            cleanup?.();
        };
    }, []);

    return (
        <div ref={ref} className="wkf-pricing-cards">
            <h2>
                {`<!-- Comment Here -->`}
                <span>Hello World</span>
            </h2>
        </div>
    );
}
```

</details>

## 12.3 FAQ

<details>
<summary>👉 [Click to expand]</summary>

- Mount components only inside `useEffect`, never during the render phase. In Next.js, add `'use client'` at the top of the file.
- In development, StrictMode runs "mount → cleanup → mount again". This is normal, as long as `controller.ts` returns a complete cleanup function.
- Libraries imported in `controller.ts` (such as `three` and `gsap`) must be installed in the target project.
- The `assets` declared in a component's `manifest.json` usually need to be placed in the target Site's `public/` directory.

</details>


---


[🏠 Back to Main README](../../README.md#table-of-contents)