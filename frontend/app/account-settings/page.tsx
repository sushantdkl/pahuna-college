"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProfileSettingsPanel } from "@/components/profile-forms";
import { SiteFooter } from "@/components/pahuna-layout";

const navItems = [
  { label: "Profile Settings", href: "#profile-settings" },
  { label: "Security & Password", href: "#password" },
];

export default function AccountSettingsPage() {
  const { logout } = useAuth();

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-stone-950">
      <nav className="sticky top-0 z-50 border-b border-emerald-900/10 bg-[#fffdf7]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/pahuna-icon.svg" alt="Pahuna" width={32} height={32} />
            <span className="text-lg font-black tracking-tight text-emerald-800">PAHUNA</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/profile" className="rounded-full px-4 py-2 text-xs font-black text-stone-600 hover:bg-stone-100">Profile</Link>
            <Link href="/dashboard" className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-black text-white hover:bg-emerald-800">Dashboard</Link>
            <button onClick={() => logout()} className="rounded-full border border-red-100 bg-white px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50">Logout</button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-emerald-900/10 bg-white p-7 shadow-lg shadow-emerald-900/5">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Traveler Account</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Account Settings</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
            Manage your profile, password, preferences, and Pahuna account details with clean spacing and connected Sprint 3 forms.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-[28px] border border-emerald-900/10 bg-white p-4 shadow-lg shadow-emerald-900/5 lg:sticky lg:top-24">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 text-sm font-black text-stone-600 transition hover:bg-emerald-50 hover:text-emerald-800">
                {item.label}
              </a>
            ))}
            <Link href="/dashboard" className="mt-3 block rounded-2xl bg-stone-900 px-4 py-3 text-center text-sm font-black text-white hover:bg-stone-950">
              Back to Dashboard
            </Link>
          </aside>

          <div className="space-y-6">
            <ProfileSettingsPanel compact />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
