"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminReplicaFrame, ReplicaStatCard, ReplicaStatusBadge } from "@/components/admin-replica-dashboard";
import {
  createAdminFoodProvider,
  deleteAdminFoodProvider,
  getAdminFoodProviders,
  updateAdminFoodProvider,
  type FoodProvider,
  type FoodProviderPayload,
} from "@/lib/api/final-crud";

type FormMode = "create" | "edit";

type FoodForm = {
  name: string;
  type: string;
  district: string;
  area: string;
  address: string;
  latitude: string;
  longitude: string;
  shortDescription: string;
  cuisines: string;
  services: string;
  features: string;
  phone: string;
  email: string;
  openingHours: string;
  priceLevel: string;
  verificationStatus: FoodProvider["verificationStatus"];
  featured: boolean;
  active: boolean;
};

const emptyForm: FoodForm = {
  name: "",
  type: "Cafe",
  district: "Surkhet",
  area: "",
  address: "",
  latitude: "",
  longitude: "",
  shortDescription: "",
  cuisines: "",
  services: "",
  features: "",
  phone: "",
  email: "",
  openingHours: "",
  priceLevel: "",
  verificationStatus: "PENDING",
  featured: false,
  active: true,
};

const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const pageSizeOptions = [10, 20, 50];

export default function DashboardFoodPage() {
  const [providers, setProviders] = useState<FoodProvider[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isFetching, setIsFetching] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<FormMode | null>(null);
  const [selected, setSelected] = useState<FoodProvider | null>(null);
  const [viewProvider, setViewProvider] = useState<FoodProvider | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FoodProvider | null>(null);
  const [form, setForm] = useState<FoodForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProviders = useCallback(async () => {
    setIsFetching(true);
    setError("");

    try {
      const response = await getAdminFoodProviders({
        page,
        limit,
        search,
        type: typeFilter,
        verificationStatus: statusFilter,
        active: activeFilter === "" ? "" : activeFilter === "true",
      });
      setProviders(response.data || []);
      setMeta(response.meta || { page, limit, total: response.data?.length || 0, totalPages: 1 });
    } catch (loadError) {
      setProviders([]);
      setError(loadError instanceof Error ? loadError.message : "Unable to load food providers");
    } finally {
      setIsFetching(false);
    }
  }, [activeFilter, limit, page, search, statusFilter, typeFilter]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadProviders(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadProviders]);

  const stats = useMemo(() => ({
    total: meta.total,
    active: providers.filter((item) => item.active).length,
    verified: providers.filter((item) => item.verificationStatus === "VERIFIED" || item.verificationStatus === "PARTNER").length,
    featured: providers.filter((item) => item.featured).length,
  }), [meta.total, providers]);

  function openCreate() {
    setSelected(null);
    setForm(emptyForm);
    setFormError("");
    setMode("create");
  }

  function openEdit(provider: FoodProvider) {
    setSelected(provider);
    setForm({
      name: provider.name,
      type: provider.type,
      district: provider.district,
      area: provider.area,
      address: provider.address || "",
      latitude: provider.latitude === undefined ? "" : String(provider.latitude),
      longitude: provider.longitude === undefined ? "" : String(provider.longitude),
      shortDescription: provider.shortDescription,
      cuisines: provider.cuisines.join(", "),
      services: provider.services.join(", "),
      features: provider.features.join(", "),
      phone: provider.phone || "",
      email: provider.email || "",
      openingHours: provider.openingHours || "",
      priceLevel: provider.priceLevel || "",
      verificationStatus: provider.verificationStatus,
      featured: provider.featured,
      active: provider.active,
    });
    setFormError("");
    setMode("edit");
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const payload = toPayload(form);
    if (!payload.name || !payload.type || !payload.district || !payload.area || !payload.shortDescription) {
      setFormError("Name, type, district, area, and description are required");
      return;
    }

    setIsSaving(true);
    try {
      if (mode === "create") {
        await createAdminFoodProvider(payload);
        setNotice("Food provider added");
      } else if (selected) {
        await updateAdminFoodProvider(selected._id, payload);
        setNotice("Food provider updated");
      }
      setMode(null);
      await loadProviders();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save food provider");
    } finally {
      setIsSaving(false);
    }
  }

  async function quickPatch(provider: FoodProvider, payload: FoodProviderPayload, message: string) {
    setError("");
    setNotice("");
    try {
      await updateAdminFoodProvider(provider._id, payload);
      setNotice(message);
      await loadProviders();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update food provider");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError("");
    setNotice("");
    try {
      await deleteAdminFoodProvider(deleteTarget._id);
      setNotice("Food provider deleted");
      setDeleteTarget(null);
      await loadProviders();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete food provider");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><h1 className="text-2xl font-bold tracking-tight">Food & Cafes</h1><p className="text-sm text-stone-500">Manage restaurants, cafes, tea stops, and local food providers from the database.</p></div>
          <button onClick={openCreate} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Add Food Provider</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReplicaStatCard title="Food Providers" value={stats.total} subtitle="All matching records" icon="food" />
          <ReplicaStatCard title="Active Providers" value={stats.active} subtitle="Visible on this page" icon="active" />
          <ReplicaStatCard title="Verified Providers" value={stats.verified} subtitle="Visible on this page" icon="verified" />
          <ReplicaStatCard title="Featured Providers" value={stats.featured} subtitle="Visible on this page" icon="featured" />
        </div>

        <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="grid gap-3 border-b border-stone-200 px-6 py-5 lg:grid-cols-[1fr_160px_170px_150px_140px]">
            <input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Search food provider, area, cuisine, or phone" className={inputClassName} />
            <input value={typeFilter} onChange={(event) => { setPage(1); setTypeFilter(event.target.value); }} placeholder="Type" className={inputClassName} />
            <select value={statusFilter} onChange={(event) => { setPage(1); setStatusFilter(event.target.value); }} className={inputClassName} aria-label="Filter by verification">
              <option value="">All verification</option><option value="PENDING">Pending</option><option value="VERIFIED">Verified</option><option value="PARTNER">Partner</option><option value="REJECTED">Rejected</option>
            </select>
            <select value={activeFilter} onChange={(event) => { setPage(1); setActiveFilter(event.target.value); }} className={inputClassName} aria-label="Filter by active status">
              <option value="">All status</option><option value="true">Active</option><option value="false">Inactive</option>
            </select>
            <select value={limit} onChange={(event) => { setPage(1); setLimit(Number(event.target.value)); }} className={inputClassName} aria-label="Rows per page">
              {pageSizeOptions.map((option) => <option key={option} value={option}>{option} rows</option>)}
            </select>
          </div>

          {notice ? <Alert tone="success" message={notice} /> : null}
          {error ? <Alert tone="error" message={error} onRetry={loadProviders} /> : null}

          <div className="overflow-x-auto px-6 py-5">
            <table className="w-full min-w-[1120px] text-sm">
              <thead><tr className="border-b text-left"><th className="pb-3 pr-5 font-medium text-stone-500">Provider</th><th className="pb-3 pr-5 font-medium text-stone-500">Type</th><th className="pb-3 pr-5 font-medium text-stone-500">Location</th><th className="pb-3 pr-5 font-medium text-stone-500">Contact</th><th className="pb-3 pr-5 font-medium text-stone-500">Verification</th><th className="pb-3 pr-5 font-medium text-stone-500">Public</th><th className="pb-3 pr-5 text-right font-medium text-stone-500">Actions</th></tr></thead>
              <tbody>{isFetching ? <LoadingRows /> : providers.length ? providers.map((provider) => (
                <tr key={provider._id} className="border-b last:border-0">
                  <td className="py-3 pr-5"><p className="font-semibold text-stone-950">{provider.name}</p><p className="mt-1 line-clamp-1 text-xs text-stone-500">{provider.shortDescription}</p></td>
                  <td className="py-3 pr-5 text-stone-700">{provider.type}</td>
                  <td className="py-3 pr-5 text-stone-700">{[provider.area, provider.district].filter(Boolean).join(", ") || "Not set"}</td>
                  <td className="py-3 pr-5 text-stone-700">{provider.phone || provider.email || "Not set"}</td>
                  <td className="py-3 pr-5"><ReplicaStatusBadge tone={provider.verificationStatus === "REJECTED" ? "danger" : provider.verificationStatus === "PENDING" ? "warning" : "success"}>{label(provider.verificationStatus)}</ReplicaStatusBadge></td>
                  <td className="py-3 pr-5"><ReplicaStatusBadge tone={provider.active ? "success" : "warning"}>{provider.active ? "Active" : "Inactive"}</ReplicaStatusBadge></td>
                  <td className="py-3 pr-0"><div className="flex flex-wrap justify-end gap-2"><button onClick={() => setViewProvider(provider)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50">View</button><button onClick={() => openEdit(provider)} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">Edit</button><button onClick={() => void quickPatch(provider, { featured: !provider.featured }, provider.featured ? "Provider unfeatured" : "Provider featured")} className="rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50">{provider.featured ? "Unfeature" : "Feature"}</button><button onClick={() => void quickPatch(provider, { active: !provider.active }, provider.active ? "Provider deactivated" : "Provider activated")} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">{provider.active ? "Deactivate" : "Activate"}</button><button onClick={() => setDeleteTarget(provider)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Delete</button></div></td>
                </tr>
              )) : <tr><td colSpan={7} className="py-14 text-center"><p className="text-base font-semibold text-stone-900">No food providers found</p><p className="mt-2 text-sm text-stone-500">Add a food provider or adjust the filters.</p></td></tr>}</tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-stone-500">Page {meta.page} of {meta.totalPages} - {meta.total} providers</p><div className="flex gap-2"><button onClick={() => setPage((value) => Math.max(value - 1, 1))} disabled={isFetching || meta.page <= 1} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50">Previous</button><button onClick={() => setPage((value) => Math.min(value + 1, meta.totalPages))} disabled={isFetching || meta.page >= meta.totalPages} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">Next</button></div></div>
        </section>
      </div>

      {mode ? <FoodFormDialog mode={mode} form={form} error={formError} isSaving={isSaving} onChange={setForm} onClose={() => setMode(null)} onSubmit={handleSave} /> : null}
      {viewProvider ? <ViewDialog provider={viewProvider} onClose={() => setViewProvider(null)} /> : null}
      {deleteTarget ? <DeleteDialog provider={deleteTarget} isDeleting={isDeleting} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} /> : null}
    </AdminReplicaFrame>
  );
}

function FoodFormDialog({ mode, form, error, isSaving, onChange, onClose, onSubmit }: { mode: FormMode; form: FoodForm; error: string; isSaving: boolean; onChange: (form: FoodForm) => void; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <Modal title={mode === "create" ? "Add food provider" : "Edit food provider"} eyebrow="Food provider" onClose={onClose}><form onSubmit={onSubmit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Name"><input value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} className={inputClassName} /></Field><Field label="Type"><input value={form.type} onChange={(event) => onChange({ ...form, type: event.target.value })} className={inputClassName} /></Field><Field label="District"><input value={form.district} onChange={(event) => onChange({ ...form, district: event.target.value })} className={inputClassName} /></Field><Field label="Area"><input value={form.area} onChange={(event) => onChange({ ...form, area: event.target.value })} className={inputClassName} /></Field><Field label="Latitude"><input type="number" step="any" value={form.latitude} onChange={(event) => onChange({ ...form, latitude: event.target.value })} className={inputClassName} /></Field><Field label="Longitude"><input type="number" step="any" value={form.longitude} onChange={(event) => onChange({ ...form, longitude: event.target.value })} className={inputClassName} /></Field><Field label="Phone"><input value={form.phone} onChange={(event) => onChange({ ...form, phone: event.target.value })} className={inputClassName} /></Field><Field label="Email"><input type="email" value={form.email} onChange={(event) => onChange({ ...form, email: event.target.value })} className={inputClassName} /></Field><Field label="Opening hours"><input value={form.openingHours} onChange={(event) => onChange({ ...form, openingHours: event.target.value })} className={inputClassName} /></Field><Field label="Price level"><input value={form.priceLevel} onChange={(event) => onChange({ ...form, priceLevel: event.target.value })} className={inputClassName} /></Field><Field label="Verification"><select value={form.verificationStatus} onChange={(event) => onChange({ ...form, verificationStatus: event.target.value as FoodForm["verificationStatus"] })} className={inputClassName}><option value="PENDING">Pending</option><option value="VERIFIED">Verified</option><option value="PARTNER">Partner</option><option value="REJECTED">Rejected</option></select></Field><label className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold"><input type="checkbox" checked={form.active} onChange={(event) => onChange({ ...form, active: event.target.checked })} />Active</label><label className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold"><input type="checkbox" checked={form.featured} onChange={(event) => onChange({ ...form, featured: event.target.checked })} />Featured</label><Field label="Cuisines"><input value={form.cuisines} onChange={(event) => onChange({ ...form, cuisines: event.target.value })} className={inputClassName} /></Field><Field label="Services"><input value={form.services} onChange={(event) => onChange({ ...form, services: event.target.value })} className={inputClassName} /></Field><Field label="Features"><input value={form.features} onChange={(event) => onChange({ ...form, features: event.target.value })} className={inputClassName} /></Field><label className="space-y-2 text-sm font-semibold text-stone-700 sm:col-span-2"><span>Address</span><textarea value={form.address} onChange={(event) => onChange({ ...form, address: event.target.value })} className={`${inputClassName} min-h-20`} /></label><label className="space-y-2 text-sm font-semibold text-stone-700 sm:col-span-2"><span>Short description</span><textarea value={form.shortDescription} onChange={(event) => onChange({ ...form, shortDescription: event.target.value })} className={`${inputClassName} min-h-24`} /></label></div>{error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}<div className="flex justify-end gap-3"><button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" disabled={isSaving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSaving ? "Saving..." : "Save provider"}</button></div></form></Modal>;
}

function toPayload(form: FoodForm): FoodProviderPayload {
  return {
    name: form.name.trim(),
    type: form.type.trim(),
    district: form.district.trim(),
    area: form.area.trim(),
    address: form.address.trim() || undefined,
    latitude: toNumber(form.latitude),
    longitude: toNumber(form.longitude),
    shortDescription: form.shortDescription.trim(),
    cuisines: splitList(form.cuisines),
    services: splitList(form.services),
    features: splitList(form.features),
    phone: form.phone.trim() || undefined,
    email: form.email.trim() || undefined,
    openingHours: form.openingHours.trim() || undefined,
    priceLevel: form.priceLevel.trim() || undefined,
    verificationStatus: form.verificationStatus,
    featured: form.featured,
    active: form.active,
  };
}

function ViewDialog({ provider, onClose }: { provider: FoodProvider; onClose: () => void }) {
  return <Modal title={provider.name} eyebrow="Food provider details" onClose={onClose}><div className="grid gap-3 sm:grid-cols-2"><Detail label="Type" value={provider.type} /><Detail label="Location" value={[provider.area, provider.district].filter(Boolean).join(", ") || "Not set"} /><Detail label="Address" value={provider.address || "Not set"} /><Detail label="Coordinates" value={provider.latitude && provider.longitude ? `${provider.latitude}, ${provider.longitude}` : "Not set"} /><Detail label="Contact" value={provider.phone || provider.email || "Not set"} /><Detail label="Status" value={`${label(provider.verificationStatus)} / ${provider.active ? "Active" : "Inactive"}`} /></div><p className="mt-4 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-700">{provider.shortDescription}</p></Modal>;
}

function DeleteDialog({ provider, isDeleting, onCancel, onConfirm }: { provider: FoodProvider; isDeleting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <Modal title="Confirm deletion" eyebrow="Delete food provider" onClose={onCancel}><p className="text-sm leading-6 text-stone-600">This will remove <span className="font-bold">{provider.name}</span> from the database and public food listings.</p><div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} disabled={isDeleting} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold disabled:opacity-50">Cancel</button><button onClick={onConfirm} disabled={isDeleting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete provider"}</button></div></Modal>;
}

function Alert({ tone, message, onRetry }: { tone: "success" | "error"; message: string; onRetry?: () => void }) {
  return <div className={`mx-6 mt-5 rounded-lg border px-4 py-3 text-sm ${tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span>{message}</span>{onRetry ? <button onClick={onRetry} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">Retry</button> : null}</div></div>;
}

function LoadingRows() {
  return Array.from({ length: 6 }).map((_, rowIndex) => <tr key={rowIndex}>{Array.from({ length: 7 }).map((__, cellIndex) => <td key={cellIndex} className="py-4 pr-5"><div className="h-4 animate-pulse rounded-full bg-stone-100" /></td>)}</tr>);
}

function Modal({ title, eyebrow, children, onClose }: { title: string; eyebrow: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4 py-6"><section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold text-stone-950">{title}</h2></div><button onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50">Close</button></div>{children}</section></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-2 text-sm font-semibold text-stone-700"><span>{label}</span>{children}</label>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-1 text-sm font-semibold text-stone-900">{value}</p></div>;
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function toNumber(value: string) {
  const trimmed = value.trim();
  return trimmed ? Number(trimmed) : undefined;
}

function label(value: string) {
  return value.toLowerCase().replace(/_/g, " ").replace(/^./, (first) => first.toUpperCase());
}
