// @ts-nocheck
"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@backend/lib/roles";
import { Menu, LogOut } from "lucide-react";
import type { UserRole } from "@backend/lib/user-role";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: UserRole;
  };
  onMenuClick: () => void;
}

export function DashboardHeader({ user, onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Spacer on desktop */}
      <div className="hidden md:block" />

      {/* User info + sign out */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium leading-none">
            {user.name || user.email}
          </p>
          <p className="text-xs text-muted-foreground">
            {ROLE_LABELS[user.role]}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}


