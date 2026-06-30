"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardFrame } from "@/app/_components/pahuna-layout";
import { useAuth } from "@/context/AuthContext";
import { featuredStays, foodProviders } from "@/lib/pahuna-content";

const adminNavItems = [
  { label: "Overview", href: "/admin", active: true, section: "OV" },
  { label: "Users", href: "/admin/users", section: "US" },
  { label: "Stays", href: "/hotels", section: "ST" },
  { label: "Food", href: "/food", section: "FD" },
  { label: "Public Site", href: "/", section: "PB" },
];

const dashboardRows = [
  { area: "User management", status: "Protected", detail: "Sprint 4 CRUD, search, pagination, create/edit/delete dialogs", href: "/admin/users" },
  { area: "Stay listings", status: "Public", detail: "Hotel, resort, lodge, homestay records with detail pages and map preview", href: "/hotels" },
  { area: "Food listings", status: "Public", detail: "Cafe, momo, route food, restaurant, and event food listings with filters", href: "/food" },
  { area: "Route safety", status: "Active", detail: "Admin login, public navigation, and logout-only session clearing", href: "/" },
];

const systemRows = [
  ["Admin login", "Active", "Separate /admin/login route"],
  ["User CRUD", "Protected", "Admin-only endpoint flow"],
  ["Public navigation", "Safe", "Home does not logout"],
  ["OpenStreetMap", "Enabled", "Stay previews use map component"],
];

export default function AdminOverviewPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/admin/login?redirect=/admin");
      return;
    }

    if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, loading, router, user]);

  if (loading || !user || !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4ed] px-4">
        <div className="rounded-xl border border-stone-200 bg-white px-6 py-4 text-center shadow-sm">
          <p className="text-sm font-medium text-stone-600">Checking admin session...</p>
        </div>
      </main>
    );
  }

  const verifiedStays = featuredStays.filter((stay) => stay.verified).length;
  const featuredFood = foodProviders.filter((provider) => provider.featured).length;
  const pendingListings = [
    ...featuredStays.filter((stay) => stay.consentStatus === "PENDING"),
    ...foodProviders.filter((provider) => provider.verificationStatus === "PENDING"),
  ].length;

  const checks = [
    ...systemRows,
    ["Listing review", pendingListings ? "Pending" : "Clear", `${pendingListings} pending`],
  ];

  return (
    <DashboardFrame
      title="Dashboard"
      eyebrow="Pahuna Admin"
      navItems={adminNavItems}
      action={
        <>
          <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-950">
            Home
          </Link>
          <button onClick={() => logout("/admin/login")} className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-red-600">
            Logout
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-stone-500">Welcome back, {user.fullName || user.email} - Admin</p>
          </div>
          {pendingListings > 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm">
              <span className="text-amber-600">!</span>
              <span className="font-medium text-amber-800">{pendingListings} items need attention</span>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Stay Listings" value={featuredStays.length} subtitle={`${verifiedStays} verified`} icon="ST" />
          <StatCard title="Food Listings" value={foodProviders.length} subtitle={`${featuredFood} featured`} icon="FD" />
          <StatCard title="Admin Users" value="CRUD" subtitle="Search, paginate, edit" icon="US" />
          <StatCard title="Route Safety" value="Active" subtitle="Admin/public auth split" icon="RS" />
          <StatCard title="Pending Reviews" value={pendingListings} subtitle="Need attention" icon="PR" />
          <StatCard title="Public Pages" value="Live" subtitle="Home, stays, food" icon="PB" />
          <StatCard title="Maps" value="OSM" subtitle="Preview enabled" icon="MP" />
          <StatCard title="Session" value="Safe" subtitle="Logout button only" icon="SE" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DataCard title="Admin Modules" description="Current Pahuna admin routes" count={dashboardRows.length}>
            <table className="w-full text-sm" aria-label="Admin modules">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-medium text-stone-500">Area</th>
                  <th className="pb-2 pr-4 font-medium text-stone-500">Status</th>
                  <th className="pb-2 pr-4 font-medium text-stone-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboardRows.map((row) => (
                  <tr key={row.area} className="border-b last:border-0">
                    <td className="py-2.5 pr-4">
                      <p className="font-medium text-stone-900">{row.area}</p>
                      <p className="mt-1 text-xs text-stone-500">{row.detail}</p>
                    </td>
                    <td className="py-2.5 pr-4">
                      <StatusPill>{row.status}</StatusPill>
                    </td>
                    <td className="py-2.5 pr-4">
                      <Link href={row.href} className="text-sm font-medium text-emerald-700 hover:text-emerald-900">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataCard>

          <DataCard title="Recent System Checks" description="Admin flow health" count={checks.length}>
            <table className="w-full text-sm" aria-label="Recent system checks">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-medium text-stone-500">Check</th>
                  <th className="pb-2 pr-4 font-medium text-stone-500">Status</th>
                  <th className="pb-2 pr-4 font-medium text-stone-500">Note</th>
                </tr>
              </thead>
              <tbody>
                {checks.map(([check, status, note]) => (
                  <tr key={check} className="border-b last:border-0">
                    <td className="py-2.5 pr-4 font-medium text-stone-900">{check}</td>
                    <td className="py-2.5 pr-4">
                      <StatusPill>{status}</StatusPill>
                    </td>
                    <td className="py-2.5 pr-4 text-stone-500">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataCard>
        </div>
      </div>
    </DashboardFrame>
  );
}

function StatCard({ title, value, subtitle, icon }: { title: string; value: string | number; subtitle: string; icon: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-stone-500">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-stone-950">{value}</p>
          <p className="text-xs text-stone-500">{subtitle}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-2.5 text-xs font-black text-emerald-700">{icon}</div>
      </div>
    </div>
  );
}

function DataCard({ title, description, count, children }: { title: string; description: string; count: number; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-sm text-stone-500">{description}</p>
        </div>
        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">{count}</span>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">{children}</div>
      </div>
    </section>
  );
}

function StatusPill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">{children}</span>;
}
