
# 8. Adding Pages

[🏠 Back to Main README](../../README.md#table-of-contents)

Each Site can contain multiple independent pages. Pages live in the Site's `src/pages/` directory.

A page directory consists of 3 files:

```sh
{your_page}/  
├── index.tsx     
├── style.css        
└── manifest.json 
```

## 8.1 Option 1: Create with a Command (Recommended)

Use the CLI command to create a page:

```bash
npm run create:page -- "My Page" --site my-site
```

You can also specify a Tailwind CSS prefix:

```bash
npm run create:page -- "My Page" --site my-site --prefix myprefix
```


## 8.2 Option 2: Manual Setup (Advanced)

If you prefer not to use the one-command setup, you can create the files manually. Each section explains the files and key details.

<details>
<summary>👉 [Click to expand]</summary>

### Steps

**1. Create the directory**

Create a new page directory under `sites/{your_site_name}/src/pages/`. The directory name uses kebab-case.

**Do not name it `index`**, because `index.html` is generated automatically by the build.

```text
sites/{your_site_name}/src/pages/{your-page}/
```

**2. Write the style `style.css`**

Page-specific styles. Use the Site prefix followed by a hyphen for custom class names (for example `wkf-samplepage-1__hero`). See [Style Conventions](./style-conventions.md).

**3. Write `index.tsx`**

This page handles the HTML structure: it imports the global styles and the components, and arranges the components in order. It also supports debugging for server-side rendering.

```tsx
// Global styles
import '@/styles/tailwind.css';

// Custom styles
import './style.css';

// Components
import MyComponent1 from '@/components/my-component1';
import MyComponent2 from '@/components/my-component2';

export default function SamplePage() {
    return (
        <main>
            {`<!-- Comment Here -->`}
            <MyComponent1 />
            <MyComponent2 />
        </main>
    );
}
```


**4. Add information `manifest.json`**

Each page configures its page information, output file name, and SEO information through its own `manifest.json`.

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | ✅ | Page name. Must match the directory name |
| `type` | `string` | ✅ | Always `"page"` |
| `version` | `string` | - | Page version |
| `output` | `string` | - | Output file name. Defaults to `{name}.html` |
| `bodyClass` | `string` | - | Class name injected into `<body>`, used to tell page themes apart. Defaults to `"page"` <blockquote> `bodyClass` accepts multiple space-separated class names. Follow the [Style Conventions](./style-conventions.md) for custom naming. </blockquote> |
| `seo` | `object` | - | Page SEO configuration, see the table below |

The `seo` fields:

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | ✅ | Page title |
| `lang` | `string` | - | Page language. If omitted, it inherits `lang` from the Site configuration |
| `description` | `string` | - | Page description, generates `<meta name="description">` |
| `keywords` | `string[]` | - | Keywords, generates a comma-separated `<meta name="keywords">` |
| `author` | `string` | - | Author, generates `<meta name="author">` |
| `canonical` | `string` | - | Canonical link, generates `<link rel="canonical">` |
| Any custom key | `string` / `array` | - | Keys starting with `og:` render as `<meta property="…">`; `twitter:` and other keys render as `<meta name="…">` |

Configuration example:

```json
{
    "name": "samplepage-1",
    "version": "1.0.0",
    "type": "page",
    "output": "samplepage-1.html",
    "bodyClass": "wkf-your-body-classname1 wkf-your-body-classname2",
    "seo": {
        "lang": "en-US",
        "title": "Sample Page 1",
        "description": "Sample page 1.",
        "author": "",
        "keywords": [],
        "canonical": ""
    }
}
```

Custom SEO properties:

```json
{
    "seo": {
        "...": "...",
        "og:type": "website",
        "og:image": "https://example.com/assets/share.jpg",
        "twitter:card": "summary_large_image",
        "my-custom-tag": "any-value-you-want"
    }
}
```

**5. Links between pages**

Use relative links directly. The path is the target page's output file name (`manifest.output`, or `{name}.html` if it is not set):

```html
<a href="./samplepage-2.html">Another page</a>
```

</details>

---


[🏠 Back to Main README](../../README.md#table-of-contents)