# WKF

**WebKineForge Command Line Interface**

WKF is the official command-line interface for the WebKineForge ecosystem. It provides a unified way to access and manage WebKineForge tools and resources.

The CLI is designed with a modular architecture, allowing new features and command groups to be added over time.

Currently, WKF provides website template discovery and installation.

## Requirements

- Node.js >= 22.12.0

## Usage

Run commands directly with `npx`. No global installation is required.

## Template Management

The template module allows you to discover and install website templates from the official WebKineForge repository.

### 1. List available templates

```bash
npx webkineforge list
```

View all available templates and their names.

### 2. Install a template

```bash
npx webkineforge add <template-name>
```

Replace `<template-name>` with the name of the template you want to install.

For example:

```bash
npx webkineforge add default-site
```

`default-site` is just an example template name. You can use any template name listed by `npx webkineforge list`.

### 3. Specify an installation directory

```bash
npx webkineforge add <template-name> --path ./my-website
```

For example:

```bash
npx webkineforge add default-site --path ./my-website
```

This installs the selected template into the specified directory.

## Running Templates Locally

**Important: Always run downloaded websites through a local HTTP server. Do not open HTML files directly in your browser using the `file://` protocol.**

Templates may use Three.js, JavaScript ES modules, textures, models, and other external assets. Opening HTML files directly can cause module loading, CORS, or resource loading errors.

After installing a template, navigate to its directory and start a local server.

For example, using Python:

```bash
cd my-website
python3 -m http.server 8000
```

Then open the following URL in your browser:

[http://localhost:8000](http://localhost:8000)

Press `Ctrl + C` in the terminal to stop the server.

## Roadmap

WKF is designed to support multiple functional modules within the WebKineForge ecosystem.

Planned extensions may include:

- **Template** — Discover and install website templates.
- **Component** — Manage and integrate reusable components.
- **Project** — Create and manage WebKineForge projects.
- **More Tools** — Additional utilities and development workflows.

These capabilities may be introduced progressively in future releases.

## Template Registry

Available templates are maintained in the official WebKineForge repository:

[https://github.com/xizon/webkineforge](https://github.com/xizon/webkineforge)

Templates are distributed through GitHub Releases.

## Features

- Discover available WebKineForge templates.
- Download templates from GitHub Releases.
- Verify downloaded files using SHA256 checksums.
- Install templates into custom directories.
- Protect existing files during installation.
- Modular architecture designed for future extensions.

## License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).