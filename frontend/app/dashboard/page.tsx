"use client";

import Image from "next/image";
import Link from "next/link";
import { DashboardFrame } from "@/app/_components/pahuna-layout";
import { resolveImageUrl } from "@/app/_components/profile-forms";
import { useAuth } from "@/context/AuthContext";
import { galleryItems, images, quickActions } from "@/lib/pahuna-content";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const avatarUrl = resolveImageUrl(user?.profileImage);
  const displayName = user?.fullName || "Pahuna Traveler";
  const location = user?.location || "Surkhet / Nepal";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Sprint 3";
  const navItems = [
    { label: "Dashboard", href: "/dashboard", active: true },
    { label: "Profile", href: "/profile" },
    { label: "Account Settings", href: "/account-settings" },
    ...(user?.role?.toLowerCase() === "admin" ? [{ label: "Admin", href: "/admin" }] : []),
    { label: "Explore Surkhet", href: "/explore" },
  ];

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f0e5] text-stone-700">
        <div className="rounded-[28px] border border-emerald-900/10 bg-white px-8 py-6 text-sm font-bold shadow-lg shadow-emerald-900/5">
          Loading Pahuna dashboard...
        </div>
      </main>
    );
  }

  return (
    <DashboardFrame
      title={displayName}
      eyebrow="Traveler Dashboard"
      navItems={navItems}
      action={
        <>
          <Link href="/profile" className="rounded-2xl bg-emerald-700 px-4 py-2 text-xs font-black text-white hover:bg-emerald-800">
            Profile
          </Link>
          <button onClick={() => logout()} className="rounded-2xl border border-red-100 bg-white px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50">
            Logout
          </button>
        </>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <article className="overflow-hidden rounded-[30px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
            <div className="relative h-56">
              <Image src={images.karnaliHero} alt="Karnali landscape dashboard banner" fill priority sizes="(max-width: 1280px) 100vw, 70vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-stone-950/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-amber-400" />
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-end">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-emerald-100 text-4xl font-black text-emerald-800 shadow-xl">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">{location}</p>
                <h2 className="mt-2 text-3xl font-black text-stone-950">{displayName}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                  {user?.bio || "Keep your Pahuna profile ready for stays, local food stops, and Karnali travel inquiries."}
                </p>
              </div>
              <Link href="/account-settings" className="rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-center text-sm font-black text-emerald-800 hover:bg-emerald-50">
                Edit Profile
              </Link>
            </div>
          </article>

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard value="0" label="Bookings" />
            <StatCard value="0" label="Wishlist Items" />
            <StatCard value="0" label="Interested Trips" />
          </div>

          <section className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Quick Actions</p>
                <h2 className="mt-2 text-2xl font-black">Plan faster from your dashboard</h2>
              </div>
              <Link href="/trip-planner" className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-black text-white hover:bg-emerald-800">
                Plan a Trip
              </Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {quickActions.slice(0, 6).map((action) => (
                <Link key={action.title} href={action.href} className="rounded-[22px] border border-emerald-900/10 bg-[#fffaf0] p-5 transition hover:border-emerald-300 hover:bg-emerald-50">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{action.meta}</p>
                  <h3 className="mt-3 font-black">{action.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{action.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            <EmptyDashboardCard title="No bookings yet" text="Confirmed stays and trip reservations will appear here once booking APIs return data." href="/hotels" action="Find stays" />
            <EmptyDashboardCard title="No wishlist items yet" text="Save buttons can connect here when wishlist backend support is available." href="/explore" action="Explore Surkhet" />
            <EmptyDashboardCard title="No interested adventures yet" text="Start with a route or trip plan before marking an adventure as interested." href="/trip-planner" action="Plan a trip" />
          </section>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
            <h2 className="text-lg font-black">Account Information</h2>
            <InfoRow label="Email" value={user?.email || "Not available"} />
            <InfoRow label="Phone" value={user?.phoneNumber || "Add phone number"} />
            <InfoRow label="Member Since" value={memberSince} />
          </div>

          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
            <h2 className="text-lg font-black">Review history</h2>
            <p className="mt-4 rounded-[22px] border-l-4 border-amber-400 bg-[#fffaf0] p-4 text-sm leading-6 text-stone-600">
              No reviews yet. Reviews will appear here when a real review flow is connected.
            </p>
          </div>

          <div className="grid gap-3">
            {galleryItems.slice(0, 2).map((item) => (
              <Link key={item.title} href="/gallery" className="relative h-44 overflow-hidden rounded-[24px] bg-stone-900">
                <Image src={item.image} alt={item.alt} fill sizes="(max-width: 1280px) 100vw, 340px" className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <p className="absolute bottom-5 left-5 right-5 font-black text-white">{item.title}</p>
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </DashboardFrame>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-5 rounded-2xl bg-emerald-50/60 p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-stone-700">{value}</p>
    </div>
  );
}

function EmptyDashboardCard({ title, text, href, action }: { title: string; text: string; href: string; action: string }) {
  return (
    <article className="rounded-[26px] border border-emerald-900/10 bg-white p-5 shadow-lg shadow-emerald-900/5">
      <div className="h-1.5 w-16 rounded-full bg-amber-400" />
      <h2 className="mt-5 text-lg font-black">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-stone-600">{text}</p>
      <Link href={href} className="mt-5 inline-flex rounded-full border border-emerald-200 px-4 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-50">
        {action}
      </Link>
    </article>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[24px] border border-emerald-900/10 bg-white p-5 text-center shadow-sm">
      <p className="text-2xl font-black text-emerald-800">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-stone-500">{label}</p>
    </div>
  );
}
