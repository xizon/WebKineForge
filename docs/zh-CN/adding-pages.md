
# 8. 新增页面


[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)

每个 Site 都可以包含多个独立页面。页面统一放在该 Site 的 `src/pages/` 目录下。

页面目录由 3 个文件组成：

```sh
{your_page}/  
├── index.tsx     
├── style.css       
└── manifest.json 
```

## 8.1 方式一：通过命令快速创建（推荐）

使用 CLI 命令创建页面：

```bash
npm run create:page -- "My Page" --site my-site
```

也可以指定 Tailwind CSS Prefix：

```bash
npm run create:page -- "My Page" --site my-site --prefix myprefix
```


## 8.2 方式二：手动创建（进阶）

如果你不想通过命令一键初始化文件，可以按步骤创建这些文件。章节内容也包含了每个文件的详细说明和注意细节。

<details>
<summary>👉 [点击展开]</summary>

### 步骤

**1. 创建目录**

在 `sites/{your_site_name}/src/pages/` 下新建页面目录，目录名使用 kebab-case。

**不要命名为 `index`**，因为 `index.html` 由构建自动生成。

```text
sites/{your_site_name}/src/pages/{your-page}/
```

**2. 编写样式 `style.css`**

页面专属样式。自定义类名使用 Site 配置的前缀加横线（如 `wkf-samplepage-1__hero`）。详见[样式规范速查](./style-conventions.md)。

**3. 编写页面 `index.tsx`**

此页面负责 HTML 结构：引入全局样式和组件，并按顺序排列组件。同时支持服务端渲染调试。

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


**4. 填写信息 `manifest.json`**

每个页面通过自己的 `manifest.json` 配置页面信息、输出文件名和 SEO 信息。

| 属性 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `name` | `string` | ✅ | 页面名称，需与目录名一致 |
| `type` | `string` | ✅ | 固定为 `"page"` |
| `version` | `string` | - | 页面版本号 |
| `output` | `string` | - | 输出文件名，默认 `{name}.html` |
| `bodyClass` | `string` | - | 注入到 `<body>` 的类名，用于区分页面主题，默认 `"page"` <blockquote>`bodyClass` 支持填写多个以空格分隔的类名。自定义命名请遵循[样式规范速查](./style-conventions.md)。</blockquote> |
| `seo` | `object` | - | 页面 SEO 配置，见下表 |

`seo` 字段：

| 属性 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `title` | `string` | ✅ | 页面标题 |
| `lang` | `string` | - | 页面语言，不填则继承 Site 配置中的 `lang` |
| `description` | `string` | - | 页面描述，生成 `<meta name="description">` |
| `keywords` | `string[]` | - | 关键词，生成逗号分隔的 `<meta name="keywords">` |
| `author` | `string` | - | 作者，生成 `<meta name="author">` |
| `canonical` | `string` | - | 规范链接，生成 `<link rel="canonical">` |
| 任意自定义键 | `string` / `array` | - | 以 `og:` 开头的键渲染为 `<meta property="…">`；`twitter:` 及其他键渲染为 `<meta name="…">` |

配置示例：

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

自定义 SEO 属性：

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

**5. 页面之间的链接**

直接使用相对链接，路径为目标页面的输出文件名（`manifest.output`，未设置时为 `{name}.html`）：

```html
<a href="./samplepage-2.html">另一个页面</a>
```

</details>


---


[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)