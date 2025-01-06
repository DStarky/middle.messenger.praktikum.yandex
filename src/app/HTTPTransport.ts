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
  data?: Record<string, unknown> | string;
  timeout?: number;
};

function queryStringify(data: Record<string, unknown>): string {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    return `${result}${key}=${encodeURIComponent(
      String(data[key]),
    )}${index < keys.length - 1 ? '&' : ''}`;
  }, '?');
}

export class HTTPTransport {
  get = (
    url: string,
    options: RequestOptions = {},
  ): Promise<XMLHttpRequest> => {
    return this.request(
      url,
      { ...options, method: METHODS.GET },
      options.timeout,
    );
  };

  post = (
    url: string,
    options: RequestOptions = {},
  ): Promise<XMLHttpRequest> => {
    return this.request(
      url,
      { ...options, method: METHODS.POST },
      options.timeout,
    );
  };

  put = (
    url: string,
    options: RequestOptions = {},
  ): Promise<XMLHttpRequest> => {
    return this.request(
      url,
      { ...options, method: METHODS.PUT },
      options.timeout,
    );
  };

  delete = (
    url: string,
    options: RequestOptions = {},
  ): Promise<XMLHttpRequest> => {
    return this.request(
      url,
      { ...options, method: METHODS.DELETE },
      options.timeout,
    );
  };

  request = (
    url: string,
    options: RequestOptions = {},
    timeout: number = 5000,
  ): Promise<XMLHttpRequest> => {
    const { headers = {}, method, data } = options;

    return new Promise<XMLHttpRequest>(function (resolve, reject) {
      if (!method) {
        reject(new Error('No method'));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      xhr.open(
        method,
        isGet && !!data
          ? `${url}${queryStringify(data as Record<string, unknown>)}`
          : url,
      );

      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        resolve(xhr);
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
        } else {
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify(data));
        }
      }
    });
  };
}
