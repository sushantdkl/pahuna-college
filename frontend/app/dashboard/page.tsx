"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function imageUrl(path?: string) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${path}`;
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const avatar = imageUrl(user?.profileImage);
  const memberSince = user?.createdAt
    ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(
        new Date(user.createdAt),
      )
    : "New member";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-emerald-50 text-sm text-zinc-500">
        Loading your Pahuna profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5fbf8] text-zinc-900">
      <nav className="flex items-center justify-between border-b border-emerald-100 bg-white px-6 py-4 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/pahuna-icon.svg" alt="Pahuna" width={34} height={34} />
          <span className="text-lg font-semibold text-emerald-800">Pahuna</span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link className="font-medium text-zinc-600 hover:text-emerald-700" href="/profile">
            Profile
          </Link>
          <Link className="rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white" href="/account-settings">
            Settings
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-xl shadow-emerald-100">
          <div className="h-52 bg-[url('/auth-hero.svg')] bg-cover bg-center" />
          <div className="px-6 pb-7">
            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-100 text-3xl font-semibold text-emerald-800 shadow-lg">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt={user?.fullName || "Profile"} className="h-full w-full object-cover" />
                  ) : (
                    user?.fullName?.charAt(0).toUpperCase() || "P"
                  )}
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-semibold">{user?.fullName || "Pahuna Traveler"}</h1>
                  <p className="mt-1 text-sm text-zinc-500">{user?.location || "Exploring Mid-Western Nepal"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/account-settings" className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700">
                  Edit Profile
                </Link>
                <Link href="/account-settings" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
                  Account
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Traveler Info</h2>
            <div className="space-y-3 text-sm text-zinc-600">
              <p><span className="font-semibold text-zinc-900">Email:</span> {user?.email || "Not available"}</p>
              <p><span className="font-semibold text-zinc-900">Phone:</span> {user?.phoneNumber || "Not added"}</p>
              <p><span className="font-semibold text-zinc-900">Member since:</span> {memberSince}</p>
            </div>
            <Link className="block rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700" href="/account-settings">
              Account Settings
            </Link>
            <button onClick={logout} className="w-full rounded-xl border border-red-100 px-4 py-3 text-sm font-semibold text-red-600">
              Logout
            </button>
          </aside>

          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Bookings", "0"],
                ["Experiences", "0"],
                ["Reviews Written", "0"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                  <p className="text-sm text-zinc-500">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-700">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">About Me</h2>
              <p className="mt-3 leading-7 text-zinc-600">
                {user?.bio || "Add a short bio in account settings to introduce yourself to Pahuna hosts and local experience providers."}
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Saved Experiences</h2>
                <p className="mt-3 text-sm text-zinc-500">Saved tours and stays will appear here after the booking module is connected.</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Reviews Written</h2>
                <p className="mt-3 text-sm text-zinc-500">Your destination and hotel reviews will be listed here.</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
