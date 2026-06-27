import { getCookie } from "@/lib/cookies";

function getApiBaseUrl() {
  const configuredOrigin = process.env.NEXT_PUBLIC_API_URL;
  const runtimeOrigin = typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:4000`
    : "http://localhost:4000";
  const apiOrigin = configuredOrigin || runtimeOrigin;

  return apiOrigin.endsWith("/api/v1")
    ? apiOrigin
    : `${apiOrigin.replace(/\/$/, "")}/api/v1`;
}

// Shared response shape mirrors the Express ApiResponseHelper used by the backend.
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ApiRequestOptions = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  body?: Record<string, unknown> | FormData;
  auth?: boolean;
};

async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions,
): Promise<ApiResponse<T>> {
  const headers = new Headers();
  const token = options.auth ? getCookie("auth_token") : null;
  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const requestBody: BodyInit | undefined = options.body instanceof FormData
    ? options.body
    : options.body
      ? JSON.stringify(options.body)
      : undefined;

  const apiBaseUrl = getApiBaseUrl();
  let response: Response;

  try {
    // All auth requests pass through this helper so base URL and error handling stay consistent.
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: options.method,
      headers,
      body: requestBody,
    });
  } catch {
    throw new Error(`Cannot connect to the backend API at ${apiBaseUrl}`);
  }

  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function apiGet<T>(path: string, auth = false) {
  return apiRequest<T>(path, { method: "GET", auth });
}

export function apiPost<T>(
  path: string,
  body: Record<string, unknown>,
  auth = false,
) {
  return apiRequest<T>(path, { method: "POST", body, auth });
}

export function apiPatch<T>(
  path: string,
  body: Record<string, unknown> | FormData,
  auth = false,
) {
  return apiRequest<T>(path, { method: "PATCH", body, auth });
}

export function apiDelete<T>(path: string, auth = false) {
  return apiRequest<T>(path, { method: "DELETE", auth });
}
