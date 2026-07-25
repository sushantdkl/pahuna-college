"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { User as UserIcon } from "lucide-react";
import { AdminReplicaFrame, ReplicaStatCard, ReplicaStatusBadge } from "@/components/admin-replica-dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PasswordInput } from "@/components/ui/password-input";
import {
  createAdminUserAction,
  deleteAdminUserAction,
  getAdminUsersAction,
  updateAdminUserAction,
} from "@/lib/actions/admin-user-actions";
import { resolveApiAssetUrl } from "@/lib/api/axios-instance";
import type { AdminUser } from "@/lib/api/admin-users";
import {
  adminUserCreateSchema,
  adminUserEditSchema,
  type AdminUserCreateFormData,
  type AdminUserEditFormData,
} from "@/schemas/admin-user.schema";

type FormMode = "create" | "edit";

type UserFormState = {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "user";
  phoneNumber: string;
  location: string;
  bio: string;
  profileImage: string;
  isActive: boolean;
  emailVerified: boolean;
};

const pageSizeOptions = [10, 20, 50];
const roleFilterOptions = [
  { label: "All roles", value: "" },
  { label: "Travelers", value: "user" },
  { label: "Administrators", value: "admin" },
];
const activeFilterOptions = [
  { label: "All accounts", value: "" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];
const verifiedFilterOptions = [
  { label: "All verification", value: "" },
  { label: "Verified", value: "true" },
  { label: "Unverified", value: "false" },
];
const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const emptyForm: UserFormState = {
  fullName: "",
  email: "",
  password: "",
  role: "user",
  phoneNumber: "",
  location: "",
  bio: "",
  profileImage: "",
  isActive: true,
  emailVerified: false,
};

export default function DashboardUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isFetching, setIsFetching] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsFetching(true);
    setError("");

    try {
      const response = await getAdminUsersAction({
        page,
        limit,
        search: debouncedSearch,
        role: roleFilter || undefined,
        active: activeFilter || undefined,
        verified: verifiedFilter || undefined,
      });
      setUsers(response.data || []);
      setMeta(response.meta || { page, limit, total: response.data?.length || 0, totalPages: 1 });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load users");
      setUsers([]);
    } finally {
      setIsFetching(false);
    }
  }, [activeFilter, debouncedSearch, limit, page, roleFilter, verifiedFilter]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadUsers]);

  const stats = useMemo(() => {
    const active = users.filter((user) => user.isActive !== false).length;
    const admins = users.filter((user) => user.role === "admin").length;
    const newThisMonth = users.filter((user) => {
      const createdAt = new Date(user.createdAt);
      const now = new Date();
      return createdAt.getFullYear() === now.getFullYear() && createdAt.getMonth() === now.getMonth();
    }).length;

    return { active, admins, newThisMonth };
  }, [users]);

  function openCreateForm() {
    setSelectedUser(null);
    setForm(emptyForm);
    setFormError("");
    setFormMode("create");
  }

  function openEditForm(user: AdminUser) {
    setSelectedUser(user);
    setForm({
      fullName: user.fullName,
      email: user.email,
      password: "",
      role: user.role,
      phoneNumber: user.phoneNumber || "",
      location: user.location || "",
      bio: user.bio || "",
      profileImage: user.profileImage || "",
      isActive: user.isActive !== false,
      emailVerified: user.emailVerified === true,
    });
    setFormError("");
    setFormMode("edit");
  }

  function toCreatePayload(state: UserFormState): AdminUserCreateFormData {
    return {
      fullName: state.fullName,
      email: state.email,
      password: state.password,
      role: state.role,
      phoneNumber: state.phoneNumber || undefined,
      location: state.location || undefined,
      bio: state.bio || undefined,
      profileImage: state.profileImage || undefined,
      isActive: state.isActive,
      emailVerified: state.emailVerified,
    };
  }

  function toEditPayload(state: UserFormState): AdminUserEditFormData {
    return {
      fullName: state.fullName,
      email: state.email,
      password: state.password || undefined,
      role: state.role,
      phoneNumber: state.phoneNumber || undefined,
      location: state.location || undefined,
      bio: state.bio || undefined,
      profileImage: state.profileImage || undefined,
      isActive: state.isActive,
      emailVerified: state.emailVerified,
    };
  }

  async function handleSaveUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const parsed = formMode === "create"
      ? adminUserCreateSchema.safeParse(toCreatePayload(form))
      : adminUserEditSchema.safeParse(toEditPayload(form));

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Please check the user form");
      return;
    }

    setIsSaving(true);

    try {
      if (formMode === "create") {
        await createAdminUserAction(parsed.data as AdminUserCreateFormData);
        setNotice("User added successfully");
      } else if (selectedUser) {
        await updateAdminUserAction(selectedUser._id, parsed.data as AdminUserEditFormData);
        setNotice("User updated successfully");
      }

      setFormMode(null);
      await loadUsers();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save user");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteUser() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError("");
    setNotice("");

    try {
      await deleteAdminUserAction(deleteTarget._id);
      setNotice("User deleted successfully");
      setDeleteTarget(null);
      await loadUsers();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete user");
    } finally {
      setIsDeleting(false);
    }
  }

  async function quickPatchUser(user: AdminUser, payload: AdminUserEditFormData, message: string) {
    setError("");
    setNotice("");

    try {
      await updateAdminUserAction(user._id, payload);
      setNotice(message);
      await loadUsers();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update user");
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-sm text-stone-500">Manage registered travelers and administrator accounts from the database.</p>
          </div>
          <button onClick={openCreateForm} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            Add User
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReplicaStatCard title="Total Users" value={meta.total} subtitle="All matching accounts" icon="users" />
          <ReplicaStatCard title="Active Users" value={stats.active} subtitle="Visible on this page" icon="users" />
          <ReplicaStatCard title="Administrators" value={stats.admins} subtitle="Visible on this page" icon="admin" />
          <ReplicaStatCard title="New Users This Month" value={stats.newThisMonth} subtitle="Visible on this page" icon="new" />
        </div>

        <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="grid gap-3 border-b border-stone-200 px-6 py-5 lg:grid-cols-[1fr_180px_180px_180px_150px]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, or phone"
              className={inputClassName}
            />
            <select value={roleFilter} onChange={(event) => { setPage(1); setRoleFilter(event.target.value); }} className={inputClassName} aria-label="Filter by role">
              {roleFilterOptions.map((option) => <option key={option.value || "all"} value={option.value}>{option.label}</option>)}
            </select>
            <select value={activeFilter} onChange={(event) => { setPage(1); setActiveFilter(event.target.value); }} className={inputClassName} aria-label="Filter by account status">
              {activeFilterOptions.map((option) => <option key={option.value || "all"} value={option.value}>{option.label}</option>)}
            </select>
            <select value={verifiedFilter} onChange={(event) => { setPage(1); setVerifiedFilter(event.target.value); }} className={inputClassName} aria-label="Filter by email verification">
              {verifiedFilterOptions.map((option) => <option key={option.value || "all"} value={option.value}>{option.label}</option>)}
            </select>
            <select value={limit} onChange={(event) => { setPage(1); setLimit(Number(event.target.value)); }} className={inputClassName} aria-label="Rows per page">
              {pageSizeOptions.map((option) => <option key={option} value={option}>{option} rows</option>)}
            </select>
          </div>

          {notice ? <Alert tone="success" message={notice} /> : null}
          {error ? <Alert tone="error" message={error} onRetry={loadUsers} /> : null}

          <div className="overflow-x-auto px-6 py-5">
            <table className="w-full min-w-[960px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-5 font-medium text-stone-500">User</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Email</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Role</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Status</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Verification</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Joined</th>
                  <th className="pb-3 pr-5 text-right font-medium text-stone-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <LoadingRows />
                ) : users.length ? (
                  users.map((user) => (
                    <tr key={user._id} className="border-b last:border-0">
                      <td className="py-3 pr-5">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} />
                          <div>
                            <p className="font-medium text-stone-950">{user.fullName}</p>
                            <p className="mt-1 text-xs text-stone-500">Updated {formatDate(user.updatedAt)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-5 text-stone-700">{user.email}</td>
                      <td className="py-3 pr-5"><ReplicaStatusBadge>{user.role === "admin" ? "Administrator" : "Traveler"}</ReplicaStatusBadge></td>
                      <td className="py-3 pr-5"><ReplicaStatusBadge tone={user.isActive === false ? "warning" : "success"}>{user.isActive === false ? "Inactive" : "Active"}</ReplicaStatusBadge></td>
                      <td className="py-3 pr-5"><ReplicaStatusBadge tone={user.emailVerified ? "success" : "warning"}>{user.emailVerified ? "Verified" : "Unverified"}</ReplicaStatusBadge></td>
                      <td className="py-3 pr-5 text-stone-700">{formatDate(user.createdAt)}</td>
                      <td className="py-3 pr-0">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button onClick={() => setViewUser(user)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50">View</button>
                          <button onClick={() => openEditForm(user)} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">Edit</button>
                          <button onClick={() => void quickPatchUser(user, { isActive: user.isActive === false }, user.isActive === false ? "User activated" : "User deactivated")} className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50">
                            {user.isActive === false ? "Activate" : "Deactivate"}
                          </button>
                          <button onClick={() => setDeleteTarget(user)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-14 text-center">
                      <p className="text-base font-semibold text-stone-900">No users found</p>
                      <p className="mt-2 text-sm text-stone-500">Add a user or adjust the search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">Page {meta.page} of {meta.totalPages} - {meta.total} users</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((value) => Math.max(value - 1, 1))} disabled={isFetching || meta.page <= 1} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50">Previous</button>
              <button onClick={() => setPage((value) => Math.min(value + 1, meta.totalPages))} disabled={isFetching || meta.page >= meta.totalPages} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">Next</button>
            </div>
          </div>
        </section>
      </div>

      {formMode ? (
        <UserFormDialog
          mode={formMode}
          form={form}
          error={formError}
          isSaving={isSaving}
          onClose={() => setFormMode(null)}
          onChange={setForm}
          onSubmit={handleSaveUser}
        />
      ) : null}

      {viewUser ? <ViewUserDialog user={viewUser} onClose={() => setViewUser(null)} /> : null}
      {deleteTarget ? <DeleteUserDialog user={deleteTarget} isDeleting={isDeleting} onCancel={() => setDeleteTarget(null)} onConfirm={handleDeleteUser} /> : null}
    </AdminReplicaFrame>
  );
}

function Alert({ tone, message, onRetry }: { tone: "success" | "error"; message: string; onRetry?: () => void }) {
  return (
    <div className={`mx-6 mt-5 rounded-lg border px-4 py-3 text-sm ${tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>{message}</span>
        {onRetry ? <button onClick={onRetry} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">Retry</button> : null}
      </div>
    </div>
  );
}

function LoadingRows() {
  return Array.from({ length: 6 }).map((_, rowIndex) => (
    <tr key={rowIndex}>
      {Array.from({ length: 7 }).map((__, cellIndex) => (
        <td key={cellIndex} className="py-4 pr-5">
          <div className="h-4 animate-pulse rounded-full bg-stone-100" />
        </td>
      ))}
    </tr>
  ));
}

function UserFormDialog({
  mode,
  form,
  error,
  isSaving,
  onClose,
  onChange,
  onSubmit,
}: {
  mode: FormMode;
  form: UserFormState;
  error: string;
  isSaving: boolean;
  onClose: () => void;
  onChange: (form: UserFormState) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4 py-6">
      <form onSubmit={onSubmit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/80 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Account form</p>
            <h2 className="mt-2 text-2xl font-bold text-stone-950">{mode === "create" ? "Add user" : "Edit user"}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50">Close</button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Full name *"><input required value={form.fullName} onChange={(event) => onChange({ ...form, fullName: event.target.value })} className={inputClassName} /></Field>
          <Field label="Email *"><input required type="email" value={form.email} onChange={(event) => onChange({ ...form, email: event.target.value })} className={inputClassName} /></Field>
          <Field label={mode === "create" ? "Password *" : "New password"}>
            <PasswordInput value={form.password} onChange={(event) => onChange({ ...form, password: event.target.value })} className={inputClassName} placeholder={mode === "create" ? "Minimum 6 characters" : "Leave blank to keep current password"} required={mode === "create"} />
          </Field>
          <Field label="Role"><select value={form.role} onChange={(event) => onChange({ ...form, role: event.target.value as UserFormState["role"] })} className={inputClassName}><option value="user">Traveler</option><option value="admin">Administrator</option></select></Field>
          <Field label="Phone"><input value={form.phoneNumber} onChange={(event) => onChange({ ...form, phoneNumber: event.target.value })} className={inputClassName} /></Field>
          <Field label="Location"><input value={form.location} onChange={(event) => onChange({ ...form, location: event.target.value })} className={inputClassName} /></Field>
          <Field label="Stored profile image path"><input value={form.profileImage} onChange={(event) => onChange({ ...form, profileImage: event.target.value })} className={inputClassName} placeholder="/uploads/profiles/photo.jpg" /></Field>
          <Field label="Account status"><select value={String(form.isActive)} onChange={(event) => onChange({ ...form, isActive: event.target.value === "true" })} className={inputClassName}><option value="true">Active</option><option value="false">Inactive</option></select></Field>
          <Field label="Email verification"><select value={String(form.emailVerified)} onChange={(event) => onChange({ ...form, emailVerified: event.target.value === "true" })} className={inputClassName}><option value="false">Unverified</option><option value="true">Verified</option></select></Field>
          <label className="space-y-2 text-sm font-semibold text-stone-700 sm:col-span-2">
            <span>Short bio</span>
            <textarea value={form.bio} onChange={(event) => onChange({ ...form, bio: event.target.value })} className={`${inputClassName} min-h-24 resize-y`} />
          </label>
        </div>

        {error ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50">Cancel</button>
          <button type="submit" disabled={isSaving} className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">{isSaving ? "Saving..." : "Save user"}</button>
        </div>
      </form>
    </div>
  );
}

function ViewUserDialog({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4">
      <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <UserAvatar user={user} size="lg" />
            <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{user.role === "admin" ? "Administrator" : "Traveler"}</p>
            <h2 className="mt-2 text-2xl font-bold text-stone-950">{user.fullName}</h2>
            <p className="mt-2 text-sm text-stone-500">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50">Close</button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Detail label="Phone" value={user.phoneNumber || "Not set"} />
          <Detail label="Location" value={user.location || "Not set"} />
          <Detail label="Status" value={user.isActive === false ? "Inactive" : "Active"} />
          <Detail label="Verification" value={user.emailVerified ? "Verified" : "Unverified"} />
          <Detail label="Joined" value={formatDate(user.createdAt)} />
          <Detail label="Updated" value={formatDate(user.updatedAt)} />
        </div>
        {user.bio ? <div className="mt-3"><Detail label="Bio" value={user.bio} /></div> : null}
      </section>
    </div>
  );
}

function DeleteUserDialog({ user, isDeleting, onCancel, onConfirm }: { user: AdminUser; isDeleting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Delete user</p>
        <h2 className="mt-3 text-2xl font-bold text-stone-950">Confirm deletion</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">This will remove <span className="font-bold">{user.fullName}</span>. The backend blocks deleting your own administrator account and protects the final active administrator.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={onCancel} disabled={isDeleting} className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete user"}</button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-2 text-sm font-semibold text-stone-700"><span>{label}</span>{children}</label>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-1 text-sm font-semibold text-stone-900">{value}</p></div>;
}

function UserAvatar({ user, size = "default" }: { user: AdminUser; size?: "default" | "lg" }) {
  const name = user.fullName || user.email;
  return (
    <Avatar size={size} className={size === "lg" ? "h-14 w-14 bg-emerald-50 text-emerald-800" : "h-10 w-10 bg-emerald-50 text-emerald-800"}>
      <AvatarImage
        src={resolveApiAssetUrl(user.profileImage) ?? undefined}
        alt={`${name} profile picture`}
        className="object-cover"
      />
      <AvatarFallback className="bg-emerald-50 font-bold text-emerald-800">
        {initials(name) || <UserIcon className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "U";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
