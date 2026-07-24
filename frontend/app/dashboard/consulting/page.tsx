"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminReplicaFrame,
  ReplicaDataCard,
  ReplicaStatCard,
} from "@/app/_components/admin-replica-dashboard";
import {
  createAdminConsultingServiceAction,
  deleteAdminConsultingLeadAction,
  deleteAdminConsultingServiceAction,
  getAdminConsultingLeadsAction,
  getAdminConsultingServicesAction,
  updateAdminConsultingLeadAction,
  updateAdminConsultingServiceAction,
} from "@/lib/actions/admin-consulting-actions";
import type {
  AdminConsultingLead,
  AdminConsultingService,
} from "@/lib/api/admin-consulting";
import {
  consultingServiceFormSchema,
  type ConsultingLeadStatus,
  type ConsultingServiceFormData,
} from "@/schemas/consulting.schema";

type ServiceFormState = {
  title: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  duration: string;
  deliverables: string;
  image: string;
  isActive: boolean;
};

const emptyServiceForm: ServiceFormState = {
  title: "",
  slug: "",
  description: "",
  category: "",
  price: "",
  duration: "",
  deliverables: "",
  image: "",
  isActive: true,
};

const leadStatuses: ConsultingLeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
  "CLOSED",
];
const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DashboardConsultingPage() {
  const [tab, setTab] = useState<"services" | "leads">("services");
  const [services, setServices] = useState<AdminConsultingService[]>([]);
  const [leads, setLeads] = useState<AdminConsultingLead[]>([]);
  const [servicePage, setServicePage] = useState(1);
  const [leadPage, setLeadPage] = useState(1);
  const [serviceMeta, setServiceMeta] = useState({ total: 0, totalPages: 1 });
  const [leadMeta, setLeadMeta] = useState({ total: 0, totalPages: 1 });
  const [summary, setSummary] = useState({ totalServices: 0, activeServices: 0, totalLeads: 0, newLeads: 0 });
  const [serviceSearchInput, setServiceSearchInput] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"" | "true" | "false">("");
  const [leadSearchInput, setLeadSearchInput] = useState("");
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatus, setLeadStatus] = useState<ConsultingLeadStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingService, setEditingService] = useState<AdminConsultingService | "create" | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceFormState>(emptyServiceForm);
  const [formError, setFormError] = useState("");
  const [viewingLead, setViewingLead] = useState<AdminConsultingLead | null>(null);
  const [reviewingLead, setReviewingLead] = useState<AdminConsultingLead | null>(null);
  const [responseText, setResponseText] = useState("");
  const [deletingService, setDeletingService] = useState<AdminConsultingService | null>(null);
  const [deletingLead, setDeletingLead] = useState<AdminConsultingLead | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState("");

  const loadServices = useCallback(async () => {
    const response = await getAdminConsultingServicesAction({
      page: servicePage,
      limit: 10,
      search: serviceSearch,
      active: activeFilter === "" ? "" : activeFilter === "true",
    });
    setServices(response.data || []);
    setServiceMeta({
      total: response.meta?.total || 0,
      totalPages: response.meta?.totalPages || 1,
    });
    setSummary({
      totalServices: response.meta?.summary?.totalServices || 0,
      activeServices: response.meta?.summary?.activeServices || 0,
      totalLeads: response.meta?.summary?.totalLeads || 0,
      newLeads: response.meta?.summary?.newLeads || 0,
    });
  }, [activeFilter, servicePage, serviceSearch]);

  const loadLeads = useCallback(async () => {
    const response = await getAdminConsultingLeadsAction({
      page: leadPage,
      limit: 10,
      search: leadSearch,
      status: leadStatus,
    });
    setLeads(response.data || []);
    setLeadMeta({
      total: response.meta?.total || 0,
      totalPages: response.meta?.totalPages || 1,
    });
  }, [leadPage, leadSearch, leadStatus]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([loadServices(), loadLeads()]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load consulting workspace");
    } finally {
      setLoading(false);
    }
  }, [loadLeads, loadServices]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadAll(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadAll]);

  function openCreate() {
    setServiceForm(emptyServiceForm);
    setFormError("");
    setEditingService("create");
  }

  function openEdit(service: AdminConsultingService) {
    setServiceForm({
      title: service.title,
      slug: service.slug,
      description: service.description,
      category: service.category || "",
      price: service.price || "",
      duration: service.duration || "",
      deliverables: service.deliverables.join(", "),
      image: service.image || "",
      isActive: service.isActive,
    });
    setFormError("");
    setEditingService(service);
  }

  function servicePayload(): ConsultingServiceFormData {
    return {
      title: serviceForm.title,
      slug: serviceForm.slug || undefined,
      description: serviceForm.description,
      category: serviceForm.category || undefined,
      price: serviceForm.price || undefined,
      duration: serviceForm.duration || undefined,
      deliverables: serviceForm.deliverables
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      image: serviceForm.image || undefined,
      isActive: serviceForm.isActive,
    };
  }

  async function saveService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const parsed = consultingServiceFormSchema.safeParse(servicePayload());
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Please check the service form");
      return;
    }
    setSaving(true);
    try {
      if (editingService === "create") {
        await createAdminConsultingServiceAction(parsed.data);
        setNotice("Consulting service created successfully.");
      } else if (editingService) {
        await updateAdminConsultingServiceAction(editingService._id, parsed.data);
        setNotice("Consulting service updated successfully.");
      }
      setEditingService(null);
      await loadAll();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save consulting service");
    } finally {
      setSaving(false);
    }
  }

  async function quickService(service: AdminConsultingService) {
    setSavingId(service._id);
    try {
      await updateAdminConsultingServiceAction(service._id, { isActive: !service.isActive });
      setNotice("Consulting service updated.");
      await loadAll();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update consulting service");
    } finally {
      setSavingId("");
    }
  }

  async function quickLead(lead: AdminConsultingLead, status: ConsultingLeadStatus, response?: string) {
    setSavingId(lead._id);
    try {
      await updateAdminConsultingLeadAction(lead._id, { status, response });
      setNotice("Consulting lead updated.");
      setReviewingLead(null);
      await loadAll();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update lead");
    } finally {
      setSavingId("");
    }
  }

  async function confirmDelete() {
    setSaving(true);
    try {
      if (deletingService) {
        await deleteAdminConsultingServiceAction(deletingService._id);
        setDeletingService(null);
      }
      if (deletingLead) {
        await deleteAdminConsultingLeadAction(deletingLead._id);
        setDeletingLead(null);
      }
      setNotice("Consulting item removed successfully.");
      await loadAll();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to remove consulting item");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Consulting Management</h1>
            <p className="text-sm text-stone-500">Manage consulting services and public support leads</p>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">New Service</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReplicaStatCard title="Total Services" value={summary.totalServices} subtitle="All service offerings" icon="CS" />
          <ReplicaStatCard title="Active Services" value={summary.activeServices} subtitle="Publicly visible" icon="AS" />
          <ReplicaStatCard title="Total Leads" value={summary.totalLeads} subtitle="All consulting requests" icon="CL" />
          <ReplicaStatCard title="New Leads" value={summary.newLeads} subtitle="Awaiting response" icon="NL" />
        </div>

        {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p> : null}
        {error ? <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => void loadAll()} className="font-bold underline">Retry</button></div> : null}

        <div className="flex gap-2">
          <button onClick={() => setTab("services")} className={tabButton(tab === "services")}>Services</button>
          <button onClick={() => setTab("leads")} className={tabButton(tab === "leads")}>Leads</button>
        </div>

        {tab === "services" ? (
          <ReplicaDataCard title="Service offerings" description="Create, refine, publish, or pause consulting services" count={serviceMeta.total}>
            <form onSubmit={(event) => { event.preventDefault(); setServicePage(1); setServiceSearch(serviceSearchInput.trim()); }} className="mb-5 grid gap-3 lg:grid-cols-[1fr_190px_auto]">
              <input value={serviceSearchInput} onChange={(event) => setServiceSearchInput(event.target.value)} placeholder="Search title, category, price, deliverables" className={inputClassName} />
              <select value={activeFilter} onChange={(event) => { setServicePage(1); setActiveFilter(event.target.value as "" | "true" | "false"); }} className={inputClassName}><option value="">Active and inactive</option><option value="true">Active</option><option value="false">Inactive</option></select>
              <button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">Search</button>
            </form>
            {loading ? <Loading text="Loading consulting services..." /> : services.length ? <ServiceTable services={services} savingId={savingId} onEdit={openEdit} onToggle={(service) => void quickService(service)} onDelete={setDeletingService} /> : <Empty text="No consulting services found." />}
            <Pager page={servicePage} totalPages={serviceMeta.totalPages} loading={loading} setPage={setServicePage} />
          </ReplicaDataCard>
        ) : (
          <ReplicaDataCard title="Consulting leads" description="Review, respond, update status, or archive inquiries" count={leadMeta.total}>
            <form onSubmit={(event) => { event.preventDefault(); setLeadPage(1); setLeadSearch(leadSearchInput.trim()); }} className="mb-5 grid gap-3 lg:grid-cols-[1fr_190px_auto]">
              <input value={leadSearchInput} onChange={(event) => setLeadSearchInput(event.target.value)} placeholder="Search name, business, email, phone, message" className={inputClassName} />
              <select value={leadStatus} onChange={(event) => { setLeadPage(1); setLeadStatus(event.target.value as ConsultingLeadStatus | ""); }} className={inputClassName}><option value="">All statuses</option>{leadStatuses.map((status) => <option key={status} value={status}>{label(status)}</option>)}</select>
              <button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">Search</button>
            </form>
            {loading ? <Loading text="Loading consulting leads..." /> : leads.length ? <LeadTable leads={leads} savingId={savingId} onView={setViewingLead} onReview={(lead) => { setResponseText(lead.response || ""); setReviewingLead(lead); }} onStatus={(lead, status) => void quickLead(lead, status, lead.response)} onDelete={setDeletingLead} /> : <Empty text="No consulting leads found." />}
            <Pager page={leadPage} totalPages={leadMeta.totalPages} loading={loading} setPage={setLeadPage} />
          </ReplicaDataCard>
        )}
      </div>

      {editingService ? <ServiceDialog mode={editingService === "create" ? "create" : "edit"} form={serviceForm} setForm={setServiceForm} error={formError} saving={saving} onClose={() => setEditingService(null)} onSubmit={saveService} /> : null}
      {viewingLead ? <LeadDialog lead={viewingLead} onClose={() => setViewingLead(null)} /> : null}
      {reviewingLead ? <ReviewDialog lead={reviewingLead} response={responseText} setResponse={setResponseText} saving={savingId === reviewingLead._id} onClose={() => setReviewingLead(null)} onSave={(status) => void quickLead(reviewingLead, status, responseText.trim() || undefined)} /> : null}
      {deletingService || deletingLead ? <ConfirmDialog title="Remove consulting item?" text="This item will be removed from the workspace." saving={saving} onCancel={() => { setDeletingService(null); setDeletingLead(null); }} onConfirm={() => void confirmDelete()} /> : null}
    </AdminReplicaFrame>
  );
}

function ServiceTable({ services, savingId, onEdit, onToggle, onDelete }: { services: AdminConsultingService[]; savingId: string; onEdit: (service: AdminConsultingService) => void; onToggle: (service: AdminConsultingService) => void; onDelete: (service: AdminConsultingService) => void }) {
  return <table className="w-full min-w-[980px] text-sm"><thead><tr className="border-b text-left text-stone-500"><th className="pb-3 pr-4 font-medium">Title</th><th className="pb-3 pr-4 font-medium">Category</th><th className="pb-3 pr-4 font-medium">Price</th><th className="pb-3 pr-4 font-medium">Duration</th><th className="pb-3 pr-4 font-medium">Active</th><th className="pb-3 pr-4 font-medium">Updated</th><th className="pb-3 font-medium">Actions</th></tr></thead><tbody>{services.map((service) => <tr key={service._id} className="border-b border-stone-100 align-top last:border-0"><td className="py-4 pr-4"><p className="font-semibold text-stone-900">{service.title}</p><p className="mt-1 max-w-56 truncate text-xs text-stone-500">{service.description}</p></td><td className="py-4 pr-4 text-stone-600">{service.category || "General"}</td><td className="py-4 pr-4 text-stone-600">{service.price || "Custom"}</td><td className="py-4 pr-4 text-stone-600">{service.duration || "Flexible"}</td><td className="py-4 pr-4"><StatusBadge status={service.isActive ? "ACTIVE" : "INACTIVE"} /></td><td className="py-4 pr-4 text-stone-500">{formatDate(service.updatedAt)}</td><td className="py-4"><div className="flex min-w-[280px] flex-wrap gap-2"><button onClick={() => onEdit(service)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold">Edit</button><button disabled={savingId === service._id} onClick={() => onToggle(service)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 disabled:opacity-50">{service.isActive ? "Deactivate" : "Activate"}</button><button onClick={() => onDelete(service)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Archive</button></div></td></tr>)}</tbody></table>;
}

function LeadTable({ leads, savingId, onView, onReview, onStatus, onDelete }: { leads: AdminConsultingLead[]; savingId: string; onView: (lead: AdminConsultingLead) => void; onReview: (lead: AdminConsultingLead) => void; onStatus: (lead: AdminConsultingLead, status: ConsultingLeadStatus) => void; onDelete: (lead: AdminConsultingLead) => void }) {
  return <table className="w-full min-w-[1080px] text-sm"><thead><tr className="border-b text-left text-stone-500"><th className="pb-3 pr-4 font-medium">Name</th><th className="pb-3 pr-4 font-medium">Business</th><th className="pb-3 pr-4 font-medium">Service</th><th className="pb-3 pr-4 font-medium">Email</th><th className="pb-3 pr-4 font-medium">Phone</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Created</th><th className="pb-3 font-medium">Actions</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead._id} className="border-b border-stone-100 align-top last:border-0"><td className="py-4 pr-4 font-semibold text-stone-900">{lead.name}</td><td className="py-4 pr-4 text-stone-600">{lead.businessName || "Individual"}</td><td className="py-4 pr-4 text-stone-600">{serviceName(lead)}</td><td className="py-4 pr-4 text-stone-600">{lead.email}</td><td className="py-4 pr-4 text-stone-600">{lead.phone}</td><td className="py-4 pr-4"><StatusBadge status={lead.status} /></td><td className="py-4 pr-4 text-stone-500">{formatDate(lead.createdAt)}</td><td className="py-4"><div className="flex min-w-[390px] flex-wrap gap-2"><button onClick={() => onView(lead)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold">View</button><button onClick={() => onReview(lead)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">Respond</button><select disabled={savingId === lead._id} value={lead.status} onChange={(event) => onStatus(lead, event.target.value as ConsultingLeadStatus)} className="rounded-lg border border-stone-200 px-2 py-2 text-xs">{leadStatuses.map((status) => <option key={status} value={status}>{label(status)}</option>)}</select><button onClick={() => onDelete(lead)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Archive</button></div></td></tr>)}</tbody></table>;
}

function ServiceDialog({ mode, form, setForm, error, saving, onClose, onSubmit }: { mode: "create" | "edit"; form: ServiceFormState; setForm: React.Dispatch<React.SetStateAction<ServiceFormState>>; error: string; saving: boolean; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <ModalShell title={mode === "create" ? "Create consulting service" : "Edit consulting service"} eyebrow="Consulting" onClose={onClose}><form onSubmit={onSubmit}><div className="grid gap-4 sm:grid-cols-2"><Field label="Title"><input value={form.title} onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))} className={inputClassName} /></Field><Field label="Slug"><input value={form.slug} onChange={(event) => setForm((value) => ({ ...value, slug: event.target.value }))} className={inputClassName} placeholder="auto from title" /></Field><Field label="Category"><input value={form.category} onChange={(event) => setForm((value) => ({ ...value, category: event.target.value }))} className={inputClassName} /></Field><Field label="Price"><input value={form.price} onChange={(event) => setForm((value) => ({ ...value, price: event.target.value }))} className={inputClassName} /></Field><Field label="Duration"><input value={form.duration} onChange={(event) => setForm((value) => ({ ...value, duration: event.target.value }))} className={inputClassName} /></Field><Field label="Image path"><input value={form.image} onChange={(event) => setForm((value) => ({ ...value, image: event.target.value }))} className={inputClassName} placeholder="/images/..." /></Field><label className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm((value) => ({ ...value, isActive: event.target.checked }))} className="accent-emerald-700" />Active</label></div><Field label="Deliverables" className="mt-4"><input value={form.deliverables} onChange={(event) => setForm((value) => ({ ...value, deliverables: event.target.value }))} className={inputClassName} placeholder="Comma separated" /></Field><Field label="Description" className="mt-4"><textarea value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} className={`${inputClassName} min-h-32`} /></Field>{error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save service"}</button></div></form></ModalShell>;
}

function LeadDialog({ lead, onClose }: { lead: AdminConsultingLead; onClose: () => void }) { return <ModalShell title={lead.name} eyebrow="Consulting lead" onClose={onClose}><div className="grid gap-3 sm:grid-cols-2"><Detail label="Service" value={serviceName(lead)} /><Detail label="Status" value={label(lead.status)} /><Detail label="Email" value={lead.email} /><Detail label="Phone" value={lead.phone} /><Detail label="Business" value={lead.businessName || "Individual"} /></div><TextBlock label="Message" value={lead.message} />{lead.response ? <TextBlock label="Response" value={lead.response} /> : null}</ModalShell>; }
function ReviewDialog({ lead, response, setResponse, saving, onClose, onSave }: { lead: AdminConsultingLead; response: string; setResponse: (value: string) => void; saving: boolean; onClose: () => void; onSave: (status: ConsultingLeadStatus) => void }) { const [status, setStatus] = useState(lead.status); return <ModalShell title={`Respond to ${lead.name}`} eyebrow={serviceName(lead)} onClose={onClose}><label className="grid gap-2 text-sm font-semibold text-stone-700">Status<select value={status} onChange={(event) => setStatus(event.target.value as ConsultingLeadStatus)} className={inputClassName}>{leadStatuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label><label className="mt-4 grid gap-2 text-sm font-semibold text-stone-700">Response<textarea value={response} onChange={(event) => setResponse(event.target.value)} maxLength={5000} className={`${inputClassName} min-h-32`} /></label><div className="mt-6 flex justify-end gap-3"><button onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button onClick={() => onSave(status)} disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save response"}</button></div></ModalShell>; }
function ConfirmDialog({ title, text, saving, onCancel, onConfirm }: { title: string; text: string; saving: boolean; onCancel: () => void; onConfirm: () => void }) { return <ModalShell title={title} eyebrow="Workspace action" onClose={onCancel}><p className="text-sm leading-6 text-stone-600">{text}</p><div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button onClick={onConfirm} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Removing..." : "Remove"}</button></div></ModalShell>; }
function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/55 px-4 py-8"><section className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold">{title}</h2></div><button onClick={onClose} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">Close</button></div><div className="mt-6">{children}</div></section></div>; }
function Pager({ page, totalPages, loading, setPage }: { page: number; totalPages: number; loading: boolean; setPage: React.Dispatch<React.SetStateAction<number>> }) { return <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4 text-sm text-stone-500"><span>Page {page} of {totalPages}</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Previous</button><button disabled={page >= totalPages || loading} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Next</button></div></div>; }
function Field({ label: fieldLabel, className = "", children }: { label: string; className?: string; children: React.ReactNode }) { return <label className={`block space-y-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-500 ${className}`}>{fieldLabel}{children}</label>; }
function Detail({ label: detailLabel, value }: { label: string; value: string }) { return <div className="rounded-xl border border-stone-200 bg-stone-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{detailLabel}</p><p className="mt-1 break-words text-sm font-semibold text-stone-800">{value}</p></div>; }
function TextBlock({ label: blockLabel, value }: { label: string; value: string }) { return <div className="mt-4 rounded-xl border border-stone-200 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{blockLabel}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-700">{value}</p></div>; }
function StatusBadge({ status }: { status: string }) { const tone = status === "ACTIVE" || status === "WON" || status === "QUALIFIED" ? "bg-emerald-100 text-emerald-800" : status === "LOST" || status === "CLOSED" || status === "INACTIVE" ? "bg-red-50 text-red-700" : status === "PROPOSAL_SENT" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-800"; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{label(status)}</span>; }
function Loading({ text }: { text: string }) { return <div className="py-14 text-center text-sm font-medium text-stone-500">{text}</div>; }
function Empty({ text }: { text: string }) { return <div className="py-14 text-center"><p className="font-semibold text-stone-800">{text}</p><p className="mt-2 text-sm text-stone-500">Matching items will appear here.</p></div>; }
function tabButton(active: boolean) { return `rounded-lg px-4 py-2 text-sm font-semibold ${active ? "bg-emerald-700 text-white" : "border border-stone-200 bg-white text-stone-600"}`; }
function label(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function formatDate(value: string) { return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
function serviceName(lead: AdminConsultingLead) { return !lead.serviceId || typeof lead.serviceId === "string" ? "General request" : lead.serviceId.title; }
