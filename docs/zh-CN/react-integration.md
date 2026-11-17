

# 12. 在 React 项目中使用组件

[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)


Site 里的组件可以复用到独立的 React 项目中。根据使用需求，可以选择以下两种方式：

以下以 `my-component1` 为例。

## 12.1 方式一：通过命令快速导出（推荐）

如果只有一个 Site：
```bash
npm run export:react
```

指定 Site：
```bash
npm run export:react -- {your_site_name}
```

导出全部 Site：
```bash
npm run export:react -- all
```

## 12.2 方式二：手动改装成 React 组件（进阶）

<details>
<summary>👉 [点击展开]</summary>

如果希望组件更自然地融入 React 项目，可以只复用原组件的交互控制器和样式，再将 `template.tsx` 改写为 React 组件。

### 步骤

**1. 复制文件 `controller.ts` 和 `style.css`.**
**2. 把 `template.tsx` 改写成 React 组件**

引入 `controller.ts`，给根节点添加 `ref`，保留原来的 `className`，并在 `useEffect` 中调用 `mount`：

```tsx
import { useEffect, useRef } from 'react';
import { mount } from './controller';
import './style.css';

export function App() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cleanup = mount(ref.current);

        return () => {
            cleanup?.();
        };
    }, []);

    return (
        <div ref={ref} className="wkf-pricing-cards">
            <h2>
                {`<!-- Comment Here -->`}
                <span>Hello World</span>
            </h2>
        </div>
    );
}
```

</details>

## 12.3 常见问题

<details>
<summary>👉 [点击展开]</summary>

- 组件挂载只能在 `useEffect` 中进行，不能在渲染阶段调用。Next.js 需要在文件顶部添加 `'use client'`。
- 开发环境的 StrictMode 会执行「挂载 → 清理 → 再挂载」，这是正常现象，前提是 `controller.ts` 返回了完整的清理函数。
- `controller.ts` 中 `import` 的库（如 `three`、`gsap`）需要在目标项目中安装。
- 组件 `manifest.json` 中声明的 `assets` 通常需要放到目标 Site 的 `public/` 目录下。

</details>


---


[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)