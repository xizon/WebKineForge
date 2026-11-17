/**
 * Debug
 */
const DEBUG = import.meta.env.DEV;

export function debugAll(...args: unknown[]) {
    if (DEBUG) {
        console.log(...args);
    }
}

export function debugBrowser(...args: unknown[]) {
    if (DEBUG && typeof window !== 'undefined') {
        console.log(...args);
    }
}