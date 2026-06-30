"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { featuredStays, foodProviders } from "@/lib/pahuna-content";

type AdminNavItem = {
  label: string;
  href: string;
  section: string;
};

export const adminReplicaNavItems: AdminNavItem[] = [
  { label: "Overview", href: "/admin", section: "OV" },
  { label: "Hotels", href: "/dashboard/hotels", section: "HT" },
  { label: "Content", href: "/dashboard/content", section: "CT" },
  { label: "Training", href: "/dashboard/training", section: "TR" },
  { label: "Consulting", href: "/dashboard/consulting", section: "CO" },
  { label: "Leads", href: "/dashboard/leads", section: "LD" },
  { label: "Messages", href: "/dashboard/messages", section: "MS" },
  { label: "Partners", href: "/dashboard/partners", section: "PR" },
  { label: "Locations", href: "/dashboard/locations", section: "LC" },
  { label: "Users", href: "/admin/users", section: "US" },
  { label: "Settings", href: "/dashboard/settings", section: "SE" },
];

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Surkhet", href: "/explore" },
  { label: "Stays", href: "/hotels" },
  { label: "Food", href: "/food" },
  { label: "Destinations", href: "/destinations" },
  { label: "Trip Planner", href: "/trip-planner" },
  { label: "Contact", href: "/contact" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
];

export function AdminReplicaFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isAdmin) {
      router.replace("/profile");
    }
  }, [isAdmin, loading, pathname, router, user]);

  if (loading || !user || !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ed] px-4">
        <div className="rounded-xl border border-stone-200 bg-white px-6 py-4 text-sm font-medium text-stone-600 shadow-sm">
          Checking admin session...
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#f7f4ed] text-stone-950">
      <header className="flex h-16 shrink-0 items-center border-b border-stone-200 bg-white px-4">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-bold text-emerald-800">
            <Image src="/pahuna-icon.svg" alt="Pahuna" width={32} height={32} className="h-8 w-8" />
            <span>PAHUNA</span>
          </Link>
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto lg:flex">
            {publicLinks.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-emerald-700">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/contact" className="ml-auto shrink-0 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            Get in Touch
          </Link>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
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
            <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-100 hover:text-stone-950">
              <span aria-hidden="true">{"<-"}</span>
              Back to site
            </Link>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4">
            <Link href="/admin" className="flex items-center gap-2 font-semibold md:hidden">
              <Image src="/pahuna-icon.svg" alt="Pahuna" width={28} height={28} className="h-7 w-7" />
              <span className="text-sm">Dashboard</span>
            </Link>
            <div className="hidden md:block" />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium leading-none">{user.fullName || user.email}</p>
                <p className="mt-1 text-xs text-stone-500">Administrator</p>
              </div>
              <button
                onClick={() => logout("/admin/login")}
                title="Sign out"
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          </header>
          <nav className="flex gap-2 overflow-x-auto border-b border-stone-200 bg-white px-4 py-2 md:hidden">
            {adminReplicaNavItems.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${active ? "bg-[#e4f1ea] text-[#007a55]" : "text-stone-500 hover:bg-stone-100"}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

export function ReplicaStatCard({ title, value, subtitle, icon }: { title: string; value: string | number; subtitle?: string; icon: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-stone-500">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-stone-950">{value}</p>
          {subtitle ? <p className="text-xs text-stone-500">{subtitle}</p> : null}
        </div>
        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
          <MetricIcon name={title || icon} />
        </div>
      </div>
    </div>
  );
}

function MetricIcon({ name }: { name: string }) {
  const common = "h-5 w-5";
  const props = {
    className: common,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  const label = name.toLowerCase();

  if (label.includes("stay") || label.includes("hotel") || label.includes("provider")) {
    return (
      <svg {...props}>
        <path d="M5 20V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v15" />
        <path d="M3 20h18" />
        <path d="M9 8h1" />
        <path d="M14 8h1" />
        <path d="M9 12h1" />
        <path d="M14 12h1" />
      </svg>
    );
  }

  if (label.includes("food") || label.includes("menu")) {
    return (
      <svg {...props}>
        <path d="M7 3v8" />
        <path d="M5 3v4a2 2 0 0 0 4 0V3" />
        <path d="M7 11v10" />
        <path d="M16 3v18" />
        <path d="M16 3c2 1 3 3 3 6 0 2-1 4-3 5" />
      </svg>
    );
  }

  if (label.includes("user") || label.includes("admin")) {
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20c1-4 13-4 14 0" />
      </svg>
    );
  }

  if (label.includes("pending") || label.includes("review") || label.includes("attention")) {
    return (
      <svg {...props}>
        <path d="M12 8v5" />
        <path d="M12 17h.01" />
        <path d="M10.3 4.3 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z" />
      </svg>
    );
  }

  if (label.includes("map") || label.includes("location") || label.includes("coordinate")) {
    return (
      <svg {...props}>
        <path d="M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11z" />
        <circle cx="12" cy="10" r="2" />
      </svg>
    );
  }

  if (label.includes("session") || label.includes("safe") || label.includes("route")) {
    return (
      <svg {...props}>
        <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  if (label.includes("message") || label.includes("lead")) {
    return (
      <svg {...props}>
        <path d="M5 6h14v10H8l-3 3z" />
      </svg>
    );
  }

  if (label.includes("partner") || label.includes("consulting")) {
    return (
      <svg {...props}>
        <path d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M16 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M3 20c1-4 9-4 10 0" />
        <path d="M11 20c1-3 7-3 10 0" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path d="M4 4h6v6H4z" />
      <path d="M14 4h6v6h-6z" />
      <path d="M4 14h6v6H4z" />
      <path d="M14 14h6v6h-6z" />
    </svg>
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
    case "Hotels":
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
    case "Content":
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
    case "Consulting":
      return (
        <svg {...iconProps}>
          <path d="M10 6h4" />
          <path d="M5 8h14v11H5z" />
          <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      );
    case "Leads":
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
      return (
        <svg {...iconProps}>
          <path d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          <path d="M16 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          <path d="M3 20c1-4 9-4 10 0" />
          <path d="M11 20c1-3 7-3 10 0" />
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

export function ReplicaDataCard({ title, description, count, children }: { title: string; description?: string; count?: number; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description ? <p className="text-sm text-stone-500">{description}</p> : null}
        </div>
        {typeof count === "number" ? <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">{count}</span> : null}
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">{children}</div>
      </div>
    </section>
  );
}

export function ReplicaStatusBadge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">{children}</span>;
}

export function AdminReplicaOverviewContent({ title = "Dashboard" }: { title?: string }) {
  const pendingListings = [
    ...featuredStays.filter((stay) => stay.consentStatus === "PENDING"),
    ...foodProviders.filter((provider) => provider.verificationStatus === "PENDING"),
  ].length;
  const stats = [
    ["Stay Listings", featuredStays.length, "Listed properties", "HT"],
    ["Food Listings", foodProviders.length, "Food providers", "FD"],
    ["Pending Reviews", pendingListings, "Need attention", "PR"],
    ["Public Pages", "Live", "Home, stays, food", "PB"],
  ];
  const reviewRows = [
    ["Stay listings", featuredStays.filter((stay) => stay.consentStatus === "PENDING").length.toString(), "Verify contact consent and facilities", "/dashboard/hotels"],
    ["Food providers", foodProviders.filter((provider) => provider.verificationStatus === "PENDING").length.toString(), "Confirm menu, hours, and location", "/dashboard/food"],
    ["User access", "CRUD", "Manage role, contact fields, and accounts", "/admin/users"],
  ];
  const quickActions = [
    ["Manage users", "Create, edit, delete, search, and paginate users.", "/admin/users"],
    ["Review stays", "Check public stay records and map coverage.", "/dashboard/hotels"],
    ["Review food", "Check cafe, momo, tea, and restaurant listings.", "/dashboard/food"],
    ["Open public site", "Return to the Pahuna homepage without logging out.", "/"],
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-stone-500">Pahuna admin control room</p>
        </div>
        {pendingListings ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            {pendingListings} items need attention
          </div>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, sub, icon]) => (
          <ReplicaStatCard key={label} title={String(label)} value={value} subtitle={String(sub)} icon={String(icon)} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <ReplicaDataCard title="Action Required" description="Operational items admins should check first" count={reviewRows.length}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-medium text-stone-500">Area</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Count</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">What to do</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Open</th>
              </tr>
            </thead>
            <tbody>
              {reviewRows.map(([area, count, note, href]) => (
                <tr key={area} className="border-b last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-stone-900">{area}</td>
                  <td className="py-2.5 pr-4"><ReplicaStatusBadge>{count}</ReplicaStatusBadge></td>
                  <td className="py-2.5 pr-4 text-stone-500">{note}</td>
                  <td className="py-2.5 pr-4">
                    <Link href={href} className="font-medium text-emerald-700 hover:text-emerald-900">Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReplicaDataCard>

        <ReplicaDataCard title="Quick Actions" description="Real dashboard tasks" count={quickActions.length}>
          <div className="grid gap-3">
            {quickActions.map(([title, text, href]) => (
              <Link key={title} href={href} className="rounded-lg border border-stone-200 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/50">
                <p className="font-semibold text-stone-950">{title}</p>
                <p className="mt-1 text-sm leading-6 text-stone-500">{text}</p>
              </Link>
            ))}
          </div>
        </ReplicaDataCard>
      </div>
    </div>
  );
}

const moduleContent: Record<string, { title: string; description: string; stats: Array<[string, string | number, string, string]>; rows: string[][] }> = {
  hotels: {
    title: "Stays & Services",
    description: "Provider records for hotels, resorts, lodges, and homestays.",
    stats: [["Total Providers", featuredStays.length, "Stay records", "HT"], ["Verified", featuredStays.filter((stay) => stay.verified).length, "Confirmed listings", "VR"], ["Pending", featuredStays.filter((stay) => stay.consentStatus === "PENDING").length, "Need review", "PN"], ["Map Ready", featuredStays.filter((stay) => stay.latitude && stay.longitude).length, "With coordinates", "MP"]],
    rows: featuredStays.slice(0, 8).map((stay) => [stay.name, stay.type, stay.area, stay.verificationStatus || "PUBLIC_LISTING"]),
  },
  food: {
    title: "Food Providers",
    description: "Cafe, restaurant, momo, tea, and route food records.",
    stats: [["Food Places", foodProviders.length, "Provider records", "FD"], ["Featured", foodProviders.filter((item) => item.featured).length, "Highlighted", "FT"], ["Types", new Set(foodProviders.map((item) => item.typeLabel)).size, "Categories", "TY"], ["Pending", foodProviders.filter((item) => item.verificationStatus === "PENDING").length, "Need review", "PN"]],
    rows: foodProviders.slice(0, 8).map((item) => [item.name, item.typeLabel, item.area, item.verificationStatus || "PUBLIC_LISTING"]),
  },
  content: {
    title: "Content Management",
    description: "Public content sections prepared for moderation.",
    stats: [["Destinations", 6, "Public pages", "DS"], ["Guides", 4, "Route content", "GD"], ["Gallery", 12, "Local assets", "GL"], ["Status", "Live", "Published", "LV"]],
    rows: [["Explore Surkhet", "Published", "Hero and places", "Live"], ["Destinations", "Published", "Karnali region", "Live"], ["Gallery", "Published", "Local images", "Live"], ["Trip Planner", "Published", "Planning CTA", "Live"]],
  },
  training: {
    title: "Training",
    description: "Training enrollment UI copied as a safe admin placeholder.",
    stats: [["Enrollments", 0, "No API connected", "EN"], ["Pending", 0, "All clear", "PN"], ["Courses", 0, "Placeholder", "CR"], ["Status", "Ready", "UI shell", "RD"]],
    rows: [["Hospitality basics", "Draft", "No backend module", "Safe placeholder"], ["Local guide training", "Draft", "No backend module", "Safe placeholder"]],
  },
  consulting: {
    title: "Consulting",
    description: "Consulting lead board style from the reference dashboard.",
    stats: [["Leads", 0, "No API connected", "LD"], ["New", 0, "All handled", "NW"], ["Qualified", 0, "No records", "QL"], ["Status", "Ready", "UI shell", "RD"]],
    rows: [["Tourism partner", "No records", "Awaiting endpoint", "Placeholder"], ["Hotel onboarding", "No records", "Awaiting endpoint", "Placeholder"]],
  },
  leads: {
    title: "Leads",
    description: "Lead cards and sections adapted without adding backend calls.",
    stats: [["Hotel Leads", 0, "No endpoint", "HL"], ["Food Leads", 0, "No endpoint", "FL"], ["Unread", 0, "All clear", "UR"], ["Status", "Ready", "UI shell", "RD"]],
    rows: [["Availability inquiry", "Empty", "Connect API later", "Placeholder"], ["Partner inquiry", "Empty", "Connect API later", "Placeholder"]],
  },
  messages: {
    title: "Messages",
    description: "Contact message dashboard layout with safe empty records.",
    stats: [["Messages", 0, "No API connected", "MS"], ["Unread", 0, "All read", "UR"], ["Archived", 0, "No records", "AR"], ["Status", "Ready", "UI shell", "RD"]],
    rows: [["Contact inbox", "Empty", "No message endpoint", "Placeholder"], ["Inquiry replies", "Empty", "No message endpoint", "Placeholder"]],
  },
  partners: {
    title: "Partners",
    description: "Partner application dashboard view.",
    stats: [["Applications", 0, "No API connected", "AP"], ["Pending", 0, "All clear", "PN"], ["Approved", 0, "No records", "OK"], ["Status", "Ready", "UI shell", "RD"]],
    rows: [["Hotel partner", "Empty", "No partner endpoint", "Placeholder"], ["Food partner", "Empty", "No partner endpoint", "Placeholder"]],
  },
  locations: {
    title: "Locations",
    description: "Coordinate coverage and location management shell.",
    stats: [["Stay Coordinates", featuredStays.filter((stay) => stay.latitude && stay.longitude).length, "Map-ready stays", "ST"], ["Food Coordinates", 0, "Fallback preview", "FD"], ["Fallback", "Surkhet", "Safe center", "SK"], ["Status", "OSM", "Map enabled", "MP"]],
    rows: [["Surkhet fallback", "Active", "28.6019, 81.6339", "Map safe"], ["Stay detail maps", "Active", "Uses coordinates when available", "Live"]],
  },
  users: {
    title: "Users",
    description: "User management summary with link to the working CRUD page.",
    stats: [["CRUD", "Active", "Admin users", "US"], ["Search", "Active", "Backend query", "SR"], ["Pagination", "Active", "Meta shape", "PG"], ["Route", "Protected", "/admin/users", "RT"]],
    rows: [["User management", "Active", "Use /admin/users", "Protected"], ["Create/Edit/Delete", "Active", "Existing Sprint 4 logic", "Protected"]],
  },
  settings: {
    title: "Settings",
    description: "Launch checklist and admin safety notes.",
    stats: [["Admin Login", "Active", "Separate route", "AL"], ["Home Link", "Safe", "No logout", "HM"], ["Logout", "Button", "Explicit only", "LO"], ["Build", "Checked", "QA required", "QA"]],
    rows: [["Change default password", "Manual", "Before production", "Important"], ["Verify public listings", "Manual", "Before commercial use", "Important"], ["Keep env safe", "Manual", "Never expose secrets", "Important"]],
  },
};

export function AdminReplicaModulePage({ moduleKey }: { moduleKey: keyof typeof moduleContent }) {
  const content = moduleContent[moduleKey];

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{content.title}</h1>
          <p className="text-sm text-stone-500">{content.description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.stats.map(([title, value, subtitle, icon]) => (
            <ReplicaStatCard key={title} title={title} value={value} subtitle={subtitle} icon={icon} />
          ))}
        </div>
        <ReplicaDataCard title={`${content.title} Records`} description="Reference-style dashboard table" count={content.rows.length}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-medium text-stone-500">Name</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Type</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Detail</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {content.rows.map(([name, type, detail, status]) => (
                <tr key={`${name}-${type}`} className="border-b last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-stone-900">{name}</td>
                  <td className="py-2.5 pr-4 text-stone-500">{type}</td>
                  <td className="py-2.5 pr-4 text-stone-500">{detail}</td>
                  <td className="py-2.5 pr-4"><ReplicaStatusBadge>{status}</ReplicaStatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReplicaDataCard>
      </div>
    </AdminReplicaFrame>
  );
}
