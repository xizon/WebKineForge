
# 6. 新建 Site


[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)

所有网站统一存放在 `sites/` 目录下，每个子目录代表一个独立的 Site，目录名使用 kebab-case。

目录结构如下：

```sh
sites/
└── {your_site_name}/
    ├── site.json
    ├── package.json
    ├── component-index.json     # [自动生成] 构建时生成
    ├── page-index.json          # [自动生成] 构建时生成
    ├── tsconfig.json            # [自动生成] 构建时生成
    ├── public/
    ├── src/
    │   ├── styles/
    │   │   └── tailwind.css
    │   ├── components/
    │   └── pages/
    └── dist/                    # [自动生成] 构建输出目录
```

## 6.1 方式一：通过命令快速创建（推荐）

使用 CLI 命令创建一个完整的 Site：

```bash
npm run create:site -- my-site
```

也可以指定 Tailwind CSS Prefix：

```bash
npm run create:site -- my-site --prefix myprefix
```

默认组件和页面的具体文件结构及内容，分别参考[新增组件](#7-新增组件)和[新增页面](#8-新增页面)中的命令创建方式。


## 6.2 方式二：手动创建（进阶）

如果你不想通过命令一键初始化文件，可以按步骤创建这些文件。章节内容也包含了每个文件的详细说明和注意细节。

<details>
<summary>👉 [点击展开]</summary>

### 步骤

1. 创建一个新的 Site 目录。
2. 创建 `site.json` 和 `package.json`。
3. 创建 `public/`、`src/styles/`、`src/components/` 和 `src/pages/` 目录。
4. 根据需要调整依赖及构建配置。
5. 根据需要创建组件和页面。
6. 执行构建命令：

```bash
npm run build -- {your_site_name}
```

**注意：**

目录名称、`site.json` 中的 `name` 和 `package.json` 中的 `name` 必须保持一致。

完整的 Site 目录结构请参考[系统架构](#2-系统架构)。

### site.json 配置

配置示例：

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

### package.json 配置

每个 Site 通过自己的 `package.json` 管理依赖及构建配置。

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

**External 配置说明：**

默认情况下，Site 依赖会正常打包到最终产物中。

如果希望某些依赖不进入 Bundle，而是使用宿主环境已经提供的全局变量，可以将它们添加到 `build.externals` 中。

配置格式：

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

### External 使用示例

以 Three.js 和 GSAP 为例。

**1. 组件源码**

组件仍然按照正常的 ES Module 方式引入依赖：

```ts
import * as THREE from 'three';
import { gsap } from 'gsap';

const scene = new THREE.Scene();

gsap.to('.demo', {
    opacity: 1,
    duration: 1
});
```

**2. 配置 package.json**

将需要 External 的依赖映射到宿主环境中的全局变量：

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

**3. HTML 页面模板加载依赖**

由于 External 依赖不会被打包进组件 JS，因此 HTML 页面需要提前加载对应的 JavaScript 文件，可以通过[自定义 HTML 页面模板](#10-自定义-html-页面模板)添加 `<script>` 标签，无需修改组件源码。

```html
<script src="https://example.com/three.min.js"></script>
<script src="https://example.com/gsap.min.js"></script>
```

以上 CDN 地址仅为示意，请替换为实际可用的资源地址。

> Three.js r161 及以上版本没有官方的全局构建文件，请参考[自定义 HTML 页面模板](#10-自定义-html-页面模板)中的 threejs-dist-builder 说明。

</details>

---


[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)