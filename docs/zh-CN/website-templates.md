
# 5. 下载网站模板

[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)

模板模块可以让你发现并下载 WebKineForge 官方仓库中的网站模板。

> 这里的网站模板是指完整的、构建好的网站，不是组件的 Template 层（`template.tsx`），也不是[自定义 HTML 页面模板](./custom-html-template.md)（`site.html`）。

每个模板都是构建后的网站（即 Site 的构建产物），经打包后下载到本地。它只包含可维护的 HTML 和静态资源，不包含 TSX 源码。你可以直接修改 HTML，集成到自己的项目中并部署。

> 需要安装 Node.js（自带 `npx`）。
>
> 如需基于 TSX 源码开发组件、页面和样式，请在 Site 中进行，详见 [1. 快速开始](../../README.zh-CN.md#1-快速开始)。

## 5.1 查看可用网站模板

```bash
npx webkineforge list
```

查看所有可用模板及其名称。

## 5.2 下载网站模板

```bash
npx webkineforge add <template-name>
```

将 `<template-name>` 替换为你要下载的模板名称。

例如：

```bash
npx webkineforge add default-site
```

`default-site` 仅为示例模板名称，你可以使用 `npx webkineforge list` 列出的任意模板名称。

## 5.3 指定下载目录

```bash
npx webkineforge add <template-name> --path ./my-website
```

例如：

```bash
npx webkineforge add default-site --path ./my-website
```

所选模板会被下载到指定目录中。

## 5.4 在本地运行模板

> **重要：请始终通过本地 HTTP 服务器运行下载的网站，不要使用 `file://` 协议直接在浏览器中打开 HTML 文件。**

模板可能使用 Three.js、JavaScript ES 模块、贴图、模型及其他外部资源。直接打开 HTML 文件可能会导致模块加载、跨域（CORS）或资源加载错误。

下载模板后，进入其目录并启动本地服务器。

例如，使用 Python：

```bash
cd my-website
python3 -m http.server 8000
```

然后在浏览器中打开：

[http://localhost:8000](http://localhost:8000)

在终端中按 `Ctrl + C` 即可停止服务器。

Python 只是其中一种方式，任何本地静态 HTTP 服务器都可以。

---

[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)
