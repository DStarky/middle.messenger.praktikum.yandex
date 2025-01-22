import { router } from './Router';
import type { Route } from './routes';
import { publicRoutes, ROUTES } from './routes';
import store from './Store';

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

type Method = (typeof METHODS)[keyof typeof METHODS];

type RequestOptions = {
  method?: Method;
  headers?: Record<string, string>;
  data?: Record<string, unknown> | string | FormData;
  timeout?: number;
};

type HTTPMethod = <R = unknown>(
  url: string,
  options?: RequestOptions,
) => Promise<R>;

function queryStringify(data: Record<string, unknown>): string {
  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    return `${result}${key}=${encodeURIComponent(String(data[key]))}${
      index < keys.length - 1 ? '&' : ''
    }`;
  }, '?');
}

export class HTTPTransport {
  get: HTTPMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.GET }, options.timeout);

  put: HTTPMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.PUT }, options.timeout);

  post: HTTPMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.POST }, options.timeout);

  delete: HTTPMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.DELETE }, options.timeout);

  request = <R = unknown>(
    url: string,
    options: RequestOptions = {},
    timeout: number = 5000,
  ): Promise<R> => {
    const { headers = {}, method, data } = options;
    return new Promise<R>((resolve, reject) => {
      if (!method) {
        reject(new Error('No method'));
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      const isGet = method === METHODS.GET;
      xhr.open(
        method,
        isGet && data
          ? `${url}${queryStringify(data as Record<string, unknown>)}`
          : url,
      );
      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });
      xhr.onload = function () {
        if (xhr.status === 401) {
          store.set('user', null);
          const currentPath = window.location.pathname as Route;
          if (!publicRoutes.includes(currentPath)) {
            router.navigate(ROUTES.MAIN);
          }

          reject(new Error('Unauthorized'));
          return;
        }

        try {
          const responseData = JSON.parse(xhr.responseText) as R;
          resolve(responseData);
        } catch (e: Error | unknown) {
          console.error(e);
          resolve(xhr.responseText as unknown as R);
        }
      };

      xhr.onabort = () => reject(new Error('Request aborted'));
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.timeout = timeout;
      xhr.ontimeout = () => reject(new Error('Request timed out'));
      if (isGet || !data) {
        xhr.send();
      } else {
        if (typeof data === 'string') {
          xhr.send(data);
        } else if (data instanceof FormData) {
          xhr.send(data);
        } else {
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify(data));
        }
      }
    });
  };
}
