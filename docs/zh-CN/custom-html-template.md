
# 10. 自定义 HTML 页面模板

[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)


每个 Site 都可以使用自己的 `site.html`，定义整个 Site 共用的 HTML 文档外壳。创建 `site.html` 时要保证 `template` 字段 指向它，两者不一致就修正其一。

默认情况下，Core 会自动生成规范的 HTML 文档结构，包括字符集、响应式视口和 SEO 信息等。如果需要接入第三方统计代码、调整 `<head>` 或增加自定义 `<meta>`，可以提供自己的 HTML 模板。

## 10.1 模板文件位置

在 Site 根目录下创建 `site.html`：

```text
sites/{your_site_name}/
├── site.json
├── site.html
├── src/
└── ...
```

在 `site.json` 中通过 `template` 字段指定模板路径：

```json
{
    "template": "./site.html"
}
```

模板路径相对于 Site 根目录。

如果没有配置 `template`，Core 将使用内置的默认 HTML 模板。

## 10.2 模板示例

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

自定义模板可以直接通过 `<script>` 引入外部的第三方库（CDN 或自己托管的文件均可）。此时只需在 Site 的 `package.json` 中配置 `build.externals`，即可避免这些库被重复打包：

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

> **注意**
> - `<script>` 必须放在 `<!--app-scripts-->` 之前，保证全局变量先于组件脚本可用。
> - gsap 的 CDN 地址和版本仅为示意，请替换为实际可用的资源，并与 `package.json` 中声明的依赖版本保持兼容。
> - Three.js 自 r161 起官方不再提供 `three.min.js` 全局构建，无法直接从 CDN 加载新版本。请使用 [threejs-dist-builder](https://github.com/xizon/threejs-dist-builder) 自行构建，见下方说明。
> - `externals` 的详细说明见[新建 Site](#6-新建-site) 中「方式二」的 External 配置。


## 10.3 占位符

<details>
<summary>👉 [点击展开]</summary>

| 占位符 | 说明 |
| :--- | :--- |
| `${lang}` | 页面语言，优先使用 Page 配置，否则使用 Site 默认语言 |
| `${title}` | 页面标题 |
| `${description}` | 页面描述 |
| `${keywords}` | 页面关键词 |
| `${bodyClass}` | 页面 body 的 CSS 类名 |
| `${siteTitle}` | Site 名称 |

</details>

## 10.4 HTML 注入标记

<details>
<summary>👉 [点击展开]</summary>

| 标记 | 说明 |
| :--- | :--- |
| `<!--app-meta-->` | 注入页面相关的 Meta 信息 |
| `<!--app-canonical-->` | 注入 Canonical 链接 |
| `<!--app-styles-->` | 注入页面所需的 CSS 样式 |
| `<!--app-container-->` | 注入页面主体 HTML 内容 |
| `<!--app-scripts-->` | 注入页面所需的 JavaScript 脚本 |

</details>


---


[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)