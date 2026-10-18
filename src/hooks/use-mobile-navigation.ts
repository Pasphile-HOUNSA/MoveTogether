export function useMobileNavigation() {
    return () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };
}
