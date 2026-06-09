const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const API_BASE_URL = API_ORIGIN.endsWith("/api/v1")
  ? API_ORIGIN
  : `${API_ORIGIN.replace(/\/$/, "")}/api/v1`;

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

export async function apiPost<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
