"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updatePasswordAction, updateProfileAction } from "@/lib/actions/auth-actions";
import { storeUserCookie } from "@/lib/cookies";
import { passwordUpdateSchema, profileUpdateSchema } from "@/schemas/auth.schema";

export function resolveImageUrl(path?: string) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http") || path.startsWith("blob:")) {
    return path;
  }

  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${path.startsWith("/") ? path : `/${path}`}`;
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

export function ProfileSettingsPanel({ compact = false }: { compact?: boolean }) {
  const { user, setUser } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [profileStatus, setProfileStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleImageChange = (file: File | null) => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }

    setImageFile(file);
    setObjectUrl(file ? URL.createObjectURL(file) : null);
  };

  const avatarPreview = useMemo(() => objectUrl || resolveImageUrl(user?.profileImage), [objectUrl, user?.profileImage]);
  const profileKey = user?.id || user?.email || "empty-profile";

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
      handleImageChange(null);
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

  return (
    <div className="space-y-6">
      <section id="profile-settings" className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-lg shadow-emerald-900/5 sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Profile Settings</p>
            <h2 className="mt-2 text-2xl font-black text-stone-950">Update traveler profile</h2>
          </div>
          <p className="text-sm text-stone-500">Image key: profileImage</p>
        </div>

        <form key={profileKey} className="mt-6 grid gap-5" onSubmit={handleProfileSubmit}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-100 text-3xl font-black text-emerald-800 shadow-xl shadow-emerald-900/15">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                user?.fullName?.charAt(0).toUpperCase() || "P"
              )}
            </div>
            <div className="max-w-xl">
              <label className="inline-flex cursor-pointer rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100">
                Choose profile image
                <input
                  className="hidden"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => handleImageChange(event.target.files?.[0] || null)}
                />
              </label>
              <p className="mt-3 text-sm leading-6 text-stone-500">
                Select a JPG, PNG, or WEBP image. The preview appears before upload and the form sends multipart/form-data.
              </p>
            </div>
          </div>

          <div className={`grid gap-4 ${compact ? "sm:grid-cols-2" : "lg:grid-cols-2"}`}>
            <Field label="Full Name" name="fullName" defaultValue={user?.fullName || ""} />
            <Field label="Email Address" name="email" type="email" defaultValue={user?.email || ""} />
            <Field label="Phone Number" name="phoneNumber" defaultValue={user?.phoneNumber || ""} />
            <Field label="Location" name="location" defaultValue={user?.location || "Surkhet / Nepal"} />
          </div>

          <label className="space-y-2 text-sm font-bold text-stone-700">
            About Me
            <textarea
              name="bio"
              defaultValue={user?.bio || ""}
              rows={compact ? 3 : 5}
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-normal leading-6 text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Tell travelers a little about yourself."
            />
          </label>

          {profileStatus ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{profileStatus}</p> : null}

          <button
            disabled={isSavingProfile}
            className="w-fit rounded-full bg-emerald-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-800/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingProfile ? "Saving changes..." : "Save Changes"}
          </button>
        </form>
      </section>

      <section id="password" className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-lg shadow-emerald-900/5 sm:p-7">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Security & Password</p>
        <h2 className="mt-2 text-2xl font-black text-stone-950">Change password</h2>
        <form className="mt-6 grid gap-4 lg:grid-cols-3" onSubmit={handlePasswordSubmit}>
          <PasswordField label="Current Password" name="currentPassword" />
          <PasswordField label="New Password" name="newPassword" />
          <PasswordField label="Confirm Password" name="confirmPassword" />
          <div className="lg:col-span-3">
            {passwordStatus ? <p className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{passwordStatus}</p> : null}
            <button
              disabled={isSavingPassword}
              className="rounded-full bg-stone-900 px-6 py-3 text-sm font-black text-white shadow-lg shadow-stone-900/10 transition hover:bg-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingPassword ? "Updating password..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <label className="space-y-2 text-sm font-bold text-stone-700">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function PasswordField({ label, name }: { label: string; name: string }) {
  return (
    <label className="space-y-2 text-sm font-bold text-stone-700">
      {label}
      <input
        name={name}
        type="password"
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}