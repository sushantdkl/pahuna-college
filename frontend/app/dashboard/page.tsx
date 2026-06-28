"use client";

import Image from "next/image";
import Link from "next/link";
import { DashboardFrame } from "@/app/_components/pahuna-layout";
import { resolveImageUrl } from "@/app/_components/profile-forms";
import { useAuth } from "@/context/AuthContext";
import { galleryItems, images, quickActions } from "@/lib/pahuna-content";

const savedExperiences = [
  {
    title: "Bulbule Lake evening walk",
    category: "Surkhet",
    image: images.bulbule,
    text: "Save this for an easy family-friendly city plan.",
  },
  {
    title: "Kakrebihar heritage stop",
    category: "Culture",
    image: images.kakrebihar,
    text: "A strong first-day cultural stop near Birendranagar.",
  },
];

const reviews = [
  {
    title: "Valley View Resort",
    date: "2 weeks ago",
    text: "Clean stay option for a Surkhet base before moving toward Karnali routes.",
  },
  {
    title: "Bulbule food stop",
    date: "1 month ago",
    text: "Good simple food and a calm evening walk around the lake area.",
  },
];

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
    ...(user?.role === "admin" ? [{ label: "Admin Users", href: "/admin/users" }] : []),
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
          <button onClick={logout} className="rounded-2xl border border-red-100 bg-white px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50">
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
            <StatCard value="12" label="Bookings" />
            <StatCard value="04" label="Experiences" />
            <StatCard value="08" label="Reviews Written" />
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

          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black">Saved Experiences</h2>
              <Link href="/gallery" className="text-sm font-black text-emerald-700 hover:text-emerald-900">View All</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {savedExperiences.map((item) => (
                <article key={item.title} className="overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
                  <div className="relative h-52">
                    <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-2 text-xs font-black text-red-500 shadow">Saved</span>
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">{item.category}</p>
                    <h3 className="mt-2 text-lg font-black">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
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
            <h2 className="text-lg font-black">Reviews Written</h2>
            <div className="mt-4 space-y-4">
              {reviews.map((review) => (
                <article key={review.title} className="rounded-[22px] border-l-4 border-emerald-600 bg-[#fffaf0] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black">{review.title}</h3>
                      <p className="mt-1 text-sm font-black text-amber-500">5.0 / 5.0</p>
                    </div>
                    <p className="text-xs font-semibold text-stone-400">{review.date}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{review.text}</p>
                </article>
              ))}
            </div>
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

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[24px] border border-emerald-900/10 bg-white p-5 text-center shadow-sm">
      <p className="text-2xl font-black text-emerald-800">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-stone-500">{label}</p>
    </div>
  );
}
