
# 5. Downloading Website Templates

[🏠 Back to Main README](../../README.md#table-of-contents)

The template module allows you to discover and download website templates from the official WebKineForge repository.

> A website template here is a complete, pre-built website. It is not the Template layer of a component (`template.tsx`), nor the [Custom HTML Template](./custom-html-template.md) (`site.html`).

Each template is a pre-built website (the build output of a Site), packaged and downloaded to your machine. It contains only maintainable HTML and static assets, and does not include the TSX source code. You can edit the HTML directly, integrate it into your own project, and deploy it.

> Requires Node.js (which ships with `npx`).
>
> To develop with the TSX source (components, pages, and styles), work inside a Site instead. See [1. Quick Start](../../README.md#1-quick-start).

## 5.1 List Available Templates

```bash
npx webkineforge list
```

View all available templates and their names.

## 5.2 Download a Template

```bash
npx webkineforge add <template-name>
```

Replace `<template-name>` with the name of the template you want to download.

For example:

```bash
npx webkineforge add default-site
```

`default-site` is just an example template name. You can use any template name listed by `npx webkineforge list`.

## 5.3 Specify a Download Directory

```bash
npx webkineforge add <template-name> --path ./my-website
```

For example:

```bash
npx webkineforge add default-site --path ./my-website
```

This downloads the selected template into the specified directory.

## 5.4 Running Templates Locally

> **Important: Always run downloaded websites through a local HTTP server. Do not open HTML files directly in your browser using the `file://` protocol.**

Templates may use Three.js, JavaScript ES modules, textures, models, and other external assets. Opening HTML files directly can cause module loading, CORS, or resource loading errors.

After downloading a template, navigate to its directory and start a local server.

For example, using Python:

```bash
cd my-website
python3 -m http.server 8000
```

Then open the following URL in your browser:

[http://localhost:8000](http://localhost:8000)

Press `Ctrl + C` in the terminal to stop the server.

Python is only one option. Any local static HTTP server works.

---

[🏠 Back to Main README](../../README.md#table-of-contents)
