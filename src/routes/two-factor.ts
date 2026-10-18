import { routeAction } from '@/lib/route-action';

export const enable = routeAction('two-factor.enable', 'post');
export const disable = routeAction('two-factor.disable', 'delete');
export const confirm = routeAction('two-factor.confirm', 'post');
export const regenerateRecoveryCodes = routeAction(
    'two-factor.recovery-codes.regenerate',
    'post',
);
