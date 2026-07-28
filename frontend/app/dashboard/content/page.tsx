"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AdminReplicaFrame,
  ReplicaStatCard,
  ReplicaStatusBadge,
} from "@/components/admin-replica-dashboard";
import {
  createAdminDestinationAction,
  deleteAdminDestinationAction,
  getAdminDestinationsAction,
  updateAdminDestinationAction,
} from "@/lib/actions/admin-destination-actions";
import type { AdminDestination } from "@/lib/api/admin-destinations";
import {
  adminDestinationFormSchema,
  type AdminDestinationFormData,
} from "@/schemas/admin-destination.schema";

type FormMode = "create" | "edit";

type DestinationFormState = {
  name: string;
  slug: string;
  description: string;
  attractions: string;
  bestTimeToVisit: string;
  distanceFromSurkhetKm: string;
  latitude: string;
  longitude: string;
  category: string;
  district: string;
  isActive: boolean;
  isFeatured: boolean;
};

const emptyForm: DestinationFormState = {
  name: "",
  slug: "",
  description: "",
  attractions: "",
  bestTimeToVisit: "",
  distanceFromSurkhetKm: "",
  latitude: "",
  longitude: "",
  category: "Lake",
  district: "Surkhet",
  isActive: true,
  isFeatured: false,
};

const pageSizeOptions = [10, 20, 50];
const categorySeeds = ["Lake", "Heritage", "Temple", "Viewpoint", "River", "Culture", "Adventure"];
const districtSeeds = ["Surkhet", "Mugu", "Dolpa", "Salyan", "Dailekh", "Karnali"];
const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DashboardContentPage() {
  const [destinations, setDestinations] = useState<AdminDestination[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [active, setActive] = useState("");
  const [featured, setFeatured] = useState("");
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<AdminDestination | null>(null);
  const [form, setForm] = useState<DestinationFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewDestination, setViewDestination] = useState<AdminDestination | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminDestination | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDestinations = useCallback(async () => {
    setIsFetching(true);
    setError("");

    try {
      const response = await getAdminDestinationsAction({
        page,
        limit,
        search: debouncedSearch,
        category,
        district,
        active,
        featured,
      });

      setDestinations(response.data || []);
      setMeta(response.meta || { page, limit, total: response.data?.length || 0, totalPages: 1 });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load destinations");
      setDestinations([]);
    } finally {
      setIsFetching(false);
    }
  }, [active, category, debouncedSearch, district, featured, limit, page]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadDestinations();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadDestinations]);

  const stats = useMemo(() => {
    const activeCount = destinations.filter((item) => item.isActive).length;
    const featuredCount = destinations.filter((item) => item.isFeatured).length;
    const coordinateCount = destinations.filter((item) => typeof item.latitude === "number" && typeof item.longitude === "number").length;

    return { activeCount, featuredCount, coordinateCount };
  }, [destinations]);

  const categoryOptions = useMemo(() => {
    return Array.from(new Set([...categorySeeds, ...destinations.map((item) => item.category || "").filter(Boolean)]));
  }, [destinations]);

  const districtOptions = useMemo(() => {
    return Array.from(new Set([...districtSeeds, ...destinations.map((item) => item.district || "").filter(Boolean)]));
  }, [destinations]);

  function openCreateForm() {
    setSelectedDestination(null);
    setForm(emptyForm);
    setFormError("");
    setImageFiles(null);
    setFormMode("create");
  }

  function openEditForm(destination: AdminDestination) {
    setSelectedDestination(destination);
    setForm({
      name: destination.name || "",
      slug: destination.slug || "",
      description: destination.description || "",
      attractions: destination.attractions?.join(", ") || "",
      bestTimeToVisit: destination.bestTimeToVisit || "",
      distanceFromSurkhetKm: destination.distanceFromSurkhetKm?.toString() || "",
      latitude: destination.latitude?.toString() || "",
      longitude: destination.longitude?.toString() || "",
      category: destination.category || "Lake",
      district: destination.district || "Surkhet",
      isActive: destination.isActive,
      isFeatured: destination.isFeatured,
    });
    setFormError("");
    setImageFiles(null);
    setFormMode("edit");
  }

  function toPayload(state: DestinationFormState): AdminDestinationFormData {
    return {
      name: state.name,
      slug: state.slug || undefined,
      description: state.description,
      attractions: state.attractions.split(",").map((item) => item.trim()).filter(Boolean),
      bestTimeToVisit: state.bestTimeToVisit || undefined,
      distanceFromSurkhetKm: state.distanceFromSurkhetKm ? Number(state.distanceFromSurkhetKm) : undefined,
      latitude: state.latitude ? Number(state.latitude) : undefined,
      longitude: state.longitude ? Number(state.longitude) : undefined,
      images: selectedDestination?.images || [],
      category: state.category || undefined,
      district: state.district || undefined,
      isActive: state.isActive,
      isFeatured: state.isFeatured,
    };
  }

  async function handleSaveDestination(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const parsed = adminDestinationFormSchema.safeParse(toPayload(form));

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Please check the destination form");
      return;
    }

    setIsSaving(true);

    try {
      if (formMode === "create") {
        await createAdminDestinationAction(parsed.data, imageFiles || undefined);
        setNotice("Destination created successfully");
      } else if (selectedDestination) {
        await updateAdminDestinationAction(selectedDestination._id, parsed.data, imageFiles || undefined);
        setNotice("Destination updated successfully");
      }

      setFormMode(null);
      await loadDestinations();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save destination");
    } finally {
      setIsSaving(false);
    }
  }

  async function quickPatchDestination(destination: AdminDestination, updates: Partial<AdminDestinationFormData>) {
    setNotice("");
    setError("");

    const payload = adminDestinationFormSchema.safeParse({
      ...destination,
      attractions: destination.attractions || [],
      ...updates,
    });

    if (!payload.success) {
      setError(payload.error.issues[0]?.message || "Unable to update destination");
      return;
    }

    try {
      await updateAdminDestinationAction(destination._id, payload.data);
      setNotice(`${destination.name} updated`);
      await loadDestinations();
    } catch (patchError) {
      setError(patchError instanceof Error ? patchError.message : "Unable to update destination");
    }
  }

  async function handleDeleteDestination() {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setNotice("");

    try {
      await deleteAdminDestinationAction(deleteTarget._id);
      setNotice("Destination deleted successfully");
      setDeleteTarget(null);
      await loadDestinations();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete destination");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Destinations</h1>
            <p className="text-sm text-stone-500">Manage public destination records and image galleries</p>
          </div>
          <button onClick={openCreateForm} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            New Destination
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReplicaStatCard title="Total Destinations" value={meta.total} subtitle="All matching records" icon="destination" />
          <ReplicaStatCard title="Featured Destinations" value={stats.featuredCount} subtitle="On this page" icon="featured" />
          <ReplicaStatCard title="Active Destinations" value={stats.activeCount} subtitle="On this page" icon="active" />
          <ReplicaStatCard title="With Coordinates" value={stats.coordinateCount} subtitle={`${destinations.length} visible records`} icon="map" />
        </div>

        <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="grid gap-3 border-b border-stone-200 px-6 py-5 lg:grid-cols-[1.2fr_repeat(5,minmax(0,0.7fr))]">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, slug, description, attraction" className={inputClassName} />
            <select value={category} onChange={(event) => { setPage(1); setCategory(event.target.value); }} className={inputClassName} aria-label="Category filter">
              <option value="">All categories</option>
              {categoryOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={district} onChange={(event) => { setPage(1); setDistrict(event.target.value); }} className={inputClassName} aria-label="District filter">
              <option value="">All districts</option>
              {districtOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={active} onChange={(event) => { setPage(1); setActive(event.target.value); }} className={inputClassName} aria-label="Active filter">
              <option value="">Active: all</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <select value={featured} onChange={(event) => { setPage(1); setFeatured(event.target.value); }} className={inputClassName} aria-label="Featured filter">
              <option value="">Featured: all</option>
              <option value="true">Featured</option>
              <option value="false">Not featured</option>
            </select>
            <select value={limit} onChange={(event) => { setPage(1); setLimit(Number(event.target.value)); }} className={inputClassName} aria-label="Rows per page">
              {pageSizeOptions.map((option) => <option key={option} value={option}>{option} rows</option>)}
            </select>
          </div>

          {notice ? <Alert tone="success" message={notice} /> : null}
          {error ? <Alert tone="error" message={error} onRetry={loadDestinations} /> : null}

          <div className="overflow-x-auto px-6 py-5">
            <table className="w-full min-w-[1080px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-5 font-medium text-stone-500">Name</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">District</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Category</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Distance</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Featured</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Active</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Updated</th>
                  <th className="pb-3 pr-5 text-right font-medium text-stone-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <LoadingRows />
                ) : destinations.length ? (
                  destinations.map((destination) => (
                    <tr key={destination._id} className="border-b last:border-0">
                      <td className="py-3 pr-5">
                        <p className="font-medium text-stone-950">{destination.name}</p>
                        <p className="mt-1 text-xs text-stone-500">/{destination.slug}</p>
                      </td>
                      <td className="py-3 pr-5 text-stone-700">{destination.district || "Not set"}</td>
                      <td className="py-3 pr-5 text-stone-700">{destination.category || "General"}</td>
                      <td className="py-3 pr-5 text-stone-700">{destination.distanceFromSurkhetKm ? `${destination.distanceFromSurkhetKm} km` : "Not set"}</td>
                      <td className="py-3 pr-5"><ReplicaStatusBadge>{destination.isFeatured ? "Featured" : "Standard"}</ReplicaStatusBadge></td>
                      <td className="py-3 pr-5"><ReplicaStatusBadge>{destination.isActive ? "Active" : "Inactive"}</ReplicaStatusBadge></td>
                      <td className="py-3 pr-5 text-stone-700">{formatDate(destination.updatedAt)}</td>
                      <td className="py-3 pr-0">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button onClick={() => setViewDestination(destination)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50">View</button>
                          <button onClick={() => openEditForm(destination)} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">Edit</button>
                          <button onClick={() => void quickPatchDestination(destination, { isFeatured: !destination.isFeatured })} className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50">{destination.isFeatured ? "Unfeature" : "Feature"}</button>
                          <button onClick={() => void quickPatchDestination(destination, { isActive: !destination.isActive })} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">{destination.isActive ? "Deactivate" : "Activate"}</button>
                          <button onClick={() => setDeleteTarget(destination)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-14 text-center">
                      <p className="text-base font-semibold text-stone-900">No destinations found</p>
                      <p className="mt-2 text-sm text-stone-500">Create a destination or adjust the filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">Page {meta.page} of {meta.totalPages} - {meta.total} destinations</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((value) => Math.max(value - 1, 1))} disabled={isFetching || meta.page <= 1} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50">Previous</button>
              <button onClick={() => setPage((value) => Math.min(value + 1, meta.totalPages))} disabled={isFetching || meta.page >= meta.totalPages} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">Next</button>
            </div>
          </div>
        </section>
      </div>

      {formMode ? (
        <DestinationFormDialog
          mode={formMode}
          form={form}
          error={formError}
          isSaving={isSaving}
          selectedDestination={selectedDestination}
          onClose={() => setFormMode(null)}
          onChange={setForm}
          onFiles={setImageFiles}
          onSubmit={handleSaveDestination}
        />
      ) : null}

      {viewDestination ? <ViewDestinationDialog destination={viewDestination} onClose={() => setViewDestination(null)} /> : null}
      {deleteTarget ? <DeleteDestinationDialog destination={deleteTarget} isDeleting={isDeleting} onCancel={() => setDeleteTarget(null)} onConfirm={handleDeleteDestination} /> : null}
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
      {Array.from({ length: 8 }).map((__, cellIndex) => (
        <td key={cellIndex} className="py-4 pr-5">
          <div className="h-4 animate-pulse rounded-full bg-stone-100" />
        </td>
      ))}
    </tr>
  ));
}

function DestinationFormDialog({
  mode,
  form,
  error,
  isSaving,
  selectedDestination,
  onClose,
  onChange,
  onFiles,
  onSubmit,
}: {
  mode: FormMode;
  form: DestinationFormState;
  error: string;
  isSaving: boolean;
  selectedDestination: AdminDestination | null;
  onClose: () => void;
  onChange: (form: DestinationFormState) => void;
  onFiles: (files: FileList | null) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4 py-6">
      <form onSubmit={onSubmit} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/80 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Destination form</p>
            <h2 className="mt-2 text-2xl font-bold text-stone-950">{mode === "create" ? "Create destination" : "Edit destination"}</h2>
            {selectedDestination?.images?.length ? <p className="mt-1 text-sm text-stone-500">{selectedDestination.images.length} current image(s)</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50">Close</button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Name"><input value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} className={inputClassName} /></Field>
          <Field label="Slug"><input value={form.slug} onChange={(event) => onChange({ ...form, slug: event.target.value })} placeholder="Auto-generated if blank" className={inputClassName} /></Field>
          <Field label="Category"><input value={form.category} onChange={(event) => onChange({ ...form, category: event.target.value })} className={inputClassName} /></Field>
          <Field label="District"><input value={form.district} onChange={(event) => onChange({ ...form, district: event.target.value })} className={inputClassName} /></Field>
          <Field label="Best time to visit"><input value={form.bestTimeToVisit} onChange={(event) => onChange({ ...form, bestTimeToVisit: event.target.value })} className={inputClassName} /></Field>
          <Field label="Distance from Surkhet (km)"><input type="number" value={form.distanceFromSurkhetKm} onChange={(event) => onChange({ ...form, distanceFromSurkhetKm: event.target.value })} className={inputClassName} /></Field>
          <Field label="Latitude"><input type="number" step="any" value={form.latitude} onChange={(event) => onChange({ ...form, latitude: event.target.value })} className={inputClassName} /></Field>
          <Field label="Longitude"><input type="number" step="any" value={form.longitude} onChange={(event) => onChange({ ...form, longitude: event.target.value })} className={inputClassName} /></Field>
          <Field label="Images"><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => onFiles(event.target.files)} className={inputClassName} /></Field>
          <Field label="Attractions"><input value={form.attractions} onChange={(event) => onChange({ ...form, attractions: event.target.value })} placeholder="Lake walk, photography, temple visit" className={inputClassName} /></Field>
          <div className="grid gap-3 rounded-lg border border-stone-200 p-4 text-sm font-semibold text-stone-700">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(event) => onChange({ ...form, isActive: event.target.checked })} /> Active destination</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(event) => onChange({ ...form, isFeatured: event.target.checked })} /> Featured</label>
          </div>
          <Field label="Description"><textarea value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} className={`${inputClassName} min-h-28`} /></Field>
        </div>

        {error ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50">Cancel</button>
          <button type="submit" disabled={isSaving} className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">{isSaving ? "Saving..." : "Save destination"}</button>
        </div>
      </form>
    </div>
  );
}

function ViewDestinationDialog({ destination, onClose }: { destination: AdminDestination; onClose: () => void }) {
  const mapHref = hasCoordinates(destination) ? `https://www.google.com/maps?q=${destination.latitude},${destination.longitude}` : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4">
      <section className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{destination.category || "Destination"}</p>
            <h2 className="mt-2 text-2xl font-bold text-stone-950">{destination.name}</h2>
            <p className="mt-2 text-sm text-stone-500">{destination.district || "Karnali"} - /{destination.slug}</p>
          </div>
          <button onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50">Close</button>
        </div>
        <p className="mt-5 text-sm leading-6 text-stone-600">{destination.description}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Detail label="Best time" value={destination.bestTimeToVisit || "Not set"} />
          <Detail label="Distance" value={destination.distanceFromSurkhetKm ? `${destination.distanceFromSurkhetKm} km` : "Not set"} />
          <Detail label="Attractions" value={destination.attractions.join(", ") || "Not set"} />
          <Detail label="Map" value={hasCoordinates(destination) ? `${destination.latitude}, ${destination.longitude}` : "Coordinates missing"} />
        </div>
        {mapHref ? <Link href={mapHref} target="_blank" className="mt-5 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Open map</Link> : null}
      </section>
    </div>
  );
}

function DeleteDestinationDialog({ destination, isDeleting, onCancel, onConfirm }: { destination: AdminDestination; isDeleting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Delete destination</p>
        <h2 className="mt-3 text-2xl font-bold text-stone-950">Confirm deletion</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">This will delete <span className="font-bold">{destination.name}</span> from destination management.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button onClick={onCancel} disabled={isDeleting} className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete destination"}</button>
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

function hasCoordinates(destination: AdminDestination) {
  return typeof destination.latitude === "number" && typeof destination.longitude === "number";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

