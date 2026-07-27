"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, User } from "lucide-react";
import { useState } from "react";
import { resolveApiAssetUrl } from "@/lib/api/axios-instance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type DashboardHeaderProps = {
  user: {
    fullName?: string | null;
    name?: string | null;
    email?: string | null;
    profileImage?: string | null;
  };
  onLogout: () => void;
};

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  const displayName = user.fullName || user.name || user.email || "Administrator";
  const profileImage = resolveApiAssetUrl(user.profileImage || undefined);
  const [isOpeningSite, setIsOpeningSite] = useState(false);

  async function openSitePreview() {
    setIsOpeningSite(true);

    try {
      const response = await fetch("/api/admin/preview/enable", { method: "POST" });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Unable to enable preview");
      }

      window.location.assign(payload.redirectTo || "/");
    } finally {
      setIsOpeningSite(false);
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold md:hidden">
        <Image src="/pahuna-icon.svg" alt="Pahuna" width={28} height={28} className="h-7 w-7" />
        <span className="text-sm">Dashboard</span>
      </Link>
      <div className="hidden md:block">
        <p className="text-sm font-semibold text-stone-950">Admin Workspace</p>
        <p className="text-xs text-stone-500">Manage stays, users, content, and safety checks</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={openSitePreview}
          disabled={isOpeningSite}
          className="hidden items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:inline-flex"
        >
          <ExternalLink className="h-4 w-4" />
          {isOpeningSite ? "Opening..." : "Open site"}
        </button>
        <div className="text-right">
          <p className="text-sm font-medium leading-none">{displayName}</p>
          <p className="mt-1 text-xs text-stone-500">Administrator</p>
        </div>
        <Avatar className="h-9 w-9 bg-emerald-50 text-emerald-800">
          <AvatarImage src={profileImage ?? undefined} alt={`${displayName} profile picture`} className="object-cover" />
          <AvatarFallback className="bg-emerald-50 font-bold text-emerald-800">
            {initials(displayName) || <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={onLogout}
          title="Sign out"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 hover:text-red-800"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "A";
}
