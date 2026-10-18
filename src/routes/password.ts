import { routeAction } from '@/lib/route-action';

export const request = routeAction('password.request', 'get');
export const email = routeAction('password.email', 'post');
export const update = routeAction('password.update', 'post');
