"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProfileSettingsPanel } from "@/app/_components/profile-forms";
import { SiteFooter } from "@/app/_components/pahuna-layout";

const navItems = [
  { label: "Profile Settings", href: "#profile-settings" },
  { label: "Security & Password", href: "#password" },
  { label: "Notifications", href: "#notifications" },
  { label: "Privacy", href: "#privacy" },
  { label: "Payment Methods", href: "#payment" },
  { label: "App Preferences", href: "#preferences" },
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
            <button onClick={logout} className="rounded-full border border-red-100 bg-white px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50">Logout</button>
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
            <PlaceholderSection id="notifications" title="Notification Preferences" text="Email updates, stay availability, route reminders, and inquiry replies can be connected in the next module." />
            <PlaceholderSection id="privacy" title="Privacy Settings" text="Public profile visibility and saved traveler preferences are prepared as frontend UI placeholders." />
            <PlaceholderSection id="payment" title="Payment Methods" text="Payment method management is not connected in Sprint 3, so no backend/payment logic was changed." />
            <PlaceholderSection id="preferences" title="App Preferences" text="Language, display theme, and route preference controls can be connected later." />
            <section className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-red-700">Danger Zone</p>
              <h2 className="mt-2 text-2xl font-black text-red-800">Account actions</h2>
              <p className="mt-3 text-sm leading-6 text-red-700">Account deletion is intentionally not connected in Sprint 3.</p>
              <button disabled className="mt-5 rounded-full bg-red-200 px-5 py-3 text-sm font-black text-red-800 opacity-70">Delete Account Disabled</button>
            </section>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function PlaceholderSection({ id, title, text }: { id: string; title: string; text: string }) {
  return (
    <section id={id} className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">{title}</p>
      <h2 className="mt-2 text-2xl font-black text-stone-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-stone-600">{text}</p>
    </section>
  );
}
