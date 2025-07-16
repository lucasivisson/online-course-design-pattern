// lib/api.ts

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  headers?: HeadersInit;
  params?: Record<string, string | number>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

function buildQuery(params?: Record<string, string | number>) {
  if (!params) return "";
  const query = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  return query ? `?${query}` : "";
}

async function request<TResponse = unknown, TRequest = unknown>(
  method: HttpMethod,
  url: string,
  data?: TRequest,
  options: RequestOptions = {}
): Promise<TResponse> {
  const { headers = {}, params, cache, next } = options;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const query = buildQuery(params);
  const fullUrl = `${API_URL}${url}${query}`;

  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: ["GET", "HEAD"].includes(method) ? undefined : JSON.stringify(data),
    cache,
    next,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw {
      status: res.status,
      message: error?.message || "Request failed",
      raw: error,
    };
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json();
  }

  return res.text() as unknown as TResponse;
}

export const api = {
  get: <TResponse>(url: string, options?: RequestOptions) =>
    request<TResponse>("GET", url, undefined, options),

  post: <TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    options?: RequestOptions
  ) => request<TResponse, TRequest>("POST", url, data, options),

  put: <TResponse, TRequest = unknown>(
    url: string,
    data: TRequest,
    options?: RequestOptions
  ) => request<TResponse, TRequest>("PUT", url, data, options),

  patch: <TResponse, TRequest = unknown>(
    url: string,
    data: TRequest,
    options?: RequestOptions
  ) => request<TResponse, TRequest>("PATCH", url, data, options),

  delete: <TResponse>(url: string, options?: RequestOptions) =>
    request<TResponse>("DELETE", url, undefined, options),
};
