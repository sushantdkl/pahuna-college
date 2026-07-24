"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminReplicaFrame,
  ReplicaDataCard,
  ReplicaStatCard,
} from "@/app/_components/admin-replica-dashboard";
import {
  deleteAdminInquiryAction,
  getAdminInquiriesAction,
  updateAdminInquiryAction,
} from "@/lib/actions/admin-inquiry-actions";
import type { AdminInquiry } from "@/lib/api/admin-inquiries";
import type {
  InquiryKind,
  InquiryStatus,
} from "@/schemas/inquiry.schema";

const pageSize = 10;
const statuses: Array<InquiryStatus | ""> = [
  "",
  "NEW",
  "IN_PROGRESS",
  "RESPONDED",
  "CLOSED",
];
const inquiryTypes: Array<InquiryKind | ""> = [
  "",
  "HOTEL",
  "AVAILABILITY",
  "BOOKING",
  "RESERVATION",
  "TRAVEL_SUPPORT",
  "GENERAL",
];

export default function DashboardLeadsPage() {
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({
    total: 0,
    new: 0,
    responded: 0,
    closed: 0,
  });
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InquiryStatus | "">("");
  const [inquiryType, setInquiryType] = useState<InquiryKind | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<AdminInquiry | null>(null);
  const [responding, setResponding] = useState<AdminInquiry | null>(null);
  const [deleting, setDeleting] = useState<AdminInquiry | null>(null);
  const [savingId, setSavingId] = useState("");

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminInquiriesAction({
        page,
        limit: pageSize,
        search,
        status,
        inquiryType,
      });
      setInquiries(response.data || []);
      setTotal(response.meta?.total || 0);
      setTotalPages(response.meta?.totalPages || 1);
      setSummary({
        total: response.meta?.summary?.total || 0,
        new: response.meta?.summary?.new || 0,
        responded: response.meta?.summary?.responded || 0,
        closed: response.meta?.summary?.closed || 0,
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load inquiries",
      );
    } finally {
      setLoading(false);
    }
  }, [inquiryType, page, search, status]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadInquiries();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadInquiries]);

  const updateStatus = async (inquiry: AdminInquiry, next: InquiryStatus) => {
    setSavingId(inquiry._id);
    setNotice("");
    setError("");

    try {
      await updateAdminInquiryAction(inquiry._id, { status: next });
      setNotice(`Inquiry marked ${formatLabel(next).toLowerCase()}.`);
      await loadInquiries();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update inquiry",
      );
    } finally {
      setSavingId("");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setSavingId(deleting._id);
    setError("");

    try {
      await deleteAdminInquiryAction(deleting._id);
      setNotice("Inquiry removed successfully.");
      setDeleting(null);
      await loadInquiries();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to remove inquiry",
      );
    } finally {
      setSavingId("");
    }
  };

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads &amp; Inquiries</h1>
          <p className="text-sm text-stone-500">
            Hotel inquiries, callback requests, and travel support requests
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReplicaStatCard title="Total Inquiries" value={summary.total} subtitle="All traveler requests" icon="LD" />
          <ReplicaStatCard title="New Inquiries" value={summary.new} subtitle="Awaiting review" icon="NW" />
          <ReplicaStatCard title="Responded" value={summary.responded} subtitle="Response sent" icon="RP" />
          <ReplicaStatCard title="Closed" value={summary.closed} subtitle="Completed" icon="CL" />
        </div>

        {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p> : null}
        {error ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={() => void loadInquiries()} className="font-bold underline">Retry</button>
          </div>
        ) : null}

        <ReplicaDataCard title="Traveler inquiries" description="Search, filter, respond, update status, or archive requests" count={total}>
          <form
            className="mb-5 grid gap-3 lg:grid-cols-[1fr_190px_190px_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              setSearch(query.trim());
            }}
          >
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, message, user, hotel, type, or status" className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500" />
            <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value as InquiryStatus | ""); }} className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500">
              {statuses.map((value) => <option key={value || "ALL"} value={value}>{value ? formatLabel(value) : "All statuses"}</option>)}
            </select>
            <select value={inquiryType} onChange={(event) => { setPage(1); setInquiryType(event.target.value as InquiryKind | ""); }} className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500">
              {inquiryTypes.map((value) => <option key={value || "ALL"} value={value}>{value ? formatLabel(value) : "All types"}</option>)}
            </select>
            <button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Search</button>
          </form>

          {loading ? (
            <div className="py-14 text-center text-sm font-medium text-stone-500">Loading inquiries...</div>
          ) : inquiries.length ? (
            <table className="min-w-[980px] w-full text-sm">
              <thead><tr className="border-b text-left text-stone-500"><th className="pb-3 pr-4 font-medium">Title</th><th className="pb-3 pr-4 font-medium">User</th><th className="pb-3 pr-4 font-medium">Related listing</th><th className="pb-3 pr-4 font-medium">Type</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Created</th><th className="pb-3 font-medium">Actions</th></tr></thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="border-b border-stone-100 align-top last:border-0">
                    <td className="py-4 pr-4"><p className="font-semibold text-stone-900">{inquiry.title}</p><p className="mt-1 max-w-52 truncate text-xs text-stone-500">{inquiry.message}</p></td>
                    <td className="py-4 pr-4"><p className="font-medium">{customerName(inquiry)}</p><p className="text-xs text-stone-500">{inquiry.userId?.email || "Account unavailable"}</p></td>
                    <td className="py-4 pr-4 text-stone-600">{relationLabel(inquiry)}</td>
                    <td className="py-4 pr-4 text-stone-600">{formatLabel(inquiry.inquiryType)}</td>
                    <td className="py-4 pr-4"><StatusBadge status={inquiry.status} /></td>
                    <td className="py-4 pr-4 text-stone-500">{formatDate(inquiry.createdAt)}</td>
                    <td className="py-4">
                      <div className="flex min-w-72 flex-wrap gap-2">
                        <button onClick={() => setSelected(inquiry)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold hover:bg-stone-50">View</button>
                        <button onClick={() => setResponding(inquiry)} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800">Respond</button>
                        <select aria-label={`Update ${inquiry.title} status`} value={inquiry.status} disabled={savingId === inquiry._id} onChange={(event) => void updateStatus(inquiry, event.target.value as InquiryStatus)} className="rounded-lg border border-stone-200 px-2 py-2 text-xs disabled:opacity-60">
                          {statuses.filter(Boolean).map((value) => <option key={value} value={value}>{formatLabel(value)}</option>)}
                        </select>
                        <button onClick={() => setDeleting(inquiry)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Archive</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-14 text-center"><p className="font-semibold text-stone-800">No inquiries found.</p><p className="mt-2 text-sm text-stone-500">New hotel and travel inquiries will appear here.</p></div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4 text-sm text-stone-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Previous</button><button disabled={page >= totalPages || loading} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Next</button></div>
          </div>
        </ReplicaDataCard>
      </div>

      {selected ? <InquiryDetailDialog inquiry={selected} onClose={() => setSelected(null)} /> : null}
      {responding ? <RespondDialog inquiry={responding} onClose={() => setResponding(null)} onSaved={async () => { setResponding(null); setNotice("Response saved and inquiry marked responded."); await loadInquiries(); }} /> : null}
      {deleting ? <ConfirmDeleteDialog inquiry={deleting} saving={savingId === deleting._id} onCancel={() => setDeleting(null)} onConfirm={() => void confirmDelete()} /> : null}
    </AdminReplicaFrame>
  );
}

function InquiryDetailDialog({ inquiry, onClose }: { inquiry: AdminInquiry; onClose: () => void }) {
  return <ModalShell title={inquiry.title} eyebrow={formatLabel(inquiry.inquiryType)} onClose={onClose}><div className="grid gap-3 sm:grid-cols-2"><Detail label="Customer" value={`${customerName(inquiry)} (${inquiry.userId?.email || "Account unavailable"})`} /><Detail label="Related listing" value={relationLabel(inquiry)} /><Detail label="Status" value={formatLabel(inquiry.status)} /><Detail label="Created" value={formatDate(inquiry.createdAt)} /></div><MessageBlock label="Customer message" value={inquiry.message} />{inquiry.response ? <MessageBlock label="Admin response" value={inquiry.response} /> : null}</ModalShell>;
}

function RespondDialog({ inquiry, onClose, onSaved }: { inquiry: AdminInquiry; onClose: () => void; onSaved: () => Promise<void> }) {
  const [response, setResponse] = useState(inquiry.response || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  return <ModalShell title={`Respond to ${customerName(inquiry)}`} eyebrow={inquiry.title} onClose={onClose}><MessageBlock label="Customer message" value={inquiry.message} /><form className="mt-5" onSubmit={async (event) => { event.preventDefault(); if (!response.trim()) { setError("Response is required"); return; } setSaving(true); setError(""); try { await updateAdminInquiryAction(inquiry._id, { response: response.trim(), status: "RESPONDED" }); await onSaved(); } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Unable to save response"); } finally { setSaving(false); } }}><label className="text-sm font-semibold text-stone-700">Response<textarea value={response} onChange={(event) => setResponse(event.target.value)} className="mt-2 min-h-36 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" placeholder="Write a helpful response" /></label>{error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}<div className="mt-5 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Send response"}</button></div></form></ModalShell>;
}

function ConfirmDeleteDialog({ inquiry, saving, onCancel, onConfirm }: { inquiry: AdminInquiry; saving: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <ModalShell title="Remove inquiry?" eyebrow="Workspace action" onClose={onCancel}><p className="text-sm leading-6 text-stone-600">Remove <strong>{inquiry.title}</strong> from {customerName(inquiry)}? This item will be removed from the workspace.</p><div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button onClick={onConfirm} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Removing..." : "Remove inquiry"}</button></div></ModalShell>;
}

function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/55 px-4 py-8"><section className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold">{title}</h2></div><button onClick={onClose} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">Close</button></div><div className="mt-6">{children}</div></section></div>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-stone-200 bg-stone-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-1 text-sm font-semibold text-stone-800">{value}</p></div>; }
function MessageBlock({ label, value }: { label: string; value: string }) { return <div className="mt-4 rounded-xl border border-stone-200 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-700">{value}</p></div>; }
function StatusBadge({ status }: { status: InquiryStatus }) { const tone = status === "NEW" ? "bg-amber-100 text-amber-800" : status === "CLOSED" ? "bg-stone-100 text-stone-600" : "bg-emerald-50 text-emerald-700"; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{formatLabel(status)}</span>; }
function customerName(inquiry: AdminInquiry) { return inquiry.userId?.fullName || "Unavailable user"; }
function relationLabel(inquiry: AdminInquiry) {
  if (inquiry.tripPackageId?.title) return inquiry.tripPackageId.title;
  if (inquiry.hotelId?.name) return inquiry.hotelId.name;
  if (!["HOTEL", "AVAILABILITY", "BOOKING", "RESERVATION"].includes(inquiry.inquiryType)) return "General";
  const titleMatch = inquiry.title.match(/(?:availability|booking|reservation) for (.+)$/i);
  return titleMatch?.[1] || "Hotel inquiry";
}
function formatLabel(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function formatDate(value: string) { return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
