// @ts-nocheck
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminReplicaFrame } from "@/components/dashboard/dashboard-shell";
import { ReplicaDataCard, ReplicaStatusBadge } from "@/components/dashboard/data-table-card";
import { ReplicaStatCard } from "@/components/dashboard/stat-card";
import { getAdminConsultingLeadsAction, getAdminConsultingServicesAction, updateAdminConsultingLeadAction } from "@/lib/actions/admin-consulting-actions";

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"];

export default function DashboardConsultingPage() {
  const [leads, setLeads] = useState([]);
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [leadResult, serviceResult] = await Promise.all([
        getAdminConsultingLeadsAction({ page: 1, limit: 50 }),
        getAdminConsultingServicesAction({ page: 1, limit: 50 }),
      ]);
      setLeads(leadResult.data || []);
      setServices(serviceResult.data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load consulting records");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const summary = useMemo(() => ({
    services: services.length,
    leads: leads.length,
    new: leads.filter((item) => item.status === "NEW").length,
    won: leads.filter((item) => item.status === "WON").length,
  }), [leads, services]);

  async function updateLead(id, payload) {
    setSaving(true);
    setError("");
    try {
      await updateAdminConsultingLeadAction(id, payload);
      await load();
      setSelected((current) => current ? { ...current, ...payload } : current);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update lead");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold tracking-tight">Consulting</h1><p className="text-sm text-stone-500">Manage consulting services and complete request submissions.</p></div>
        {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReplicaStatCard title="Services" value={summary.services} subtitle="Active service records" icon="SV" />
          <ReplicaStatCard title="Leads" value={summary.leads} subtitle="Submitted requests" icon="LD" />
          <ReplicaStatCard title="New" value={summary.new} subtitle="Need contact" icon="NW" />
          <ReplicaStatCard title="Won" value={summary.won} subtitle="Closed success" icon="WN" />
        </div>
        <ReplicaDataCard title="Consulting leads" description="Every visible field from the locked consulting form is shown here" count={leads.length}>
          <table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="pb-2 pr-4 font-medium text-stone-500">Business</th><th className="pb-2 pr-4 font-medium text-stone-500">Contact</th><th className="pb-2 pr-4 font-medium text-stone-500">Service</th><th className="pb-2 pr-4 font-medium text-stone-500">Status</th><th className="pb-2 pr-4 font-medium text-stone-500">Open</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead._id} className="border-b last:border-0"><td className="py-3 pr-4 font-semibold text-stone-900">{lead.businessName || "-"}</td><td className="py-3 pr-4"><p>{lead.contactName || lead.name}</p><p className="text-stone-500">{lead.email}</p></td><td className="py-3 pr-4 text-stone-600">{typeof lead.serviceId === "object" ? lead.serviceId.title : lead.serviceType || lead.serviceId || "-"}</td><td className="py-3 pr-4"><ReplicaStatusBadge>{lead.status}</ReplicaStatusBadge></td><td className="py-3 pr-4"><button onClick={() => { setSelected(lead); setResponse(lead.response || ""); }} className="font-semibold text-emerald-700 hover:text-emerald-900">Details</button></td></tr>)}</tbody></table>
        </ReplicaDataCard>
      </div>
      {selected ? <DetailPanel title={selected.businessName || selected.name} onClose={() => setSelected(null)}>
        <Detail label="Contact Person" value={selected.contactName || selected.name} /><Detail label="Email" value={selected.email} /><Detail label="Phone" value={selected.phone} /><Detail label="Business Type" value={selected.businessType} /><Detail label="Business Stage" value={selected.businessStage || selected.stage} /><Detail label="Business Size" value={selected.businessSize} /><Detail label="Location" value={selected.location} /><Detail label="Primary Service Needed" value={typeof selected.serviceId === "object" ? selected.serviceId.title : selected.serviceType || selected.serviceId} /><Detail label="Timeline" value={selected.timeline} /><Detail label="Approximate Budget" value={selected.budgetRange || selected.budget} /><Detail label="Challenges and Goals" value={selected.message} block />
        <label className="mt-4 block text-sm font-semibold text-stone-700">Pipeline status</label><select value={selected.status} onChange={(event) => updateLead(selected._id, { status: event.target.value })} disabled={saving} className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>
        <label className="mt-4 block text-sm font-semibold text-stone-700">Admin response</label><textarea value={response} onChange={(event) => setResponse(event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" /><button disabled={saving} onClick={() => updateLead(selected._id, { response })} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Save response</button>
      </DetailPanel> : null}
    </AdminReplicaFrame>
  );
}

function DetailPanel({ title, children, onClose }) { return <div className="fixed inset-0 z-50 bg-black/40 p-4" onClick={onClose}><div className="ml-auto h-full w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><button onClick={onClose} className="rounded-lg border px-3 py-1 text-sm">Close</button></div>{children}</div></div>; }
function Detail({ label, value, block = false }) { return <div className="border-b border-stone-100 py-3"><p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">{label}</p><p className={`mt-1 text-sm text-stone-800 ${block ? "whitespace-pre-wrap leading-6" : ""}`}>{value || "-"}</p></div>; }
