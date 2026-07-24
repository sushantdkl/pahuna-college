"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminReplicaFrame,
  ReplicaDataCard,
  ReplicaStatCard,
} from "@/app/_components/admin-replica-dashboard";
import {
  deleteAdminPartnerApplicationAction,
  getAdminPartnerApplicationsAction,
  updateAdminPartnerApplicationAction,
} from "@/lib/actions/admin-partner-application-actions";
import type { AdminPartnerApplication } from "@/lib/api/admin-partner-applications";
import type {
  PartnerApplicationStatus,
  PartnerType,
} from "@/schemas/partner-application.schema";

const pageSize = 10;
const statuses: Array<PartnerApplicationStatus | ""> = [
  "",
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
];
const types: Array<PartnerType | ""> = [
  "",
  "HOTEL",
  "RESORT",
  "RESTAURANT",
  "TRAVEL_AGENCY",
  "TRANSPORT",
  "OTHER",
];

export default function DashboardPartnersPage() {
  const [applications, setApplications] = useState<AdminPartnerApplication[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PartnerApplicationStatus | "">("");
  const [type, setType] = useState<PartnerType | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<AdminPartnerApplication | null>(null);
  const [reviewing, setReviewing] = useState<AdminPartnerApplication | null>(null);
  const [reviewStatus, setReviewStatus] = useState<PartnerApplicationStatus>("UNDER_REVIEW");
  const [deleting, setDeleting] = useState<AdminPartnerApplication | null>(null);
  const [savingId, setSavingId] = useState("");

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminPartnerApplicationsAction({
        page,
        limit: pageSize,
        search,
        status,
        type,
      });
      setApplications(response.data || []);
      setTotal(response.meta?.total || 0);
      setTotalPages(response.meta?.totalPages || 1);
      setSummary({
        total: response.meta?.summary?.total || 0,
        pending: response.meta?.summary?.pending || 0,
        approved: response.meta?.summary?.approved || 0,
        rejected: response.meta?.summary?.rejected || 0,
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load partner applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, type]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadApplications(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadApplications]);

  function openReview(application: AdminPartnerApplication, nextStatus?: PartnerApplicationStatus) {
    setReviewStatus(nextStatus || application.status);
    setReviewing(application);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setSavingId(deleting._id);
    setError("");
    try {
      await deleteAdminPartnerApplicationAction(deleting._id);
      setNotice("Partner application removed successfully.");
      setDeleting(null);
      await loadApplications();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to remove application");
    } finally {
      setSavingId("");
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Partner Applications</h1>
          <p className="text-sm text-stone-500">Review hotels, homestays, tour operators, and local service providers applying to Pahuna</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReplicaStatCard title="Total Applications" value={summary.total} subtitle="All submissions" icon="PA" />
          <ReplicaStatCard title="Pending" value={summary.pending} subtitle="Awaiting review" icon="PN" />
          <ReplicaStatCard title="Approved" value={summary.approved} subtitle="Accepted partners" icon="AP" />
          <ReplicaStatCard title="Rejected" value={summary.rejected} subtitle="Not approved" icon="RJ" />
        </div>

        {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p> : null}
        {error ? <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => void loadApplications()} className="font-bold underline">Retry</button></div> : null}

        <ReplicaDataCard title="Partner applications" description="Search, review, approve, reject, add notes, or archive" count={total}>
          <form className="mb-5 grid gap-3 xl:grid-cols-[1fr_180px_200px_auto]" onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(query.trim()); }}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search business, owner, email, phone, address, or website" className={inputClassName} />
            <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value as PartnerApplicationStatus | ""); }} className={inputClassName}>{statuses.map((value) => <option key={value || "ALL"} value={value}>{value ? formatLabel(value) : "All statuses"}</option>)}</select>
            <select value={type} onChange={(event) => { setPage(1); setType(event.target.value as PartnerType | ""); }} className={inputClassName}>{types.map((value) => <option key={value || "ALL"} value={value}>{value ? formatLabel(value) : "All partner types"}</option>)}</select>
            <button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Search</button>
          </form>

          {loading ? (
            <div className="py-14 text-center text-sm font-medium text-stone-500">Loading partner applications...</div>
          ) : applications.length ? (
            <table className="w-full min-w-[1120px] text-sm">
              <thead><tr className="border-b text-left text-stone-500"><th className="pb-3 pr-4 font-medium">Business</th><th className="pb-3 pr-4 font-medium">Partner Type</th><th className="pb-3 pr-4 font-medium">Owner</th><th className="pb-3 pr-4 font-medium">Email</th><th className="pb-3 pr-4 font-medium">Phone</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Submitted</th><th className="pb-3 font-medium">Actions</th></tr></thead>
              <tbody>{applications.map((application) => (
                <tr key={application._id} className="border-b border-stone-100 align-top last:border-0">
                  <td className="py-4 pr-4 font-semibold text-stone-900">{application.businessName}</td>
                  <td className="py-4 pr-4 text-stone-600">{formatLabel(application.partnerType)}</td>
                  <td className="py-4 pr-4 text-stone-600">{application.ownerName}</td>
                  <td className="py-4 pr-4 text-stone-600">{application.email}</td>
                  <td className="py-4 pr-4 text-stone-600">{application.phone}</td>
                  <td className="py-4 pr-4"><StatusBadge status={application.status} /></td>
                  <td className="py-4 pr-4 text-stone-500">{formatDate(application.createdAt)}</td>
                  <td className="py-4"><div className="flex min-w-[390px] flex-wrap gap-2">
                    <button onClick={() => setSelected(application)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold hover:bg-stone-50">View</button>
                    <button onClick={() => openReview(application, "APPROVED")} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">Approve</button>
                    <button onClick={() => openReview(application, "REJECTED")} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">Reject</button>
                    <button onClick={() => openReview(application)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold">Add notes</button>
                    <button onClick={() => setDeleting(application)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Archive</button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          ) : (
            <div className="py-14 text-center"><p className="font-semibold text-stone-800">No partner applications found.</p><p className="mt-2 text-sm text-stone-500">Public partner applications will appear here.</p></div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4 text-sm text-stone-500"><span>Page {page} of {totalPages}</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Previous</button><button disabled={page >= totalPages || loading} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Next</button></div></div>
        </ReplicaDataCard>
      </div>

      {selected ? <ApplicationDialog application={selected} onClose={() => setSelected(null)} /> : null}
      {reviewing ? <ReviewDialog application={reviewing} initialStatus={reviewStatus} onClose={() => setReviewing(null)} onSaved={async () => { setReviewing(null); setNotice("Partner review saved successfully."); await loadApplications(); }} /> : null}
      {deleting ? <DeleteDialog application={deleting} saving={savingId === deleting._id} onClose={() => setDeleting(null)} onConfirm={() => void confirmDelete()} /> : null}
    </AdminReplicaFrame>
  );
}

function ReviewDialog({ application, initialStatus, onClose, onSaved }: { application: AdminPartnerApplication; initialStatus: PartnerApplicationStatus; onClose: () => void; onSaved: () => Promise<void> }) {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(application.notes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  return <ModalShell title={`Review ${application.businessName}`} eyebrow={formatLabel(application.partnerType)} onClose={onClose}><form onSubmit={async (event) => { event.preventDefault(); setSaving(true); setError(""); try { await updateAdminPartnerApplicationAction(application._id, { status, notes: notes.trim() || undefined }); await onSaved(); } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Unable to save review"); } finally { setSaving(false); } }}><label className="grid gap-2 text-sm font-semibold text-stone-700">Review status<select value={status} onChange={(event) => setStatus(event.target.value as PartnerApplicationStatus)} className={inputClassName}>{statuses.filter(Boolean).map((value) => <option key={value} value={value}>{formatLabel(value)}</option>)}</select></label><label className="mt-4 grid gap-2 text-sm font-semibold text-stone-700">Admin notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={5000} className={`${inputClassName} min-h-36`} placeholder="Record review notes and follow-up details" /></label>{error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}<div className="mt-5 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving review..." : "Save review"}</button></div></form></ModalShell>;
}
function ApplicationDialog({ application, onClose }: { application: AdminPartnerApplication; onClose: () => void }) { return <ModalShell title={application.businessName} eyebrow={formatLabel(application.partnerType)} onClose={onClose}><div className="grid gap-3 sm:grid-cols-2"><Detail label="Owner" value={application.ownerName} /><Detail label="Status" value={formatLabel(application.status)} /><Detail label="Email" value={application.email} /><Detail label="Phone" value={application.phone} /><Detail label="Address" value={application.address || "Not provided"} /><Detail label="Website" value={application.website || "Not provided"} /><Detail label="Total rooms" value={application.totalRooms === undefined ? "Not applicable" : String(application.totalRooms)} /><Detail label="Existing online" value={application.existingOnline ? "Yes" : "No"} /></div>{application.challenges ? <TextBlock label="Challenges" value={application.challenges} /> : null}{application.goals ? <TextBlock label="Goals" value={application.goals} /> : null}{application.notes ? <TextBlock label="Admin notes" value={application.notes} /> : null}</ModalShell>; }
function DeleteDialog({ application, saving, onClose, onConfirm }: { application: AdminPartnerApplication; saving: boolean; onClose: () => void; onConfirm: () => void }) { return <ModalShell title="Remove partner application?" eyebrow="Workspace action" onClose={onClose}><p className="text-sm leading-6 text-stone-600">Remove <strong>{application.businessName}</strong>? This item will be removed from the workspace.</p><div className="mt-6 flex justify-end gap-3"><button onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button onClick={onConfirm} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Removing..." : "Remove application"}</button></div></ModalShell>; }
function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/55 px-4 py-8"><section className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold">{title}</h2></div><button onClick={onClose} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">Close</button></div><div className="mt-6">{children}</div></section></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-stone-200 bg-stone-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-stone-800">{value}</p></div>; }
function TextBlock({ label, value }: { label: string; value: string }) { return <div className="mt-4 rounded-xl border border-stone-200 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-700">{value}</p></div>; }
function StatusBadge({ status }: { status: PartnerApplicationStatus }) { const tone = status === "APPROVED" ? "bg-emerald-100 text-emerald-800" : status === "REJECTED" ? "bg-red-100 text-red-700" : status === "UNDER_REVIEW" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-800"; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{formatLabel(status)}</span>; }
function formatLabel(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function formatDate(value: string) { return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
