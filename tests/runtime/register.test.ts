
// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    registerComponent,
    mountComponents,
    unmountElement,
} from '../../core/runtime/bridge/register.ts';

type Cleanup = () => void;

let componentId = 0;

function createComponent(
    controller: (element: HTMLElement) => Cleanup | void
) {
    const slug = `test-component-${++componentId}`;

    const template = vi.fn((props = {}) => ({
        ...props,
    }));

    const component = registerComponent(
        slug,
        template as never,
        controller
    );

    return {
        slug,
        template,
        component,
    };
}

function createElement(slug: string) {
    const element = document.createElement('div');

    element.setAttribute('data-component', slug);

    return element;
}

describe('runtime/bridge/register', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    // 1.
    it('should register a component', () => {
        const controller = vi.fn();

        const { slug, component } = createComponent(controller);

        expect(component).toBeTypeOf('function');

        const result = component({});

        expect(result).toHaveProperty('data-component', slug);
    });

    // 2. 
    it('should inject data-component into template props', () => {
        const { slug, template, component } = createComponent(
            () => undefined
        );

        const props = {
            className: 'hero',
            id: 'hero-section',
        };

        component(props);

        expect(template).toHaveBeenCalledWith({
            ...props,
            'data-component': slug,
        });
    });

    // 3. 
    it('should mount registered components', () => {
        const controller = vi.fn();

        const { slug } = createComponent(controller);

        const element = createElement(slug);

        document.body.appendChild(element);

        const cleanup = mountComponents();

        expect(controller).toHaveBeenCalledTimes(1);
        expect(controller).toHaveBeenCalledWith(element);

        cleanup();
    });

    // 4. 
    it('should mount multiple instances of the same component', () => {
        const controller = vi.fn();

        const { slug } = createComponent(controller);

        const first = createElement(slug);
        const second = createElement(slug);

        document.body.append(first, second);

        const cleanup = mountComponents();

        expect(controller).toHaveBeenCalledTimes(2);
        expect(controller).toHaveBeenCalledWith(first);
        expect(controller).toHaveBeenCalledWith(second);

        cleanup();
    });

    // 5. 
    it('should not mount an element more than once', () => {
        const controller = vi.fn();

        const { slug } = createComponent(controller);

        document.body.appendChild(createElement(slug));

        const cleanup1 = mountComponents();
        const cleanup2 = mountComponents();

        expect(controller).toHaveBeenCalledTimes(1);

        cleanup2();
        cleanup1();
    });

    // 6. 
    it('should only mount components inside the specified root', () => {
        const controller = vi.fn();

        const { slug } = createComponent(controller);

        const root = document.createElement('section');
        const inside = createElement(slug);
        const outside = createElement(slug);

        root.appendChild(inside);

        document.body.append(root, outside);

        const cleanup = mountComponents(root);

        expect(controller).toHaveBeenCalledTimes(1);
        expect(controller).toHaveBeenCalledWith(inside);

        cleanup();
    });

    // 7. 
    it('should mount root itself when it matches the component selector', () => {
        const controller = vi.fn();

        const { slug } = createComponent(controller);

        const root = createElement(slug);

        document.body.appendChild(root);

        const cleanup = mountComponents(root);

        expect(controller).toHaveBeenCalledTimes(1);
        expect(controller).toHaveBeenCalledWith(root);

        cleanup();
    });

    // 8. 
    it('should execute cleanup when unmounting', () => {
        const onCleanup = vi.fn();

        const { slug } = createComponent(() => onCleanup);

        document.body.appendChild(createElement(slug));

        const cleanup = mountComponents();

        cleanup();

        expect(onCleanup).toHaveBeenCalledTimes(1);
    });

    // 9.
    it('should support controllers without cleanup functions', () => {
        const controller = vi.fn();

        const { slug } = createComponent(controller);

        document.body.appendChild(createElement(slug));

        const cleanup = mountComponents();

        expect(controller).toHaveBeenCalledTimes(1);

        expect(() => cleanup()).not.toThrow();
    });

    // 10. 
    it('should continue mounting when a controller throws', () => {
        const failedController = vi.fn(() => {
            throw new Error('Mount failed');
        });

        const successController = vi.fn();

        const failed = createComponent(failedController);
        const success = createComponent(successController);

        document.body.append(
            createElement(failed.slug),
            createElement(success.slug)
        );

        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const cleanup = mountComponents();

        expect(failedController).toHaveBeenCalledTimes(1);
        expect(successController).toHaveBeenCalledTimes(1);

        cleanup();

        consoleError.mockRestore();
    });

    // 11. 
    it('should unmount an individual element', () => {
        const onCleanup = vi.fn();

        const { slug } = createComponent(() => onCleanup);

        const element = createElement(slug);

        document.body.appendChild(element);

        const cleanup = mountComponents();

        unmountElement(element);

        expect(onCleanup).toHaveBeenCalledTimes(1);

        cleanup();

        // 
        expect(onCleanup).toHaveBeenCalledTimes(1);
    });

    // 12. 
    it('should execute cleanups in reverse mounting order', () => {
        const order: number[] = [];

        const first = createComponent(() => {
            return () => order.push(1);
        });

        const second = createComponent(() => {
            return () => order.push(2);
        });

        const third = createComponent(() => {
            return () => order.push(3);
        });

        document.body.append(
            createElement(first.slug),
            createElement(second.slug),
            createElement(third.slug)
        );

        const cleanup = mountComponents();

        cleanup();

        expect(order).toEqual([3, 2, 1]);
    });

    // 13.
    it('should allow remounting after cleanup', () => {
        const controller = vi.fn();

        const { slug } = createComponent(controller);

        document.body.appendChild(createElement(slug));

        const cleanup1 = mountComponents();

        expect(controller).toHaveBeenCalledTimes(1);

        cleanup1();

        const cleanup2 = mountComponents();

        expect(controller).toHaveBeenCalledTimes(2);

        cleanup2();
    });

    // 14.
    it('should continue cleanup when another cleanup throws', () => {
        const secondCleanup = vi.fn();
        const thirdCleanup = vi.fn();

        const first = createComponent(() => () => {
            throw new Error('Cleanup failed');
        });

        const second = createComponent(() => secondCleanup);
        const third = createComponent(() => thirdCleanup);

        document.body.append(
            createElement(first.slug),
            createElement(second.slug),
            createElement(third.slug)
        );

        const consoleError = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const cleanup = mountComponents();

        expect(() => cleanup()).not.toThrow();

        expect(secondCleanup).toHaveBeenCalledTimes(1);
        expect(thirdCleanup).toHaveBeenCalledTimes(1);

        consoleError.mockRestore();
    });
});
