
# 3. 配置站点信息

[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)

每个 Site 都以 `sites/{your_site_name}/site.json` 管理站点基础信息、HTML 模板以及源码和构建目录。


## 3.1 配置示例

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

## 3.2 配置字段

| 属性 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `name` | `string` | ✅ | Site 唯一标识，用于系统内部识别；需与目录名称及 `package.json` 中的 `name` 一致 |
| `version` | `string` | ✅ | Site 版本号 |
| `lang` | `string` | ✅ | 默认语言代码，例如 `en-US`、`zh-CN` |
| `title` | `string` | ✅ | 默认网站标题，用于页面 SEO 标题生成 |
| `description` | `string` | - | 默认网站描述 |
| `author` | `object` | - | 开发者信息 |
| `template` | `string` | - | Site 级 HTML 文档模板路径，默认使用系统内置模板 |
| `paths` | `object` | - | Site 主要目录路径配置 |
| `entries` | `object` | - | 页面、组件和全局样式的扫描入口 |

## 3.3 paths 目录配置

<details>
<summary>👉 [点击展开]</summary>

用于指定 Site 的主要目录位置：

| 属性 | 默认路径 | 说明 |
| :--- | :--- | :--- |
| `src` | `./src` | Site 源码目录 |
| `public` | `./public` | 静态资源目录 |
| `dist` | `./dist` | 完整构建输出目录 |

</details>

## 3.4 entries 入口配置

<details>
<summary>👉 [点击展开]</summary>

用于指定 Core 扫描和处理的源码入口：

| 属性 | 默认路径 | 说明 |
| :--- | :--- | :--- |
| `pages` | `./src/pages` | 页面模板及页面信息入口 |
| `components` | `./src/components` | 组件源码及组件信息入口 |
| `styles` | `./src/styles` | 全局样式入口 |

</details>

`paths` 和 `entries` 均提供默认值。使用标准目录结构时，可以省略，无需重复填写。

## 3.5 开发者信息

<details>
<summary>👉 [点击展开]</summary>

| 属性 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `name` | `string` | - | 开发者姓名 |
| `website` | `string` | - | 网站链接 |
| `email` | `string` | - | 电子邮箱 |

</details>



## 3.6 页面级 SEO 配置

Site 配置提供全局默认信息，具体页面的 SEO 信息仍然写在对应页面的 `manifest.json` 中，通过 `seo` 字段进行配置。

页面可以根据需要覆盖 Site 的默认语言、标题和描述等信息。未单独设置的字段按照 Site 默认配置处理。


---


[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)