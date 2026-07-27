"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LayoutDashboard, LogOut, Pencil, Plus } from "lucide-react";

type AdminPreviewToolbarProps = {
  enabled: boolean;
};

const hiddenPrefixes = ["/admin", "/dashboard", "/login", "/register", "/profile", "/account-settings"];

function routeActions(pathname: string) {
  if (pathname.startsWith("/hotels/")) {
    return {
      editLabel: "Edit This Stay",
      addLabel: "Add Stay",
      manageHref: "/dashboard/hotels",
    };
  }

  if (pathname === "/hotels") {
    return {
      editLabel: "Manage Stays",
      addLabel: "Add Stay",
      manageHref: "/dashboard/hotels",
    };
  }

  if (pathname.startsWith("/food")) {
    return { editLabel: "Manage Food", addLabel: "Add Food Provider", manageHref: "/dashboard/food" };
  }

  if (pathname.startsWith("/destinations")) {
    return { editLabel: "Manage Destinations", addLabel: "Add Destination", manageHref: "/dashboard/content" };
  }

  if (pathname.startsWith("/experiences")) {
    return { editLabel: "Manage Experiences", addLabel: "Add Experience", manageHref: "/dashboard/experiences" };
  }

  if (pathname.startsWith("/training")) {
    return { editLabel: "Manage Courses", addLabel: "Add Course", manageHref: "/dashboard/training" };
  }

  if (pathname.startsWith("/consulting")) {
    return { editLabel: "Manage Services", addLabel: "Add Service", manageHref: "/dashboard/consulting" };
  }

  if (pathname.startsWith("/blog")) {
    return { editLabel: "Manage Posts", addLabel: "Create Blog Post", manageHref: "/dashboard/blog" };
  }

  return { editLabel: "Manage Content", addLabel: "Add Content", manageHref: "/dashboard" };
}

export function AdminPreviewToolbar({ enabled }: AdminPreviewToolbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (!enabled || hiddenPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return null;
  }

  const actions = routeActions(pathname);

  async function exitPreview() {
    await fetch("/api/admin/preview/disable", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="sticky top-0 z-[60] border-b border-emerald-900/10 bg-[#fffdf7]/95 px-3 py-2 text-stone-900 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-xs font-black">
        <span className="rounded-full bg-emerald-700 px-3 py-1.5 uppercase tracking-[0.18em] text-white">
          Admin Preview
        </span>
        <Link href={actions.manageHref} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-emerald-800 hover:bg-emerald-50">
          <Pencil className="h-3.5 w-3.5" />
          {actions.editLabel}
        </Link>
        <Link href={actions.manageHref} className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-900 hover:bg-amber-100">
          <Plus className="h-3.5 w-3.5" />
          {actions.addLabel}
        </Link>
        <Link href="/dashboard" className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-stone-700 hover:bg-stone-50">
          <LayoutDashboard className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
        <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-stone-700 hover:bg-stone-50">
          <ExternalLink className="h-3.5 w-3.5" />
          Public Home
        </a>
        <button type="button" onClick={exitPreview} className="ml-auto inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-red-700 hover:bg-red-100">
          <LogOut className="h-3.5 w-3.5" />
          Exit Preview
        </button>
      </div>
    </div>
  );
}
