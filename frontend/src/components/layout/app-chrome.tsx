"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingAIAssistant } from "@/components/ai/floating-ai-assistant";

const selfContainedRoutes = new Set(["/login", "/register", "/admin/login", "/profile", "/account-settings"]);
const selfContainedPrefixes = ["/admin", "/dashboard"];

export function AppChrome({ children }: { children: React.ReactNode }) {
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
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <FloatingAIAssistant />
    </div>
  );
}
