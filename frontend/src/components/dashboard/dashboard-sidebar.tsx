"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminNavItem = {
  label: string;
  href: string;
  section: string;
};

export const adminReplicaNavItems: AdminNavItem[] = [
  { label: "Overview", href: "/admin", section: "OV" },
  { label: "Users", href: "/dashboard/users", section: "US" },
  { label: "Inquiries", href: "/dashboard/inquiries", section: "IQ" },
  { label: "Messages", href: "/dashboard/messages", section: "MS" },
  { label: "Partners", href: "/dashboard/partners", section: "PR" },
  { label: "Reservations", href: "/dashboard/reservations", section: "RS" },
  { label: "Stays & Services", href: "/dashboard/hotels", section: "HT" },
  { label: "Food & Cafes", href: "/dashboard/food", section: "FD" },
  { label: "Destinations", href: "/dashboard/content", section: "CT" },
  { label: "Experiences", href: "/dashboard/experiences", section: "EX" },
  { label: "Trip Planner", href: "/dashboard/trip-planner", section: "TP" },
  { label: "Packages", href: "/dashboard/packages", section: "PK" },
  { label: "Routes", href: "/dashboard/routes", section: "RT" },
  { label: "Locations", href: "/dashboard/locations", section: "LC" },
  { label: "Training", href: "/dashboard/training", section: "TR" },
  { label: "Consulting", href: "/dashboard/consulting", section: "CO" },
  { label: "Blog Posts", href: "/dashboard/blog", section: "BP" },
  { label: "Settings", href: "/dashboard/settings", section: "SE" },
];

export function DashboardSidebar({ onLogout }: { onLogout?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-stone-200 bg-white md:flex">
      <div className="flex h-14 items-center border-b border-stone-200 px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Image src="/pahuna-icon.svg" alt="Pahuna" width={28} height={28} className="h-7 w-7" />
          <span className="text-sm">Dashboard</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {adminReplicaNavItems.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-[#e4f1ea] text-[#007a55]" : "text-slate-600 hover:bg-stone-100 hover:text-stone-950"
                  }`}
                >
                  <SidebarIcon label={item.label} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-stone-200 px-3 py-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-700 hover:bg-red-50 hover:text-red-800"
        >
          <span aria-hidden="true">{"<-"}</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export function DashboardMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-stone-200 bg-white px-4 py-2 md:hidden">
      {adminReplicaNavItems.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${
              active ? "bg-[#e4f1ea] text-[#007a55]" : "text-stone-500 hover:bg-stone-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarIcon({ label }: { label: string }) {
  const common = "h-4 w-4 shrink-0";
  const iconProps = {
    className: common,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  switch (label) {
    case "Overview":
      return (
        <svg {...iconProps}>
          <path d="M4 4h6v6H4z" />
          <path d="M14 4h6v6h-6z" />
          <path d="M4 14h6v6H4z" />
          <path d="M14 14h6v6h-6z" />
        </svg>
      );
    case "Stays & Services":
      return (
        <svg {...iconProps}>
          <path d="M6 20V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v15" />
          <path d="M4 20h16" />
          <path d="M9 8h1" />
          <path d="M14 8h1" />
          <path d="M9 12h1" />
          <path d="M14 12h1" />
        </svg>
      );
    case "Food & Cafes":
      return (
        <svg {...iconProps}>
          <path d="M6 3v7" />
          <path d="M10 3v7" />
          <path d="M8 10v11" />
          <path d="M16 3v18" />
          <path d="M16 3c3 2 3 7 0 9" />
        </svg>
      );
    case "Destinations":
    case "Blog Posts":
      return (
        <svg {...iconProps}>
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      );
    case "Training":
      return (
        <svg {...iconProps}>
          <path d="M4 10l8-4 8 4-8 4z" />
          <path d="M6 12v4c2 2 10 2 12 0v-4" />
        </svg>
      );
    case "Experiences":
      return (
        <svg {...iconProps}>
          <path d="M5 17 11 5l3 7 5-3-6 10-3-6z" />
          <path d="M4 20h16" />
        </svg>
      );
    case "Trip Planner":
    case "Packages":
    case "Routes":
      return (
        <svg {...iconProps}>
          <path d="M4 6h16" />
          <path d="M8 6v14" />
          <path d="M16 6v14" />
          <path d="M4 14h16" />
        </svg>
      );
    case "Consulting":
      return (
        <svg {...iconProps}>
          <path d="M10 6h4" />
          <path d="M5 8h14v11H5z" />
          <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      );
    case "Inquiries":
      return (
        <svg {...iconProps}>
          <path d="M5 6h14v10H8l-3 3z" />
        </svg>
      );
    case "Messages":
      return (
        <svg {...iconProps}>
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "Partners":
    case "Reservations":
      return (
        <svg {...iconProps}>
          {label === "Reservations" ? (
            <>
              <path d="M7 3v3" />
              <path d="M17 3v3" />
              <path d="M4 8h16" />
              <path d="M5 5h14v15H5z" />
              <path d="m8 13 2 2 5-5" />
            </>
          ) : (
            <>
              <path d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path d="M16 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path d="M3 20c1-4 9-4 10 0" />
              <path d="M11 20c1-3 7-3 10 0" />
            </>
          )}
        </svg>
      );
    case "Locations":
      return (
        <svg {...iconProps}>
          <path d="M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11z" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      );
    case "Users":
      return (
        <svg {...iconProps}>
          <path d="M16 19c0-2-2-4-4-4s-4 2-4 4" />
          <circle cx="12" cy="9" r="3" />
          <path d="M20 19c0-1.5-1-3-2.5-3.5" />
          <path d="M4 19c0-1.5 1-3 2.5-3.5" />
        </svg>
      );
    case "Settings":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2" />
          <path d="M12 19v2" />
          <path d="M3 12h2" />
          <path d="M19 12h2" />
          <path d="m5.6 5.6 1.4 1.4" />
          <path d="m17 17 1.4 1.4" />
          <path d="m18.4 5.6-1.4 1.4" />
          <path d="m7 17-1.4 1.4" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="7" />
        </svg>
      );
  }
}
