# Scenes

## Overview

A wrapper for a stack of `SceneItem` children. Each subsequent scene covers the previous one during scrolling. The wrapper provides default cover opacity and travel distance for its child scenes.

## Examples

### Basic Usage

Place `SceneItem` components inside `Scenes`. Each scene should contain a panel with the content for that stage.

```tsx
<Scenes>
    <SceneItem>
        <section
            style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                boxSizing: 'border-box',
                padding: '48px',
                background: '#172554',
                color: '#ffffff',
            }}
        >
            <h2>First Scene</h2>
        </section>
    </SceneItem>

    <SceneItem>
        <section
            style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                boxSizing: 'border-box',
                padding: '48px',
                background: '#0f766e',
                color: '#ffffff',
            }}
        >
            <h2>Second Scene</h2>
        </section>
    </SceneItem>
</Scenes>
```

### Configure the Stack

`coveredOpacity` controls the visible opacity of the covered part of the scene underneath. `coverOffset` controls how far the incoming scene travels; it accepts a number or a CSS length such as `50vh` or `120px`.

```tsx
<Scenes coveredOpacity={0.25} coverOffset="65vh">
    <SceneItem>
        <section
            style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                boxSizing: 'border-box',
                padding: '48px',
                background: '#1e293b',
                color: '#ffffff',
            }}
        >
            <h2>First Scene</h2>
        </section>
    </SceneItem>

    <SceneItem coveredOpacity={0.5} coverOffset="40vh">
        <section
            style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                boxSizing: 'border-box',
                padding: '48px',
                background: '#9a3412',
                color: '#ffffff',
            }}
        >
            <h2>Second Scene</h2>
        </section>
    </SceneItem>
</Scenes>
```

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `any` | - | - | SceneItem elements to be stacked. |
| `coveredOpacity` | `number` | `0.4` | - | Opacity applied to the covered portion of the scene underneath. |
| `coverOffset` | `number \| string` | `'50vh'` | - | Travel distance of the incoming scene. Accepts a number or CSS length. |

## Dependencies

- `gsap` and `gsap/ScrollTrigger` - Scroll-driven scene transitions.
- `scene-item` - Child component used to define each scene.
