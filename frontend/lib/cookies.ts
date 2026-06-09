import type { AuthUser } from "@/lib/api/auth";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function setCookie(name: string, value: string) {
  // Cookies keep the token and user profile available after redirecting to the dashboard.
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function storeAuthCookies(token: string, user: AuthUser) {
  setCookie("auth_token", token);
  setCookie("user_data", JSON.stringify(user));
}
