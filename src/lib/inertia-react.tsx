import type { FormEvent, MouseEvent, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

type FormMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
type RouteOptions<T = Record<string, unknown>> = {
  forceFormData?: boolean;
  preserveScroll?: boolean;
  preserveState?: boolean;
  replace?: boolean;
  resetOnSuccess?: boolean | string[];
  resetOnError?: string[];
  onSuccess?: (page?: T) => void;
  onError?: (errors?: Record<string, string | string[]>) => void;
  onFinish?: () => void;
  [key: string]: unknown;
};

export function Head({ title, children }: { title?: string; children?: ReactNode }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return <>{children ?? null}</>;
}

export function Link(props: any) {
  const { href, to, replace = false, onClick, children, className, ...rest } = props;
  const navigate = useNavigate();
  const target = typeof href === 'string' ? href : href?.url ?? to ?? '/';

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(event);
    }

    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    if (target.startsWith('http')) return;

    event.preventDefault();
    navigate(target, { replace });
  };

  return (
    <RouterLink to={target} replace={replace} className={className} onClick={handleClick} {...rest}>
      {children}
    </RouterLink>
  );
}

const navigate = (url: string, options: RouteOptions = {}) => {
  const nextUrl = url || '/';

  if (typeof window !== 'undefined') {
    if (options.replace) {
      window.history.replaceState({}, '', nextUrl);
    } else {
      window.history.pushState({}, '', nextUrl);
    }
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  options.onFinish?.();
};

export const router: any = {
  get: (url: string, options: RouteOptions = {}) => navigate(url, options),
  post: (url: string, _data?: Record<string, unknown>, options: RouteOptions = {}) => {
    options.onSuccess?.({ data: _data ?? {} });
    navigate(url, options);
    options.onError?.({});
  },
  put: (url: string, _data?: Record<string, unknown>, options: RouteOptions = {}) => {
    options.onSuccess?.({ data: _data ?? {} });
    navigate(url, options);
    options.onError?.({});
  },
  patch: (url: string, _data?: Record<string, unknown>, options: RouteOptions = {}) => {
    options.onSuccess?.({ data: _data ?? {} });
    navigate(url, options);
    options.onError?.({});
  },
  delete: (url: string, _data?: Record<string, unknown>, options: RouteOptions = {}) => {
    options.onSuccess?.({ data: _data ?? {} });
    navigate(url, options);
    options.onError?.({});
  },
  visit: (url: string, options: RouteOptions = {}) => navigate(url, options),
  reload: (options: RouteOptions = {}) => navigate(window.location.pathname + window.location.search, options),
  flushAll: () => undefined,
};

export function usePage<T = any>(): any {
  return { props: {} as T };
}

export function setLayoutProps(_props?: any) {
  return undefined;
}

export function Form({
  action,
  method = 'post',
  children,
  transform,
  ...props
}: {
  action?: string;
  method?: FormMethod;
  transform?: (data: any) => any;
  children?: ReactNode | ((props: any) => ReactNode);
  [key: string]: any;
}) {
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);

    const rawValues = Object.fromEntries(new FormData(event.currentTarget).entries());
    const values = transform ? transform(rawValues) : rawValues;
    const target = action || window.location.pathname;

    if (method === 'get') {
      const query = new URLSearchParams(values as Record<string, string>);
      const url = query.toString() ? `${target}?${query.toString()}` : target;
      window.location.assign(url);
      return;
    }

    const submitMethod = method === 'delete' ? 'delete' : method;
    const fn = (router as Record<string, unknown>)[submitMethod] as (
      url: string,
      data?: Record<string, unknown>,
      options?: RouteOptions,
    ) => void;

    fn?.(target, values as Record<string, unknown>, {
      onSuccess: () => setProcessing(false),
      onError: (nextErrors) => {
        setErrors((nextErrors as Record<string, string>) ?? {});
        setProcessing(false);
      },
      onFinish: () => setProcessing(false),
    });
  };

  const clearErrors = () => setErrors({});
  const resetAndClearErrors = () => setErrors({});

  if (typeof children === 'function') {
    return (
      <form onSubmit={handleSubmit} {...props}>
        {children({ processing, errors, data: {}, clearErrors, resetAndClearErrors })}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
}

export function useForm<T = any>(initialData: T): any {
  const [data, setDataState] = useState<T>(initialData);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setData = (key: any, value?: unknown) => {
    setDataState((prev: any) => {
      if (typeof key === 'function') {
        return key(prev);
      }

      if (typeof key === 'object') {
        return { ...prev, ...key };
      }

      return { ...prev, [key]: value };
    });
  };

  const submit = (method: 'get' | 'post' | 'put' | 'patch' | 'delete', url: string, options: RouteOptions = {}) => {
    setProcessing(true);
    const handler = (router as any)[method];
    handler?.(url, data, {
      ...options,
      onSuccess: (page?: any) => {
        setProcessing(false);
        options.onSuccess?.(page);
      },
      onError: (nextErrors?: Record<string, string | string[]>) => {
        setErrors((nextErrors as Record<string, string>) ?? {});
        setProcessing(false);
        options.onError?.(nextErrors);
      },
      onFinish: () => {
        setProcessing(false);
        options.onFinish?.();
      },
    });
  };

  const clearErrors = () => setErrors({});
  const reset = () => setDataState(initialData);

  return {
    data,
    setData,
    processing,
    errors,
    setErrors,
    clearErrors,
    reset,
    transform: (callback: (values: any) => any) => setDataState((prev: any) => callback(prev)),
    resetAndClearErrors: () => setErrors({}),
    post: (url: string, options: RouteOptions = {}) => submit('post', url, options),
    put: (url: string, options: RouteOptions = {}) => submit('put', url, options),
    patch: (url: string, options: RouteOptions = {}) => submit('patch', url, options),
    delete: (url: string, options: RouteOptions = {}) => submit('delete', url, options),
    get: (url: string, options: RouteOptions = {}) => submit('get', url, options),
  };
}
