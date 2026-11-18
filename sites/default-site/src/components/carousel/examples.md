# Carousel

## Overview

A reusable content carousel that supports text, HTML, SVG, and image slides. It automatically generates navigation dots based on the number of slides and supports autoplay, pointer-based dragging, and keyboard navigation.

## Examples

### Basic Usage

Pass an array of content elements as `slides`.

```tsx
<Carousel
    slides={[
        <div>First slide</div>,
        <div>Second slide</div>,
        <div>Third slide</div>,
    ]}
/>
```

### Image Slides

Use images as slide content.

```tsx
<Carousel
    slides={[
        <img src="./assets/images/photo-01.jpg" alt="Slide 1" />,
        <img src="./assets/images/photo-02.jpg" alt="Slide 2" />,
        <img src="./assets/images/photo-03.jpg" alt="Slide 3" />,
    ]}
/>
```

### Mixed Content

Combine text, images, and SVG elements in the same carousel.

```tsx
<Carousel
    slides={[
        <div>HTML content</div>,
        <img src="./assets/images/photo-01.jpg" alt="Product" />,
        <svg width="500px" height="500px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="Image"><rect x="2" y="6" width="28" height="20" rx="1" ry="1" fill="#5f7cf9"/><path d="M30,16.58V25a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1v-.5l12.4-9.3a1,1,0,0,1,1.2,0l3.31,2.48,5.38-5.39a1,1,0,0,1,1.42,0Z" fill="#8c9eff"/><path d="M19,13a1,1,0,0,1-.38-.08,1.15,1.15,0,0,1-.33-.21,1,1,0,0,1-.21-1.09.9.9,0,0,1,.54-.54.93.93,0,0,1,.57-.06.6.6,0,0,1,.19.06.76.76,0,0,1,.18.09l.15.12a1.15,1.15,0,0,1,.21.33,1,1,0,0,1-.21,1.09,1.15,1.15,0,0,1-.33.21A1,1,0,0,1,19,13Z" fill="#4062ed"/><path d="M29,6H19V26H29a1,1,0,0,0,1-1V7A1,1,0,0,0,29,6Z" fill="#4062ed"/><path d="M19.71,11.29l-.15-.12a.76.76,0,0,0-.18-.09.6.6,0,0,0-.19-.06H19v2a1,1,0,0,0,.38-.08,1.15,1.15,0,0,0,.33-.21,1,1,0,0,0,.21-1.09A1.15,1.15,0,0,0,19.71,11.29Z" fill="#2f58dd"/><path d="M24.29,12.29,19,17.59V26H29a1,1,0,0,0,1-1V16.58l-4.29-4.29A1,1,0,0,0,24.29,12.29Z" fill="#5f7cf9"/></g></svg>
    ]}
/>
```

### Disable Autoplay

Set `autoplay` to `false` to allow manual navigation only.

```tsx
<Carousel
    slides={[
        <div>First slide</div>,
        <div>Second slide</div>,
        <div>Third slide</div>,
    ]}
    autoplay={false}
/>
```

### Customize Playback

Set the autoplay interval and initial slide.

```tsx
<Carousel
    slides={[
        <div>First slide</div>,
        <div>Second slide</div>,
        <div>Third slide</div>,
    ]}
    interval={5000}
    initialIndex={1}
/>
```

### Disable Navigation Dots or Dragging

Use `showDots` and `draggable` to control navigation behavior.

```tsx
<Carousel
    slides={[
        <div>First slide</div>,
        <div>Second slide</div>,
        <div>Third slide</div>,
    ]}
    showDots={false}
    draggable={false}
/>
```

## API Reference

| Parameter | Type | Default | Required | Description |
|---|---|---|---|---|
| `slides` | `any[]` | `[]` | ✅ | An array of slide content. Supports text, HTML, SVG, images, and mixed content. |
| `autoplay` | `boolean` | `true` | - | Automatically advances to the next slide. |
| `interval` | `number` | `3000` | - | Time between autoplay transitions, in milliseconds. |
| `initialIndex` | `number` | `0` | - | Index of the initially active slide. |
| `showDots` | `boolean` | `true` | - | Displays navigation dots generated from the slide count. |
| `draggable` | `boolean` | `true` | - | Enables pointer-based dragging to switch slides. |

## Dependencies

- `gsap`