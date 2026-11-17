
# 11. 跨 Site 资源复用

[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)

支持不同 Site 之间共享和复用组件及静态资源，无需复制文件或集中管理。

构建 Site 引用请先更新 TypeScript 路径配置 `npm run build -- all`。


## 11.1 目录结构

例如，项目中有两个 Site：

```text
sites/
├── default-site/
│   ├── public/
│   │   └── assets/
│   │       └── hero-bg.webp
│   └── src/
│       ├── components/
│       │   └── pricing-cards/
│       └── pages/
│
└── second-site/
    └── src/
        ├── components/
        └── pages/
```

## 11.2 组件引用

使用 `@/site/<site-name>/components/<component-name>` 引用其他 Site 的组件。

例如，在 `second-site` 中引用 `default-site` 的 pricing-cards 组件：

```tsx
import PricingCards from '@/site/default-site/components/pricing-cards';

export default function SamplePage() {
    return (
        <main>
            <PricingCards />
        </main>
    );
}
```

## 11.3 静态资源引用

使用 `@/site/<site-name>/assets/<file-path>` 引用其他 Site 的静态资源。`<file-path>` 是文件的完整路径（包含所在的子文件夹）加文件名，例如 `images/parallax-bg.jpg`，而不是只写 `parallax-bg.jpg`。

例如，引用 `default-site` 中的背景图片：

```tsx
import imageUrl from '@/site/default-site/assets/images/parallax-bg.jpg';
export default function SamplePage() {
    return (
        <main>
            {imageUrl && <img src={imageUrl} width={300} />}
        </main>
    );
}
```


---


[🏠 返回项目主文档](../../README.zh-CN.md#table-of-contents)