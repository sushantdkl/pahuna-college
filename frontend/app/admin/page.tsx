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
      <main className="flex min-h-screen items-center justify-center bg-[#f6f0e5] px-4">
        <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 text-center shadow-lg">
          <p className="text-sm font-black text-stone-700">Checking admin session...</p>
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

  return (
    <DashboardFrame
      title="Dashboard"
      eyebrow="Pahuna Admin"
      navItems={adminNavItems}
      action={
        <>
          <Link href="/" className="rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-800 hover:bg-emerald-50">
            Home
          </Link>
          <button onClick={() => logout("/admin/login")} className="rounded-2xl border border-red-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-600 hover:bg-red-50">
            Logout
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[32px] border border-emerald-900/10 bg-white shadow-xl shadow-emerald-900/5">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Control room</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">Welcome back, {user.fullName || user.email}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">Manage Pahuna users, public stay/food listings, and route safety from one protected admin workspace.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-80">
              <AdminHealth label="Session" value="Protected" />
              <AdminHealth label="Role" value="Admin" />
            </div>
          </div>
          <div className="h-1.5 w-full bg-amber-400" />
          <div className="flex flex-col gap-3 bg-[#fffaf0] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-stone-600">Public navigation is safe. Logout only runs from the Logout button.</p>
            <Link href="/admin/users" className="inline-flex justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800">Manage users</Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Stay Listings" value={featuredStays.length.toString()} subtitle={`${verifiedStays} verified`} icon="ST" />
          <MetricCard title="Food Listings" value={foodProviders.length.toString()} subtitle={`${featuredFood} featured`} icon="FD" />
          <MetricCard title="Admin Users" value="CRUD" subtitle="Search, paginate, edit" icon="US" />
          <MetricCard title="Route Safety" value="Active" subtitle="Admin/public auth split" icon="RS" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="overflow-hidden rounded-[30px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
            <div className="border-b border-stone-100 px-6 py-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Operations</p>
              <h2 className="mt-2 text-2xl font-black">Admin modules</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[#fffaf0] text-xs font-black uppercase tracking-[0.16em] text-stone-500">
                  <tr>
                    <th className="px-6 py-4">Area</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {dashboardRows.map((row) => (
                    <tr key={row.area}>
                      <td className="px-6 py-4 font-black text-stone-900">{row.area}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">{row.status}</span>
                      </td>
                      <td className="px-6 py-4 text-stone-600">{row.detail}</td>
                      <td className="px-6 py-4">
                        <Link href={row.href} className="rounded-xl border border-emerald-200 px-3 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-50">
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[30px] border border-amber-200 bg-amber-50 p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-800">Listing review</p>
              <h2 className="mt-3 text-2xl font-black text-amber-950">{pendingListings} pending</h2>
              <p className="mt-3 text-sm leading-6 text-amber-900/80">Listings marked pending stay inquiry-first until owner/contact details are verified.</p>
            </div>
            <div className="rounded-[30px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Quick links</p>
              <div className="mt-5 grid gap-2">
                <Link href="/admin/users" className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white hover:bg-emerald-800">Manage users</Link>
                <Link href="/hotels" className="rounded-2xl border border-emerald-200 px-4 py-3 text-sm font-black text-emerald-800 hover:bg-emerald-50">Review stays</Link>
                <Link href="/food" className="rounded-2xl border border-emerald-200 px-4 py-3 text-sm font-black text-emerald-800 hover:bg-emerald-50">Review food</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardFrame>
  );
}

function MetricCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: string }) {
  return (
    <div className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-lg shadow-emerald-900/5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-stone-500">{title}</p>
          <p className="mt-3 text-3xl font-black text-stone-950">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-black text-emerald-800">{icon}</div>
      </div>
      <p className="mt-4 text-sm font-semibold text-stone-500">{subtitle}</p>
    </div>
  );
}

function AdminHealth({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-emerald-50 p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{label}</p>
      <p className="mt-2 text-lg font-black text-emerald-950">{value}</p>
    </div>
  );
}
