"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminReplicaFrame, ReplicaStatCard, ReplicaStatusBadge } from "@/components/admin-replica-dashboard";
import {
  createAdminRouteSegment,
  createAdminTransportRoute,
  deleteAdminRouteSegment,
  deleteAdminTransportRoute,
  getAdminRouteSegments,
  getAdminTransportRoutes,
  updateAdminRouteSegment,
  updateAdminTransportRoute,
  type RouteSegment,
  type TransportRoute,
} from "@/lib/actions/final-crud-actions";

type TabKey = "routes" | "segments";
type RouteForm = {
  fromLocation: string;
  toLocation: string;
  mode: string;
  durationHours: string;
  costMin: string;
  costMax: string;
  frequency: string;
  notes: string;
  isActive: boolean;
};
type SegmentForm = {
  from: string;
  to: string;
  slug: string;
  mode: RouteSegment["mode"];
  distanceKm: string;
  durationMin: string;
  durationMax: string;
  costMin: string;
  costMax: string;
  seasonality: string;
  reliability: RouteSegment["reliability"];
  notes: string;
  riskNotes: string;
  recommendedStopover: string;
  requiresConfirmation: boolean;
  active: boolean;
  featured: boolean;
};

const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const emptyRoute: RouteForm = { fromLocation: "", toLocation: "", mode: "BUS", durationHours: "", costMin: "", costMax: "", frequency: "", notes: "", isActive: true };
const emptySegment: SegmentForm = { from: "", to: "", slug: "", mode: "BUS", distanceKm: "", durationMin: "", durationMax: "", costMin: "", costMax: "", seasonality: "", reliability: "MEDIUM", notes: "", riskNotes: "", recommendedStopover: "", requiresConfirmation: true, active: true, featured: false };

export default function DashboardRoutesPage() {
  const [tab, setTab] = useState<TabKey>("routes");
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [segments, setSegments] = useState<RouteSegment[]>([]);
  const [search, setSearch] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);
  const [editingSegment, setEditingSegment] = useState<RouteSegment | null>(null);
  const [routeDialogOpen, setRouteDialogOpen] = useState(false);
  const [segmentDialogOpen, setSegmentDialogOpen] = useState(false);
  const [routeForm, setRouteForm] = useState<RouteForm>(emptyRoute);
  const [segmentForm, setSegmentForm] = useState<SegmentForm>(emptySegment);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: TabKey; id: string; label: string } | null>(null);

  const load = useCallback(async () => {
    setIsFetching(true);
    setError("");
    try {
      const [routeResponse, segmentResponse] = await Promise.all([
        getAdminTransportRoutes({ page: 1, limit: 50, search }),
        getAdminRouteSegments({ page: 1, limit: 50, search }),
      ]);
      setRoutes(routeResponse.data || []);
      setSegments(segmentResponse.data || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load routes");
    } finally {
      setIsFetching(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 300);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const stats = useMemo(() => ({
    activeRoutes: routes.filter((route) => route.isActive).length,
    activeSegments: segments.filter((segment) => segment.active).length,
    confirmation: segments.filter((segment) => segment.requiresConfirmation).length,
    featured: segments.filter((segment) => segment.featured).length,
  }), [routes, segments]);

  function openRoute(route?: TransportRoute) {
    setEditingRoute(route || null);
    setRouteDialogOpen(true);
    setRouteForm(route ? {
      fromLocation: route.fromLocation,
      toLocation: route.toLocation,
      mode: route.mode,
      durationHours: route.durationHours?.toString() || "",
      costMin: route.costMin?.toString() || "",
      costMax: route.costMax?.toString() || "",
      frequency: route.frequency || "",
      notes: route.notes || "",
      isActive: route.isActive,
    } : emptyRoute);
  }

  function openSegment(segment?: RouteSegment) {
    setEditingSegment(segment || null);
    setSegmentDialogOpen(true);
    setSegmentForm(segment ? {
      from: segment.from,
      to: segment.to,
      slug: segment.slug,
      mode: segment.mode,
      distanceKm: segment.distanceKm?.toString() || "",
      durationMin: segment.durationMin?.toString() || "",
      durationMax: segment.durationMax?.toString() || "",
      costMin: segment.costMin?.toString() || "",
      costMax: segment.costMax?.toString() || "",
      seasonality: segment.seasonality || "",
      reliability: segment.reliability,
      notes: segment.notes || "",
      riskNotes: segment.riskNotes || "",
      recommendedStopover: segment.recommendedStopover || "",
      requiresConfirmation: segment.requiresConfirmation,
      active: segment.active,
      featured: segment.featured,
    } : emptySegment);
  }

  async function saveRoute(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      fromLocation: routeForm.fromLocation,
      toLocation: routeForm.toLocation,
      mode: routeForm.mode,
      durationHours: numberOrUndefined(routeForm.durationHours),
      costMin: numberOrUndefined(routeForm.costMin),
      costMax: numberOrUndefined(routeForm.costMax),
      frequency: routeForm.frequency || undefined,
      notes: routeForm.notes || undefined,
      isActive: routeForm.isActive,
    };
    try {
      if (editingRoute) await updateAdminTransportRoute(editingRoute._id, payload);
      else await createAdminTransportRoute(payload);
      setEditingRoute(null);
      setRouteDialogOpen(false);
      setNotice("Transport route saved");
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save route");
    } finally {
      setSaving(false);
    }
  }

  async function saveSegment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      from: segmentForm.from,
      to: segmentForm.to,
      slug: segmentForm.slug || slugify(`${segmentForm.from}-${segmentForm.to}`),
      mode: segmentForm.mode,
      distanceKm: numberOrUndefined(segmentForm.distanceKm),
      durationMin: numberOrUndefined(segmentForm.durationMin),
      durationMax: numberOrUndefined(segmentForm.durationMax),
      costMin: numberOrUndefined(segmentForm.costMin),
      costMax: numberOrUndefined(segmentForm.costMax),
      seasonality: segmentForm.seasonality || undefined,
      reliability: segmentForm.reliability,
      notes: segmentForm.notes || undefined,
      riskNotes: segmentForm.riskNotes || undefined,
      recommendedStopover: segmentForm.recommendedStopover || undefined,
      requiresConfirmation: segmentForm.requiresConfirmation,
      active: segmentForm.active,
      featured: segmentForm.featured,
    };
    try {
      if (editingSegment) await updateAdminRouteSegment(editingSegment._id, payload);
      else await createAdminRouteSegment(payload);
      setEditingSegment(null);
      setSegmentDialogOpen(false);
      setNotice("Route segment saved");
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save segment");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "routes") await deleteAdminTransportRoute(deleteTarget.id);
      else await deleteAdminRouteSegment(deleteTarget.id);
      setNotice("Route record deleted");
      setDeleteTarget(null);
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete route record");
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Routes</h1>
            <p className="text-sm text-stone-500">Manage transport options, route segments, costs, and travel confirmation notes</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => openRoute()} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Add Route</button>
            <button onClick={() => openSegment()} className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">Add Segment</button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReplicaStatCard title="Transport Routes" value={routes.length} subtitle={`${stats.activeRoutes} active`} icon="route" />
          <ReplicaStatCard title="Route Segments" value={segments.length} subtitle={`${stats.activeSegments} active`} icon="segment" />
          <ReplicaStatCard title="Confirm First" value={stats.confirmation} subtitle="Need local verification" icon="confirm" />
          <ReplicaStatCard title="Featured Segments" value={stats.featured} subtitle="Public highlights" icon="feature" />
        </div>

        <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-stone-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2">
              <TabButton active={tab === "routes"} onClick={() => setTab("routes")}>Transport Routes</TabButton>
              <TabButton active={tab === "segments"} onClick={() => setTab("segments")}>Route Segments</TabButton>
            </div>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search origin, destination, mode, or notes" className={`${inputClassName} lg:max-w-md`} />
          </div>

          {notice ? <Alert tone="success" message={notice} /> : null}
          {error ? <Alert tone="error" message={error} onRetry={load} /> : null}

          <div className="overflow-x-auto px-6 py-5">
            {tab === "routes" ? (
              <table className="w-full min-w-[920px] text-sm">
                <thead><tr className="border-b text-left"><Head>From</Head><Head>To</Head><Head>Mode</Head><Head>Duration</Head><Head>Cost</Head><Head>Frequency</Head><Head>Status</Head><Head align="right">Actions</Head></tr></thead>
                <tbody>
                  {isFetching ? <LoadingRows cols={8} /> : routes.length ? routes.map((route) => (
                    <tr key={route._id} className="border-b last:border-0">
                      <Cell strong>{route.fromLocation}</Cell><Cell>{route.toLocation}</Cell><Cell>{route.mode}</Cell><Cell>{route.durationHours ? `${route.durationHours}h` : "Varies"}</Cell><Cell>{cost(route.costMin, route.costMax)}</Cell><Cell>{route.frequency || "Confirm"}</Cell><Cell><ReplicaStatusBadge>{route.isActive ? "Active" : "Inactive"}</ReplicaStatusBadge></Cell>
                      <td className="py-3 pr-0"><RowActions onEdit={() => openRoute(route)} onDelete={() => setDeleteTarget({ type: "routes", id: route._id, label: `${route.fromLocation} to ${route.toLocation}` })} /></td>
                    </tr>
                  )) : <EmptyRow colSpan={8} label="No transport routes found" />}
                </tbody>
              </table>
            ) : (
              <table className="w-full min-w-[1080px] text-sm">
                <thead><tr className="border-b text-left"><Head>From</Head><Head>To</Head><Head>Mode</Head><Head>Distance</Head><Head>Duration</Head><Head>Cost</Head><Head>Reliability</Head><Head>Status</Head><Head align="right">Actions</Head></tr></thead>
                <tbody>
                  {isFetching ? <LoadingRows cols={9} /> : segments.length ? segments.map((segment) => (
                    <tr key={segment._id} className="border-b last:border-0">
                      <Cell strong>{segment.from}</Cell><Cell>{segment.to}</Cell><Cell>{segment.mode}</Cell><Cell>{segment.distanceKm ? `${segment.distanceKm} km` : "Not set"}</Cell><Cell>{duration(segment)}</Cell><Cell>{cost(segment.costMin, segment.costMax)}</Cell><Cell>{segment.reliability}</Cell><Cell><ReplicaStatusBadge>{segment.active ? "Active" : "Inactive"}</ReplicaStatusBadge></Cell>
                      <td className="py-3 pr-0"><RowActions onEdit={() => openSegment(segment)} onDelete={() => setDeleteTarget({ type: "segments", id: segment._id, label: `${segment.from} to ${segment.to}` })} /></td>
                    </tr>
                  )) : <EmptyRow colSpan={9} label="No route segments found" />}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {routeDialogOpen ? <RouteDialog form={routeForm} saving={saving} onClose={() => { setRouteDialogOpen(false); setEditingRoute(null); }} onChange={setRouteForm} onSubmit={saveRoute} /> : null}
      {segmentDialogOpen ? <SegmentDialog form={segmentForm} saving={saving} onClose={() => { setSegmentDialogOpen(false); setEditingSegment(null); }} onChange={setSegmentForm} onSubmit={saveSegment} /> : null}
      {deleteTarget ? <ConfirmDelete label={deleteTarget.label} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} /> : null}
    </AdminReplicaFrame>
  );
}

function RouteDialog({ form, saving, onClose, onChange, onSubmit }: { form: RouteForm; saving: boolean; onClose: () => void; onChange: (form: RouteForm) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <FormShell title="Transport route" onClose={onClose} onSubmit={onSubmit} saving={saving}><Field label="From"><input value={form.fromLocation} onChange={(event) => onChange({ ...form, fromLocation: event.target.value })} className={inputClassName} /></Field><Field label="To"><input value={form.toLocation} onChange={(event) => onChange({ ...form, toLocation: event.target.value })} className={inputClassName} /></Field><Field label="Mode"><input value={form.mode} onChange={(event) => onChange({ ...form, mode: event.target.value })} className={inputClassName} /></Field><Field label="Duration hours"><input type="number" value={form.durationHours} onChange={(event) => onChange({ ...form, durationHours: event.target.value })} className={inputClassName} /></Field><Field label="Cost min"><input type="number" value={form.costMin} onChange={(event) => onChange({ ...form, costMin: event.target.value })} className={inputClassName} /></Field><Field label="Cost max"><input type="number" value={form.costMax} onChange={(event) => onChange({ ...form, costMax: event.target.value })} className={inputClassName} /></Field><Field label="Frequency"><input value={form.frequency} onChange={(event) => onChange({ ...form, frequency: event.target.value })} className={inputClassName} /></Field><label className="flex items-center gap-2 text-sm font-semibold text-stone-700"><input type="checkbox" checked={form.isActive} onChange={(event) => onChange({ ...form, isActive: event.target.checked })} /> Active</label><Field label="Notes"><textarea value={form.notes} onChange={(event) => onChange({ ...form, notes: event.target.value })} className={`${inputClassName} min-h-24`} /></Field></FormShell>;
}

function SegmentDialog({ form, saving, onClose, onChange, onSubmit }: { form: SegmentForm; saving: boolean; onClose: () => void; onChange: (form: SegmentForm) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <FormShell title="Route segment" onClose={onClose} onSubmit={onSubmit} saving={saving}><Field label="From"><input value={form.from} onChange={(event) => onChange({ ...form, from: event.target.value })} className={inputClassName} /></Field><Field label="To"><input value={form.to} onChange={(event) => onChange({ ...form, to: event.target.value })} className={inputClassName} /></Field><Field label="Slug"><input value={form.slug} onChange={(event) => onChange({ ...form, slug: event.target.value })} className={inputClassName} /></Field><Field label="Mode"><select value={form.mode} onChange={(event) => onChange({ ...form, mode: event.target.value as RouteSegment["mode"] })} className={inputClassName}>{["FLIGHT", "BUS", "JEEP", "WALK", "TREK", "MIXED"].map((mode) => <option key={mode}>{mode}</option>)}</select></Field><Field label="Distance km"><input type="number" value={form.distanceKm} onChange={(event) => onChange({ ...form, distanceKm: event.target.value })} className={inputClassName} /></Field><Field label="Duration min"><input type="number" value={form.durationMin} onChange={(event) => onChange({ ...form, durationMin: event.target.value })} className={inputClassName} /></Field><Field label="Duration max"><input type="number" value={form.durationMax} onChange={(event) => onChange({ ...form, durationMax: event.target.value })} className={inputClassName} /></Field><Field label="Cost min"><input type="number" value={form.costMin} onChange={(event) => onChange({ ...form, costMin: event.target.value })} className={inputClassName} /></Field><Field label="Cost max"><input type="number" value={form.costMax} onChange={(event) => onChange({ ...form, costMax: event.target.value })} className={inputClassName} /></Field><Field label="Reliability"><select value={form.reliability} onChange={(event) => onChange({ ...form, reliability: event.target.value as RouteSegment["reliability"] })} className={inputClassName}>{["HIGH", "MEDIUM", "LOW"].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Seasonality"><input value={form.seasonality} onChange={(event) => onChange({ ...form, seasonality: event.target.value })} className={inputClassName} /></Field><Field label="Stopover"><input value={form.recommendedStopover} onChange={(event) => onChange({ ...form, recommendedStopover: event.target.value })} className={inputClassName} /></Field><label className="flex items-center gap-2 text-sm font-semibold text-stone-700"><input type="checkbox" checked={form.active} onChange={(event) => onChange({ ...form, active: event.target.checked })} /> Active</label><label className="flex items-center gap-2 text-sm font-semibold text-stone-700"><input type="checkbox" checked={form.featured} onChange={(event) => onChange({ ...form, featured: event.target.checked })} /> Featured</label><label className="flex items-center gap-2 text-sm font-semibold text-stone-700"><input type="checkbox" checked={form.requiresConfirmation} onChange={(event) => onChange({ ...form, requiresConfirmation: event.target.checked })} /> Requires confirmation</label><Field label="Notes"><textarea value={form.notes} onChange={(event) => onChange({ ...form, notes: event.target.value })} className={`${inputClassName} min-h-24`} /></Field><Field label="Risk notes"><textarea value={form.riskNotes} onChange={(event) => onChange({ ...form, riskNotes: event.target.value })} className={`${inputClassName} min-h-24`} /></Field></FormShell>;
}

function FormShell({ title, children, saving, onClose, onSubmit }: { title: string; children: React.ReactNode; saving: boolean; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4 py-6"><form onSubmit={onSubmit} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Route form</p><h2 className="mt-2 text-2xl font-bold">{title}</h2></div><button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Close</button></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{children}</div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-semibold">Cancel</button><button disabled={saving} className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save"}</button></div></form></div>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`rounded-lg px-4 py-2 text-sm font-semibold ${active ? "bg-emerald-700 text-white" : "border border-stone-200 text-stone-600 hover:bg-stone-50"}`}>{children}</button>;
}

function Alert({ tone, message, onRetry }: { tone: "success" | "error"; message: string; onRetry?: () => void }) {
  return <div className={`mx-6 mt-5 rounded-lg border px-4 py-3 text-sm ${tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span>{message}</span>{onRetry ? <button onClick={onRetry} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">Retry</button> : null}</div></div>;
}
function Head({ children, align }: { children: React.ReactNode; align?: "right" }) { return <th className={`pb-3 pr-5 font-medium text-stone-500 ${align === "right" ? "text-right" : ""}`}>{children}</th>; }
function Cell({ children, strong }: { children: React.ReactNode; strong?: boolean }) { return <td className={`py-3 pr-5 ${strong ? "font-medium text-stone-950" : "text-stone-700"}`}>{children}</td>; }
function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) { return <div className="flex justify-end gap-2"><button onClick={onEdit} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800">Edit</button><button onClick={onDelete} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Delete</button></div>; }
function LoadingRows({ cols }: { cols: number }) { return Array.from({ length: 5 }).map((_, row) => <tr key={row}>{Array.from({ length: cols }).map((__, col) => <td key={col} className="py-4 pr-5"><div className="h-4 animate-pulse rounded-full bg-stone-100" /></td>)}</tr>); }
function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) { return <tr><td colSpan={colSpan} className="py-14 text-center"><p className="font-semibold text-stone-900">{label}</p><p className="mt-2 text-sm text-stone-500">Add a route record or adjust the search.</p></td></tr>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="space-y-2 text-sm font-semibold text-stone-700"><span>{label}</span>{children}</label>; }
function ConfirmDelete({ label, onCancel, onConfirm }: { label: string; onCancel: () => void; onConfirm: () => void }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 px-4"><section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Delete route record</p><h2 className="mt-3 text-2xl font-bold">Confirm deletion</h2><p className="mt-3 text-sm text-stone-600">This will delete <span className="font-bold">{label}</span>.</p><div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-semibold">Cancel</button><button onClick={onConfirm} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white">Delete</button></div></section></div>; }
function numberOrUndefined(value: string) { return value.trim() ? Number(value) : undefined; }
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function cost(min?: number, max?: number) { if (min && max) return `Rs. ${min}-${max}`; if (min) return `From Rs. ${min}`; if (max) return `Up to Rs. ${max}`; return "Confirm"; }
function duration(segment: RouteSegment) { if (segment.durationMin && segment.durationMax) return `${segment.durationMin}-${segment.durationMax} min`; if (segment.durationMin) return `${segment.durationMin} min`; return "Varies"; }
