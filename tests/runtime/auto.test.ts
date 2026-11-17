
 // @vitest-environment happy-dom

import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

vi.mock('../../core/runtime/bridge/register.ts', () => ({
    mountComponents: vi.fn(),
}));

vi.mock('../../core/utils/debug.ts', () => ({
    debugAll: vi.fn(),
}));

import { mountComponents } from '../../core/runtime/bridge/register.ts';

const mountMock = vi.mocked(mountComponents);

const readyStateDescriptor = Object.getOwnPropertyDescriptor(
    document,
    'readyState'
);

function setReadyState(state: DocumentReadyState) {
    Object.defineProperty(document, 'readyState', {
        configurable: true,
        get: () => state,
    });
}

describe('runtime/auto', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();

        document.removeEventListener('DOMContentLoaded', () => {});
        document.body.innerHTML = '';
    });

    afterEach(() => {
        if (readyStateDescriptor) {
            Object.defineProperty(
                document,
                'readyState',
                readyStateDescriptor
            );
        } else {
            Reflect.deleteProperty(document, 'readyState');
        }
    });

    // 1. 
    it('should wait for DOMContentLoaded before mounting', async () => {
        const cleanup = vi.fn();

        mountMock.mockReturnValue(cleanup);

        setReadyState('loading');

        await import('../../core/runtime/auto.ts');

        expect(mountMock).not.toHaveBeenCalled();

        document.dispatchEvent(
            new Event('DOMContentLoaded')
        );

        expect(mountMock).toHaveBeenCalledTimes(1);
    });

    // 2.
    it('should start immediately when DOM is already ready', async () => {
        const cleanup = vi.fn();

        mountMock.mockReturnValue(cleanup);

        setReadyState('interactive');

        await import('../../core/runtime/auto.ts');

        expect(mountMock).toHaveBeenCalledTimes(1);
    });

    // 3. 
    it('should start immediately when document is complete', async () => {
        const cleanup = vi.fn();

        mountMock.mockReturnValue(cleanup);

        setReadyState('complete');

        await import('../../core/runtime/auto.ts');

        expect(mountMock).toHaveBeenCalledTimes(1);
    });

    // 4. 
    it('should mount only once after DOMContentLoaded', async () => {
        const cleanup = vi.fn();

        mountMock.mockReturnValue(cleanup);

        setReadyState('loading');

        await import('../../core/runtime/auto.ts');

        document.dispatchEvent(
            new Event('DOMContentLoaded')
        );

        document.dispatchEvent(
            new Event('DOMContentLoaded')
        );

        expect(mountMock).toHaveBeenCalledTimes(1);
    });
});
