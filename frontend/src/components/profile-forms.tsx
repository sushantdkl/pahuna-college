"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { UploadCloud, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updatePasswordAction, updateProfileAction } from "@/lib/actions/auth-actions";
import { resolveApiAssetUrl } from "@/lib/api/axios-instance";
import { storeUserCookie } from "@/lib/cookies";
import { PasswordInput } from "@/components/ui/password-input";
import { passwordUpdateSchema, profileUpdateSchema } from "@/schemas/auth.schema";

const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export function resolveImageUrl(path?: string) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http") || path.startsWith("blob:")) {
    return path;
  }

  return resolveApiAssetUrl(path);
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

export function ProfileSettingsPanel({
  compact = false,
  section = "all",
}: {
  compact?: boolean;
  section?: "all" | "profile" | "security";
}) {
  const { user, setUser } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileStatus, setProfileStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const validateImageFile = (file: File) => {
    const lowerName = file.name.toLowerCase();
    const extensionOk = ACCEPTED_IMAGE_EXTENSIONS.some((extension) => lowerName.endsWith(extension));

    if (!file.size) return "Selected image is empty.";
    if (file.size > MAX_PROFILE_IMAGE_SIZE) return "Profile image must be 2 MB or smaller.";
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type) || !extensionOk) return "Only JPG, JPEG, PNG, or WEBP images are allowed.";
    if (/[<>:"\\|?*\u0000-\u001f]/.test(file.name)) return "Image filename contains unsafe characters.";
    return "";
  };

  const handleImageChange = (file: File | null) => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }

    setImageError("");

    if (file) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setImageFile(null);
        setObjectUrl(null);
        setImageError(validationError);
        return;
      }
    }

    setImageFile(file);
    setObjectUrl(file ? URL.createObjectURL(file) : null);
    setUploadProgress(0);
  };

  const avatarPreview = useMemo(() => objectUrl || resolveImageUrl(user?.profileImage), [objectUrl, user?.profileImage]);
  const profileKey = user?.id || user?.email || "empty-profile";

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileStatus("");
    setUploadProgress(imageFile ? 15 : 0);
    setIsSavingProfile(true);

    try {
      const formData = buildProfileFormData(event.currentTarget, imageFile);
      if (imageFile) setUploadProgress(55);
      const response = await updateProfileAction(formData);
      if (imageFile) setUploadProgress(90);
      const updatedUser = response.data?.user;

      if (!updatedUser) {
        throw new Error("Updated user was not returned");
      }

      setUser(updatedUser);
      storeUserCookie(updatedUser);
      handleImageChange(null);
      setUploadProgress(100);
      setProfileStatus(response.message || "Profile updated successfully");
    } catch (error) {
      setProfileStatus(error instanceof Error ? error.message : "Profile update failed");
    } finally {
      setIsSavingProfile(false);
      window.setTimeout(() => setUploadProgress(0), 900);
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
      {section === "all" || section === "profile" ? (
      <section id="profile-settings" className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-lg shadow-emerald-900/5 sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Profile Settings</p>
            <h2 className="mt-2 text-2xl font-black text-stone-950">Update traveler profile</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">Keep your contact details ready for stay inquiries, route planning, and profile updates.</p>
          </div>
        </div>

        <form key={profileKey} className="mt-6 grid gap-5" onSubmit={handleProfileSubmit}>
          <div className="grid gap-5 lg:grid-cols-[140px_1fr]">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-emerald-100 text-3xl font-black text-emerald-800 shadow-xl shadow-emerald-900/15">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10" />
              )}
            </div>
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleImageChange(event.dataTransfer.files?.[0] || null);
              }}
              className={`rounded-3xl border border-dashed p-5 transition ${isDragging ? "border-emerald-500 bg-emerald-50" : "border-emerald-900/20 bg-stone-50"}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-stone-900">Upload profile picture</p>
                    <p className="mt-1 text-sm leading-6 text-stone-500">Drop an image here or choose a file. JPG, JPEG, PNG, or WEBP up to 2 MB.</p>
                    {imageFile ? <p className="mt-2 text-xs font-bold text-emerald-700">Selected: {imageFile.name}</p> : null}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-black text-white hover:bg-emerald-800">
                    {imageFile || user?.profileImage ? "Replace Image" : "Choose Image"}
                  </button>
                  {imageFile ? (
                    <button type="button" onClick={() => handleImageChange(null)} className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-black text-stone-700 hover:bg-stone-100">
                      <X className="h-4 w-4" /> Remove
                    </button>
                  ) : null}
                </div>
              </div>
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => handleImageChange(event.target.files?.[0] || null)}
              />
              {imageError ? <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{imageError}</p> : null}
              {uploadProgress > 0 ? (
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-emerald-700 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              ) : null}
            </div>
          </div>

          <div className={`grid gap-4 ${compact ? "sm:grid-cols-2" : "lg:grid-cols-2"}`}>
            <Field label="Full Name" name="fullName" required defaultValue={user?.fullName || ""} />
            <Field label="Email Address" name="email" type="email" required defaultValue={user?.email || ""} />
            <Field label="Phone Number" name="phoneNumber" defaultValue={user?.phoneNumber || ""} />
            <Field label="Location" name="location" defaultValue={user?.location || "Surkhet / Nepal"} />
            <label className="space-y-2 text-sm font-bold text-stone-700">
              Role
              <input
                readOnly
                value={user?.role === "admin" ? "Administrator" : "Traveler"}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-normal text-stone-600 outline-none"
              />
            </label>
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
      ) : null}

      {section === "all" || section === "security" ? (
      <section id="password" className="rounded-[28px] border border-emerald-900/10 bg-white p-5 shadow-lg shadow-emerald-900/5 sm:p-7">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Security & Password</p>
        <h2 className="mt-2 text-2xl font-black text-stone-950">Change password</h2>
        <form className="mt-6 grid gap-4 lg:grid-cols-3" onSubmit={handlePasswordSubmit}>
          <PasswordField label="Current Password" name="currentPassword" />
          <PasswordField label="New Password" name="newPassword" />
          <PasswordField label="Confirm New Password" name="confirmPassword" />
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
      ) : null}
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-2 text-sm font-bold text-stone-700">
      {label}{required ? " *" : ""}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function PasswordField({ label, name }: { label: string; name: string }) {
  return (
    <label className="space-y-2 text-sm font-bold text-stone-700">
      {label} *
      <PasswordInput
        name={name}
        required
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-normal text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}
