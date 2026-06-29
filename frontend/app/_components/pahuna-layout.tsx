"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { navItems } from "@/lib/pahuna-content";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const accountHref = isAdmin ? "/admin" : "/profile";
  const accountLabel = isAdmin ? "Admin" : "Profile";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900/10 bg-[#fffdf7]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Pahuna home">
          <Image src="/pahuna-icon.svg" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="text-lg font-black tracking-tight text-emerald-800">PAHUNA</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-stone-600 hover:bg-emerald-50 hover:text-emerald-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {!loading && user ? (
            <>
              <Link
                href={accountHref}
                className="hidden rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-700 transition hover:bg-stone-100 sm:inline-flex"
              >
                {accountLabel}
              </Link>
              <button
                type="button"
                onClick={() => logout(isAdmin ? "/admin/login" : "/login")}
                className="hidden rounded-full border border-red-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-50 sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-700 transition hover:bg-stone-100 sm:inline-flex"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/contact"
            className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-emerald-800/15 transition hover:bg-emerald-800"
          >
            Send inquiry
          </Link>
        </div>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-emerald-900/5 px-4 py-2 xl:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition ${
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "bg-emerald-700 text-white"
                : "bg-white text-stone-600 hover:bg-emerald-50 hover:text-emerald-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
        {!loading && user ? (
          <Link href={accountHref} className="shrink-0 rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-900 shadow-sm">
            {accountLabel}
          </Link>
        ) : (
          <Link href="/login" className="shrink-0 rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-900 shadow-sm">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t-4 border-amber-500 bg-[#111815] text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black tracking-tight text-emerald-300">
            <Image src="/pahuna-icon.svg" alt="" width={34} height={34} className="h-8 w-8 rounded-xl bg-white" />
            <span>PAHUNA</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-stone-400">
            Surkhet-first Karnali tourism platform for stays, routes, food, destinations, and local travel support.
          </p>
        </div>
        <FooterGroup title="Explore" links={["Explore Surkhet", "Stays", "Food", "Destinations"]} />
        <FooterGroup title="Plan" links={["Trip Planner", "Routes", "Gallery", "Contact"]} />
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-200">Need help?</h3>
          <p className="mt-4 text-sm leading-6 text-stone-400">Ask about availability, routes, food stops, or timing before confirming your plan.</p>
          <Link href="/contact" className="mt-5 inline-flex rounded-full bg-emerald-500 px-5 py-3 text-sm font-black text-emerald-950 transition hover:bg-emerald-400">
            Send Inquiry
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-stone-500">Copyright 2026 Pahuna. Crafted with hospitality in Nepal.</div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[] }) {
  const hrefFor = (label: string) =>
    label === "Explore Surkhet"
      ? "/explore"
      : label === "Stays"
        ? "/hotels"
        : `/${label.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-200">{title}</h3>
      <div className="mt-4 grid gap-3 text-sm">
        {links.map((link) => (
          <Link key={link} href={hrefFor(link)} className="text-stone-400 transition hover:text-emerald-300">
            {link}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SectionShell({
  children,
  className = "",
  id,
}: Readonly<{ children: ReactNode; className?: string; id?: string }>) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">{eyebrow}</p> : null}
      <h2 className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-stone-600">{description}</p> : null}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: Readonly<{ href: string; children: ReactNode; variant?: "primary" | "secondary" | "ghost" }>) {
  const classes =
    variant === "primary"
      ? "bg-emerald-700 text-white shadow-lg shadow-emerald-800/15 hover:bg-emerald-800"
      : variant === "secondary"
        ? "border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
        : "bg-stone-900/80 text-white hover:bg-stone-950";

  return (
    <Link href={href} className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition ${classes}`}>
      {children}
    </Link>
  );
}

export function PageShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-[#fffaf0] text-stone-950">
      {children}
    </main>
  );
}

export type DashboardNavItem = {
  label: string;
  href: string;
  active?: boolean;
  section?: string;
};

export function DashboardFrame({
  title,
  eyebrow,
  children,
  navItems,
  action,
}: Readonly<{
  title: string;
  eyebrow: string;
  children: ReactNode;
  navItems: DashboardNavItem[];
  action?: ReactNode;
}>) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const dashboardHomeHref = isAdmin ? "/admin" : "/dashboard";

  return (
    <main className="min-h-screen bg-[#f4efe6] text-stone-950 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-emerald-900/10 bg-[#fffdf7] px-4 py-4 shadow-sm lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-4">
        <Link href={dashboardHomeHref} className="flex h-14 items-center gap-3 rounded-2xl border border-emerald-900/10 bg-white px-3 shadow-sm">
          <Image src="/pahuna-icon.svg" alt="Pahuna" width={34} height={34} className="h-8 w-8" />
          <div>
            <span className="block text-sm font-black tracking-tight text-emerald-800">PAHUNA</span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">Dashboard</span>
          </div>
        </Link>
        <nav className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                item.active
                  ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/10"
                  : "text-stone-600 hover:bg-emerald-50 hover:text-emerald-800"
              }`}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${item.active ? "bg-white/15 text-white" : "bg-stone-100 text-stone-500"}`}>
                {(item.section || item.label).slice(0, 2).toUpperCase()}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 hidden rounded-2xl border border-amber-200 bg-amber-50 p-4 lg:block">
          <div className="h-1 w-20 rounded-full bg-amber-400" />
          <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-amber-800">{isAdmin ? "Pahuna admin" : "Pahuna traveler"}</p>
          <p className="mt-2 text-sm leading-6 text-amber-900/80">
            {isAdmin
              ? "Manage public content and Sprint 4 users without leaving the current auth flow."
              : "Keep trips, saved stays, and profile settings together without changing your session."}
          </p>
        </div>
        <Link href="/" className="mt-4 hidden rounded-xl px-3 py-2 text-sm font-bold text-stone-500 hover:bg-stone-100 hover:text-emerald-800 lg:block">
          Back to public site
        </Link>
      </aside>
      <section className="flex min-h-screen min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-[#fffdf7]/95 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-700">{eyebrow}</p>
              <h1 className="mt-1 text-2xl font-black text-stone-950 sm:text-3xl">{title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-emerald-900/10 bg-white px-4 py-2 text-right shadow-sm">
                <p className="text-sm font-black text-stone-900">{user?.fullName || user?.email || "Pahuna Admin"}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">{user?.role || "ADMIN"}</p>
              </div>
              {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
              {!action ? (
                <button onClick={() => logout("/admin/login")} className="rounded-2xl border border-red-100 bg-white px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50">
                  Logout
                </button>
              ) : null}
            </div>
          </div>
        </header>
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </section>
    </main>
  );
}

export function ImageTile({
  title,
  subtitle,
  image,
  href,
  tall = false,
}: {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  tall?: boolean;
}) {
  return (
    <Link href={href} className={`group relative block overflow-hidden rounded-[28px] bg-stone-900 shadow-xl shadow-stone-900/10 ${tall ? "min-h-[420px]" : "min-h-[250px]"}`}>
      <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-200">{subtitle}</p>
        <h3 className="mt-2 text-2xl font-black">{title}</h3>
      </div>
    </Link>
  );
}

export function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white/85 p-4 text-center shadow-sm backdrop-blur">
      <p className="text-2xl font-black text-emerald-800">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-stone-500">{label}</p>
    </div>
  );
}
