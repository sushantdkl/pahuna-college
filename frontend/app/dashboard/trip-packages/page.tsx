"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminReplicaFrame,
  ReplicaDataCard,
  ReplicaStatCard,
} from "@/app/_components/admin-replica-dashboard";
import {
  createAdminTripPackageAction,
  deleteAdminTripPackageAction,
  getAdminTripPackagesAction,
  updateAdminTripPackageAction,
} from "@/lib/actions/admin-trip-package-actions";
import type { AdminTripPackage } from "@/lib/api/admin-trip-packages";
import {
  tripPackageFormSchema,
  type TripPackageFormData,
} from "@/schemas/trip-package.schema";

type PackageFormState = {
  title: string;
  slug: string;
  description: string;
  destinationId: string;
  durationDays: string;
  price: string;
  priceMin: string;
  priceMax: string;
  itinerary: string;
  inclusions: string;
  exclusions: string;
  highlights: string;
  difficulty: string;
  groupSize: string;
  images: string;
  isActive: boolean;
  isFeatured: boolean;
};

const emptyForm: PackageFormState = {
  title: "",
  slug: "",
  description: "",
  destinationId: "",
  durationDays: "",
  price: "",
  priceMin: "",
  priceMax: "",
  itinerary: "",
  inclusions: "",
  exclusions: "",
  highlights: "",
  difficulty: "",
  groupSize: "",
  images: "",
  isActive: true,
  isFeatured: false,
};

const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DashboardTripPackagesPage() {
  const [packages, setPackages] = useState<AdminTripPackage[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [summary, setSummary] = useState({ total: 0, active: 0, featured: 0, averagePrice: 0 });
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"" | "true" | "false">("");
  const [featuredFilter, setFeaturedFilter] = useState<"" | "true" | "false">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<AdminTripPackage | "create" | null>(null);
  const [viewing, setViewing] = useState<AdminTripPackage | null>(null);
  const [deleting, setDeleting] = useState<AdminTripPackage | null>(null);
  const [form, setForm] = useState<PackageFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState("");

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminTripPackagesAction({
        page,
        limit: 10,
        search,
        active: activeFilter === "" ? "" : activeFilter === "true",
        featured: featuredFilter === "" ? "" : featuredFilter === "true",
      });
      setPackages(response.data || []);
      setMeta({
        total: response.meta?.total || 0,
        totalPages: response.meta?.totalPages || 1,
      });
      setSummary({
        total: response.meta?.summary?.total || 0,
        active: response.meta?.summary?.active || 0,
        featured: response.meta?.summary?.featured || 0,
        averagePrice: response.meta?.summary?.averagePrice || 0,
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load trip packages");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, featuredFilter, page, search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadPackages(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadPackages]);

  function openCreate() {
    setForm(emptyForm);
    setFormError("");
    setEditing("create");
  }

  function openEdit(tripPackage: AdminTripPackage) {
    setForm({
      title: tripPackage.title,
      slug: tripPackage.slug,
      description: tripPackage.description,
      destinationId: destinationId(tripPackage),
      durationDays: tripPackage.durationDays?.toString() || "",
      price: tripPackage.price?.toString() || "",
      priceMin: tripPackage.priceMin?.toString() || "",
      priceMax: tripPackage.priceMax?.toString() || "",
      itinerary: tripPackage.itinerary.join("\n"),
      inclusions: tripPackage.inclusions.join("\n"),
      exclusions: tripPackage.exclusions.join("\n"),
      highlights: tripPackage.highlights.join("\n"),
      difficulty: tripPackage.difficulty || "",
      groupSize: tripPackage.groupSize || "",
      images: tripPackage.images.join(", "),
      isActive: tripPackage.isActive,
      isFeatured: tripPackage.isFeatured,
    });
    setFormError("");
    setEditing(tripPackage);
  }

  function payload(): TripPackageFormData {
    return {
      title: form.title,
      slug: form.slug || undefined,
      description: form.description,
      destinationId: form.destinationId || undefined,
      durationDays: form.durationDays ? Number(form.durationDays) : undefined,
      price: form.price ? Number(form.price) : undefined,
      priceMin: form.priceMin ? Number(form.priceMin) : undefined,
      priceMax: form.priceMax ? Number(form.priceMax) : undefined,
      itinerary: lineList(form.itinerary),
      inclusions: lineList(form.inclusions),
      exclusions: lineList(form.exclusions),
      highlights: lineList(form.highlights),
      difficulty: form.difficulty || undefined,
      groupSize: form.groupSize || undefined,
      images: commaList(form.images),
      isActive: form.isActive,
      isFeatured: form.isFeatured,
    };
  }

  async function savePackage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const parsed = tripPackageFormSchema.safeParse(payload());
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Please check the package form");
      return;
    }
    setSaving(true);
    try {
      if (editing === "create") {
        await createAdminTripPackageAction(parsed.data);
        setNotice("Trip package created successfully.");
      } else if (editing) {
        await updateAdminTripPackageAction(editing._id, parsed.data);
        setNotice("Trip package updated successfully.");
      }
      setEditing(null);
      await loadPackages();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save package");
    } finally {
      setSaving(false);
    }
  }

  async function quickUpdate(tripPackage: AdminTripPackage, data: Partial<TripPackageFormData>) {
    setSavingId(tripPackage._id);
    setError("");
    try {
      await updateAdminTripPackageAction(tripPackage._id, data);
      setNotice("Trip package updated.");
      await loadPackages();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update package");
    } finally {
      setSavingId("");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setSaving(true);
    try {
      await deleteAdminTripPackageAction(deleting._id);
      setNotice("Trip package deleted successfully.");
      setDeleting(null);
      await loadPackages();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete package");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Trip Packages</h1>
            <p className="text-sm text-stone-500">Manage ready-made Karnali tour packages</p>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">New Package</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReplicaStatCard title="Total Packages" value={summary.total} subtitle="All packages" icon="TP" />
          <ReplicaStatCard title="Active Packages" value={summary.active} subtitle="Publicly visible" icon="AP" />
          <ReplicaStatCard title="Featured Packages" value={summary.featured} subtitle="Highlighted" icon="FP" />
          <ReplicaStatCard title="Average Price" value={summary.averagePrice ? `NPR ${summary.averagePrice.toLocaleString()}` : "NPR 0"} subtitle="Package price" icon="PR" />
        </div>

        {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p> : null}
        {error ? <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => void loadPackages()} className="font-bold underline">Retry</button></div> : null}

        <ReplicaDataCard title="Package records" description="Search, edit, activate, feature, or delete" count={meta.total}>
          <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(query.trim()); }} className="mb-5 grid gap-3 xl:grid-cols-[1fr_180px_180px_auto]">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, description, highlights, difficulty" className={inputClassName} />
            <select value={activeFilter} onChange={(event) => { setPage(1); setActiveFilter(event.target.value as "" | "true" | "false"); }} className={inputClassName}><option value="">Active and inactive</option><option value="true">Active</option><option value="false">Inactive</option></select>
            <select value={featuredFilter} onChange={(event) => { setPage(1); setFeaturedFilter(event.target.value as "" | "true" | "false"); }} className={inputClassName}><option value="">Featured and normal</option><option value="true">Featured</option><option value="false">Not featured</option></select>
            <button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">Search</button>
          </form>
          {loading ? <div className="py-14 text-center text-sm font-medium text-stone-500">Loading trip packages...</div> : packages.length ? (
            <table className="w-full min-w-[1180px] text-sm">
              <thead><tr className="border-b text-left text-stone-500"><th className="pb-3 pr-4 font-medium">Title</th><th className="pb-3 pr-4 font-medium">Destination</th><th className="pb-3 pr-4 font-medium">Duration</th><th className="pb-3 pr-4 font-medium">Price</th><th className="pb-3 pr-4 font-medium">Difficulty</th><th className="pb-3 pr-4 font-medium">Active</th><th className="pb-3 pr-4 font-medium">Featured</th><th className="pb-3 pr-4 font-medium">Updated</th><th className="pb-3 font-medium">Actions</th></tr></thead>
              <tbody>{packages.map((tripPackage) => <tr key={tripPackage._id} className="border-b border-stone-100 align-top last:border-0"><td className="py-4 pr-4"><p className="font-semibold text-stone-900">{tripPackage.title}</p><p className="mt-1 max-w-52 truncate text-xs text-stone-500">{tripPackage.description}</p></td><td className="py-4 pr-4 text-stone-600">{destinationName(tripPackage)}</td><td className="py-4 pr-4 text-stone-600">{tripPackage.durationDays ? `${tripPackage.durationDays} days` : "Flexible"}</td><td className="py-4 pr-4 text-stone-600">{priceLabel(tripPackage)}</td><td className="py-4 pr-4 text-stone-600">{tripPackage.difficulty || "Easy"}</td><td className="py-4 pr-4"><StatusBadge active={tripPackage.isActive} /></td><td className="py-4 pr-4 text-stone-600">{tripPackage.isFeatured ? "Featured" : "Normal"}</td><td className="py-4 pr-4 text-stone-500">{formatDate(tripPackage.updatedAt)}</td><td className="py-4"><div className="flex min-w-[430px] flex-wrap gap-2"><button onClick={() => setViewing(tripPackage)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold">View</button><button onClick={() => openEdit(tripPackage)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold">Edit</button><button disabled={savingId === tripPackage._id} onClick={() => void quickUpdate(tripPackage, { isActive: !tripPackage.isActive })} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 disabled:opacity-50">{tripPackage.isActive ? "Deactivate" : "Activate"}</button><button disabled={savingId === tripPackage._id} onClick={() => void quickUpdate(tripPackage, { isFeatured: !tripPackage.isFeatured })} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 disabled:opacity-50">{tripPackage.isFeatured ? "Unfeature" : "Feature"}</button><button onClick={() => setDeleting(tripPackage)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Delete</button></div></td></tr>)}</tbody>
            </table>
          ) : <div className="py-14 text-center"><p className="font-semibold text-stone-800">No trip packages found.</p><p className="mt-2 text-sm text-stone-500">Ready-made Karnali packages will appear here.</p><button onClick={openCreate} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Create package</button></div>}
          <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4 text-sm text-stone-500"><span>Page {page} of {meta.totalPages}</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Previous</button><button disabled={page >= meta.totalPages || loading} onClick={() => setPage((value) => Math.min(meta.totalPages, value + 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Next</button></div></div>
        </ReplicaDataCard>
      </div>

      {editing ? <PackageDialog mode={editing === "create" ? "create" : "edit"} form={form} setForm={setForm} error={formError} saving={saving} onClose={() => setEditing(null)} onSubmit={savePackage} /> : null}
      {viewing ? <PackageViewDialog tripPackage={viewing} onClose={() => setViewing(null)} /> : null}
      {deleting ? <ConfirmDialog tripPackage={deleting} saving={saving} onCancel={() => setDeleting(null)} onConfirm={() => void confirmDelete()} /> : null}
    </AdminReplicaFrame>
  );
}

function PackageDialog({ mode, form, setForm, error, saving, onClose, onSubmit }: { mode: "create" | "edit"; form: PackageFormState; setForm: React.Dispatch<React.SetStateAction<PackageFormState>>; error: string; saving: boolean; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <ModalShell title={mode === "create" ? "Create trip package" : "Edit trip package"} eyebrow="Trip Packages" onClose={onClose}><form onSubmit={onSubmit}><div className="grid gap-4 sm:grid-cols-2"><Field label="Title"><input value={form.title} onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))} className={inputClassName} /></Field><Field label="Slug"><input value={form.slug} onChange={(event) => setForm((value) => ({ ...value, slug: event.target.value }))} className={inputClassName} placeholder="auto from title" /></Field><Field label="Destination id"><input value={form.destinationId} onChange={(event) => setForm((value) => ({ ...value, destinationId: event.target.value }))} className={inputClassName} placeholder="Optional destination ObjectId" /></Field><Field label="Duration days"><input type="number" min="1" value={form.durationDays} onChange={(event) => setForm((value) => ({ ...value, durationDays: event.target.value }))} className={inputClassName} /></Field><Field label="Price"><input type="number" min="0" value={form.price} onChange={(event) => setForm((value) => ({ ...value, price: event.target.value }))} className={inputClassName} /></Field><Field label="Price min"><input type="number" min="0" value={form.priceMin} onChange={(event) => setForm((value) => ({ ...value, priceMin: event.target.value }))} className={inputClassName} /></Field><Field label="Price max"><input type="number" min="0" value={form.priceMax} onChange={(event) => setForm((value) => ({ ...value, priceMax: event.target.value }))} className={inputClassName} /></Field><Field label="Difficulty"><input value={form.difficulty} onChange={(event) => setForm((value) => ({ ...value, difficulty: event.target.value }))} className={inputClassName} /></Field><Field label="Group size"><input value={form.groupSize} onChange={(event) => setForm((value) => ({ ...value, groupSize: event.target.value }))} className={inputClassName} /></Field><Field label="Images"><input value={form.images} onChange={(event) => setForm((value) => ({ ...value, images: event.target.value }))} className={inputClassName} placeholder="/images/a.jpg, /images/b.jpg" /></Field><label className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm((value) => ({ ...value, isActive: event.target.checked }))} className="accent-emerald-700" />Active</label><label className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold"><input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm((value) => ({ ...value, isFeatured: event.target.checked }))} className="accent-emerald-700" />Featured</label></div><Field label="Description" className="mt-4"><textarea value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} className={`${inputClassName} min-h-32`} /></Field><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Highlights"><textarea value={form.highlights} onChange={(event) => setForm((value) => ({ ...value, highlights: event.target.value }))} className={`${inputClassName} min-h-28`} placeholder="One per line" /></Field><Field label="Itinerary"><textarea value={form.itinerary} onChange={(event) => setForm((value) => ({ ...value, itinerary: event.target.value }))} className={`${inputClassName} min-h-28`} placeholder="One per line" /></Field><Field label="Inclusions"><textarea value={form.inclusions} onChange={(event) => setForm((value) => ({ ...value, inclusions: event.target.value }))} className={`${inputClassName} min-h-28`} placeholder="One per line" /></Field><Field label="Exclusions"><textarea value={form.exclusions} onChange={(event) => setForm((value) => ({ ...value, exclusions: event.target.value }))} className={`${inputClassName} min-h-28`} placeholder="One per line" /></Field></div>{error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save package"}</button></div></form></ModalShell>;
}

function PackageViewDialog({ tripPackage, onClose }: { tripPackage: AdminTripPackage; onClose: () => void }) { return <ModalShell title={tripPackage.title} eyebrow="Package details" onClose={onClose}><div className="grid gap-3 sm:grid-cols-2"><Detail label="Destination" value={destinationName(tripPackage)} /><Detail label="Duration" value={tripPackage.durationDays ? `${tripPackage.durationDays} days` : "Flexible"} /><Detail label="Price" value={priceLabel(tripPackage)} /><Detail label="Difficulty" value={tripPackage.difficulty || "Easy"} /><Detail label="Active" value={tripPackage.isActive ? "Active" : "Inactive"} /><Detail label="Featured" value={tripPackage.isFeatured ? "Featured" : "Normal"} /></div><TextBlock label="Description" value={tripPackage.description} /><ListBlock label="Highlights" values={tripPackage.highlights} /><ListBlock label="Itinerary" values={tripPackage.itinerary} /><ListBlock label="Inclusions" values={tripPackage.inclusions} /><ListBlock label="Exclusions" values={tripPackage.exclusions} /></ModalShell>; }
function ConfirmDialog({ tripPackage, saving, onCancel, onConfirm }: { tripPackage: AdminTripPackage; saving: boolean; onCancel: () => void; onConfirm: () => void }) { return <ModalShell title="Delete trip package?" eyebrow="Permanent action" onClose={onCancel}><p className="text-sm leading-6 text-stone-600">Delete <strong>{tripPackage.title}</strong>? This cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button onClick={onConfirm} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Deleting..." : "Delete package"}</button></div></ModalShell>; }
function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/55 px-4 py-8"><section className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold">{title}</h2></div><button onClick={onClose} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">Close</button></div><div className="mt-6">{children}</div></section></div>; }
function Field({ label: fieldLabel, className = "", children }: { label: string; className?: string; children: React.ReactNode }) { return <label className={`block space-y-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-500 ${className}`}>{fieldLabel}{children}</label>; }
function Detail({ label: detailLabel, value }: { label: string; value: string }) { return <div className="rounded-xl border border-stone-200 bg-stone-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{detailLabel}</p><p className="mt-1 break-words text-sm font-semibold text-stone-800">{value}</p></div>; }
function TextBlock({ label: blockLabel, value }: { label: string; value: string }) { return <div className="mt-4 rounded-xl border border-stone-200 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{blockLabel}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-700">{value}</p></div>; }
function ListBlock({ label: blockLabel, values }: { label: string; values: string[] }) { return values.length ? <TextBlock label={blockLabel} value={values.join("\n")} /> : null; }
function StatusBadge({ active }: { active: boolean }) { return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-800" : "bg-red-50 text-red-700"}`}>{active ? "Active" : "Inactive"}</span>; }
function lineList(value: string) { return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean); }
function commaList(value: string) { return value.split(",").map((item) => item.trim()).filter(Boolean); }
function destinationId(tripPackage: AdminTripPackage) { return !tripPackage.destinationId ? "" : typeof tripPackage.destinationId === "string" ? tripPackage.destinationId : tripPackage.destinationId._id; }
function destinationName(tripPackage: AdminTripPackage) { return !tripPackage.destinationId || typeof tripPackage.destinationId === "string" ? "Karnali" : tripPackage.destinationId.name; }
function priceLabel(tripPackage: AdminTripPackage) { if (tripPackage.price !== undefined) return `NPR ${tripPackage.price.toLocaleString()}`; if (tripPackage.priceMin !== undefined && tripPackage.priceMax !== undefined) return `NPR ${tripPackage.priceMin.toLocaleString()} - ${tripPackage.priceMax.toLocaleString()}`; return "Contact"; }
function formatDate(value: string) { return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
