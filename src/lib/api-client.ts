/**
 * Client API centralisé MoveTogether pour communiquer avec le backend Express
 * Gère automatiquement :
 * - L'URL de base (VITE_API_URL ou http://localhost:5000/api)
 * - L'envoi du token JWT (Bearer Token) stocké dans localStorage
 * - Les en-têtes JSON et FormData (Multipart)
 * - La gestion propre des erreurs HTTP
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('movetogether_token');
}

export interface ApiFetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const token = getStoredToken();
  const { params, headers, ...restOptions } = options;

  let url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs;
    }
  }

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
  };

  // N'ajoute pas de Content-Type si le body est un FormData (le navigateur ajoute multipart/form-data + boundary automatiquement)
  if (!(restOptions.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const finalHeaders = {
    ...defaultHeaders,
    ...(headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...restOptions,
    headers: finalHeaders,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMsg =
      (typeof data === 'object' && data?.error) ||
      (typeof data === 'object' && data?.message) ||
      `Erreur HTTP ${response.status}`;
    const err: any = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

apiClient.get = <T = any>(endpoint: string, params?: Record<string, any>) =>
  apiClient<T>(endpoint, { method: 'GET', params });

apiClient.post = <T = any>(endpoint: string, body?: any) =>
  apiClient<T>(endpoint, {
    method: 'POST',
    body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
  });

apiClient.put = <T = any>(endpoint: string, body?: any) =>
  apiClient<T>(endpoint, {
    method: 'PUT',
    body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
  });

apiClient.patch = <T = any>(endpoint: string, body?: any) =>
  apiClient<T>(endpoint, {
    method: 'PATCH',
    body: body instanceof FormData ? body : (body !== undefined ? JSON.stringify(body) : undefined),
  });

apiClient.delete = <T = any>(endpoint: string) =>
  apiClient<T>(endpoint, { method: 'DELETE' });

apiClient.upload = <T = any>(endpoint: string, formData: FormData) =>
  apiClient<T>(endpoint, {
    method: 'POST',
    body: formData,
  });

export default apiClient;
