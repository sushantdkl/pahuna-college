"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  updatePasswordAction,
  updateProfileAction,
} from "@/lib/actions/auth-actions";
import { storeUserCookie } from "@/lib/cookies";
import {
  passwordUpdateSchema,
  profileUpdateSchema,
} from "@/schemas/auth.schema";

function imageUrl(path?: string) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${path}`;
}

function buildProfileFormData(form: HTMLFormElement, imageFile: File | null) {
  const raw = Object.fromEntries(new FormData(form).entries());
  const parsed = profileUpdateSchema.safeParse({
    fullName: raw.fullName,
    email: raw.email,
    phoneNumber: raw.phoneNumber || undefined,
    location: raw.location || undefined,
    bio: raw.bio || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid profile data");
  }

  const formData = new FormData();

  Object.entries(parsed.data).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value);
    }
  });

  if (imageFile) {
    formData.append("profileImage", imageFile);
  }

  return formData;
}

export default function AccountSettingsPage() {
  const { user, setUser, logout } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [profileStatus, setProfileStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const avatarPreview = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }

    return imageUrl(user?.profileImage);
  }, [imageFile, user?.profileImage]);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileStatus("");
    setIsSavingProfile(true);

    try {
      const formData = buildProfileFormData(event.currentTarget, imageFile);
      const response = await updateProfileAction(formData);
      const updatedUser = response.data?.user;

      if (!updatedUser) {
        throw new Error("Updated user was not returned");
      }

      setUser(updatedUser);
      storeUserCookie(updatedUser);
      setImageFile(null);
      setProfileStatus(response.message || "Profile updated successfully");
    } catch (error) {
      setProfileStatus(error instanceof Error ? error.message : "Profile update failed");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setPasswordStatus("");
    setIsSavingPassword(true);

    try {
      const raw = Object.fromEntries(new FormData(form).entries());
      const parsed = passwordUpdateSchema.safeParse(raw);

      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Invalid password data");
      }

      const response = await updatePasswordAction(parsed.data);
      form.reset();
      setPasswordStatus(response.message || "Password updated successfully");
    } catch (error) {
      setPasswordStatus(error instanceof Error ? error.message : "Password update failed");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const profileKey = user?.id || "empty-profile";
  const navItems = [
    "Profile Settings",
    "Security & Password",
    "Notifications",
    "Privacy",
    "Payment Methods",
    "App Preferences",
  ];

  return (
    <main className="min-h-screen bg-[#f5fbf8] text-zinc-900">
      <nav className="flex items-center justify-between border-b border-emerald-100 bg-white px-6 py-4 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/pahuna-icon.svg" alt="Pahuna" width={34} height={34} />
          <span className="text-lg font-semibold text-emerald-800">Pahuna</span>
        </Link>
        <button onClick={logout} className="rounded-full border border-red-100 px-4 py-2 text-sm font-semibold text-red-600">
          Logout
        </button>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Traveler Account</p>
          <h1 className="mt-2 text-3xl font-semibold">Account Settings</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Manage your profile, password, preferences, and Pahuna account details.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            {navItems.map((item, index) => (
              <a
                key={item}
                href={`#section-${index}`}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-zinc-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {item}
              </a>
            ))}
            <Link href="/dashboard" className="mt-3 block rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white">
              Back to Dashboard
            </Link>
          </aside>

          <div className="space-y-6">
            <section id="section-0" className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Profile Settings</h2>
              <form key={profileKey} className="mt-5 grid gap-5" onSubmit={handleProfileSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-2xl font-semibold text-emerald-800">
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarPreview} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      user?.fullName?.charAt(0).toUpperCase() || "P"
                    )}
                  </div>
                  <label className="w-fit cursor-pointer rounded-xl border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700">
                    Upload profile image
                    <input
                      className="hidden"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-semibold text-zinc-600">
                    Full Name
                    <input name="fullName" defaultValue={user?.fullName || ""} className="w-full rounded-xl border border-zinc-200 px-3 py-3 font-normal text-zinc-900 outline-none focus:border-emerald-500" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-zinc-600">
                    Email
                    <input name="email" type="email" defaultValue={user?.email || ""} className="w-full rounded-xl border border-zinc-200 px-3 py-3 font-normal text-zinc-900 outline-none focus:border-emerald-500" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-zinc-600">
                    Phone
                    <input name="phoneNumber" defaultValue={user?.phoneNumber || ""} className="w-full rounded-xl border border-zinc-200 px-3 py-3 font-normal text-zinc-900 outline-none focus:border-emerald-500" />
                  </label>
                  <label className="space-y-2 text-sm font-semibold text-zinc-600">
                    Location
                    <input name="location" defaultValue={user?.location || ""} className="w-full rounded-xl border border-zinc-200 px-3 py-3 font-normal text-zinc-900 outline-none focus:border-emerald-500" />
                  </label>
                </div>
                <label className="space-y-2 text-sm font-semibold text-zinc-600">
                  About Me
                  <textarea name="bio" defaultValue={user?.bio || ""} rows={4} className="w-full rounded-xl border border-zinc-200 px-3 py-3 font-normal text-zinc-900 outline-none focus:border-emerald-500" />
                </label>

                {profileStatus ? <p className="text-sm font-medium text-emerald-700">{profileStatus}</p> : null}
                <button disabled={isSavingProfile} className="w-fit rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                  {isSavingProfile ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </section>

            <section id="section-1" className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Password Change</h2>
              <form className="mt-5 grid gap-4 sm:grid-cols-3" onSubmit={handlePasswordSubmit}>
                <input name="currentPassword" type="password" placeholder="Current password" className="rounded-xl border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-emerald-500" />
                <input name="newPassword" type="password" placeholder="New password" className="rounded-xl border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-emerald-500" />
                <input name="confirmPassword" type="password" placeholder="Confirm password" className="rounded-xl border border-zinc-200 px-3 py-3 text-sm outline-none focus:border-emerald-500" />
                <div className="sm:col-span-3">
                  {passwordStatus ? <p className="mb-3 text-sm font-medium text-emerald-700">{passwordStatus}</p> : null}
                  <button disabled={isSavingPassword} className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                    {isSavingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </section>

            {["Notification Preferences", "Privacy Settings", "Payment Methods", "App Preferences"].map((title, index) => (
              <section key={title} id={`section-${index + 2}`} className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  This section is prepared for the next Pahuna feature module.
                </p>
              </section>
            ))}

            <section className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-red-700">Danger Zone</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Account deletion is not connected in Sprint 3.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
