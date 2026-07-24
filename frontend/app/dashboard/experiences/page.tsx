"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AdminReplicaFrame,
  ReplicaStatCard,
  ReplicaStatusBadge,
} from "@/app/_components/admin-replica-dashboard";
import {
  createAdminExperienceAction,
  deleteAdminExperienceAction,
  getAdminExperiencesAction,
  updateAdminExperienceAction,
} from "@/lib/actions/admin-experience-actions";
import type { AdminExperience } from "@/lib/api/admin-experiences";
import {
  adminExperienceFormSchema,
  type AdminExperienceFormData,
} from "@/schemas/admin-experience.schema";

type FormMode = "create" | "edit";

type ExperienceFormState = {
  name: string;
  description: string;
  category: string;
  price: string;
  duration: string;
  location: string;
  latitude: string;
  longitude: string;
  maxParticipants: string;
  rating: string;
  reviewCount: string;
  isActive: boolean;
};

const emptyForm: ExperienceFormState = {
  name: "",
  description: "",
  category: "Adventure",
  price: "",
  duration: "",
  location: "",
  latitude: "",
  longitude: "",
  maxParticipants: "",
  rating: "",
  reviewCount: "",
  isActive: true,
};

const pageSizeOptions = [10, 20, 50];
const categorySeeds = ["Adventure", "Culture", "Food", "Wellness", "Heritage", "Workshop"];
const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DashboardExperiencesPage() {
  const [experiences, setExperiences] = useState<AdminExperience[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [active, setActive] = useState("");
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<AdminExperience | null>(null);
  const [form, setForm] = useState<ExperienceFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewExperience, setViewExperience] = useState<AdminExperience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminExperience | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadExperiences = useCallback(async () => {
    setIsFetching(true);
    setError("");

    try {
      const response = await getAdminExperiencesAction({
        page,
        limit,
        search: debouncedSearch,
        category,
        active,
      });

      setExperiences(response.data || []);
      setMeta(response.meta || { page, limit, total: response.data?.length || 0, totalPages: 1 });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load experiences");
      setExperiences([]);
    } finally {
      setIsFetching(false);
    }
  }, [active, category, debouncedSearch, limit, page]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadExperiences();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadExperiences]);

  const stats = useMemo(() => {
    const activeCount = experiences.filter((item) => item.isActive).length;
    const adventureCount = experiences.filter((item) => item.category.toLowerCase() === "adventure").length;
    const rated = experiences.filter((item) => typeof item.rating === "number");
    const averageRating = rated.length
      ? (rated.reduce((sum, item) => sum + (item.rating || 0), 0) / rated.length).toFixed(1)
      : "0";

    return { activeCount, adventureCount, averageRating };
  }, [experiences]);

  const categoryOptions = useMemo(() => {
    return Array.from(new Set([...categorySeeds, ...experiences.map((item) => item.category || "").filter(Boolean)]));
  }, [experiences]);

  function openCreateForm() {
    setSelectedExperience(null);
    setForm(emptyForm);
    setFormError("");
    setImageFiles(null);
    setFormMode("create");
  }

  function openEditForm(experience: AdminExperience) {
    setSelectedExperience(experience);
    setForm({
      name: experience.name || "",
      description: experience.description || "",
      category: experience.category || "Adventure",
      price: experience.price?.toString() || "",
      duration: experience.duration || "",
      location: experience.location || "",
      latitude: experience.latitude?.toString() || "",
      longitude: experience.longitude?.toString() || "",
      maxParticipants: experience.maxParticipants?.toString() || "",
      rating: experience.rating?.toString() || "",
      reviewCount: experience.reviewCount?.toString() || "",
      isActive: experience.isActive,
    });
    setFormError("");
    setImageFiles(null);
    setFormMode("edit");
  }

  function toPayload(state: ExperienceFormState): AdminExperienceFormData {
    return {
      name: state.name,
      description: state.description,
      category: state.category,
      price: state.price ? Number(state.price) : undefined,
      duration: state.duration || undefined,
      location: state.location,
      latitude: state.latitude ? Number(state.latitude) : undefined,
      longitude: state.longitude ? Number(state.longitude) : undefined,
      maxParticipants: state.maxParticipants ? Number(state.maxParticipants) : undefined,
      images: selectedExperience?.images || [],
      rating: state.rating ? Number(state.rating) : undefined,
      reviewCount: state.reviewCount ? Number(state.reviewCount) : undefined,
      isActive: state.isActive,
    };
  }

  async function handleSaveExperience(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const parsed = adminExperienceFormSchema.safeParse(toPayload(form));

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Please check the experience form");
      return;
    }

    setIsSaving(true);

    try {
      if (formMode === "create") {
        await createAdminExperienceAction(parsed.data, imageFiles || undefined);
        setNotice("Experience created successfully");
      } else if (selectedExperience) {
        await updateAdminExperienceAction(selectedExperience._id, parsed.data, imageFiles || undefined);
        setNotice("Experience updated successfully");
      }

      setFormMode(null);
      await loadExperiences();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save experience");
    } finally {
      setIsSaving(false);
    }
  }

  async function quickPatchExperience(experience: AdminExperience, updates: Partial<AdminExperienceFormData>) {
    setNotice("");
    setError("");

    const payload = adminExperienceFormSchema.safeParse({
      ...experience,
      images: experience.images || [],
      ...updates,
    });

    if (!payload.success) {
      setError(payload.error.issues[0]?.message || "Unable to update experience");
      return;
    }

    try {
      await updateAdminExperienceAction(experience._id, payload.data);
      setNotice(`${experience.name} updated`);
      await loadExperiences();
    } catch (patchError) {
      setError(patchError instanceof Error ? patchError.message : "Unable to update experience");
    }
  }

  async function handleDeleteExperience() {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setNotice("");

    try {
      await deleteAdminExperienceAction(deleteTarget._id);
      setNotice("Experience deleted successfully");
      setDeleteTarget(null);
      await loadExperiences();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete experience");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Experiences</h1>
            <p className="text-sm text-stone-500">Manage adventure, culture, wellness, and local activity experiences</p>
          </div>
          <button onClick={openCreateForm} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            New Experience
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReplicaStatCard title="Total Experiences" value={meta.total} subtitle="All matching records" icon="experience" />
          <ReplicaStatCard title="Active Experiences" value={stats.activeCount} subtitle="On this page" icon="active" />
          <ReplicaStatCard title="Adventure Experiences" value={stats.adventureCount} subtitle="On this page" icon="adventure" />
          <ReplicaStatCard title="Average Rating" value={stats.averageRating} subtitle="Visible rated records" icon="rating" />
        </div>

        <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="grid gap-3 border-b border-stone-200 px-6 py-5 lg:grid-cols-[1.2fr_repeat(3,minmax(0,0.7fr))]">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, category, location" className={inputClassName} />
            <select value={category} onChange={(event) => { setPage(1); setCategory(event.target.value); }} className={inputClassName} aria-label="Category filter">
              <option value="">All categories</option>
              {categoryOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={active} onChange={(event) => { setPage(1); setActive(event.target.value); }} className={inputClassName} aria-label="Active filter">
              <option value="">Active: all</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <select value={limit} onChange={(event) => { setPage(1); setLimit(Number(event.target.value)); }} className={inputClassName} aria-label="Rows per page">
              {pageSizeOptions.map((option) => <option key={option} value={option}>{option} rows</option>)}
            </select>
          </div>

          {notice ? <Alert tone="success" message={notice} /> : null}
          {error ? <Alert tone="error" message={error} onRetry={loadExperiences} /> : null}

          <div className="overflow-x-auto px-6 py-5">
            <table className="w-full min-w-[1160px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-5 font-medium text-stone-500">Name</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Category</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Location</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Price</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Duration</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Max</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Active</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Rating</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Updated</th>
                  <th className="pb-3 pr-5 text-right font-medium text-stone-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <LoadingRows />
                ) : experiences.length ? (
                  experiences.map((experience) => (
                    <tr key={experience._id} className="border-b last:border-0">
                      <td className="py-3 pr-5">
                        <p className="font-medium text-stone-950">{experience.name}</p>
                        <p className="mt-1 max-w-[240px] truncate text-xs text-stone-500">{experience.description}</p>
                      </td>
                      <td className="py-3 pr-5 text-stone-700">{experience.category}</td>
                      <td className="py-3 pr-5 text-stone-700">{experience.location}</td>
                      <td className="py-3 pr-5 text-stone-700">{experience.price ? `Rs. ${experience.price}` : "Ask price"}</td>
                      <td className="py-3 pr-5 text-stone-700">{experience.duration || "Flexible"}</td>
                      <td className="py-3 pr-5 text-stone-700">{experience.maxParticipants || "Open"}</td>
                      <td className="py-3 pr-5"><ReplicaStatusBadge>{experience.isActive ? "Active" : "Inactive"}</ReplicaStatusBadge></td>
                      <td className="py-3 pr-5 text-stone-700">{experience.rating ? `${experience.rating} (${experience.reviewCount || 0})` : "Pending"}</td>
                      <td className="py-3 pr-5 text-stone-700">{formatDate(experience.updatedAt)}</td>
                      <td className="py-3 pr-0">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button onClick={() => setViewExperience(experience)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50">View</button>
                          <button onClick={() => openEditForm(experience)} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">Edit</button>
                          <button onClick={() => void quickPatchExperience(experience, { isActive: !experience.isActive })} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">{experience.isActive ? "Deactivate" : "Activate"}</button>
                          <button onClick={() => setDeleteTarget(experience)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-14 text-center">
                      <p className="text-base font-semibold text-stone-900">No experiences found</p>
                      <p className="mt-2 text-sm text-stone-500">Create an experience or adjust the filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">Page {meta.page} of {meta.totalPages} - {meta.total} experiences</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((value) => Math.max(value - 1, 1))} disabled={isFetching || meta.page <= 1} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50">Previous</button>
              <button onClick={() => setPage((value) => Math.min(value + 1, meta.totalPages))} disabled={isFetching || meta.page >= meta.totalPages} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">Next</button>
            </div>
          </div>
        </section>
      </div>

      {formMode ? (
        <ExperienceFormDialog
          mode={formMode}
          form={form}
          error={formError}
          isSaving={isSaving}
          onClose={() => setFormMode(null)}
          onChange={setForm}
          onFiles={setImageFiles}
          onSubmit={handleSaveExperience}
        />
      ) : null}

      {viewExperience ? <ViewExperienceDialog experience={viewExperience} onClose={() => setViewExperience(null)} /> : null}
      {deleteTarget ? <DeleteExperienceDialog experience={deleteTarget} isDeleting={isDeleting} onCancel={() => setDeleteTarget(null)} onConfirm={handleDeleteExperience} /> : null}
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
      {Array.from({ length: 10 }).map((__, cellIndex) => (
        <td key={cellIndex} className="py-4 pr-5">
          <div className="h-4 animate-pulse rounded-full bg-stone-100" />
        </td>
      ))}
    </tr>
  ));
}

function ExperienceFormDialog({
  mode,
  form,
  error,
  isSaving,
  onClose,
  onChange,
  onFiles,
  onSubmit,
}: {
  mode: FormMode;
  form: ExperienceFormState;
  error: string;
  isSaving: boolean;
  onClose: () => void;
  onChange: (form: ExperienceFormState) => void;
  onFiles: (files: FileList | null) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4 py-6">
      <form onSubmit={onSubmit} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/80 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Experience form</p>
            <h2 className="mt-2 text-2xl font-bold text-stone-950">{mode === "create" ? "Create experience" : "Edit experience"}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50">Close</button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Name"><input value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} className={inputClassName} /></Field>
          <Field label="Category"><input value={form.category} onChange={(event) => onChange({ ...form, category: event.target.value })} className={inputClassName} /></Field>
          <Field label="Location"><input value={form.location} onChange={(event) => onChange({ ...form, location: event.target.value })} className={inputClassName} /></Field>
          <Field label="Duration"><input value={form.duration} onChange={(event) => onChange({ ...form, duration: event.target.value })} className={inputClassName} /></Field>
          <Field label="Price"><input type="number" value={form.price} onChange={(event) => onChange({ ...form, price: event.target.value })} className={inputClassName} /></Field>
          <Field label="Max participants"><input type="number" value={form.maxParticipants} onChange={(event) => onChange({ ...form, maxParticipants: event.target.value })} className={inputClassName} /></Field>
          <Field label="Latitude"><input type="number" step="any" value={form.latitude} onChange={(event) => onChange({ ...form, latitude: event.target.value })} className={inputClassName} /></Field>
          <Field label="Longitude"><input type="number" step="any" value={form.longitude} onChange={(event) => onChange({ ...form, longitude: event.target.value })} className={inputClassName} /></Field>
          <Field label="Rating"><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(event) => onChange({ ...form, rating: event.target.value })} className={inputClassName} /></Field>
          <Field label="Review count"><input type="number" value={form.reviewCount} onChange={(event) => onChange({ ...form, reviewCount: event.target.value })} className={inputClassName} /></Field>
          <Field label="Images"><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => onFiles(event.target.files)} className={inputClassName} /></Field>
          <div className="grid gap-3 rounded-lg border border-stone-200 p-4 text-sm font-semibold text-stone-700">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(event) => onChange({ ...form, isActive: event.target.checked })} /> Active experience</label>
          </div>
          <Field label="Description"><textarea value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} className={`${inputClassName} min-h-28`} /></Field>
        </div>

        {error ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50">Cancel</button>
          <button type="submit" disabled={isSaving} className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">{isSaving ? "Saving..." : "Save experience"}</button>
        </div>
      </form>
    </div>
  );
}

function ViewExperienceDialog({ experience, onClose }: { experience: AdminExperience; onClose: () => void }) {
  const mapHref = hasCoordinates(experience) ? `https://www.openstreetmap.org/?mlat=${experience.latitude}&mlon=${experience.longitude}#map=16/${experience.latitude}/${experience.longitude}` : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4">
      <section className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{experience.category}</p>
            <h2 className="mt-2 text-2xl font-bold text-stone-950">{experience.name}</h2>
            <p className="mt-2 text-sm text-stone-500">{experience.location}</p>
          </div>
          <button onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50">Close</button>
        </div>
        <p className="mt-5 text-sm leading-6 text-stone-600">{experience.description}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Detail label="Price" value={experience.price ? `Rs. ${experience.price}` : "Ask price"} />
          <Detail label="Duration" value={experience.duration || "Flexible"} />
          <Detail label="Participants" value={experience.maxParticipants ? `${experience.maxParticipants}` : "Open"} />
          <Detail label="Rating" value={experience.rating ? `${experience.rating} / 5` : "Pending"} />
        </div>
        {mapHref ? <Link href={mapHref} target="_blank" className="mt-5 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Open map</Link> : null}
      </section>
    </div>
  );
}

function DeleteExperienceDialog({ experience, isDeleting, onCancel, onConfirm }: { experience: AdminExperience; isDeleting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Delete experience</p>
        <h2 className="mt-3 text-2xl font-bold text-stone-950">Confirm deletion</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">This will delete <span className="font-bold">{experience.name}</span> from experience management.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={onCancel} disabled={isDeleting} className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete experience"}</button>
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

function hasCoordinates(experience: AdminExperience) {
  return typeof experience.latitude === "number" && typeof experience.longitude === "number";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
