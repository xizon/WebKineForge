

# 10. Custom HTML Template


[🏠 Back to Main README](../../README.md#table-of-contents)

Each Site can use its own `site.html` to define the shared HTML shell. When creating `site.html`, ensure that the `template` field points to it; if they do not match, correct one of them.

By default, Core generates a standard HTML structure automatically. Provide a custom `site.html` if you need third-party scripts, `<head>` modifications, or custom metadata tags.

## 10.1 Template File Location

Create `site.html` in the Site root directory:

```text
sites/{your_site_name}/
├── site.json
├── site.html
├── src/
└── ...
```

Specify the template path with the `template` field in `site.json`:

```json
{
    "template": "./site.html"
}
```

The template path is relative to the Site root directory.

If `template` is not configured, Core uses the built-in default HTML template.

## 10.2 Template Example

```html
<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>

    <meta name="description" content="${description}" />

    <!--app-canonical-->
    <!--app-styles-->
</head>

<body class="${bodyClass}">
    <!--app-container-->

    <!-- Third-party libraries: Must be loaded before "app-scripts" -->
    <script src="./vendor/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>

    <!--app-scripts-->
</body>
</html>
```

Add `build.externals` to `package.json` to prevent loaded script libraries from being bundled again:

```json
{
    "build": {
        "externals": {
            "three": "THREE",
            "gsap": "gsap"
        }
    }
}
```

> **Notes**
> - Put the `<script>` tags before `<!--app-scripts-->`, so the global variables are available before the component scripts run.
> - The gsap CDN address and version are for illustration only. Replace them with real, available resources, and keep them compatible with the dependency versions declared in `package.json`.
> - Since r161, Three.js no longer provides an official global `three.min.js` build, so newer versions cannot be loaded directly from a CDN. Please build it yourself with [threejs-dist-builder](https://github.com/xizon/threejs-dist-builder).
> - For details about `externals`, see the External configuration under "Option 2" in [Creating a Site](#6-creating-a-site).


## 10.3 Placeholders

<details>
<summary>👉 [Click to expand]</summary>

| Placeholder | Description |
| :--- | :--- |
| `${lang}` | Page language (The Page configuration takes precedence; otherwise, the Site's default language is used.) |
| `${title}` | Page title |
| `${description}` | Page description |
| `${keywords}` | Page keywords |
| `${bodyClass}` | CSS class name for body |
| `${siteTitle}` | Site name |

</details>

## 10.4 HTML Template Markers

<details>
<summary>👉 [Click to expand]</summary>

| Marker | Description |
| :--- | :--- |
| `<!--app-meta-->` | Meta information |
| `<!--app-canonical-->` | Canonical link |
| `<!--app-styles-->` | CSS styles |
| `<!--app-container-->` | Main HTML content |
| `<!--app-scripts-->` | JavaScript scripts |

</details>


---


[🏠 Back to Main README](../../README.md#table-of-contents)