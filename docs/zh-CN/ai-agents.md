
# 4. 使用 AI Agent


[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)

系统内置了 Agent，Cursor、Codex 等工具打开项目时会自动识别。

> 刚接触项目？可以直接从这里开始：项目自带 `default-site`，Agent 也可以帮你创建新的 Site、组件和页面。如果想自己创建 Site，请参考 [6. 新建 Site](./creating-a-site.md)。

## 4.1 工作范围：一次任务，一个 Site

Agent 的主要作用域和责任区是“Site 内部”——即在已经创建好的特定 Site 目录（sites/<site-name>/）里，根据开发需求去检索组件、复用跨站点资源、编写页面结构、开发交互组件以及维护对应的索引文件。

| 项目情况 | 是否需要指定 Site |
| :--- | :--- |
| `sites/` 下只有一个 Site | 不需要，Agent 自动使用它 |
| 有多个 Site | 建议在需求中写明 Site 名；未说明时，Agent 会先询问，不会猜测 |

## 4.2 使用步骤

**1. 生成 Site 索引**

首次使用前，先构建目标 Site，生成该 Site 的索引文件：

```bash
npm run build -- {your_site_name}
```

```text
sites/{your_site_name}/
├── component-index.json   # 组件索引，供 Agent 检索和复用
└── page-index.json        # 页面索引，供 Agent 了解页面结构
```

索引按 Site 独立生成。新增或修改组件、页面后会重新生成，Agent 在验证阶段执行构建时会一并更新，无需手动维护。如果索引缺失或过期，Agent 也会自行重新构建。

**2. 用自然语言下达任务**

假设项目中包含多个独立 Site：

```text
└── sites/
    ├── product-showcase/
    └── portfolio/
```

在指定的 Site 内新增组件和页面：

> 请在 product-showcase Site 中新增一个 pricing-cards 组件，设计为三列价格卡片，进入视口后依次出现。然后新增 pricing 页面，使用已有的 primary-menu 和新创建的 pricing-cards 组件，页面风格与当前 Site 保持一致。HTML的样式请使用 tailwind 的工具类内嵌。

复用其他 Site 的组件或资源：

> 请在 portfolio Site 新增 contact 页面，复用 product-showcase 中的 primary-menu 组件，其余内容在 portfolio 内新建。

组件比较简单时，可以要求更轻量的结构：

> 请在 portfolio Site 新增一个 promo-badge 组件，它体量很小且是静态的，请使用行内 `style={{ ... }}`，不需要单独的 style.css 和 controller.ts。

默认情况下，Agent 会遵循推荐的三层结构（Template / Controller / Style）；当你明确提出，或组件本身很简单且是静态时，它会改用行内样式（不带 `style.css`，静态组件也不带 `controller.ts`）的写法。

如果你只有1个站点，你可以这样说：

> 请在默认站点中...。


## 4.3 Agent 的交互

跨 Site 复用通过 @/site/<site>/components/<component> 引用，不会复制文件。如果复用的组件需要改动，Agent 会询问你：

> 修改来源组件（所有引用它的 Site 都会受影响），还是在当前 Site 创建本地变体。

---


[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)