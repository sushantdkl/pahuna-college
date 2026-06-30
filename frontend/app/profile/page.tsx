"use client";

import Image from "next/image";
import Link from "next/link";
import { LiveLocationCard } from "@/app/_components/live-location-card";
import { SiteFooter } from "@/app/_components/pahuna-layout";
import { resolveImageUrl } from "@/app/_components/profile-forms";
import { useAuth } from "@/context/AuthContext";
import { images } from "@/lib/pahuna-content";

const summaryCards = [
  { label: "Bookings", value: "0", text: "Confirmed stays will appear here." },
  { label: "Saved Stays", value: "0", text: "Wishlist backend is not connected yet." },
  { label: "Adventures", value: "0", text: "Interested adventures will appear here." },
  { label: "Reserved Tours", value: "0", text: "Tour reservations will appear here." },
];

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const avatarUrl = resolveImageUrl(user?.profileImage);
  const displayName = user?.fullName || "Pahuna Traveler";
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "New member";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f3e8]">
        <p className="rounded-[24px] bg-white px-6 py-4 text-sm font-bold text-stone-600 shadow-lg">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f3e8] text-stone-950">
      <ProfileNav onLogout={() => logout()} />

      <section className="relative">
        <div className="relative h-72 bg-stone-950 sm:h-80">
          <Image src={images.hero} alt="Karnali landscape profile banner" fill priority sizes="100vw" className="object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-stone-950/45 to-amber-900/10" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-24 overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-2xl shadow-emerald-900/10">
            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_420px] lg:items-end lg:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[34px] border-4 border-white bg-emerald-100 text-4xl font-black text-emerald-800 shadow-xl shadow-emerald-900/15">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-800">{user?.role || "user"}</span>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-amber-900">Pahuna Member</span>
                  </div>
                  <h1 className="mt-3 break-words text-3xl font-black tracking-tight sm:text-4xl">{displayName}</h1>
                  <p className="mt-2 break-words text-sm font-semibold text-stone-500">{user?.email || "Email not available"}</p>
                  <p className="mt-1 text-sm text-stone-500">{user?.location || "Location not added"}</p>
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <Link href="/account-settings" className="inline-flex justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800">Edit Profile</Link>
                    <Link href="/account-settings" className="inline-flex justify-center rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-black text-emerald-800 hover:bg-emerald-50">Account Settings</Link>
                    <button onClick={() => logout()} className="inline-flex justify-center rounded-full border border-red-100 bg-white px-5 py-3 text-sm font-black text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <HeroFact label="Member since" value={memberSince} />
                <HeroFact label="Profile status" value={profileCompleteness(user) >= 60 ? "Ready" : "Needs details"} />
              </div>
            </div>
            <div className="h-1.5 w-full bg-amber-400" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[370px_1fr] lg:px-8">
        <aside className="space-y-6">
          <ProfileCard title="Personal Information" eyebrow="Account">
            <div className="grid gap-3">
              <InfoRow label="Name" value={displayName} />
              <InfoRow label="Email" value={user?.email || "Not available"} />
              <InfoRow label="Phone" value={user?.phoneNumber || "Add phone number"} />
              <InfoRow label="Account type" value={user?.role || "user"} />
              <InfoRow label="Member since" value={memberSince} />
              <InfoRow label="Saved location" value={user?.location || "Not added"} />
            </div>
          </ProfileCard>

          <ProfileCard title="Preferences" eyebrow="Travel style">
            <EmptyMiniState
              title="No preferences yet"
              text="Add interests, preferred stays, food, and adventure style from account settings when those fields are available."
              href="/account-settings"
              action="Update profile"
            />
          </ProfileCard>
        </aside>

        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.label} {...card} />
            ))}
          </section>

          <LiveLocationCard />

          <section className="grid gap-5 xl:grid-cols-3">
            <EmptyProfilePanel title="No bookings yet" text="Your confirmed stays and trip bookings will appear here when the backend returns them." href="/stays" action="Explore Stays" />
            <EmptyProfilePanel title="No saved stays yet" text="Saved hotels and wishlist items will appear here when wishlist support is connected." href="/stays" action="Find stays to save" />
            <EmptyProfilePanel title="No interested adventures yet" text="Adventure interests will appear here when that feature is connected." href="/explore" action="Explore Surkhet" />
          </section>

          <section className="overflow-hidden rounded-[30px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Trip Planner</p>
                <h2 className="mt-2 text-2xl font-black text-stone-950">Plan your Karnali trip</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">Use your profile details and optional live location to plan stays, food stops, routes, and Surkhet-first travel ideas.</p>
              </div>
              <Link href="/trip-planner" className="inline-flex justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-black text-white hover:bg-emerald-800">
                Plan a trip
              </Link>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function ProfileNav({ onLogout }: { onLogout: () => void }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-900/10 bg-[#fffdf7]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/pahuna-icon.svg" alt="Pahuna" width={32} height={32} />
          <span className="text-lg font-black tracking-tight text-emerald-800">PAHUNA</span>
        </Link>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          <Link href="/dashboard" className="rounded-full px-4 py-2 text-xs font-black text-stone-600 hover:bg-stone-100">Dashboard</Link>
          <Link href="/account-settings" className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-black text-white hover:bg-emerald-800">Settings</Link>
          <button onClick={onLogout} className="rounded-full border border-red-100 bg-white px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50">Logout</button>
        </div>
      </div>
    </nav>
  );
}

function profileCompleteness(user: ReturnType<typeof useAuth>["user"]) {
  if (!user) return 0;
  const fields = [user.fullName, user.email, user.phoneNumber, user.location, user.bio, user.profileImage];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

function HeroFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-emerald-900/10 bg-emerald-50 p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-700">{label}</p>
      <p className="mt-2 text-lg font-black text-emerald-950">{value}</p>
    </div>
  );
}

function ProfileCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[30px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black text-stone-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#fffaf0] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-stone-800">{value}</p>
    </div>
  );
}

function SummaryCard({ label, value, text }: { label: string; value: string; text: string }) {
  return (
    <article className="rounded-[26px] border border-emerald-900/10 bg-white p-5 shadow-lg shadow-emerald-900/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-stone-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-stone-950">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-black text-emerald-800">{label.charAt(0)}</div>
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-600">{text}</p>
    </article>
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

function EmptyMiniState({ title, text, href, action }: { title: string; text: string; href: string; action: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-5">
      <h3 className="font-black text-stone-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
      <Link href={href} className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-emerald-800 shadow-sm hover:bg-emerald-50">
        {action}
      </Link>
    </div>
  );
}
