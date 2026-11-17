

# 7. 新增组件

[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)

每个 Site 都可以拥有自己的组件库。组件统一放在该 Site 的 `src/components/` 目录下。

组件目录推荐由 6 个文件组成：

```sh
{your_component}/
├── template.tsx    
├── controller.ts   
├── style.css       
├── index.ts         
├── manifest.json    
└── examples.md    
```

> 💡 下面的结构（Template / Controller / Style）是**强烈推荐**的组件组织方式，但**并非强制**。简单组件可以省略 `style.css`（静态组件还可省略 `controller.ts`）并使用行内样式，详见 [7.3 灵活写法](#73-灵活写法)。

## 7.1 方式一：通过命令快速创建（推荐）

使用 CLI 命令创建组件：

```bash
npm run create:component -- "My Component" --site my-site
```

也可以指定 Tailwind CSS Prefix：

```bash
npm run create:component -- "My Component" --site my-site --prefix myprefix
```

命令会生成完整的三层结构。创建之后，你可以按 [7.3 灵活写法](#73-灵活写法)的说明省略 `style.css`（静态组件还可以省略 `controller.ts`）。


## 7.2 方式二：手动创建（进阶）

如果你不想通过命令一键初始化文件，可以按步骤创建这些文件。章节内容也包含了每个文件的详细说明和注意细节。

<details>
<summary>👉 [点击展开]</summary>

### 步骤

**1. 创建目录**

在 `sites/{your_site_name}/src/components/` 下新建组件目录，目录名使用 kebab-case（如 `pricing-cards`）。

```text
sites/{your_site_name}/src/components/{your-component}/
```

**2. 编写样式 `style.css`**

自定义 class 使用 Site 配置的前缀加横线（例如 `wkf-pricing-cards`）；冒号形式只留给 Tailwind 工具类。命名示例和选择器规则请参阅[样式规范速查](./style-conventions.md)。

```css
.wkf-pricing-cards {
    position: relative;
}

.wkf-pricing-cards__title {
    font-size: 2rem;
}

.wkf-pricing-cards:hover {
    opacity: 0.9;
}
```



**3. 编写模板 `template.tsx`**

```tsx
import './style.css';

export function Template({
    children,
    customAttr1 = 0.4,
    customAttr2 = '50vh',
}: {
    children?: any;
    customAttr1?: number;
    customAttr2?: number | string;
}) {
    return (
        <div
            className="wkf-pricing-cards"
            data-custom-attr1={customAttr1}
            data-custom-attr2={customAttr2}
        >
            {`<!-- Comment Here -->`}
            {children}
        </div>
    );
}
```

> `wkf-pricing-cards` 是使用 Site 前缀的自定义类名。如果 Site 使用其他前缀，请相应替换 `wkf`。详见[样式规范速查](./style-conventions.md)。

**4. 编写交互 `controller.ts`**

只处理该组件根节点内的交互，并返回清理函数，撤销所有创建的监听器、动画和观察者：

```ts
export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;

    const observer = new ResizeObserver(onResize);
    observer.observe(element);

    return () => observer.disconnect(); // 撤销上面创建的一切
}
```

**5. 补充信息 `manifest.json`**

| 属性 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `name` | `string` | ✅ | 组件名称（需与组件目录名一致） |
| `version` | `string` | - | 组件版本号 |
| `type` | `string` | ✅ | 固定为 `"component"` |
| `description` | `string` | - | 组件功能描述说明 |
| `dependencies` | `object` | - | 组件 JS 依赖库清单（如 `gsap`、`three` 等及对应版本号） |
| `assets` | `string[]` | - | 组件用到的静态资源路径列表（构建时需确保复制到目标 Site 的 `public/`） |

```json
{
    "name": "my-component-name",
    "version": "1.0.0",
    "type": "component",
    "description": "Description of the component.",
    "dependencies": {
        "gsap": "^3.15.1",
        "three": "^0.177.0"
    },
    "assets": [
        "./assets/models/test.glb",
        "./assets/images/bg.jpg"
    ]
}
```

**6. 组件入口文件 `index.ts`**

```ts
export { Template as default } from './template';
```

- 组件入口将模板导出为默认导出。
- 组件将由系统自动发现和注册。
- 插件会读取 `manifest.json`，获取注册组件名称，并自动检测是否存在 `controller.ts` 文件。
- 如果存在 `controller.ts`，则将其中的 *mount* 函数注册为组件控制器；否则，使用一个空操作（no-op）的 mount 函数，等价于 `mount(element) { if (element === null) return; return () => {}; }`。

**7. 建议附带示例文档 `examples.md`**

> **用途**：开发模式下自动发现所有组件，可在浏览器中即时看到各种用法的效果。

| 章节 | 支持的标题 |
|---|---|
| Overview | `Overview`、 `概述`, `介绍`, `组件概述`, `组件介绍`, `简介` |
| Examples | `Examples`、`示例`, `使用示例`, `示例用法`, `用法示例` |
| API Reference | `API Reference`、`API 参考`, `API 文档`, `API 参数`, `接口说明`, `接口参数`, `参数`, `参数表`, `参数说明`, `属性`, `属性说明`, `组件参数`, `组件属性` |
| Dependencies | `Dependencies`、`依赖`, `依赖项`, `依赖关系`, `外部依赖`, `组件依赖`, `项目依赖' |

````markdown
# {Component Name}

## Overview

[Briefly describe what this component does.]

## Examples

### Basic Usage

This example shows the basic usage.

```tsx
<MyComponentName />
```

### Advanced Usage

[Add this section only if the component has advanced usage examples. Write each example as a bare JSX expression in a `tsx` block: no import, no export, no placeholders.]

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `name` | `string` | - | ✅ | Unique identification. |
| `attr` | `number` | `1` | - | Property description. |

[Replace the example parameter above with the actual component parameters.]

## Dependencies

- [Library Name](URL) - Version or usage notes
````


> **示例代码的写法约定：**
>
> - `#` 只放组件名称。
> - `## Overview` 只放组件整体介绍。
> - `## Examples` 是 Demo 区域的入口。
> - 每个 `###` 对应一个独立 Demo。
> - 每个 `tsx` 代码块是一段**纯 JSX**，只写使用方式本身，不写 `import`、`export` 和函数包装。
> - 组件名使用**目录名的 PascalCase**（如 `pricing-cards` 对应 `PricingCards`），不要自己起别名。
> - 多个并列元素用 `<>...</>` 包裹，不要用 `...` 或注释做占位，子内容写最小的真实内容。
> - 只写组件真实支持的 props，不要虚构。



**8. 在页面中使用**

组件创建完成后，可以在同一个 Site 的页面中引入和使用。具体操作参考[新增页面](#8-新增页面)。

</details>

## 7.3 灵活写法

对于需要长期维护、跨 Site 复用或由 AI Agent 参与开发的组件，我们**强烈推荐**三层结构（Template / Controller / Style）：它让结构、行为、样式各自独立，也是 CLI 默认生成的结构。

但它是**推荐实践，而不是硬性规则**。对于一个小徽标、一条分隔线或一个快速原型，6 个文件可能过重，因此 WebKineForge 支持更轻量的写法，请按组件的实际情况选择。

<details>
<summary>👉 [点击展开]</summary>


### 哪些可以省略，哪些必须保留

| 文件 | 是否灵活 | 说明 |
| :--- | :--- | :--- |
| `template.tsx` | 必需 | 组件本体，可同时包含样式（行内 `style={{ ... }}` 或 Tailwind 工具类）。不要在这里写浏览器端代码 |
| `style.css` | 可选 | 可用模板中的 `style={{ ... }}` 或 Tailwind 工具类代替 |
| `controller.ts` | 可选 | 所有浏览器端代码都写在这里。静态组件可以省略（见示例一）；有交互的组件请保留 |
| `index.ts` | 保留 | 组件入口，有了它页面才能使用 |
| `manifest.json` | 保留 | 名称、依赖和资源信息，同时为组件索引提供数据，便于复用和 Agent 检索 |
| `examples.md` | 保留 | 共享组件建议保留 |

### 示例一：单文件 + 行内样式（静态组件）

代码全部写在 `template.tsx` 中，样式直接用 `style` 对象写在元素上，因此不需要 `style.css`、`controller.ts`，也不用考虑类名前缀。请记住模板在构建时会在服务端渲染，所以不要在其中写浏览器端代码。

```text
promo-badge/
├── template.tsx
├── index.ts
└── manifest.json
```

```tsx
// template.tsx
export function Template({
    text = 'New',
    color = '#ff5a36',
}: {
    text?: string;
    color?: string;
}) {
    return (
        <span
            style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '999px',
                background: color,
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 600,
            }}
        >
            {text}
        </span>
    );
}
```

```ts
// index.ts
export { Template as default } from './template';
```

### 示例二：带交互的组件，行内样式，不需要 `style.css`

样式仍然内联在模板中，交互逻辑则依然写在 `controller.ts` 里。请不要把浏览器端代码混进 `template.tsx`：模板在构建时会在服务端渲染，而服务端不存在 `window` 和 `document`，会报 `ReferenceError: document is not defined` 之类的错误。

```text
like-button/
├── template.tsx
├── controller.ts
├── index.ts
└── manifest.json
```

```tsx
// template.tsx
export function Template({ label = 'Likes' }: { label?: string }) {
    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
                type="button"
                style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
            >
                {label}
            </button>
            <span data-count>0</span>
        </div>
    );
}
```

```ts
// controller.ts
export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;

    const button = element.querySelector('button');
    const count = element.querySelector('[data-count]');
    let value = 0;

    const onClick = () => {
        value += 1;
        if (count) count.textContent = String(value);
    };
    button?.addEventListener('click', onClick);

    // 撤销上面创建的所有内容
    return () => button?.removeEventListener('click', onClick);
}
```

```ts
// index.ts
export { Template as default } from './template';
```

### 示例三：模板中直接写 Tailwind 工具类，不需要 `style.css`

如果你更喜欢工具类，可以直接写在模板里，并使用 Site 的全局前缀（默认 `wkf`，参见 [9. 管理全局样式](./global-styles.md)）：

```tsx
export function Template({ text = 'New' }: { text?: string }) {
    return (
        <span className="wkf:inline-block wkf:rounded-full wkf:bg-orange-500 wkf:px-3 wkf:py-1 wkf:text-sm wkf:font-semibold wkf:text-white">
            {text}
        </span>
    );
}
```

### 如何选择

| 如果组件…… | 推荐写法 |
| :--- | :--- |
| 需要跨 Site 复用、含交互或动画，或会由多人 / 多个 Agent 修改 | **三层结构**（推荐） |
| 是静态的，但需要 hover、`@media` 或 `@keyframes` | Template + `style.css` |
| 体量小且静态 | **单文件**，使用 `style={{ ... }}` 或 Tailwind 工具类 |
| 是带少量交互的小组件 | 行内样式 + 完整的 `controller.ts` |
| 只是可能随时丢弃的原型 | 行内样式，保留下来再补 `style.css` |

</details>



---


[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)