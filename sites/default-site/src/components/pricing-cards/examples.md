# Pricing Cards

## Overview

Renders three pricing columns on the Site's dark glass surface. When the card grid enters the viewport, the columns appear from left to right. Reduced-motion preferences show them immediately.

## Examples

### Basic Usage

The component renders its built-in Free, Pro, and Ultra plans when `plans` is omitted.

```tsx
<PricingCards />
```

### Custom Plans

Pass section copy and a replacement plans array. Each plan requires all listed text and link fields; `featured` is optional.

```tsx
<PricingCards
    kicker="Plans"
    title="Choose a pace"
    description="Three ways to publish interactive pages."
    plans={[
        {
            name: 'Starter',
            price: '$0',
            cadence: 'per month',
            summary: 'A single published page.',
            features: ['One published page', 'Core motion components'],
            action: 'Start free',
            href: './samplepage-1.html',
        },
        {
            name: 'Studio',
            price: '$48',
            cadence: 'per month',
            summary: 'The working site.',
            features: ['Unlimited pages', 'Scroll and 3D scenes'],
            action: 'Start studio',
            href: './samplepage-2.html',
            featured: true,
        },
    ]}
/>
```

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `kicker` | `string` | `'Plans'` | - | Small label above the title. |
| `title` | `string` | `'Choose a pace'` | - | Section heading. |
| `description` | `string` | Component's built-in description | - | Short paragraph under the heading. |
| `plans` | `PricingPlan[]` | Free, Pro, and Ultra | - | Replaces the default pricing columns. |

### PricingPlan

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Plan name. |
| `price` | `string` | Yes | Displayed price. |
| `cadence` | `string` | Yes | Billing period or price unit. |
| `summary` | `string` | Yes | Short plan description. |
| `features` | `string[]` | Yes | Feature list. |
| `action` | `string` | Yes | Call-to-action label. |
| `href` | `string` | Yes | Call-to-action destination. |
| `featured` | `boolean` | No | Highlights the plan when `true`. |

## Dependencies

- None. Entrance timing uses `IntersectionObserver` and CSS transitions.
