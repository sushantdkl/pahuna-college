"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { images } from "@/lib/pahuna-content";
import { ProfileSettingsPanel, resolveImageUrl } from "@/app/_components/profile-forms";
import { SiteFooter } from "@/app/_components/pahuna-layout";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const avatarUrl = resolveImageUrl(user?.profileImage);
  const displayName = user?.fullName || "Pahuna Traveler";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf0]">
        <p className="rounded-[24px] bg-white px-6 py-4 text-sm font-bold text-stone-600 shadow-lg">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-stone-950">
      <nav className="sticky top-0 z-50 border-b border-emerald-900/10 bg-[#fffdf7]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/pahuna-icon.svg" alt="Pahuna" width={32} height={32} />
            <span className="text-lg font-black tracking-tight text-emerald-800">PAHUNA</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/dashboard" className="rounded-full px-4 py-2 text-xs font-black text-stone-600 hover:bg-stone-100">Dashboard</Link>
            <Link href="/account-settings" className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-black text-white hover:bg-emerald-800">Settings</Link>
            <button onClick={() => logout()} className="rounded-full border border-red-100 bg-white px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50">Logout</button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="relative h-72 bg-stone-950 sm:h-80">
          <Image src={images.hero} alt="Profile cover" fill priority sizes="100vw" className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-stone-950/35 to-amber-900/10" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 rounded-[34px] border border-white/70 bg-white p-6 shadow-2xl shadow-emerald-900/10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-100 text-4xl font-black text-emerald-800 shadow-xl shadow-emerald-900/15">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="pb-2">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Public Profile</p>
                  <h1 className="mt-2 text-3xl font-black sm:text-4xl">{displayName}</h1>
                  <p className="mt-1 text-sm font-semibold text-stone-500">{user?.location || "Surkhet / Nepal"}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 md:min-w-[360px]">
                <MiniStat value="0" label="Bookings" />
                <MiniStat value="0" label="Wishlist" />
                <MiniStat value="0" label="Interested" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
        <aside className="space-y-5">
          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Information</p>
            <h2 className="mt-2 text-2xl font-black">Traveler details</h2>
            <div className="mt-5 space-y-3 text-sm leading-6 text-stone-600">
              <p><strong className="text-stone-900">Email:</strong> {user?.email || "Not available"}</p>
              <p><strong className="text-stone-900">Phone:</strong> {user?.phoneNumber || "Add phone number"}</p>
              <p><strong className="text-stone-900">Location:</strong> {user?.location || "Surkhet / Nepal"}</p>
              <p><strong className="text-stone-900">Account type:</strong> {user?.role || "user"}</p>
            </div>
          </div>
          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">About</p>
            <p className="mt-4 text-sm leading-7 text-stone-600">{user?.bio || "Add your traveler introduction from the profile settings form. This page keeps Sprint 3 profile logic connected and styled in the Pahuna theme."}</p>
          </div>
        </aside>
        <div className="space-y-6">
          <ProfileSettingsPanel />
          <section className="grid gap-5 md:grid-cols-3">
            <EmptyProfilePanel title="No bookings yet" text="Your confirmed stays and trip bookings will appear here when the backend returns them." href="/stays" action="Explore stays" />
            <EmptyProfilePanel title="No wishlist items yet" text="Save or like travel ideas after signing in. Browsing remains open to everyone." href="/explore" action="Explore Surkhet" />
            <EmptyProfilePanel title="No interested adventures yet" text="Mark adventures when that feature is available, or start with a trip plan now." href="/trip-planner" action="Plan a trip" />
          </section>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function EmptyProfilePanel({ title, text, href, action }: { title: string; text: string; href: string; action: string }) {
  return (
    <div className="rounded-[26px] border border-emerald-900/10 bg-white p-5 shadow-lg shadow-emerald-900/5">
      <div className="h-1.5 w-16 rounded-full bg-amber-400" />
      <h3 className="mt-5 text-lg font-black text-stone-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-stone-600">{text}</p>
      <Link href={href} className="mt-5 inline-flex rounded-full border border-emerald-200 px-4 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-50">
        {action}
      </Link>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[22px] bg-emerald-50 p-4 text-center">
      <p className="text-2xl font-black text-emerald-800">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-stone-500">{label}</p>
    </div>
  );
}
