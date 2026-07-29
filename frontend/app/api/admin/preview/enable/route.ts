import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_PREVIEW_COOKIE,
  ADMIN_PREVIEW_MAX_AGE,
  isPreviewRole,
} from "@/lib/admin-preview";

function getApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";
  const origin = configured.endsWith("/api/v1")
    ? configured
    : `${configured.replace(/\/$/, "")}/api/v1`;

  return origin;
}

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/whoami`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const payload = await response.json();
  const role = payload?.data?.user?.role;

  if (!isPreviewRole(role)) {
    return NextResponse.json({ success: false, message: "Preview mode is restricted" }, { status: 403 });
  }

  const redirectTo = new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001");
  const result = NextResponse.json({ success: true, redirectTo: redirectTo.pathname });

  result.cookies.set(ADMIN_PREVIEW_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_PREVIEW_MAX_AGE,
  });

  return result;
}
