import { mountComponents } from './bridge/register.ts';
import { debugAll } from '../utils/debug.ts';

let cleanupComponents: (() => void) | undefined;

function start() {
    if (cleanupComponents) return;

    debugAll('[WKF][RUNTIME][ONLY DEV] Runtime started ✅');

    cleanupComponents = mountComponents();

    debugAll('[WKF][RUNTIME][ONLY DEV] Components mounted ✅');
}

function stop() {
    cleanupComponents?.();
    cleanupComponents = undefined;
}

// Start after the DOM is ready.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, {
        once: true,
    });
} else {
    start();
}

// HMR support.
if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        stop();
    });
}