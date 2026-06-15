import { getCookie } from "@/lib/cookies";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const API_BASE_URL = API_ORIGIN.endsWith("/api/v1")
  ? API_ORIGIN
  : `${API_ORIGIN.replace(/\/$/, "")}/api/v1`;

// Shared response shape mirrors the Express ApiResponseHelper used by the backend.
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

type ApiRequestOptions = {
  method: "GET" | "POST" | "PATCH";
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

  // All auth requests pass through this helper so base URL and error handling stay consistent.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method,
    headers,
    body: requestBody,
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function apiGet<T>(path: string, auth = false) {
  return apiRequest<T>(path, { method: "GET", auth });
}

export function apiPost<T>(path: string, body: Record<string, unknown>) {
  return apiRequest<T>(path, { method: "POST", body });
}

export function apiPatch<T>(
  path: string,
  body: Record<string, unknown> | FormData,
  auth = false,
) {
  return apiRequest<T>(path, { method: "PATCH", body, auth });
}
