// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/roles";
import type { UserRole } from "@/lib/user-role";
import {
  LayoutDashboard,
  Hotel,
  FileText,
  GraduationCap,
  Briefcase,
  Users,
  MessageSquare,
  Handshake,
  Settings,
  Mail,
  MapPin,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section: string; // maps to ROLE_PERMISSIONS key
}

const navItems: SidebarItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    section: "overview",
  },
  {
    label: "Hotels",
    href: "/dashboard/hotels",
    icon: Hotel,
    section: "hotels",
  },
  {
    label: "Content",
    href: "/dashboard/content",
    icon: FileText,
    section: "content",
  },
  {
    label: "Training",
    href: "/dashboard/training",
    icon: GraduationCap,
    section: "training",
  },
  {
    label: "Consulting",
    href: "/dashboard/consulting",
    icon: Briefcase,
    section: "consulting",
  },
  {
    label: "Leads",
    href: "/dashboard/leads",
    icon: MessageSquare,
    section: "leads",
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: Mail,
    section: "messages",
  },
  {
    label: "Partners",
    href: "/dashboard/partners",
    icon: Handshake,
    section: "partners",
  },
  {
    label: "Locations",
    href: "/dashboard/locations",
    icon: MapPin,
    section: "locations",
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
    section: "users",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    section: "settings",
  },
];

interface DashboardSidebarProps {
  role: UserRole;
  open: boolean;
  onClose: () => void;
}

export function DashboardSidebar({
  role,
  open,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter((item) =>
    hasPermission(role, item.section),
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-200 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo / brand */}
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg">
              <Image
                src="/logo/pahuna-icon.svg"
                alt="Pahuna"
                width={28}
                height={28}
                className="h-7 w-7"
              />
            </div>
            <span className="text-sm">Dashboard</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {visibleItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom: back to site */}
        <div className="border-t px-3 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            â† Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}


