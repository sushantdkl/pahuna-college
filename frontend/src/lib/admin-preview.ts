import { cookies } from "next/headers";

export const ADMIN_PREVIEW_COOKIE = "pahuna_admin_preview";
export const ADMIN_PREVIEW_MAX_AGE = 60 * 60 * 2;

export type PreviewRole = "admin" | "editor" | "hotel_partner";

export function isPreviewRole(role?: string | null): role is PreviewRole {
  return ["admin", "editor", "hotel_partner"].includes(role?.toLowerCase() || "");
}

export function readRoleFromToken(token?: string | null) {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
    return typeof decoded.role === "string" ? decoded.role.toLowerCase() : null;
  } catch {
    return null;
  }
}

export async function getAdminPreviewState() {
  const cookieStore = await cookies();
  const enabled = cookieStore.get(ADMIN_PREVIEW_COOKIE)?.value === "1";
  const role = readRoleFromToken(cookieStore.get("auth_token")?.value);

  return {
    enabled: enabled && isPreviewRole(role),
    role,
  };
}
