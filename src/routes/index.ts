import { routeAction } from '@/lib/route-action';

export const dashboard = routeAction('dashboard', 'get');
export const logout = routeAction('logout', 'post');
export const register = routeAction('register', 'get');
export const login = routeAction('login', 'get');
