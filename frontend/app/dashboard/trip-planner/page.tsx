"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminReplicaFrame,
  ReplicaDataCard,
  ReplicaStatCard,
} from "@/app/_components/admin-replica-dashboard";
import {
  createAdminItineraryAction,
  deleteAdminItineraryAction,
  getAdminItinerariesAction,
  updateAdminItineraryAction,
} from "@/lib/actions/admin-itinerary-actions";
import { getAdminUsersAction } from "@/lib/actions/admin-user-actions";
import { getPlannerOptionsAction } from "@/lib/actions/itinerary-actions";
import type {
  AdminItinerary,
  AdminItineraryCreateData,
} from "@/lib/api/admin-itineraries";
import type {
  ItineraryReference,
  ItineraryUser,
  PlannerOptions,
} from "@/lib/api/itineraries";
import type { AdminUser } from "@/lib/api/admin-users";
import {
  itineraryFormSchema,
  type ItineraryFormData,
  type ItineraryStatus,
} from "@/schemas/itinerary.schema";

type ItineraryFormState = {
  userId: string;
  title: string;
  description: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  budget: string;
  hotelIds: string[];
  experienceIds: string[];
  status: ItineraryStatus;
  isPublic: boolean;
};

const emptyForm: ItineraryFormState = {
  userId: "",
  title: "",
  description: "",
  destinationId: "",
  startDate: "",
  endDate: "",
  budget: "",
  hotelIds: [],
  experienceIds: [],
  status: "DRAFT",
  isPublic: false,
};

const emptyOptions: PlannerOptions = {
  destinations: [],
  hotels: [],
  experiences: [],
};

const statuses: ItineraryStatus[] = [
  "DRAFT",
  "PLANNED",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
];

const inputClassName =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DashboardTripPlannerPage() {
  const [itineraries, setItineraries] = useState<AdminItinerary[]>([]);
  const [options, setOptions] = useState(emptyOptions);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ItineraryStatus | "">("");
  const [visibility, setVisibility] = useState<"" | "true" | "false">("");
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [summary, setSummary] = useState({ total: 0, planned: 0, public: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [viewing, setViewing] = useState<AdminItinerary | null>(null);
  const [editing, setEditing] = useState<AdminItinerary | "create" | null>(null);
  const [deleting, setDeleting] = useState<AdminItinerary | null>(null);
  const [form, setForm] = useState<ItineraryFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState("");

  const loadItineraries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminItinerariesAction({
        page,
        limit: 10,
        search,
        status,
        isPublic: visibility === "" ? "" : visibility === "true",
      });
      setItineraries(response.data || []);
      setMeta(response.meta || { page, limit: 10, total: response.data?.length || 0, totalPages: 1 });
      setSummary({
        total: response.meta?.summary?.total || 0,
        planned: response.meta?.summary?.planned || 0,
        public: response.meta?.summary?.public || 0,
        completed: response.meta?.summary?.completed || 0,
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load itineraries");
      setItineraries([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, visibility]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadItineraries(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadItineraries]);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      try {
        const [optionResponse, userResponse] = await Promise.all([
          getPlannerOptionsAction(),
          getAdminUsersAction({ page: 1, limit: 50 }),
        ]);
        setOptions(optionResponse.data || emptyOptions);
        setUsers(userResponse.data || []);
      } catch (optionError) {
        setError(optionError instanceof Error ? optionError.message : "Unable to load itinerary form options");
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setFormError("");
    setEditing("create");
  }

  function openEdit(itinerary: AdminItinerary) {
    setForm({
      userId: referenceId(itinerary.userId),
      title: itinerary.title,
      description: itinerary.description || "",
      destinationId: referenceId(itinerary.destinationId),
      startDate: dateInputValue(itinerary.startDate),
      endDate: dateInputValue(itinerary.endDate),
      budget: itinerary.budget?.toString() || "",
      hotelIds: itinerary.hotelIds.map(referenceId),
      experienceIds: itinerary.experienceIds.map(referenceId),
      status: itinerary.status,
      isPublic: itinerary.isPublic,
    });
    setFormError("");
    setEditing(itinerary);
  }

  function formPayload(): ItineraryFormData {
    return {
      title: form.title,
      description: form.description || undefined,
      destinationId: form.destinationId,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      budget: form.budget ? Number(form.budget) : undefined,
      hotelIds: form.hotelIds,
      experienceIds: form.experienceIds,
      status: form.status,
      isPublic: form.isPublic,
    };
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const parsed = itineraryFormSchema.safeParse(formPayload());
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Please check the itinerary form");
      return;
    }
    if (editing === "create" && !form.userId) {
      setFormError("Please select a traveler");
      return;
    }

    setSaving(true);
    try {
      if (editing === "create") {
        await createAdminItineraryAction({ ...parsed.data, userId: form.userId } as AdminItineraryCreateData);
        setNotice("Itinerary created successfully");
      } else if (editing) {
        await updateAdminItineraryAction(editing._id, parsed.data);
        setNotice("Itinerary updated successfully");
      }
      setEditing(null);
      await loadItineraries();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save itinerary");
    } finally {
      setSaving(false);
    }
  }

  async function quickStatus(itinerary: AdminItinerary, nextStatus: ItineraryStatus) {
    setSavingId(itinerary._id);
    setError("");
    setNotice("");
    try {
      await updateAdminItineraryAction(itinerary._id, { status: nextStatus });
      setNotice(`${itinerary.title} marked ${label(nextStatus).toLowerCase()}`);
      await loadItineraries();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update status");
    } finally {
      setSavingId("");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setSaving(true);
    setError("");
    try {
      await deleteAdminItineraryAction(deleting._id);
      setNotice("Itinerary removed successfully");
      setDeleting(null);
      await loadItineraries();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to remove itinerary");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Trip Itineraries</h1>
            <p className="text-sm text-stone-500">Manage saved travel plans and Karnali trip requests</p>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">New Itinerary</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReplicaStatCard title="Total Itineraries" value={summary.total} subtitle="All saved plans" icon="IT" />
          <ReplicaStatCard title="Planned Trips" value={summary.planned} subtitle="Planning stage" icon="PL" />
          <ReplicaStatCard title="Public Itineraries" value={summary.public} subtitle="Visible plans" icon="PB" />
          <ReplicaStatCard title="Completed Trips" value={summary.completed} subtitle="Finished travel" icon="CP" />
        </div>

        {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p> : null}
        {error ? <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => void loadItineraries()} className="font-bold underline">Retry</button></div> : null}

        <ReplicaDataCard title="Traveler itineraries" description="Search, review, edit, update status, or archive plans" count={meta.total}>
          <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); }} className="mb-5 grid gap-3 lg:grid-cols-[1fr_190px_190px_auto]">
            <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search title, description, traveler, destination" className={inputClassName} />
            <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value as ItineraryStatus | ""); }} className={inputClassName}><option value="">All statuses</option>{statuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select>
            <select value={visibility} onChange={(event) => { setPage(1); setVisibility(event.target.value as "" | "true" | "false"); }} className={inputClassName}><option value="">Public and private</option><option value="true">Public</option><option value="false">Private</option></select>
            <button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Search</button>
          </form>

          {loading ? <div className="py-14 text-center text-sm font-medium text-stone-500">Loading itineraries...</div> : itineraries.length ? (
            <table className="w-full min-w-[1250px] text-sm">
              <thead><tr className="border-b text-left text-stone-500"><th className="pb-3 pr-4 font-medium">Title</th><th className="pb-3 pr-4 font-medium">User</th><th className="pb-3 pr-4 font-medium">Destination</th><th className="pb-3 pr-4 font-medium">Dates</th><th className="pb-3 pr-4 font-medium">Budget</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Public</th><th className="pb-3 pr-4 font-medium">Created</th><th className="pb-3 font-medium">Actions</th></tr></thead>
              <tbody>{itineraries.map((itinerary) => <tr key={itinerary._id} className="border-b border-stone-100 align-top last:border-0"><td className="py-4 pr-4"><p className="font-semibold text-stone-900">{itinerary.title}</p><p className="mt-1 max-w-48 truncate text-xs text-stone-500">{itinerary.description || "No description"}</p></td><td className="py-4 pr-4"><p className="font-medium">{userName(itinerary)}</p><p className="text-xs text-stone-500">{userEmail(itinerary)}</p></td><td className="py-4 pr-4 text-stone-600">{referenceName(itinerary.destinationId)}</td><td className="py-4 pr-4 text-stone-600">{dateRange(itinerary)}</td><td className="py-4 pr-4 text-stone-600">{itinerary.budget !== undefined ? `NPR ${itinerary.budget.toLocaleString()}` : "Not set"}</td><td className="py-4 pr-4"><StatusBadge status={itinerary.status} /></td><td className="py-4 pr-4 text-stone-600">{itinerary.isPublic ? "Public" : "Private"}</td><td className="py-4 pr-4 text-stone-500">{formatDate(itinerary.createdAt)}</td><td className="py-4"><div className="flex min-w-80 flex-wrap gap-2"><button onClick={() => setViewing(itinerary)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold hover:bg-stone-50">View</button><button onClick={() => openEdit(itinerary)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">Edit</button><select value={itinerary.status} disabled={savingId === itinerary._id} onChange={(event) => void quickStatus(itinerary, event.target.value as ItineraryStatus)} className="rounded-lg border border-stone-200 px-2 py-2 text-xs disabled:opacity-50" aria-label={`Update ${itinerary.title} status`}>{statuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select><button onClick={() => setDeleting(itinerary)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Archive</button></div></td></tr>)}</tbody>
            </table>
          ) : <div className="py-14 text-center"><p className="font-semibold text-stone-800">No itineraries found.</p><p className="mt-2 text-sm text-stone-500">Saved customer plans and admin-created itineraries will appear here.</p><button onClick={openCreate} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Create itinerary</button></div>}

          <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4 text-sm text-stone-500"><span>Page {page} of {meta.totalPages}</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Previous</button><button disabled={page >= meta.totalPages || loading} onClick={() => setPage((value) => Math.min(meta.totalPages, value + 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Next</button></div></div>
        </ReplicaDataCard>
      </div>

      {viewing ? <ViewDialog itinerary={viewing} onClose={() => setViewing(null)} /> : null}
      {editing ? <FormDialog mode={editing === "create" ? "create" : "edit"} form={form} setForm={setForm} users={users} options={options} error={formError} saving={saving} onClose={() => setEditing(null)} onSubmit={handleSave} /> : null}
      {deleting ? <ConfirmDialog title="Remove itinerary?" text={`Remove ${deleting.title}? This item will be removed from the workspace.`} saving={saving} onCancel={() => setDeleting(null)} onConfirm={() => void confirmDelete()} /> : null}
    </AdminReplicaFrame>
  );
}

function FormDialog({ mode, form, setForm, users, options, error, saving, onClose, onSubmit }: { mode: "create" | "edit"; form: ItineraryFormState; setForm: React.Dispatch<React.SetStateAction<ItineraryFormState>>; users: AdminUser[]; options: PlannerOptions; error: string; saving: boolean; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <ModalShell title={mode === "create" ? "Create itinerary" : "Edit itinerary"} eyebrow="Trip management" onClose={onClose}><form onSubmit={onSubmit}><div className="grid gap-4 sm:grid-cols-2">{mode === "create" ? <Field label="Traveler"><select value={form.userId} onChange={(event) => setForm((value) => ({ ...value, userId: event.target.value }))} className={inputClassName}><option value="">Select traveler</option>{users.map((user) => <option key={user._id} value={user._id}>{user.fullName} · {user.email}</option>)}</select></Field> : null}<Field label="Title"><input value={form.title} onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))} className={inputClassName} /></Field><Field label="Destination"><select value={form.destinationId} onChange={(event) => setForm((value) => ({ ...value, destinationId: event.target.value }))} className={inputClassName}><option value="">Select destination</option>{options.destinations.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></Field><Field label="Status"><select value={form.status} onChange={(event) => setForm((value) => ({ ...value, status: event.target.value as ItineraryStatus }))} className={inputClassName}>{statuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></Field><Field label="Start date"><input type="date" value={form.startDate} onChange={(event) => setForm((value) => ({ ...value, startDate: event.target.value }))} className={inputClassName} /></Field><Field label="End date"><input type="date" min={form.startDate || undefined} value={form.endDate} onChange={(event) => setForm((value) => ({ ...value, endDate: event.target.value }))} className={inputClassName} /></Field><Field label="Budget (NPR)"><input type="number" min="0" value={form.budget} onChange={(event) => setForm((value) => ({ ...value, budget: event.target.value }))} className={inputClassName} /></Field><Field label="Hotels"><MultiSelect items={options.hotels} values={form.hotelIds} onChange={(hotelIds) => setForm((value) => ({ ...value, hotelIds }))} /></Field><Field label="Experiences"><MultiSelect items={options.experiences} values={form.experienceIds} onChange={(experienceIds) => setForm((value) => ({ ...value, experienceIds }))} /></Field><label className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold"><input type="checkbox" checked={form.isPublic} onChange={(event) => setForm((value) => ({ ...value, isPublic: event.target.checked }))} className="accent-emerald-700" />Public itinerary</label></div><Field label="Description" className="mt-4"><textarea value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} className={`${inputClassName} min-h-28`} /></Field>{error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : mode === "create" ? "Create itinerary" : "Save changes"}</button></div></form></ModalShell>;
}

function ViewDialog({ itinerary, onClose }: { itinerary: AdminItinerary; onClose: () => void }) {
  return <ModalShell title={itinerary.title} eyebrow="Itinerary details" onClose={onClose}><div className="grid gap-3 sm:grid-cols-2"><Detail label="Traveler" value={`${userName(itinerary)} · ${userEmail(itinerary)}`} /><Detail label="Destination" value={referenceName(itinerary.destinationId)} /><Detail label="Dates" value={dateRange(itinerary)} /><Detail label="Budget" value={itinerary.budget !== undefined ? `NPR ${itinerary.budget.toLocaleString()}` : "Not set"} /><Detail label="Status" value={label(itinerary.status)} /><Detail label="Visibility" value={itinerary.isPublic ? "Public" : "Private"} /></div>{itinerary.description ? <DetailBlock label="Description" value={itinerary.description} /> : null}<ReferenceList label="Hotels" values={itinerary.hotelIds} /><ReferenceList label="Experiences" values={itinerary.experienceIds} /></ModalShell>;
}

function MultiSelect({ items, values, onChange }: { items: ItineraryReference[]; values: string[]; onChange: (values: string[]) => void }) { return <select multiple value={values} onChange={(event) => onChange(Array.from(event.target.selectedOptions, (option) => option.value))} className={`${inputClassName} min-h-24`}>{items.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select>; }
function Field({ label: fieldLabel, className = "", children }: { label: string; className?: string; children: React.ReactNode }) { return <label className={`block space-y-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-500 ${className}`}>{fieldLabel}{children}</label>; }
function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/55 px-4 py-8"><section className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold">{title}</h2></div><button onClick={onClose} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">Close</button></div><div className="mt-6">{children}</div></section></div>; }
function ConfirmDialog({ title, text, saving, onCancel, onConfirm }: { title: string; text: string; saving: boolean; onCancel: () => void; onConfirm: () => void }) { return <ModalShell title={title} eyebrow="Workspace action" onClose={onCancel}><p className="text-sm leading-6 text-stone-600">{text}</p><div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button onClick={onConfirm} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Removing..." : "Remove itinerary"}</button></div></ModalShell>; }
function Detail({ label: detailLabel, value }: { label: string; value: string }) { return <div className="rounded-xl border border-stone-200 bg-stone-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{detailLabel}</p><p className="mt-1 text-sm font-semibold text-stone-800">{value}</p></div>; }
function DetailBlock({ label: detailLabel, value }: { label: string; value: string }) { return <div className="mt-4 rounded-xl border border-stone-200 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{detailLabel}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-700">{value}</p></div>; }
function ReferenceList({ label: listLabel, values }: { label: string; values: Array<string | ItineraryReference> }) { return <div className="mt-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{listLabel}</p><p className="mt-2 text-sm text-stone-700">{values.length ? values.map(referenceName).join(", ") : "None selected"}</p></div>; }
function StatusBadge({ status }: { status: ItineraryStatus }) { const tone = status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : status === "CANCELLED" ? "bg-red-50 text-red-700" : status === "DRAFT" ? "bg-stone-100 text-stone-600" : "bg-amber-100 text-amber-900"; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{label(status)}</span>; }
function label(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function referenceId(value: string | ItineraryReference | ItineraryUser) { return typeof value === "string" ? value : value._id; }
function referenceName(value: string | ItineraryReference) { return typeof value === "string" ? "Unavailable" : value.name; }
function userName(itinerary: AdminItinerary) { return typeof itinerary.userId === "string" ? "Unavailable" : itinerary.userId.fullName; }
function userEmail(itinerary: AdminItinerary) { return typeof itinerary.userId === "string" ? "Account unavailable" : itinerary.userId.email; }
function dateInputValue(value?: string) { return value ? new Date(value).toISOString().slice(0, 10) : ""; }
function formatDate(value: string) { return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
function dateRange(itinerary: AdminItinerary) { if (!itinerary.startDate && !itinerary.endDate) return "Dates not set"; return `${itinerary.startDate ? formatDate(itinerary.startDate) : "Flexible"} – ${itinerary.endDate ? formatDate(itinerary.endDate) : "Flexible"}`; }
