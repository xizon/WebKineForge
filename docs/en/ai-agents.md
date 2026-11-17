
# 4. Using AI Agents

[🏠 Back to Main README](../../README.md#table-of-contents)

The system ships with a built-in Agent. Tools such as Cursor and Codex recognize it automatically when they open the project.

> New to the project? You can start here: the project ships with a `default-site`, and the Agent can scaffold new Sites, components, and pages for you. To create a Site yourself, see [6. Creating a Site](./creating-a-site.md).

## 4.1 Scope: One Task, One Site

Each Agent works within a single Site: within a specific, already-created Site directory (`sites/<site-name>/`), it finds components and reuses resources from other Sites, writes page structure, builds interactive components, and maintains the index files, based on your instructions.

| Project situation | Need to specify a Site? |
| :--- | :--- |
| Only one Site under `sites/` | No, the Agent uses it automatically |
| Multiple Sites | Name the Site in your request. If you don't, the Agent asks first and never guesses |

## 4.2 Steps

**1. Generate the Site index**

Before first use, build the target Site to generate its index files:

```bash
npm run build -- {your_site_name}
```

```text
sites/{your_site_name}/
├── component-index.json   # Component index, for Agents to look up and reuse components
└── page-index.json        # Page index, for Agents to understand page structure
```

Indexes are generated per Site. They are regenerated after components or pages are added or changed, and the Agent's verification build updates them too, so you do not need to maintain them manually. If an index is missing or outdated, the Agent rebuilds it on its own.

**2. Give tasks in natural language**

Suppose the project contains several independent Sites:

```text
└── sites/
    ├── product-showcase/
    └── portfolio/
```

Add components and pages inside a specific Site:

> In the product-showcase Site, add a pricing-cards component designed as three price cards in a row that appear one after another when they enter the viewport. Then add a pricing page that uses the existing primary-menu and the newly created pricing-cards component, with a style consistent with the current Site. Use Tailwind utility classes inline in the HTML.

Reuse components or resources from another Site:

> In the portfolio Site, add a contact page that reuses the primary-menu component from product-showcase, and create everything else inside portfolio.

Ask for a lighter component structure when the component is simple:

> In the portfolio Site, add a promo-badge component. It is small and static, so use inline `style={{ ... }}`, with no separate style.css or controller.ts.

By default the Agent follows the recommended three-layer structure (Template / Controller / Style). It switches to an inline-style form (no `style.css`, and no `controller.ts` for static components) when you ask for it, or when the component is trivial and static.

If you have only one site, you can say:

> Please, in the default site...


## 4.3 Agent Interaction

Cross-Site reuse uses `@/site/<site>/components/<component>` references and does not copy files. If a reused component needs changes, the Agent asks you:

> Modify the source component (every Site that references it will be affected), or create a local variant in the current Site.


---


[🏠 Back to Main README](../../README.md#table-of-contents)