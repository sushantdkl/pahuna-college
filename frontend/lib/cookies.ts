import type { AuthUser } from "@/lib/api/auth";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function setCookie(name: string, value: string) {
  // Cookies keep the token and user profile available after redirecting to the dashboard.
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function getCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((value) => value.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

export function storeAuthCookies(token: string, user: AuthUser) {
  setCookie("auth_token", token);
  setCookie("user_data", JSON.stringify(user));
}

export function clearAuthCookies() {
  document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "user_data=; path=/; max-age=0; SameSite=Lax";
}
