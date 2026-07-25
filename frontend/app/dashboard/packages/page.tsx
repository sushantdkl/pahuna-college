"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminReplicaFrame, ReplicaStatCard, ReplicaStatusBadge } from "@/components/admin-replica-dashboard";
import {
  createAdminTripPackageAction,
  deleteAdminTripPackageAction,
  getAdminTripPackagesAction,
  updateAdminTripPackageAction,
} from "@/lib/actions/admin-trip-package-actions";
import type { AdminTripPackage } from "@/lib/api/admin-trip-packages";
import { tripPackageFormSchema, type TripPackageFormData } from "@/schemas/trip-package.schema";

type FormState = {
  title: string;
  slug: string;
  description: string;
  durationDays: string;
  priceMin: string;
  priceMax: string;
  difficulty: string;
  groupSize: string;
  images: string;
  highlights: string;
  itinerary: string;
  inclusions: string;
  exclusions: string;
  isActive: boolean;
  isFeatured: boolean;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  description: "",
  durationDays: "3",
  priceMin: "",
  priceMax: "",
  difficulty: "",
  groupSize: "",
  images: "",
  highlights: "",
  itinerary: "",
  inclusions: "",
  exclusions: "",
  isActive: true,
  isFeatured: false,
};

const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DashboardPackagesPage() {
  const [packages, setPackages] = useState<AdminTripPackage[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("");
  const [featured, setFeatured] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [viewPackage, setViewPackage] = useState<AdminTripPackage | null>(null);
  const [editPackage, setEditPackage] = useState<AdminTripPackage | null>(null);
  const [deletePackage, setDeletePackage] = useState<AdminTripPackage | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadPackages = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getAdminTripPackagesAction({
        page,
        limit: 10,
        search,
        active: active ? active === "true" : "",
        featured: featured ? featured === "true" : "",
      });
      setPackages(response.data || []);
      setMeta(response.meta || { page, limit: 10, total: response.data?.length || 0, totalPages: 1 });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load packages");
    } finally {
      setIsLoading(false);
    }
  }, [active, featured, page, search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadPackages(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadPackages]);

  const stats = useMemo(() => ({
    active: packages.filter((item) => item.isActive).length,
    featured: packages.filter((item) => item.isFeatured).length,
    averagePrice: packages.length
      ? Math.round(packages.reduce((sum, item) => sum + Number(item.priceMin || item.price || 0), 0) / packages.length)
      : 0,
  }), [packages]);

  function openCreate() {
    setEditPackage(null);
    setForm(emptyForm);
    setFormError("");
    setIsFormOpen(true);
  }

  function openEdit(item: AdminTripPackage) {
    setEditPackage(item);
    setIsFormOpen(true);
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      durationDays: String(item.durationDays || ""),
      priceMin: String(item.priceMin || item.price || ""),
      priceMax: String(item.priceMax || item.price || ""),
      difficulty: item.difficulty || "",
      groupSize: item.groupSize || "",
      images: (item.images || []).join("\n"),
      highlights: (item.highlights || []).join("\n"),
      itinerary: (item.itinerary || []).join("\n"),
      inclusions: (item.inclusions || []).join("\n"),
      exclusions: (item.exclusions || []).join("\n"),
      isActive: item.isActive,
      isFeatured: item.isFeatured,
    });
    setFormError("");
  }

  async function savePackage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");
    setNotice("");

    const payload = toPayload(form);
    const parsed = tripPackageFormSchema.safeParse(payload);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Please check the package form");
      setIsSaving(false);
      return;
    }

    try {
      if (editPackage) {
        await updateAdminTripPackageAction(editPackage._id, parsed.data);
        setNotice("Package updated successfully");
      } else {
        await createAdminTripPackageAction(parsed.data);
        setNotice("Package added successfully");
      }
      setEditPackage(null);
      setIsFormOpen(false);
      setForm(emptyForm);
      await loadPackages();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save package");
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deletePackage) return;
    setNotice("");
    setError("");
    try {
      await deleteAdminTripPackageAction(deletePackage._id);
      setDeletePackage(null);
      setNotice("Package deleted successfully");
      await loadPackages();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete package");
    }
  }

  async function quickUpdate(item: AdminTripPackage, payload: Partial<TripPackageFormData>, message: string) {
    setNotice("");
    setError("");
    try {
      await updateAdminTripPackageAction(item._id, payload);
      setNotice(message);
      await loadPackages();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update package");
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Trip Packages</h1>
            <p className="text-sm text-stone-500">Manage package records that publish to the existing public package cards and detail pages.</p>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Add Package</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReplicaStatCard title="Total Packages" value={meta.total} subtitle="Matching database records" icon="packages" />
          <ReplicaStatCard title="Active" value={stats.active} subtitle="Visible publicly" icon="status" />
          <ReplicaStatCard title="Featured" value={stats.featured} subtitle="Highlighted packages" icon="featured" />
          <ReplicaStatCard title="Average Starting Price" value={`NPR ${stats.averagePrice.toLocaleString("en-IN")}`} subtitle="Visible page average" icon="price" />
        </div>

        <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="grid gap-3 border-b border-stone-200 px-6 py-5 lg:grid-cols-[1fr_180px_180px]">
            <input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Search title, slug, or description" className={inputClassName} />
            <select value={active} onChange={(event) => { setPage(1); setActive(event.target.value); }} className={inputClassName}>
              <option value="">All status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <select value={featured} onChange={(event) => { setPage(1); setFeatured(event.target.value); }} className={inputClassName}>
              <option value="">All featured</option>
              <option value="true">Featured</option>
              <option value="false">Not featured</option>
            </select>
          </div>

          {notice ? <Alert tone="success" message={notice} /> : null}
          {error ? <Alert tone="error" message={error} /> : null}

          <div className="overflow-x-auto px-6 py-5">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-5 font-medium text-stone-500">Package</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Duration</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Price</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Status</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Featured</th>
                  <th className="pb-3 pr-5 font-medium text-stone-500">Updated</th>
                  <th className="pb-3 text-right font-medium text-stone-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <LoadingRows /> : packages.length ? packages.map((item) => (
                  <tr key={item._id} className="border-b last:border-0">
                    <td className="py-3 pr-5">
                      <p className="font-semibold text-stone-950">{item.title}</p>
                      <p className="mt-1 text-xs text-stone-500">/{item.slug}</p>
                    </td>
                    <td className="py-3 pr-5">{item.durationDays || "-"} days</td>
                    <td className="py-3 pr-5">NPR {Number(item.priceMin || item.price || 0).toLocaleString("en-IN")}</td>
                    <td className="py-3 pr-5"><ReplicaStatusBadge tone={item.isActive ? "success" : "warning"}>{item.isActive ? "Active" : "Inactive"}</ReplicaStatusBadge></td>
                    <td className="py-3 pr-5"><ReplicaStatusBadge tone={item.isFeatured ? "success" : "neutral"}>{item.isFeatured ? "Featured" : "Standard"}</ReplicaStatusBadge></td>
                    <td className="py-3 pr-5">{formatDate(item.updatedAt)}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button onClick={() => setViewPackage(item)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold hover:bg-stone-50">View</button>
                        <button onClick={() => openEdit(item)} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">Edit</button>
                        <button onClick={() => void quickUpdate(item, { isActive: !item.isActive }, item.isActive ? "Package unpublished" : "Package published")} className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50">{item.isActive ? "Unpublish" : "Publish"}</button>
                        <button onClick={() => void quickUpdate(item, { isFeatured: !item.isFeatured }, item.isFeatured ? "Package unfeatured" : "Package featured")} className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50">{item.isFeatured ? "Unfeature" : "Feature"}</button>
                        <button onClick={() => setDeletePackage(item)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="py-14 text-center"><p className="font-semibold text-stone-900">No packages found</p><p className="mt-2 text-sm text-stone-500">Add a package or adjust filters.</p></td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-stone-200 px-6 py-4">
            <p className="text-sm text-stone-500">Page {meta.page} of {meta.totalPages} - {meta.total} packages</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((value) => Math.max(value - 1, 1))} disabled={page <= 1 || isLoading} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold disabled:opacity-50">Previous</button>
              <button onClick={() => setPage((value) => Math.min(value + 1, meta.totalPages))} disabled={page >= meta.totalPages || isLoading} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Next</button>
            </div>
          </div>
        </section>
      </div>

      {isFormOpen ? <PackageFormDialog form={form} error={formError} isSaving={isSaving} isEdit={!!editPackage} onChange={setForm} onClose={() => { setEditPackage(null); setIsFormOpen(false); setForm(emptyForm); }} onSubmit={savePackage} /> : null}
      {viewPackage ? <DetailDialog item={viewPackage} onClose={() => setViewPackage(null)} /> : null}
      {deletePackage ? <ConfirmDialog item={deletePackage} onCancel={() => setDeletePackage(null)} onConfirm={confirmDelete} /> : null}
    </AdminReplicaFrame>
  );
}

function toPayload(form: FormState): TripPackageFormData {
  return {
    title: form.title,
    slug: form.slug,
    description: form.description,
    durationDays: Number(form.durationDays || 0) || undefined,
    priceMin: Number(form.priceMin || 0) || undefined,
    priceMax: Number(form.priceMax || 0) || undefined,
    difficulty: form.difficulty || undefined,
    groupSize: form.groupSize || undefined,
    images: lines(form.images),
    highlights: lines(form.highlights),
    itinerary: lines(form.itinerary),
    inclusions: lines(form.inclusions),
    exclusions: lines(form.exclusions),
    isActive: form.isActive,
    isFeatured: form.isFeatured,
  };
}

function PackageFormDialog({ form, error, isSaving, isEdit, onChange, onClose, onSubmit }: { form: FormState; error: string; isSaving: boolean; isEdit: boolean; onChange: (form: FormState) => void; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4 py-6">
      <form onSubmit={onSubmit} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Package form</p><h2 className="mt-2 text-2xl font-bold">{isEdit ? "Edit package" : "Add package"}</h2></div>
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Close</button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Title *"><input required value={form.title} onChange={(event) => onChange({ ...form, title: event.target.value })} className={inputClassName} /></Field>
          <Field label="Slug"><input value={form.slug} onChange={(event) => onChange({ ...form, slug: event.target.value })} className={inputClassName} placeholder="auto-generated if blank" /></Field>
          <Field label="Duration days"><input type="number" min={1} value={form.durationDays} onChange={(event) => onChange({ ...form, durationDays: event.target.value })} className={inputClassName} /></Field>
          <Field label="Group size"><input value={form.groupSize} onChange={(event) => onChange({ ...form, groupSize: event.target.value })} className={inputClassName} /></Field>
          <Field label="Price min"><input type="number" min={0} value={form.priceMin} onChange={(event) => onChange({ ...form, priceMin: event.target.value })} className={inputClassName} /></Field>
          <Field label="Price max"><input type="number" min={0} value={form.priceMax} onChange={(event) => onChange({ ...form, priceMax: event.target.value })} className={inputClassName} /></Field>
          <Field label="Difficulty"><input value={form.difficulty} onChange={(event) => onChange({ ...form, difficulty: event.target.value })} className={inputClassName} /></Field>
          <Field label="Images, one URL per line"><textarea value={form.images} onChange={(event) => onChange({ ...form, images: event.target.value })} className={`${inputClassName} min-h-24`} /></Field>
          <Field label="Description *"><textarea required value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} className={`${inputClassName} min-h-28`} /></Field>
          <Field label="Highlights, one per line"><textarea value={form.highlights} onChange={(event) => onChange({ ...form, highlights: event.target.value })} className={`${inputClassName} min-h-28`} /></Field>
          <Field label="Itinerary, one day per line"><textarea value={form.itinerary} onChange={(event) => onChange({ ...form, itinerary: event.target.value })} className={`${inputClassName} min-h-28`} /></Field>
          <Field label="Inclusions, one per line"><textarea value={form.inclusions} onChange={(event) => onChange({ ...form, inclusions: event.target.value })} className={`${inputClassName} min-h-28`} /></Field>
          <Field label="Exclusions, one per line"><textarea value={form.exclusions} onChange={(event) => onChange({ ...form, exclusions: event.target.value })} className={`${inputClassName} min-h-28`} /></Field>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.isActive} onChange={(event) => onChange({ ...form, isActive: event.target.checked })} /> Active</label>
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.isFeatured} onChange={(event) => onChange({ ...form, isFeatured: event.target.checked })} /> Featured</label>
          </div>
        </div>
        {error ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-semibold">Cancel</button>
          <button disabled={isSaving} className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{isSaving ? "Saving..." : "Save package"}</button>
        </div>
      </form>
    </div>
  );
}

function DetailDialog({ item, onClose }: { item: AdminTripPackage; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4"><section className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{item.isActive ? "Published" : "Private"}</p><h2 className="mt-2 text-2xl font-bold">{item.title}</h2><p className="mt-2 text-sm text-stone-500">/{item.slug}</p></div><button onClick={onClose} className="h-fit rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Close</button></div><p className="mt-5 text-sm leading-6 text-stone-700">{item.description}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><Detail label="Duration" value={`${item.durationDays || "-"} days`} /><Detail label="Price" value={`NPR ${Number(item.priceMin || item.price || 0).toLocaleString("en-IN")}`} /><Detail label="Group" value={item.groupSize || "Not set"} /><Detail label="Updated" value={formatDate(item.updatedAt)} /></div></section></div>;
}

function ConfirmDialog({ item, onCancel, onConfirm }: { item: AdminTripPackage; onCancel: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4"><section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Delete package</p><h2 className="mt-3 text-2xl font-bold">Confirm deletion</h2><p className="mt-3 text-sm leading-6 text-stone-600">Delete <span className="font-bold">{item.title}</span>? Unpublishing is safer if this package has public links.</p><div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-semibold">Cancel</button><button onClick={onConfirm} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white">Delete</button></div></section></div>;
}

function LoadingRows() {
  return Array.from({ length: 5 }).map((_, rowIndex) => <tr key={rowIndex}>{Array.from({ length: 7 }).map((__, cellIndex) => <td key={cellIndex} className="py-4 pr-5"><div className="h-4 animate-pulse rounded-full bg-stone-100" /></td>)}</tr>);
}

function Alert({ tone, message }: { tone: "success" | "error"; message: string }) {
  return <div className={`mx-6 mt-5 rounded-lg border px-4 py-3 text-sm ${tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}>{message}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-2 text-sm font-semibold text-stone-700"><span>{label}</span>{children}</label>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-1 text-sm font-semibold text-stone-900">{value}</p></div>;
}

function lines(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
