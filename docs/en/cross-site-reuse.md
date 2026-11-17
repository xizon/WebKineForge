

# 11. Cross-Site Resource Reuse


[🏠 Back to Main README](../../README.md#table-of-contents)

Different Sites can share components and static assets without duplication:

To set up Site references, please first update the TypeScript path configuration `npm run build -- all`.

## 11.1 Directory Structure

For example, a project has two Sites:

```text
sites/
├── default-site/
│   ├── public/
│   │   └── assets/
│   │       └── hero-bg.webp
│   └── src/
│       ├── components/
│       │   └── pricing-cards/
│       └── pages/
│
└── second-site/
    └── src/
        ├── components/
        └── pages/
```

## 11.2 Referencing Components

Use `@/site/<site-name>/components/<component-name>` to reference a component from another Site.

For example, to use the pricing-cards component of `default-site` in `second-site`:

```tsx
import PricingCards from '@/site/default-site/components/pricing-cards';

export default function SamplePage() {
    return (
        <main>
            <PricingCards />
        </main>
    );
}
```

## 11.3 Referencing Static Assets

Use `@/site/<site-name>/assets/<file-path>` to reference static assets from another Site. `<file-path>` is the full path of the file, including any subfolders, followed by the file name (for example `images/parallax-bg.jpg`, not just `parallax-bg.jpg`).

For example, to reference the background image in `default-site`:

```tsx
import imageUrl from '@/site/default-site/assets/images/parallax-bg.jpg';
export default function SamplePage() {
    return (
        <main>
            {imageUrl && <img src={imageUrl} width={300} />}
        </main>
    );
}
```

---


[🏠 Back to Main README](../../README.md#table-of-contents)