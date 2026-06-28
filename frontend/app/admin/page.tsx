"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardFrame } from "@/app/_components/pahuna-layout";
import { useAuth } from "@/context/AuthContext";

const adminNavItems = [
  { label: "Overview", href: "/admin", active: true },
  { label: "Users", href: "/admin/users" },
  { label: "Public Site", href: "/" },
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

  return (
    <DashboardFrame
      title="Admin Overview"
      eyebrow="Pahuna Control Room"
      navItems={adminNavItems}
      action={
        <>
          <Link href="/" className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-800 hover:bg-emerald-50">
            Home
          </Link>
          <button onClick={() => logout("/admin/login")} className="rounded-full border border-red-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-600 hover:bg-red-50">
            Logout
          </button>
        </>
      }
    >
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard label="Admin" value={user.fullName || "Pahuna Admin"} detail={user.email} />
        <MetricCard label="User Management" value="Sprint 4" detail="Create, edit, delete, search, paginate" />
        <MetricCard label="Route Safety" value="Active" detail="Admin login and public browsing stay separate" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[30px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Management</p>
              <h2 className="mt-2 text-2xl font-black">Admin user tools</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">Use the Sprint 4 user management table to search, paginate, create, edit, and delete users through protected admin APIs.</p>
            </div>
            <Link href="/admin/users" className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-800/15 hover:bg-emerald-800">
              Manage users
            </Link>
          </div>
          <div className="mt-6 overflow-hidden rounded-[24px] border border-stone-100">
            {["Protected admin endpoints", "Search and pagination meta", "Create/edit/delete dialogs"].map((item) => (
              <div key={item} className="flex items-center justify-between border-b border-stone-100 px-5 py-4 last:border-b-0">
                <span className="text-sm font-bold text-stone-700">{item}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">Ready</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-[30px] border border-amber-200 bg-amber-50 p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-800">Admin note</p>
          <h2 className="mt-3 text-2xl font-black text-amber-950">Public navigation is safe.</h2>
          <p className="mt-3 text-sm leading-6 text-amber-900/80">The Home link only navigates to the public site. It does not clear cookies or call logout, so admins can browse and return to the dashboard.</p>
        </aside>
      </div>
    </DashboardFrame>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">{label}</p>
      <p className="mt-4 text-2xl font-black text-stone-950">{value}</p>
      {detail ? <p className="mt-2 text-sm leading-6 text-stone-600">{detail}</p> : null}
    </div>
  );
}
