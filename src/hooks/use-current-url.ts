import { usePage } from '@inertiajs/react';
import type { UrlMethodPair } from '@inertiajs/core';

export function useCurrentUrl() {
    const { url } = usePage();
    const currentPath = new URL(url, window.location.origin).pathname;

    return {
        isCurrentUrl: (href: string | UrlMethodPair) => {
            const target = typeof href === 'string' ? href : href.url;
            return currentPath === new URL(target, window.location.origin).pathname;
        },
    };
}
