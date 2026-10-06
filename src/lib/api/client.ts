/**
 * HTTP client for the backend API. Not wired to any endpoint yet: the modules
 * in this folder read the local content in `@/data` until the API is ready,
 * then swap their body for a `request()` call.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Thrown by placeholder actions whose backend endpoint does not exist yet. */
export class NotConnectedError extends ApiError {
  constructor(feature: string) {
    super(`${feature} is not connected to the backend yet.`, 501);
    this.name = "NotConnectedError";
  }
}

export type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
  timeoutMs?: number;
};

export async function request<T>(
  baseUrl: string,
  path: string,
  { body, token, timeoutMs = 10_000, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    if (!response.ok) {
      throw new ApiError(data?.message ?? `Request failed (${response.status})`, response.status);
    }
    return data as T;
  } finally {
    clearTimeout(timer);
  }
}
