# Pricing Cards

## Overview

Renders three pricing columns on the Site's dark glass surface. When the card grid enters the viewport, the columns appear from left to right. Reduced-motion preferences show them immediately.

## Examples

### Basic Usage

The component renders its built-in Free, Pro, and Ultra plans when `plans` is omitted.

```tsx
<div style={{background: '#333'}}>
    <PricingCards 
        plans={[
        {
            name: 'Free',
            price: '$0',
            cadence: 'per month',
            summary: 'A single published page for trying the motion set.',
            features: [
                'One published page',
                'Core motion components',
                'Community notes',
            ],
            action: 'Start free',
            href: '#',
        },
        {
            name: 'Pro',
            price: '$5',
            cadence: 'per month',
            summary: 'The working site: scroll scenes, 3D, and a shared library.',
            features: [
                'Unlimited pages',
                'Scroll and 3D scenes',
                'Shared component library',
            ],
            action: 'Start Pro',
            href: '#',
            featured: true,
        },
        {
            name: 'Ultra',
            price: '$???',
            cadence: 'per month',
            summary: 'Any expansion you desire.',
            features: [
                'Everything in Pro',
                'Custom Tools',
            ],
            action: 'Ultra',
            href: '#',
        },
    ]} 
/>
</div>
```

### Custom Plans

Pass section copy and a replacement plans array. Each plan requires all listed text and link fields; `featured` is optional.

```tsx
<div style={{background: '#333'}}>
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
</div>
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
| `name` | `string` | ✅ | Plan name. |
| `price` | `string` | ✅ | Displayed price. |
| `cadence` | `string` | ✅ | Billing period or price unit. |
| `summary` | `string` | ✅ | Short plan description. |
| `features` | `string[]` | ✅ | Feature list. |
| `action` | `string` | ✅ | Call-to-action label. |
| `href` | `string` | ✅ | Call-to-action destination. |
| `featured` | `boolean` | - | Highlights the plan when `true`. |

## Dependencies

- None. 
