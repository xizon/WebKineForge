# Scene Item

## Overview

Defines one sticky scene panel inside a `Scenes` stack. Its content remains at full opacity while it covers the preceding scene. Optional per-item settings override the defaults supplied by `Scenes`.

## Examples

### Basic Usage

Use `SceneItem` as a child of `Scenes`.

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
            <h2>Opening Scene</h2>
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
            <h2>Next Scene</h2>
        </section>
    </SceneItem>
</Scenes>
```

### Override Scene Defaults

Set `coveredOpacity` or `coverOffset` on an individual item when it needs different behavior from the parent `Scenes` configuration.

```tsx
<Scenes coveredOpacity={0.4} coverOffset="50vh">
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
            <h2>Default Transition</h2>
        </section>
    </SceneItem>

    <SceneItem coveredOpacity={0.2} coverOffset="80vh">
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
            <h2>Custom Transition</h2>
        </section>
    </SceneItem>
</Scenes>
```

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `any` | - | - | Content rendered inside the scene panel. |
| `coveredOpacity` | `number` | Inherited from `Scenes` | - | Opacity of the covered portion of the previous scene. |
| `coverOffset` | `number \| string` | Inherited from `Scenes` | - | Travel distance for this scene as it covers the previous one. Accepts a number or CSS length. |

## Dependencies

- `scenes`
