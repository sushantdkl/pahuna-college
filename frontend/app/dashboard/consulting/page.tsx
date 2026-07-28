// @ts-nocheck
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminReplicaFrame } from "@/components/dashboard/dashboard-shell";
import { ReplicaDataCard, ReplicaStatusBadge } from "@/components/dashboard/data-table-card";
import { ReplicaStatCard } from "@/components/dashboard/stat-card";
import {
  createAdminConsultingServiceAction,
  deleteAdminConsultingLeadAction,
  deleteAdminConsultingServiceAction,
  getAdminConsultingLeadsAction,
  getAdminConsultingServicesAction,
  updateAdminConsultingLeadAction,
  updateAdminConsultingServiceAction,
} from "@/lib/actions/admin-consulting-actions";
import { consultingServiceFormSchema } from "@/schemas/consulting.schema";

const leadStatuses = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"];
const emptyService = { title: "", slug: "", description: "", category: "", price: "", duration: "", deliverables: "", image: "", isActive: true };
const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DashboardConsultingPage() {
  const [tab, setTab] = useState("services");
  const [leads, setLeads] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [response, setResponse] = useState("");
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [serviceImageFile, setServiceImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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
    void load();
  }, [load]);

  const summary = useMemo(() => ({
    services: services.length,
    active: services.filter((item) => item.isActive).length,
    leads: leads.length,
    new: leads.filter((item) => item.status === "NEW").length,
  }), [leads, services]);

  function openService(service = null) {
    setEditingService(service || "create");
    setServiceImageFile(null);
    setServiceForm(service ? {
      title: service.title || "",
      slug: service.slug || "",
      description: service.description || "",
      category: service.category || "",
      price: service.price || "",
      duration: service.duration || "",
      deliverables: (service.deliverables || []).join(", "),
      image: service.image || "",
      isActive: Boolean(service.isActive),
    } : emptyService);
  }

  function servicePayload() {
    return {
      ...serviceForm,
      slug: serviceForm.slug || undefined,
      category: serviceForm.category || undefined,
      price: serviceForm.price || undefined,
      duration: serviceForm.duration || undefined,
      image: serviceForm.image || undefined,
      deliverables: serviceForm.deliverables.split(",").map((item) => item.trim()).filter(Boolean),
    };
  }

  async function saveService(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const parsed = consultingServiceFormSchema.safeParse(servicePayload());
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Invalid service data");
      if (editingService === "create") {
        await createAdminConsultingServiceAction(parsed.data, serviceImageFile);
        setNotice("Consulting service added");
      } else {
        await updateAdminConsultingServiceAction(editingService._id, parsed.data, serviceImageFile);
        setNotice("Consulting service updated");
      }
      setEditingService(null);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save consulting service");
    } finally {
      setSaving(false);
    }
  }

  async function updateService(service, payload, message) {
    setError("");
    setNotice("");
    try {
      await updateAdminConsultingServiceAction(service._id, payload);
      setNotice(message);
      await load();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update consulting service");
    }
  }

  async function updateLead(id, payload) {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await updateAdminConsultingLeadAction(id, payload);
      setNotice("Consulting lead updated");
      await load();
      setSelectedLead((current) => current ? { ...current, ...payload } : current);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update lead");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      if (deleting.type === "service") {
        await deleteAdminConsultingServiceAction(deleting.record._id);
        setNotice("Consulting service deleted");
      } else {
        await deleteAdminConsultingLeadAction(deleting.record._id);
        setNotice("Consulting lead deleted");
      }
      setDeleting(null);
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete consulting record");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><h1 className="text-2xl font-bold tracking-tight">Consulting</h1><p className="text-sm text-stone-500">Manage consulting services and complete request submissions from the live database.</p></div>
          <button onClick={() => openService()} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Add Service</button>
        </div>
        {error ? <Alert tone="error" message={error} /> : null}
        {notice ? <Alert tone="success" message={notice} /> : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReplicaStatCard title="Services" value={summary.services} subtitle="Consulting service records" icon="SV" />
          <ReplicaStatCard title="Active Services" value={summary.active} subtitle="Visible publicly" icon="AC" />
          <ReplicaStatCard title="Leads" value={summary.leads} subtitle="Submitted requests" icon="LD" />
          <ReplicaStatCard title="New Leads" value={summary.new} subtitle="Need contact" icon="NW" />
        </div>
        <div className="flex gap-2"><Tab active={tab === "services"} onClick={() => setTab("services")}>Services</Tab><Tab active={tab === "leads"} onClick={() => setTab("leads")}>Leads</Tab></div>
        {tab === "services" ? (
          <ReplicaDataCard title="Consulting services" description="Active services publish to the public consulting page and request selector." count={services.length}>
            <Table headers={["Service", "Category", "Price", "Duration", "Public", "Actions"]}>
              {services.map((service) => <tr key={service._id} className="border-b last:border-0"><td className="py-3 pr-4"><p className="font-semibold text-stone-900">{service.title}</p><p className="text-stone-500">{service.slug}</p></td><td className="py-3 pr-4 text-stone-600">{service.category || "-"}</td><td className="py-3 pr-4 text-stone-600">{service.price || "-"}</td><td className="py-3 pr-4 text-stone-600">{service.duration || "-"}</td><td className="py-3 pr-4"><ReplicaStatusBadge>{service.isActive ? "Active" : "Inactive"}</ReplicaStatusBadge></td><td className="py-3 pr-4"><div className="flex flex-wrap gap-2"><SmallButton onClick={() => setSelectedService(service)}>View</SmallButton><SmallButton onClick={() => openService(service)}>Edit</SmallButton><SmallButton onClick={() => updateService(service, { isActive: !service.isActive }, service.isActive ? "Service unpublished" : "Service published")}>{service.isActive ? "Unpublish" : "Publish"}</SmallButton><SmallButton danger onClick={() => setDeleting({ type: "service", record: service })}>Delete</SmallButton></div></td></tr>)}
            </Table>
          </ReplicaDataCard>
        ) : (
          <ReplicaDataCard title="Consulting leads" description="Every visible field from the public consulting form is shown here." count={leads.length}>
            <Table headers={["Business", "Contact", "Service", "Status", "Actions"]}>
              {leads.map((lead) => <tr key={lead._id} className="border-b last:border-0"><td className="py-3 pr-4 font-semibold text-stone-900">{lead.businessName || "-"}</td><td className="py-3 pr-4"><p>{lead.contactName || lead.name}</p><p className="text-stone-500">{lead.email}</p></td><td className="py-3 pr-4 text-stone-600">{typeof lead.serviceId === "object" ? lead.serviceId.title : lead.serviceType || lead.serviceId || "-"}</td><td className="py-3 pr-4"><ReplicaStatusBadge>{lead.status}</ReplicaStatusBadge></td><td className="py-3 pr-4"><div className="flex gap-2"><SmallButton onClick={() => { setSelectedLead(lead); setResponse(lead.response || ""); }}>View</SmallButton><SmallButton danger onClick={() => setDeleting({ type: "lead", record: lead })}>Delete</SmallButton></div></td></tr>)}
            </Table>
          </ReplicaDataCard>
        )}
      </div>
      {editingService ? <ServiceDialog form={serviceForm} imageFile={serviceImageFile} saving={saving} onChange={setServiceForm} onImageChange={setServiceImageFile} onSubmit={saveService} onClose={() => setEditingService(null)} /> : null}
      {selectedService ? <DetailPanel title={selectedService.title} onClose={() => setSelectedService(null)}><Detail label="Description" value={selectedService.description} block /><Detail label="Category" value={selectedService.category} /><Detail label="Price" value={selectedService.price} /><Detail label="Duration" value={selectedService.duration} /><Detail label="Deliverables" value={(selectedService.deliverables || []).join(", ")} /><Detail label="Status" value={selectedService.isActive ? "Active" : "Inactive"} /></DetailPanel> : null}
      {selectedLead ? <DetailPanel title={selectedLead.businessName || selectedLead.name} onClose={() => setSelectedLead(null)}><Detail label="Contact Person" value={selectedLead.contactName || selectedLead.name} /><Detail label="Email" value={selectedLead.email} /><Detail label="Phone" value={selectedLead.phone} /><Detail label="Business Type" value={selectedLead.businessType} /><Detail label="Business Stage" value={selectedLead.businessStage || selectedLead.stage} /><Detail label="Business Size" value={selectedLead.businessSize} /><Detail label="Location" value={selectedLead.location} /><Detail label="Primary Service Needed" value={typeof selectedLead.serviceId === "object" ? selectedLead.serviceId.title : selectedLead.serviceType || selectedLead.serviceId} /><Detail label="Timeline" value={selectedLead.timeline} /><Detail label="Approximate Budget" value={selectedLead.budgetRange || selectedLead.budget} /><Detail label="Challenges and Goals" value={selectedLead.message} block /><label className="mt-4 block text-sm font-semibold text-stone-700">Pipeline status</label><select value={selectedLead.status} onChange={(event) => updateLead(selectedLead._id, { status: event.target.value })} disabled={saving} className={inputClassName}>{leadStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select><label className="mt-4 block text-sm font-semibold text-stone-700">Admin response</label><textarea value={response} onChange={(event) => setResponse(event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" /><button disabled={saving} onClick={() => updateLead(selectedLead._id, { response })} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Save response</button></DetailPanel> : null}
      {deleting ? <ConfirmDialog label={deleting.record.title || deleting.record.businessName || deleting.record.name} saving={saving} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} /> : null}
    </AdminReplicaFrame>
  );
}

function ServiceDialog({ form, imageFile, saving, onChange, onImageChange, onSubmit, onClose }) {
  return <Modal title="Consulting service" onClose={onClose}><form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2"><Field label="Title"><input value={form.title} onChange={(event) => onChange({ ...form, title: event.target.value })} className={inputClassName} /></Field><Field label="Slug"><input value={form.slug} onChange={(event) => onChange({ ...form, slug: event.target.value })} className={inputClassName} /></Field><Field label="Category"><input value={form.category} onChange={(event) => onChange({ ...form, category: event.target.value })} className={inputClassName} /></Field><Field label="Price"><input value={form.price} onChange={(event) => onChange({ ...form, price: event.target.value })} className={inputClassName} /></Field><Field label="Duration"><input value={form.duration} onChange={(event) => onChange({ ...form, duration: event.target.value })} className={inputClassName} /></Field><Field label="Service image"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => onImageChange(event.target.files?.[0] || null)} className={inputClassName} /><p className="mt-1 text-xs font-medium text-stone-500">{imageFile?.name || (form.image ? "Current image will be kept" : "Choose an image from your device")}</p></Field><label className="flex items-center gap-2 text-sm font-semibold text-stone-700"><input type="checkbox" checked={form.isActive} onChange={(event) => onChange({ ...form, isActive: event.target.checked })} />Active</label><Field label="Deliverables"><input value={form.deliverables} onChange={(event) => onChange({ ...form, deliverables: event.target.value })} className={inputClassName} placeholder="Comma separated" /></Field><label className="space-y-2 text-sm font-semibold text-stone-700 sm:col-span-2"><span>Description</span><textarea value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} className={`${inputClassName} min-h-28`} /></label><div className="flex justify-end gap-3 sm:col-span-2"><button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">{saving ? "Saving..." : "Save service"}</button></div></form></Modal>;
}
function Table({ headers, children }) { return <table className="w-full min-w-[920px] text-sm"><thead><tr className="border-b text-left">{headers.map((header) => <th key={header} className="pb-2 pr-4 font-medium text-stone-500">{header}</th>)}</tr></thead><tbody>{children}</tbody></table>; }
function Tab({ active, children, onClick }) { return <button onClick={onClick} className={`rounded-lg px-4 py-2 text-sm font-semibold ${active ? "bg-emerald-700 text-white" : "border border-stone-200 bg-white text-stone-700"}`}>{children}</button>; }
function SmallButton({ children, danger = false, onClick }) { return <button onClick={onClick} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${danger ? "border-red-200 bg-red-50 text-red-700" : "border-stone-200 text-stone-700 hover:bg-stone-50"}`}>{children}</button>; }
function Modal({ title, children, onClose }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 px-4 py-6"><section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><button onClick={onClose} className="rounded-lg border px-3 py-1 text-sm">Close</button></div>{children}</section></div>; }
function DetailPanel({ title, children, onClose }) { return <div className="fixed inset-0 z-50 bg-black/40 p-4" onClick={onClose}><div className="ml-auto h-full w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><button onClick={onClose} className="rounded-lg border px-3 py-1 text-sm">Close</button></div>{children}</div></div>; }
function ConfirmDialog({ label, saving, onCancel, onConfirm }) { return <Modal title="Confirm deletion" onClose={onCancel}><p className="text-sm text-stone-600">Delete {label} from the database?</p><div className="mt-6 flex justify-end gap-3"><button disabled={saving} onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm font-semibold">Cancel</button><button disabled={saving} onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">{saving ? "Deleting..." : "Delete"}</button></div></Modal>; }
function Field({ label, children }) { return <label className="space-y-2 text-sm font-semibold text-stone-700"><span>{label}</span>{children}</label>; }
function Detail({ label, value, block = false }) { return <div className="border-b border-stone-100 py-3"><p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">{label}</p><p className={`mt-1 text-sm text-stone-800 ${block ? "whitespace-pre-wrap leading-6" : ""}`}>{value || "-"}</p></div>; }
function Alert({ tone, message }) { return <p className={`rounded-lg border px-4 py-3 text-sm font-semibold ${tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{message}</p>; }
