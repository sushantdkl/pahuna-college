"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AdminReplicaFrame,
  ReplicaDataCard,
  ReplicaStatCard,
} from "@/app/_components/admin-replica-dashboard";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/app/_components/pahuna-layout";
import type { ApiResponse } from "@/lib/api/axios-instance";

type CrudRecord = Record<string, unknown> & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

type FieldOption = { label: string; value: string };

export type CrudField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "select" | "list";
  required?: boolean;
  options?: FieldOption[];
};

type Filter = {
  key: string;
  label: string;
  options: FieldOption[];
};

type CrudPageProps<T extends CrudRecord> = {
  title: string;
  subtitle: string;
  createLabel: string;
  columns: Array<{ key: string; label: string; render?: (record: T) => string }>;
  fields: CrudField[];
  filters?: Filter[];
  load: (params: Record<string, unknown>) => Promise<ApiResponse<T[]>>;
  create: (payload: Record<string, unknown>) => Promise<ApiResponse<T>>;
  update: (id: string, payload: Record<string, unknown>) => Promise<ApiResponse<T>>;
  remove: (id: string) => Promise<ApiResponse<{ deleted: true }>>;
  statLabels: [string, string, string, string];
  defaultValues: Record<string, unknown>;
};

const inputClassName =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const softButtonClassName =
  "rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800";
const dangerButtonClassName =
  "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100";

export function SimpleCrudPage<T extends CrudRecord>({
  title,
  subtitle,
  createLabel,
  columns,
  fields,
  filters = [],
  load,
  create,
  update,
  remove,
  statLabels,
  defaultValues,
}: CrudPageProps<T>) {
  const itemLabel = title.replace(/s$/, "");
  const listingTitle = `${title} workspace`;
  const listingDescription = "Search, review, publish, and refine public-facing information.";
  const [records, setRecords] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<T | "create" | null>(null);
  const [viewing, setViewing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(defaultValues);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState("");

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, unknown> = { page, limit: 10, search };
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value === "true") params[key] = true;
        else if (value === "false") params[key] = false;
        else if (value) params[key] = value;
      });
      const response = await load(params);
      setRecords(response.data || []);
      setMeta({
        total: response.meta?.total || 0,
        totalPages: response.meta?.totalPages || 1,
      });
      setSummary(response.meta?.summary || {});
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : `Unable to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  }, [filterValues, load, page, search, title]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadRecords(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadRecords]);

  const statValues = useMemo(
    () => [
      summary.total ?? meta.total,
      summary.active ?? summary.published ?? summary.featured ?? 0,
      summary.pending ?? summary.draft ?? summary.featured ?? 0,
      summary.inactive ?? Math.max((summary.total ?? meta.total) - (summary.active ?? summary.published ?? 0), 0),
    ],
    [meta.total, summary],
  );

  function openCreate() {
    setForm(defaultValues);
    setFormError("");
    setEditing("create");
  }

  function openEdit(record: T) {
    const next: Record<string, unknown> = {};
    fields.forEach((field) => {
      const value = record[field.key];
      next[field.key] = Array.isArray(value) ? value.join(", ") : value ?? defaultValues[field.key] ?? "";
    });
    setForm(next);
    setFormError("");
    setEditing(record);
  }

  function payload() {
    const next: Record<string, unknown> = {};
    fields.forEach((field) => {
      const value = form[field.key];
      if (field.type === "boolean") {
        next[field.key] = Boolean(value);
      } else if (field.type === "number") {
        next[field.key] = value === "" || value === undefined ? undefined : Number(value);
      } else if (field.type === "list") {
        next[field.key] = typeof value === "string"
          ? value.split(",").map((item) => item.trim()).filter(Boolean)
          : Array.isArray(value)
            ? value
            : [];
      } else {
        next[field.key] = value === "" ? undefined : value;
      }
    });
    return next;
  }

  function validate() {
    const missing = fields.find((field) => field.required && !String(form[field.key] || "").trim());
    if (missing) return `${missing.label} is required`;
    return "";
  }

  async function saveRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate();
    if (validation) {
      setFormError(validation);
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (editing === "create") {
        await create(payload());
        setNotice(`${itemLabel} added successfully.`);
      } else if (editing) {
        await update(editing._id, payload());
        setNotice(`${itemLabel} updated successfully.`);
      }
      setEditing(null);
      await loadRecords();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : `Unable to save ${title.toLowerCase()}`);
    } finally {
      setSaving(false);
    }
  }

  async function quickUpdate(record: T, data: Record<string, unknown>) {
    setSavingId(record._id);
    try {
      await update(record._id, data);
      setNotice(`${itemLabel} updated.`);
      await loadRecords();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : `Unable to update ${itemLabel.toLowerCase()}`);
    } finally {
      setSavingId("");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setSaving(true);
    try {
      await remove(deleting._id);
      setNotice(`${itemLabel} removed successfully.`);
      setDeleting(null);
      await loadRecords();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : `Unable to remove ${itemLabel.toLowerCase()}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-stone-500">{subtitle}</p>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            {createLabel}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statLabels.map((label, index) => (
            <ReplicaStatCard key={label} title={label} value={statValues[index] ?? 0} subtitle="Dashboard count" icon={label.slice(0, 2).toUpperCase()} />
          ))}
        </div>

        {notice ? <p className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p> : null}
        {error ? <ErrorState description={error} action={<button type="button" onClick={() => void loadRecords()} className="rounded-[8px] border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-700">Retry</button>} /> : null}

        <ReplicaDataCard title={listingTitle} description={listingDescription} count={meta.total}>
          <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(query.trim()); }} className="mb-5 rounded-[8px] border border-stone-200 bg-stone-50/70 p-3">
            <div className="grid gap-3 xl:grid-cols-[1fr_repeat(3,180px)_auto]">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}...`} className={inputClassName} />
            {filters.map((filter) => (
              <select key={filter.key} value={filterValues[filter.key] || ""} onChange={(event) => { setPage(1); setFilterValues((current) => ({ ...current, [filter.key]: event.target.value })); }} className={inputClassName}>
                <option value="">{filter.label}</option>
                {filter.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            ))}
            <button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">Search</button>
            </div>
          </form>

          {loading ? (
            <LoadingSkeleton rows={4} />
          ) : records.length ? (
            <table className="w-full min-w-[1050px] text-sm">
              <thead>
                <tr className="border-b text-left text-stone-500">
                  {columns.map((column) => <th key={column.key} className="pb-3 pr-4 font-medium">{column.label}</th>)}
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record._id} className="border-b border-stone-100 align-top last:border-0">
                    {columns.map((column) => (
                      <td key={column.key} className="py-4 pr-4 text-stone-600">
                        {column.render ? column.render(record) : valueLabel(record[column.key])}
                      </td>
                    ))}
                    <td className="py-4">
                      <div className="flex min-w-[360px] flex-wrap gap-2">
                        <button onClick={() => setViewing(record)} className={softButtonClassName}>Preview</button>
                        <button onClick={() => openEdit(record)} className={softButtonClassName}>Edit</button>
                        {hasMediaFields(record) ? <button onClick={() => openEdit(record)} className={softButtonClassName}>Media</button> : null}
                        {hasLocationFields(record) ? <button onClick={() => openEdit(record)} className={softButtonClassName}>Location</button> : null}
                        {"active" in record ? <button disabled={savingId === record._id} onClick={() => void quickUpdate(record, { active: !record.active })} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 disabled:opacity-50">{record.active ? "Pause" : "Publish"}</button> : null}
                        {"isActive" in record ? <button disabled={savingId === record._id} onClick={() => void quickUpdate(record, { isActive: !record.isActive })} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 disabled:opacity-50">{record.isActive ? "Pause" : "Publish"}</button> : null}
                        {"isPublished" in record ? <button disabled={savingId === record._id} onClick={() => void quickUpdate(record, { isPublished: !record.isPublished })} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 disabled:opacity-50">{record.isPublished ? "Unpublish" : "Publish"}</button> : null}
                        <button onClick={() => setDeleting(record)} className={dangerButtonClassName}>Archive</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title={`No ${title.toLowerCase()} found`} description="Add a new listing or adjust filters to continue managing this workspace." action={<button type="button" onClick={openCreate} className="rounded-[8px] bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">{createLabel}</button>} />
          )}

          <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4 text-sm text-stone-500">
            <span>Page {page} of {meta.totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Previous</button>
              <button disabled={page >= meta.totalPages || loading} onClick={() => setPage((value) => Math.min(meta.totalPages, value + 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Next</button>
            </div>
          </div>
        </ReplicaDataCard>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4" role="dialog" aria-modal="true" aria-label={editing === "create" ? createLabel : `Edit ${title}`}>
          <form onSubmit={saveRecord} className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[12px] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{editing === "create" ? "New listing" : "Listing editor"}</p>
                <h2 className="mt-2 text-xl font-bold">{editing === "create" ? createLabel : `Edit ${displayTitle(editing)}`}</h2>
                <p className="text-sm text-stone-500">Update only the selected item, then return to the workspace.</p>
              </div>
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">Cancel</button>
            </div>
            {formError ? <p className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p> : null}
            <div className="space-y-5">
              {groupFields(fields).map((group) => (
                <section key={group.title} className="rounded-[10px] border border-stone-200 bg-stone-50/60 p-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-stone-950">{group.title}</h3>
                    <p className="mt-1 text-xs text-stone-500">{group.description}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {group.fields.map((field) => (
                      <FormField
                        key={field.key}
                        field={field}
                        value={form[field.key]}
                        onChange={(value) => setForm((current) => ({ ...current, [field.key]: value }))}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button>
              <button disabled={saving} type="submit" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </div>
      ) : null}

      {viewing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4" role="dialog" aria-modal="true" aria-label={`${title} details`}>
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[12px] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Preview listing</p>
                <h2 className="mt-2 text-xl font-bold">{displayTitle(viewing)}</h2>
                <p className="mt-1 text-sm text-stone-500">{statusSummary(viewing)}</p>
              </div>
              <button onClick={() => setViewing(null)} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">Close</button>
            </div>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              {fields.map((field) => (
                <DetailTile key={field.key} label={field.label} value={viewing[field.key]} wide={field.type === "textarea" || field.type === "list"} />
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-3 border-t border-stone-200 pt-4">
              <button type="button" onClick={() => { openEdit(viewing); setViewing(null); }} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Edit listing</button>
            </div>
          </div>
        </div>
      ) : null}

      {deleting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 p-4" role="dialog" aria-modal="true" aria-label={`${itemLabel} removal confirmation`}>
          <div className="w-full max-w-md rounded-[12px] bg-white p-6 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">Archive listing</p>
            <h2 className="mt-2 text-xl font-bold">Remove {displayTitle(deleting)}?</h2>
            <p className="mt-2 text-sm text-stone-600">This removes the item from the management workspace and public data feed.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleting(null)} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button>
              <button disabled={saving} onClick={() => void confirmDelete()} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Removing..." : "Remove"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminReplicaFrame>
  );
}

function valueLabel(value: unknown) {
  if (value === undefined || value === null || value === "") return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function FormField({
  field,
  value,
  onChange,
}: {
  field: CrudField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const wide = field.type === "textarea" || field.type === "list";

  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="text-sm font-semibold text-stone-700">{field.label}{field.required ? " *" : ""}</span>
      {field.type === "textarea" || field.type === "list" ? (
        <textarea value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} rows={field.type === "list" ? 3 : 5} className={`${inputClassName} mt-1`} placeholder={field.type === "list" ? "Add items separated by commas" : undefined} />
      ) : field.type === "boolean" ? (
        <select value={String(Boolean(value))} onChange={(event) => onChange(event.target.value === "true")} className={`${inputClassName} mt-1`}>
          <option value="true">Visible</option>
          <option value="false">Hidden</option>
        </select>
      ) : field.type === "select" ? (
        <select value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={`${inputClassName} mt-1`}>
          <option value="">Select {field.label}</option>
          {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      ) : (
        <input type={field.type === "number" ? "number" : "text"} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className={`${inputClassName} mt-1`} />
      )}
    </label>
  );
}

function DetailTile({ label, value, wide }: { label: string; value: unknown; wide?: boolean }) {
  return (
    <div className={`rounded-[8px] border border-stone-100 bg-stone-50 p-3 ${wide ? "sm:col-span-2" : ""}`}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-stone-800">{valueLabel(value)}</p>
    </div>
  );
}

function groupFields(fields: CrudField[]) {
  const overviewKeys = ["name", "title", "slug", "type", "category", "district", "area", "address", "description"];
  const locationKeys = ["latitude", "longitude", "route", "origin", "destination", "duration", "cost", "distance", "price"];
  const mediaKeys = ["image", "gallery", "cover", "photo"];
  const statusKeys = ["active", "isActive", "featured", "isFeatured", "isPublished", "status", "verificationStatus", "published"];

  const groups = [
    {
      title: "Overview",
      description: "Name, public copy, category, and key listing context.",
      fields: fields.filter((field) => keyIncludes(field.key, overviewKeys)),
    },
    {
      title: "Location, Route & Pricing",
      description: "Travel context, map coordinates, route relationships, and price guidance.",
      fields: fields.filter((field) => keyIncludes(field.key, locationKeys)),
    },
    {
      title: "Media & Highlights",
      description: "Images, amenities, highlights, services, and public tags.",
      fields: fields.filter((field) => keyIncludes(field.key, mediaKeys) || field.type === "list"),
    },
    {
      title: "Publishing",
      description: "Visibility, verification, featured placement, and workflow status.",
      fields: fields.filter((field) => statusKeys.some((key) => field.key.toLowerCase() === key.toLowerCase())),
    },
  ];

  const assigned = new Set(groups.flatMap((group) => group.fields.map((field) => field.key)));
  const details = fields.filter((field) => !assigned.has(field.key));

  return [
    ...groups.map((group) => ({ ...group, fields: uniqueFields(group.fields) })).filter((group) => group.fields.length),
    ...(details.length
      ? [{
          title: "Additional Details",
          description: "Supporting details required by this workflow.",
          fields: details,
        }]
      : []),
  ];
}

function uniqueFields(fields: CrudField[]) {
  const seen = new Set<string>();
  return fields.filter((field) => {
    if (seen.has(field.key)) return false;
    seen.add(field.key);
    return true;
  });
}

function keyIncludes(key: string, values: string[]) {
  const normalized = key.toLowerCase();
  return values.some((value) => normalized.includes(value.toLowerCase()));
}

function displayTitle(record: CrudRecord | null | "create") {
  if (!record || record === "create") return "selected item";
  const title = record.name || record.title || record.businessName || record.fullName || record.email || record._id;
  return String(title);
}

function statusSummary(record: CrudRecord) {
  const status = record.status || record.verificationStatus;
  const active = "active" in record ? record.active : "isActive" in record ? record.isActive : undefined;
  const featured = "featured" in record ? record.featured : "isFeatured" in record ? record.isFeatured : undefined;
  return [
    status ? valueLabel(status) : null,
    typeof active === "boolean" ? (active ? "Visible" : "Hidden") : null,
    typeof featured === "boolean" ? (featured ? "Featured" : "Standard placement") : null,
  ].filter(Boolean).join(" / ") || "Workspace item";
}

function hasMediaFields(record: CrudRecord) {
  return ["image", "images", "gallery", "coverImage", "photos"].some((key) => key in record);
}

function hasLocationFields(record: CrudRecord) {
  return ["latitude", "longitude", "location", "address", "district", "area"].some((key) => key in record);
}
