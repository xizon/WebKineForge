export function mount(element: HTMLElement | null): (() => void) | void {
    if (element === null) return;
    return () => {};
}
