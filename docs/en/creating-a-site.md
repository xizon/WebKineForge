
# 6. Creating a Site

[🏠 Back to Main README](../../README.md#table-of-contents)

All websites live in the `sites/` directory using kebab-case naming.

The directory structure is as follows:

```sh
sites/
└── {your_site_name}/
    ├── site.json
    ├── package.json
    ├── component-index.json     # [Auto-generated] created at build
    ├── page-index.json          # [Auto-generated] created at build
    ├── tsconfig.json            # [Auto-generated] created at build
    ├── public/
    ├── src/
    │   ├── styles/
    │   │   └── tailwind.css
    │   ├── components/
    │   └── pages/
    └── dist/                    # [Auto-generated] build output directory
```




## 6.1 Option 1: Create with a Command (Recommended)

Use the CLI command to create a complete Site:

```bash
npm run create:site -- my-site
```

You can also specify a Tailwind CSS prefix:

```bash
npm run create:site -- my-site --prefix myprefix
```

For the exact file structure and contents of the default components and pages, see the command-based creation in [Adding Components](#7-adding-components) and [Adding Pages](#8-adding-pages).


## 6.2 Option 2: Manual Setup (Advanced)

If you prefer not to use the one-command setup, you can create the files manually. Each section explains the files and key details.

<details>
<summary>👉 [Click to expand]</summary>

### Steps

1. Create a new Site directory under `sites/`.
2. Create `site.json` and `package.json`.
3. Create the `public/`, `src/styles/`, `src/components/`, and `src/pages/` directories.
4. Adjust dependencies and build configuration as needed.
5. Create components and pages as needed.
6. Run the build command:

```bash
npm run build -- {your_site_name}
```

**Note:**

The directory name, the `name` in `site.json`, and the `name` in `package.json` must all be the same.

For the complete Site directory structure, see [System Architecture](#2-system-architecture).

### site.json Configuration

Example:

```json
{
    "name": "my-site",
    "version": "1.0.0",
    "lang": "en-US",
    "title": "My Site",
    "description": "This is a site automatically created by the CLI..",
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

### package.json Configuration

Each Site manages its dependencies and build configuration through its own `package.json`.

```json
{
    "name": "default-site",
    "private": true,
    "version": "1.0.0",
    "dependencies": {
        "gsap": "^3.15.1",
        "three": "^0.177.0"
    },
    "devDependencies": {
        "@types/three": "^0.177.0"
    },
    "build": {
        "externals": {}
    },
    "x-build-externals-description": "To exclude dependencies from the bundle, add them to build.externals and specify their global variable names."
}
```

**About External configuration:**

By default, a Site's dependencies are bundled into the final output.

If you want some dependencies to stay out of the bundle and use global variables already provided by the host environment instead, add them to `build.externals`.

Format:

```json
{
    "build": {
        "externals": {
            "npm-package-name": "GlobalVariableName",
            "gsap": "gsap",
            "three": "THREE",
            "jquery": "jQuery",
            "echarts": "echarts"
        }
    }
}
```

### Using External Libraries

Using Three.js and GSAP as an example.

**1. Component source**

Components still import dependencies as regular ES Modules:

```ts
import * as THREE from 'three';
import { gsap } from 'gsap';

const scene = new THREE.Scene();

gsap.to('.demo', {
    opacity: 1,
    duration: 1
});
```

**2. Configure package.json**

Map the dependencies that should be External to the global variables in the host environment:

```json
{
    "dependencies": {
        "three": "^0.177.0",
        "gsap": "^3.15.1"
    },
    "build": {
        "externals": {
            "gsap": "gsap",
            "three": "THREE"
        }
    }
}
```

**3. Load dependencies in the HTML page template**

External dependencies are not bundled into the component JS, so the HTML page must load the corresponding JavaScript files beforehand. You can add `<script>` tags through a [Custom HTML Template](#10-custom-html-template) without changing any component source.

```html
<script src="https://example.com/three.min.js"></script>
<script src="https://example.com/gsap.min.js"></script>
```

The CDN addresses above are for illustration only. Replace them with real, available resources.

> Three.js r161 and later have no official global build file. See the threejs-dist-builder notes in [Custom HTML Template](#10-custom-html-template).

</details>

---


[🏠 Back to Main README](../../README.md#table-of-contents)