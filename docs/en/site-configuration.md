
# 3. Site Configuration


[🏠 Back to Main README](../../README.md#table-of-contents)


Each Site uses `sites/{your_site_name}/site.json` to define its information, HTML template, source directories, and build output.


## 3.1 Configuration Example

```json
{
    "name": "default-site",
    "version": "1.0.0",
    "lang": "en-US",
    "title": "Default Site",
    "description": "Your description.",
    "author": {
        "name": "Your Name",
        "website": "https://example.com",
        "email": "hello@example.com"
    },
    "template": "./site.html",
    "paths": {
        "src": "./src",
        "public": "./public",
        "dist": "./dist"
    },
    "entries": {
        "pages": "./src/pages",
        "components": "./src/components",
        "styles": "./src/styles"
    }
}
```

## 3.2 Configuration Fields

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | ✅ | Unique internal identifier; must match "folder" name and "package.json" `name` |
| `version` | `string` | ✅ | Site version |
| `lang` | `string` | ✅ | Default language code (e.g., `en-US`, `zh-CN`) |
| `title` | `string` | ✅ | Default website title used for SEO |
| `description` | `string` | - | Default website description |
| `author` | `object` | - | Developer details |
| `template` | `string` | - | Path to custom Site-level HTML template |
| `paths` | `object` | - | Main directory paths |
| `entries` | `object` | - | Source entry points for pages, components, and styles |

## 3.3 paths Settings

<details>
<summary>👉 [Click to expand]</summary>

| Property | Default Path | Description |
| :--- | :--- | :--- |
| `src` | `./src` | Source directory |
| `public` | `./public` | Static assets directory |
| `dist` | `./dist` | Build output directory |

</details>

## 3.4 entries Settings

<details>
<summary>👉 [Click to expand]</summary>

| Property | Default Path | Description |
| :--- | :--- | :--- |
| `pages` | `./src/pages` | Page templates and information entry |
| `components` | `./src/components` | Component source and information entry |
| `styles` | `./src/styles` | Global styles entry |

</details>

`paths` and `entries` both have default values. With the standard directory structure you can omit them and avoid repeating the defaults.

## 3.5 Developer Info

<details>
<summary>👉 [Click to expand]</summary>

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | - | Developer name |
| `website` | `string` | - | Website link |
| `email` | `string` | - | Email address |

</details>

## 3.6 Page SEO Settings

The Site configuration provides global defaults. A page's own SEO information is written in that page's `manifest.json` using the `seo` field. Unset fields automatically fall back to the Site defaults.

Pages can override the Site's default language, title, description, and other information as needed.


---


[🏠 Back to Main README](../../README.md#table-of-contents)