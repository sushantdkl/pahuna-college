// @ts-nocheck
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminReplicaFrame } from "@/components/dashboard/dashboard-shell";
import { ReplicaDataCard, ReplicaStatusBadge } from "@/components/dashboard/data-table-card";
import { ReplicaStatCard } from "@/components/dashboard/stat-card";
import {
  getAdminPartnerApplicationsAction,
  updateAdminPartnerApplicationAction,
} from "@/lib/actions/admin-partner-application-actions";

const statuses = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];

export default function DashboardPartnersPage() {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const result = await getAdminPartnerApplicationsAction({ page: 1, limit: 50 });
      setApplications(result.data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load partner applications");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const summary = useMemo(() => ({
    total: applications.length,
    pending: applications.filter((item) => item.status === "PENDING").length,
    approved: applications.filter((item) => item.status === "APPROVED").length,
    hotels: applications.filter((item) => ["HOTEL", "RESORT"].includes(item.partnerType)).length,
  }), [applications]);

  async function updateApplication(id, payload, options = {}) {
    setSaving(true);
    setError("");
    try {
      await updateAdminPartnerApplicationAction(id, payload);
      await load();
      if (options.closeOnSuccess) {
        setSelected(null);
        setNotes("");
      } else {
        setSelected((current) => current ? { ...current, ...payload } : current);
      }
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update application");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Partners</h1>
          <p className="text-sm text-stone-500">Review partner applications from the canonical Partner and Hotel Lead forms.</p>
        </div>
        {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReplicaStatCard title="Applications" value={summary.total} subtitle="Submitted forms" icon="AP" />
          <ReplicaStatCard title="Pending" value={summary.pending} subtitle="Need review" icon="PN" />
          <ReplicaStatCard title="Approved" value={summary.approved} subtitle="Accepted partners" icon="OK" />
          <ReplicaStatCard title="Hotel Leads" value={summary.hotels} subtitle="Hotel/resort flows" icon="HT" />
        </div>
        <ReplicaDataCard title="Partner applications" description="Complete application data with admin-only review controls" count={applications.length}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-medium text-stone-500">Business</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Owner</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Type</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Status</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((item) => (
                <tr key={item._id} className="border-b last:border-0">
                  <td className="py-3 pr-4"><p className="font-semibold text-stone-900">{item.businessName}</p><p className="text-stone-500">{item.email}</p></td>
                  <td className="py-3 pr-4 text-stone-600">{item.ownerName}</td>
                  <td className="py-3 pr-4 text-stone-600">{item.partnerType}</td>
                  <td className="py-3 pr-4"><ReplicaStatusBadge>{item.status}</ReplicaStatusBadge></td>
                  <td className="py-3 pr-4"><button onClick={() => { setSelected(item); setNotes(item.notes || ""); }} className="font-semibold text-emerald-700 hover:text-emerald-900">Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReplicaDataCard>
      </div>

      {selected ? (
        <DetailPanel title={selected.businessName} onClose={() => setSelected(null)}>
          <Detail label="Business Type" value={selected.partnerType} />
          <Detail label="Owner / Manager Name" value={selected.ownerName} />
          <Detail label="Email" value={selected.email} />
          <Detail label="Phone" value={selected.phone} />
          <Detail label="Address" value={selected.address} />
          <Detail label="Website" value={selected.website} />
          <Detail label="Total Rooms" value={selected.totalRooms} />
          <Detail label="Current Revenue / Price Range" value={selected.currentRevenue} />
          <Detail label="Existing Online Presence" value={selected.existingOnline ? "Yes" : "No"} />
          <Detail label="Business Challenges" value={selected.challenges} block />
          <Detail label="Partnership Goals" value={selected.goals} block />
          <label className="mt-4 block text-sm font-semibold text-stone-700">Review status</label>
          <select value={selected.status} onChange={(event) => updateApplication(selected._id, { status: event.target.value })} disabled={saving} className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm">
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <label className="mt-4 block text-sm font-semibold text-stone-700">Admin notes</label>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" />
          <button disabled={saving} onClick={() => updateApplication(selected._id, { notes }, { closeOnSuccess: true })} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Save notes</button>
        </DetailPanel>
      ) : null}
    </AdminReplicaFrame>
  );
}

function DetailPanel({ title, children, onClose }) {
  return <div className="fixed inset-0 z-50 bg-black/40 p-4" onClick={onClose}><div className="ml-auto h-full w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><button onClick={onClose} className="rounded-lg border px-3 py-1 text-sm">Close</button></div>{children}</div></div>;
}

function Detail({ label, value, block = false }) {
  return <div className="border-b border-stone-100 py-3"><p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">{label}</p><p className={`mt-1 text-sm text-stone-800 ${block ? "whitespace-pre-wrap leading-6" : ""}`}>{value || "-"}</p></div>;
}
