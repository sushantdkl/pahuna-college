"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardFrame } from "@/app/_components/pahuna-layout";
import { useAuth } from "@/context/AuthContext";
import {
  createAdminUserAction,
  deleteAdminUserAction,
  getAdminUsersAction,
  updateAdminUserAction,
} from "@/lib/actions/admin-user-actions";
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
};

const emptyForm: UserFormState = {
  fullName: "",
  email: "",
  password: "",
  role: "user",
  phoneNumber: "",
  location: "",
};

const pageSize = 10;
const inputClassName =
  "w-full rounded-2xl border border-emerald-900/10 bg-[#fffaf0] px-4 py-3 text-sm font-semibold text-stone-800 outline-none ring-emerald-100 transition placeholder:text-stone-400 focus:border-emerald-500 focus:ring-4";

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [meta, setMeta] = useState({
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 1,
  });
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.role === "admin";
  const adminNavItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Users", href: "/admin/users", active: true },
    { label: "Profile", href: "/profile" },
    { label: "Account Settings", href: "/account-settings" },
    { label: "Explore Surkhet", href: "/explore" },
  ];

  const loadUsers = useCallback(async () => {
    if (!isAdmin) {
      return;
    }

    setIsFetching(true);
    setError("");

    try {
      const response = await getAdminUsersAction({
        page,
        limit: pageSize,
        search: debouncedSearch,
      });

      setUsers(response.data || []);
      setMeta(
        response.meta || {
          page,
          limit: pageSize,
          total: response.data?.length || 0,
          totalPages: 1,
        },
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load users",
      );
    } finally {
      setIsFetching(false);
    }
  }, [debouncedSearch, isAdmin, page]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/admin/users");
      return;
    }

    if (!loading && user && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, loading, router, user]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadUsers]);

  const shortIdPrefix = useMemo(() => {
    return Math.max((meta.page - 1) * meta.limit, 0);
  }, [meta.limit, meta.page]);

  function openCreateForm() {
    setSelectedUser(null);
    setForm(emptyForm);
    setFormError("");
    setFormMode("create");
  }

  function openEditForm(adminUser: AdminUser) {
    setSelectedUser(adminUser);
    setForm({
      fullName: adminUser.fullName || "",
      email: adminUser.email || "",
      password: "",
      role: adminUser.role,
      phoneNumber: adminUser.phoneNumber || "",
      location: adminUser.location || "",
    });
    setFormError("");
    setFormMode("edit");
  }

  async function handleSaveUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const payload = {
      ...form,
      phoneNumber: form.phoneNumber.trim() || undefined,
      location: form.location.trim() || undefined,
    };
    const parsed =
      formMode === "create"
        ? adminUserCreateSchema.safeParse(payload)
        : adminUserEditSchema.safeParse(payload);

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Please check the form");
      return;
    }

    setIsSaving(true);

    try {
      if (formMode === "create") {
        await createAdminUserAction(parsed.data as AdminUserCreateFormData);
        setNotice("User created successfully");
      } else if (selectedUser) {
        await updateAdminUserAction(
          selectedUser._id,
          parsed.data as AdminUserEditFormData,
        );
        setNotice("User updated successfully");
      }

      setFormMode(null);
      await loadUsers();
    } catch (saveError) {
      setFormError(
        saveError instanceof Error ? saveError.message : "Unable to save user",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteUser() {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setNotice("");

    try {
      await deleteAdminUserAction(deleteTarget._id);
      setNotice("User deleted successfully");
      setDeleteTarget(null);
      await loadUsers();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete user",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading || (!user && !error)) {
    return <AdminShellLoader />;
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f3e8] px-4 text-stone-900">
        <section className="w-full max-w-md rounded-[28px] border border-emerald-900/10 bg-white p-8 text-center shadow-xl shadow-emerald-900/10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
            Admin only
          </p>
          <h1 className="mt-3 text-2xl font-black">Redirecting to dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            User management is only available to Pahuna admin accounts.
          </p>
        </section>
      </main>
    );
  }

  return (
    <DashboardFrame
      title="Users"
      eyebrow="Admin User Management"
      navItems={adminNavItems}
      action={
        <>
          <Link href="/dashboard" className="rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-50">
            Dashboard
          </Link>
          <button
            onClick={logout}
            className="rounded-2xl border border-red-100 bg-white px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </>
      }
    >
      <section className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
              Admin User Management
            </p>
            <h1 className="mt-3 text-3xl font-black text-stone-950 sm:text-4xl">
              Users
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Manage Pahuna accounts, roles, profile contact fields, and access from a protected admin workspace.
            </p>
          </div>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/10 hover:bg-emerald-800"
          >
            Add User
          </button>
        </div>

        <section className="mt-6 rounded-[28px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
          <div className="flex flex-col gap-4 border-b border-emerald-900/10 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users by name, email, or phone"
                className="w-full rounded-2xl border border-emerald-900/10 bg-[#fffaf0] px-4 py-3 text-sm font-semibold text-stone-800 outline-none ring-emerald-100 transition placeholder:text-stone-400 focus:border-emerald-500 focus:ring-4"
              />
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-stone-500">
              <span>{meta.total} total users</span>
              <button
                onClick={() => void loadUsers()}
                disabled={isFetching}
                className="rounded-2xl border border-emerald-200 px-4 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
              >
                Retry
              </button>
            </div>
          </div>

          {notice ? (
            <div className="mx-5 mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {notice}
            </div>
          ) : null}

          {error ? (
            <div className="mx-5 mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>{error}</span>
                <button
                  onClick={() => void loadUsers()}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : null}

          <div className="p-5">
            <div className="overflow-hidden rounded-[24px] border border-emerald-900/10">
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead className="bg-emerald-950 text-xs font-black uppercase tracking-[0.14em] text-white">
                    <tr>
                      <th className="px-5 py-4">ID</th>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Email</th>
                      <th className="px-5 py-4">Role</th>
                      <th className="px-5 py-4">Created</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/10 bg-white">
                    {isFetching ? (
                      <LoadingRows />
                    ) : users.length ? (
                      users.map((adminUser, index) => (
                        <tr key={adminUser._id} className="align-middle">
                          <td className="px-5 py-4 text-sm font-black text-stone-500">
                            #{shortIdPrefix + index + 1}
                          </td>
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-black text-stone-900">
                                {adminUser.fullName}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-stone-400">
                                {adminUser._id.slice(-8)}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-stone-600">
                            {adminUser.email}
                          </td>
                          <td className="px-5 py-4">
                            <RoleBadge role={adminUser.role} />
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-stone-500">
                            {formatDate(adminUser.createdAt)}
                          </td>
                          <td className="px-5 py-4">
                            <ActionButtons
                              user={adminUser}
                              onEdit={openEditForm}
                              onDelete={setDeleteTarget}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center">
                          <EmptyState search={debouncedSearch} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 bg-[#fffaf0] p-4 lg:hidden">
                {isFetching ? (
                  <MobileLoadingCards />
                ) : users.length ? (
                  users.map((adminUser) => (
                    <article
                      key={adminUser._id}
                      className="rounded-[24px] border border-emerald-900/10 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-black text-stone-950">
                            {adminUser.fullName}
                          </p>
                          <p className="mt-1 break-all text-sm font-semibold text-stone-500">
                            {adminUser.email}
                          </p>
                        </div>
                        <RoleBadge role={adminUser.role} />
                      </div>
                      <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-stone-400">
                        Created {formatDate(adminUser.createdAt)}
                      </p>
                      <div className="mt-4">
                        <ActionButtons
                          user={adminUser}
                          onEdit={openEditForm}
                          onDelete={setDeleteTarget}
                        />
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[24px] bg-white p-8 text-center">
                    <EmptyState search={debouncedSearch} />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-stone-500">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((value) => Math.max(value - 1, 1))}
                  disabled={isFetching || meta.page <= 1}
                  className="rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-black text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage((value) => Math.min(value + 1, meta.totalPages))
                  }
                  disabled={isFetching || meta.page >= meta.totalPages}
                  className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-black text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>

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

      {deleteTarget ? (
        <DeleteDialog
          user={deleteTarget}
          isDeleting={isDeleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteUser}
        />
      ) : null}
    </DashboardFrame>
  );
}

function AdminShellLoader() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f3e8] text-stone-700">
      <div className="rounded-[28px] border border-emerald-900/10 bg-white px-8 py-6 text-sm font-bold shadow-lg shadow-emerald-900/5">
        Loading admin users...
      </div>
    </main>
  );
}

function RoleBadge({ role }: { role: AdminUser["role"] }) {
  const isAdmin = role === "admin";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
        isAdmin
          ? "bg-emerald-100 text-emerald-800"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {role}
    </span>
  );
}

function ActionButtons({
  user,
  onEdit,
  onDelete,
}: {
  user: AdminUser;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button
        onClick={() => onEdit(user)}
        className="rounded-xl border border-emerald-200 px-3 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-50"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(user)}
        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-100"
      >
        Delete
      </button>
    </div>
  );
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
  const title = mode === "create" ? "Create user" : "Edit user";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4 py-6">
      <form
        onSubmit={onSubmit}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-white/80 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
              Admin form
            </p>
            <h2 className="mt-2 text-2xl font-black text-stone-950">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-200 px-4 py-2 text-xs font-black text-stone-600 hover:bg-stone-50"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input
              value={form.fullName}
              onChange={(event) =>
                onChange({ ...form, fullName: event.target.value })
              }
              className={inputClassName}
              autoComplete="name"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                onChange({ ...form, email: event.target.value })
              }
              className={inputClassName}
              autoComplete="email"
            />
          </Field>
          <Field label={mode === "create" ? "Password" : "New password"}>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                onChange({ ...form, password: event.target.value })
              }
              placeholder={mode === "edit" ? "Leave blank to keep current" : ""}
              className={inputClassName}
              autoComplete="new-password"
            />
          </Field>
          <Field label="Role">
            <select
              value={form.role}
              onChange={(event) =>
                onChange({
                  ...form,
                  role: event.target.value as UserFormState["role"],
                })
              }
              className={inputClassName}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
          <Field label="Phone">
            <input
              value={form.phoneNumber}
              onChange={(event) =>
                onChange({ ...form, phoneNumber: event.target.value })
              }
              className={inputClassName}
              autoComplete="tel"
            />
          </Field>
          <Field label="Location">
            <input
              value={form.location}
              onChange={(event) =>
                onChange({ ...form, location: event.target.value })
              }
              className={inputClassName}
              autoComplete="address-level2"
            />
          </Field>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-stone-200 px-5 py-3 text-sm font-black text-stone-600 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save User"}
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteDialog({
  user,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  user: AdminUser;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4">
      <section className="w-full max-w-md rounded-[30px] border border-white/80 bg-white p-6 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
          Delete user
        </p>
        <h2 className="mt-3 text-2xl font-black text-stone-950">
          Confirm deletion
        </h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          This will delete <span className="font-black">{user.fullName}</span>{" "}
          ({user.email}) from Pahuna.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-2xl border border-stone-200 px-5 py-3 text-sm font-black text-stone-600 hover:bg-stone-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm font-black text-stone-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

function LoadingRows() {
  return Array.from({ length: 5 }).map((_, index) => (
    <tr key={index}>
      {Array.from({ length: 6 }).map((__, cellIndex) => (
        <td key={cellIndex} className="px-5 py-4">
          <div className="h-4 animate-pulse rounded-full bg-emerald-100" />
        </td>
      ))}
    </tr>
  ));
}

function MobileLoadingCards() {
  return Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className="h-32 animate-pulse rounded-[24px] border border-emerald-900/10 bg-white"
    />
  ));
}

function EmptyState({ search }: { search: string }) {
  return (
    <div>
      <p className="text-lg font-black text-stone-900">No users found</p>
      <p className="mt-2 text-sm text-stone-500">
        {search
          ? "Try another search term or clear the search box."
          : "Create the first managed user from the Add User button."}
      </p>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
