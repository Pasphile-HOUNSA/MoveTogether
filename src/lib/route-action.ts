import { route } from 'ziggy-js';

type RouteParams = string | number | Record<string, unknown>;
type FormMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type RouteAction = ((params?: RouteParams) => string) & {
    url: (params?: RouteParams) => string;
    form: (params?: RouteParams) => { action: string; method: FormMethod };
};

export function routeAction(name: string, method: FormMethod): RouteAction {
    const url = (params?: RouteParams) => {
        const result =
            params === undefined ? route(name) : route(name, params);
        if (typeof result !== 'string') {
            throw new Error(`Unable to resolve route "${name}".`);
        }
        return result;
    };

    return Object.assign(url, {
        url,
        form: (params?: RouteParams) => ({ action: url(params), method }),
    });
}
