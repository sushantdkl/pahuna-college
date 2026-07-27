"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingAIAssistant } from "@/components/ai/floating-ai-assistant";
import { AdminPreviewToolbar } from "@/components/admin-preview/admin-preview-toolbar";

const selfContainedRoutes = new Set(["/login", "/register", "/admin/login", "/profile", "/account-settings"]);
const selfContainedPrefixes = ["/admin", "/dashboard"];

export function AppChrome({
  children,
  adminPreviewEnabled = false,
}: {
  children: React.ReactNode;
  adminPreviewEnabled?: boolean;
}) {
  const pathname = usePathname();
  const isSelfContainedRoute =
    selfContainedRoutes.has(pathname) ||
    selfContainedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (isSelfContainedRoute) {
    return <main id="main-content" className="flex-1">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <AdminPreviewToolbar enabled={adminPreviewEnabled} />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <FloatingAIAssistant />
    </div>
  );
}
