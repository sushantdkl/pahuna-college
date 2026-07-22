"use client";

import { useState, type ReactNode } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const primaryLinks = navItems.filter((item) =>
    ["/", "/explore", "/hotels", "/food", "/destinations", "/trip-planner", "/contact"].includes(item.href),
  );
  const serviceLinks = [
    { label: "B2B Consulting", href: "/consulting", description: "Hospitality strategy and operations support" },
    { label: "Training Academy", href: "/training", description: "Courses for hospitality careers" },
    { label: "Partner With Us", href: "/partner", description: "Join the Karnali tourism network" },
    { label: "Trip Routes", href: "/routes", description: "Transport routes and route segments" },
    { label: "Trip Cost", href: "/trip-cost", description: "Route and budget estimator" },
    { label: "Experiences / Things To Do", href: "/experiences", description: "Culture, nature, food, and adventure" },
  ];
  const activeService = serviceLinks.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const mobileLinks = [...primaryLinks, ...serviceLinks];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-[#fffaf0]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Pahuna home">
          <Image src="/logo/pahuna-logo-clean.svg" alt="Pahuna" width={180} height={84} className="h-10 w-auto" priority />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
          {primaryLinks.map((item) => (
            <RefDesktopLink key={item.href} label={item.label} href={item.href} pathname={pathname} />
          ))}
          <RefDesktopMenu label="Services" pathname={pathname} active={activeService} items={serviceLinks} />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {!loading && user ? (
            <>
              <Link href={accountHref} className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-white sm:inline-flex">
                {accountLabel}
              </Link>
              <button type="button" onClick={() => logout(isAdmin ? "/admin/login" : "/login")} className="hidden rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:inline-flex">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-white sm:inline-flex">
              Sign in
            </Link>
          )}
          <Link href="/contact" className="hidden rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 sm:inline-flex">
            Get in Touch
          </Link>
          <button type="button" onClick={() => setMobileOpen((open) => !open)} className="inline-flex h-10 w-14 items-center justify-center rounded-lg border border-emerald-900/10 bg-white text-xs font-black text-emerald-900 lg:hidden" aria-expanded={mobileOpen} aria-label="Toggle navigation">
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-emerald-900/10 bg-[#fffdf7] px-4 py-5 shadow-xl lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 sm:grid-cols-2">
            {mobileLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-bold transition ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? "bg-emerald-700 text-white" : "text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto mt-4 flex max-w-7xl flex-wrap gap-2 border-t border-emerald-900/10 pt-4">
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Get in Touch</Link>
            {!loading && user ? (
              <>
                <Link href={accountHref} onClick={() => setMobileOpen(false)} className="rounded-lg bg-amber-100 px-5 py-3 text-sm font-bold text-amber-900">{accountLabel}</Link>
                <button type="button" onClick={() => logout(isAdmin ? "/admin/login" : "/login")} className="rounded-lg border border-red-100 px-5 py-3 text-sm font-bold text-red-600">Logout</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg bg-amber-100 px-5 py-3 text-sm font-bold text-amber-900">Sign in</Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function RefDesktopLink({ label, href, pathname }: { label: string; href: string; pathname: string }) {
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return <Link href={href} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-white text-emerald-800 shadow-sm" : "text-stone-600 hover:bg-white/70 hover:text-stone-950"}`}>{label}</Link>;
}

function RefDesktopMenu({ label, pathname, active, items }: { label: string; pathname: string; active?: boolean; items: { label: string; href: string; description?: string }[] }) {
  const menuActive = active ?? items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  return (
    <details className="group relative">
      <summary className={`cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-medium transition [&::-webkit-details-marker]:hidden ${menuActive ? "bg-white text-emerald-800 shadow-sm" : "text-stone-600 hover:bg-white/70 hover:text-stone-950"}`}>{label} <span aria-hidden="true" className="ml-1">⌄</span></summary>
      <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded-xl border border-stone-200 bg-white p-2 shadow-xl">
        {items.map((item) => <Link key={item.href} href={item.href} className="block rounded-lg px-4 py-3 text-sm font-semibold text-stone-800 hover:bg-emerald-50 hover:text-emerald-800"><span>{item.label}</span>{item.description ? <span className="mt-1 block text-xs font-normal leading-5 text-stone-500">{item.description}</span> : null}</Link>)}
      </div>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full bg-[#070b10] text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex flex-col gap-2">
            <Image src="/logo/pahuna-logo-clean.svg" alt="Pahuna" width={200} height={94} className="h-11 w-auto rounded-sm bg-white" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">Karnali Awaits</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-7 text-stone-400">
            Pahuna - Nepal&apos;s first integrated tourism platform for Karnali Province. Premium stays, authentic experiences, B2B consulting, and hospitality training.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-stone-400">
            <a href="tel:+977083520000" className="hover:text-emerald-300">+977-083-520000</a>
            <a href="mailto:hello@pahuna.com" className="hover:text-emerald-300">hello@pahuna.com</a>
            <span>Birendranagar, Surkhet, Karnali Province, Nepal</span>
          </div>
        </div>
        <FooterGroup title="Discover" links={["Explore Surkhet", "Destinations", "Hotels & Stays", "Things to Do", "Trip Ideas", "Trip Planner"]} />
        <FooterGroup title="Services" links={["B2B Consulting", "Training Academy", "Partner With Us", "Trip Routes"]} />
        <FooterGroup title="Company" links={["About Us", "Contact", "FAQ", "Privacy Policy", "Terms & Conditions"]} />
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-stone-500 sm:flex sm:items-center sm:justify-between sm:px-8">
        <span>Copyright 2026 Pahuna. All rights reserved.</span>
        <span>Built with care in Surkhet, Nepal</span>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: string[] }) {
  const hrefFor = (label: string) =>
    label === "Explore Surkhet"
      ? "/explore"
      : label === "Hotels & Stays"
        ? "/hotels"
        : label === "Things to Do"
          ? "/experiences"
        : label === "Trip Ideas"
          ? "/itineraries"
        : label === "B2B Consulting"
          ? "/consulting"
        : label === "Training Academy"
          ? "/training"
        : label === "Partner With Us"
          ? "/partner"
        : label === "Trip Routes"
          ? "/routes"
        : label === "Trip Packages"
          ? "/trip-packages"
        : ["About Us", "FAQ", "Privacy Policy", "Terms & Conditions"].includes(label)
          ? "/contact"
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

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  children?: ReactNode;
}>) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#071121] via-[#111630] to-[#08121f] text-white">
      {image ? <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-25" /> : null}
      <SectionShell className="relative z-10 py-20 text-center sm:py-24">
        <p className="mx-auto inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-bold text-white/75">{eyebrow}</p>
        <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">{description}</p>
        {children ? <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div> : null}
      </SectionShell>
    </section>
  );
}

export function StatusBadge({
  children,
  tone = "green",
}: Readonly<{ children: ReactNode; tone?: "green" | "yellow" | "slate" | "red" }>) {
  const toneClass =
    tone === "yellow"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : tone === "red"
        ? "border-red-200 bg-red-50 text-red-700"
        : tone === "slate"
          ? "border-stone-200 bg-stone-50 text-stone-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${toneClass}`}>{children}</span>;
}

export function EmptyState({
  title,
  description,
  action,
}: Readonly<{ title: string; description: string; action?: ReactNode }>) {
  return (
    <div className="rounded-[8px] border border-dashed border-emerald-200 bg-white/80 p-10 text-center shadow-sm">
      <div className="mx-auto h-1.5 w-16 rounded-full bg-amber-400" />
      <h2 className="mt-5 text-2xl font-black text-stone-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
}: Readonly<{ title?: string; description: string; action?: ReactNode }>) {
  return (
    <div className="rounded-[8px] border border-red-200 bg-red-50 p-5 text-red-800">
      <h2 className="text-sm font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingSkeleton({ rows = 3 }: Readonly<{ rows?: number }>) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="rounded-[8px] border border-stone-200 bg-white p-5 shadow-sm">
          <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
          <div className="mt-4 h-3 w-full animate-pulse rounded bg-stone-100" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-stone-100" />
        </div>
      ))}
    </div>
  );
}

export function MapPanel({
  title,
  description,
  children,
}: Readonly<{ title: string; description?: string; children?: ReactNode }>) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-emerald-100 bg-white shadow-sm">
      <div className="relative min-h-64 bg-[linear-gradient(135deg,#eaf4ee,#f8fbf7)]">
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #cfe7d6 0 8%, transparent 9%), radial-gradient(circle at 72% 45%, #dbe7dd 0 12%, transparent 13%), linear-gradient(120deg, transparent 45%, #c9ddd2 46%, transparent 48%)" }} />
        <span className="absolute left-[48%] top-[45%] h-5 w-5 rounded-full bg-emerald-700 shadow-lg ring-4 ring-white" />
        <span className="absolute left-[56%] top-[35%] h-4 w-4 rounded-full bg-violet-600 shadow-lg ring-4 ring-white" />
        <span className="absolute left-[42%] top-[56%] h-4 w-4 rounded-full bg-amber-500 shadow-lg ring-4 ring-white" />
      </div>
      <div className="border-t border-emerald-100 p-5">
        <h3 className="font-black text-stone-950">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p> : null}
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">{eyebrow}</p> : null}
      <Heading className="mt-3 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">{title}</Heading>
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
    <Link href={href} className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-bold transition ${classes}`}>
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
    <main className="flex h-screen overflow-hidden bg-[#f7f4ed] text-stone-950">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-stone-200 bg-white md:flex">
        <div className="flex h-14 items-center justify-between border-b border-stone-200 px-4">
          <Link href={dashboardHomeHref} className="flex items-center gap-2 font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg">
              <Image src="/pahuna-icon.svg" alt="Pahuna" width={28} height={28} className="h-7 w-7" />
            </span>
            <span className="text-sm">Dashboard</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-950"
                  }`}
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[10px] font-black">
                    {(item.section || item.label).slice(0, 2).toUpperCase()}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-stone-200 px-3 py-3">
          <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-950">
            <span aria-hidden="true">←</span>
            Back to site
          </Link>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href={dashboardHomeHref} className="flex items-center gap-2 font-semibold md:hidden">
              <Image src="/pahuna-icon.svg" alt="Pahuna" width={28} height={28} className="h-7 w-7" />
              <span className="text-sm">Dashboard</span>
            </Link>
            <div className="hidden md:block">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-400">{eyebrow}</p>
              <h1 className="text-sm font-semibold text-stone-900">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">{user?.fullName || user?.email || "Pahuna Admin"}</p>
              <p className="mt-1 text-xs text-stone-500">{user?.role || "ADMIN"}</p>
            </div>
            {action ? <div className="flex items-center gap-2">{action}</div> : null}
            {!action ? (
              <button onClick={() => logout("/admin/login")} className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-red-600">
                Logout
              </button>
            ) : null}
          </div>
        </header>

        <nav className="no-scrollbar flex gap-2 overflow-x-auto border-b border-stone-200 bg-white px-4 py-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${
                item.active ? "bg-emerald-50 text-emerald-700" : "text-stone-500"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
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

