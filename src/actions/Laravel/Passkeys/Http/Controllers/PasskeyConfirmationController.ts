import type { UrlMethodPair } from '@inertiajs/core';
import { routeAction } from '@/lib/route-action';

export const index = (): UrlMethodPair => ({
    url: routeAction('passkeys.confirmation.options', 'get')(),
    method: 'get',
});

export const store = (): UrlMethodPair => ({
    url: routeAction('passkeys.confirmation.store', 'post')(),
    method: 'post',
});
