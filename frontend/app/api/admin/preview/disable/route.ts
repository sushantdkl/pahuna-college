import { NextResponse } from "next/server";
import { ADMIN_PREVIEW_COOKIE } from "@/lib/admin-preview";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(ADMIN_PREVIEW_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
