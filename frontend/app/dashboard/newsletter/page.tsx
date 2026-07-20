"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminReplicaFrame,
  ReplicaDataCard,
  ReplicaStatCard,
} from "@/app/_components/admin-replica-dashboard";
import {
  deleteAdminNewsletterSubscriberAction,
  getAdminNewsletterSubscribersAction,
  updateAdminNewsletterSubscriberAction,
} from "@/lib/actions/admin-newsletter-subscriber-actions";
import type { AdminNewsletterSubscriber } from "@/lib/api/admin-newsletter-subscribers";

const pageSize = 10;

export default function DashboardNewsletterPage() {
  const [subscribers, setSubscribers] = useState<AdminNewsletterSubscriber[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0,
  });
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<boolean | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<AdminNewsletterSubscriber | null>(null);
  const [deleting, setDeleting] = useState<AdminNewsletterSubscriber | null>(null);
  const [savingId, setSavingId] = useState("");

  const loadSubscribers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminNewsletterSubscribersAction({
        page,
        limit: pageSize,
        search,
        active,
      });
      setSubscribers(response.data || []);
      setTotal(response.meta?.total || 0);
      setTotalPages(response.meta?.totalPages || 1);
      setSummary({
        total: response.meta?.summary?.total || 0,
        active: response.meta?.summary?.active || 0,
        inactive: response.meta?.summary?.inactive || 0,
        newThisMonth: response.meta?.summary?.newThisMonth || 0,
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load newsletter subscribers",
      );
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  }, [active, page, search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadSubscribers(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadSubscribers]);

  async function toggleActive(subscriber: AdminNewsletterSubscriber) {
    setSavingId(subscriber._id);
    setError("");
    setNotice("");

    try {
      await updateAdminNewsletterSubscriberAction(subscriber._id, {
        isActive: !subscriber.isActive,
      });
      setNotice(
        `${subscriber.email} ${subscriber.isActive ? "deactivated" : "activated"} successfully.`,
      );
      await loadSubscribers();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update subscriber",
      );
    } finally {
      setSavingId("");
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setSavingId(deleting._id);
    setError("");

    try {
      await deleteAdminNewsletterSubscriberAction(deleting._id);
      setNotice("Newsletter subscriber deleted successfully.");
      setDeleting(null);
      await loadSubscribers();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete subscriber",
      );
    } finally {
      setSavingId("");
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Newsletter Subscribers</h1>
          <p className="text-sm text-stone-500">Manage Pahuna travel update subscribers</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReplicaStatCard title="Total Subscribers" value={summary.total} subtitle="All signups" icon="NS" />
          <ReplicaStatCard title="Active Subscribers" value={summary.active} subtitle="Receiving updates" icon="AC" />
          <ReplicaStatCard title="Inactive Subscribers" value={summary.inactive} subtitle="Currently paused" icon="IN" />
          <ReplicaStatCard title="New This Month" value={summary.newThisMonth} subtitle="Recent signups" icon="NW" />
        </div>

        {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p> : null}
        {error ? <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => void loadSubscribers()} className="font-bold underline">Retry</button></div> : null}

        <ReplicaDataCard title="Subscriber records" description="Search, review, activate, deactivate, or delete" count={total}>
          <form className="mb-5 grid gap-3 lg:grid-cols-[1fr_190px_auto]" onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(query.trim()); }}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or email" className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500" />
            <select value={active === "" ? "" : String(active)} onChange={(event) => { setPage(1); setActive(event.target.value === "" ? "" : event.target.value === "true"); }} className="rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500">
              <option value="">All subscribers</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Search</button>
          </form>

          {loading ? (
            <div className="py-14 text-center text-sm font-medium text-stone-500">Loading newsletter subscribers...</div>
          ) : subscribers.length ? (
            <table className="w-full min-w-[900px] text-sm">
              <thead><tr className="border-b text-left text-stone-500"><th className="pb-3 pr-4 font-medium">Name</th><th className="pb-3 pr-4 font-medium">Email</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Subscribed</th><th className="pb-3 pr-4 font-medium">Unsubscribed</th><th className="pb-3 font-medium">Actions</th></tr></thead>
              <tbody>{subscribers.map((subscriber) => (
                <tr key={subscriber._id} className="border-b border-stone-100 align-top last:border-0">
                  <td className="py-4 pr-4 font-semibold text-stone-900">{subscriber.name || "Not provided"}</td>
                  <td className="py-4 pr-4 text-stone-600">{subscriber.email}</td>
                  <td className="py-4 pr-4"><StatusBadge active={subscriber.isActive} /></td>
                  <td className="py-4 pr-4 text-stone-500">{formatDate(subscriber.subscribedAt)}</td>
                  <td className="py-4 pr-4 text-stone-500">{subscriber.unsubscribedAt ? formatDate(subscriber.unsubscribedAt) : "—"}</td>
                  <td className="py-4"><div className="flex min-w-72 flex-wrap gap-2">
                    <button onClick={() => setSelected(subscriber)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold hover:bg-stone-50">View</button>
                    <button disabled={savingId === subscriber._id} onClick={() => void toggleActive(subscriber)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 disabled:opacity-50">{savingId === subscriber._id ? "Saving..." : subscriber.isActive ? "Deactivate" : "Activate"}</button>
                    <button onClick={() => setDeleting(subscriber)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Delete</button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          ) : (
            <div className="py-14 text-center"><p className="font-semibold text-stone-800">No newsletter subscribers found.</p><p className="mt-2 text-sm text-stone-500">Public newsletter signups will appear here.</p></div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4 text-sm text-stone-500"><span>Page {page} of {totalPages}</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Previous</button><button disabled={page >= totalPages || loading} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Next</button></div></div>
        </ReplicaDataCard>
      </div>

      {selected ? <SubscriberDialog subscriber={selected} onClose={() => setSelected(null)} /> : null}
      {deleting ? <DeleteDialog subscriber={deleting} saving={savingId === deleting._id} onClose={() => setDeleting(null)} onConfirm={() => void confirmDelete()} /> : null}
    </AdminReplicaFrame>
  );
}

function SubscriberDialog({ subscriber, onClose }: { subscriber: AdminNewsletterSubscriber; onClose: () => void }) { return <ModalShell title={subscriber.name || subscriber.email} eyebrow="Newsletter subscriber" onClose={onClose}><div className="grid gap-3 sm:grid-cols-2"><Detail label="Email" value={subscriber.email} /><Detail label="Status" value={subscriber.isActive ? "Active" : "Inactive"} /><Detail label="Subscribed" value={formatDate(subscriber.subscribedAt)} /><Detail label="Unsubscribed" value={subscriber.unsubscribedAt ? formatDate(subscriber.unsubscribedAt) : "Not unsubscribed"} /></div></ModalShell>; }
function DeleteDialog({ subscriber, saving, onClose, onConfirm }: { subscriber: AdminNewsletterSubscriber; saving: boolean; onClose: () => void; onConfirm: () => void }) { return <ModalShell title="Delete newsletter subscriber?" eyebrow="Permanent action" onClose={onClose}><p className="text-sm leading-6 text-stone-600">Delete <strong>{subscriber.email}</strong>? This cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button onClick={onConfirm} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Deleting..." : "Delete subscriber"}</button></div></ModalShell>; }
function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/55 px-4 py-8"><section className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold">{title}</h2></div><button onClick={onClose} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">Close</button></div><div className="mt-6">{children}</div></section></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-stone-200 bg-stone-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-stone-800">{value}</p></div>; }
function StatusBadge({ active }: { active: boolean }) { return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"}`}>{active ? "Active" : "Inactive"}</span>; }
function formatDate(value: string) { return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
