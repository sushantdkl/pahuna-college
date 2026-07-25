// @ts-nocheck
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminReplicaFrame } from "@/components/dashboard/dashboard-shell";
import { ReplicaDataCard, ReplicaStatusBadge } from "@/components/dashboard/data-table-card";
import { ReplicaStatCard } from "@/components/dashboard/stat-card";
import {
  getAdminTrainingCoursesAction,
  getAdminTrainingEnrollmentsAction,
  updateAdminTrainingEnrollmentAction,
} from "@/lib/actions/admin-training-actions";

const statuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function DashboardTrainingPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [enrollmentResult, courseResult] = await Promise.all([
        getAdminTrainingEnrollmentsAction({ page: 1, limit: 50 }),
        getAdminTrainingCoursesAction({ page: 1, limit: 50 }),
      ]);
      setEnrollments(enrollmentResult.data || []);
      setCourses(courseResult.data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load training records");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const summary = useMemo(() => ({
    courses: courses.length,
    enrollments: enrollments.length,
    pending: enrollments.filter((item) => item.status === "PENDING").length,
    confirmed: enrollments.filter((item) => item.status === "CONFIRMED").length,
  }), [courses, enrollments]);

  async function updateEnrollment(id, payload) {
    setSaving(true);
    setError("");
    try {
      await updateAdminTrainingEnrollmentAction(id, payload);
      await load();
      setSelected((current) => current ? { ...current, ...payload } : current);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update enrollment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Training</h1>
          <p className="text-sm text-stone-500">Manage active courses and review complete enrollment submissions.</p>
        </div>
        {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReplicaStatCard title="Courses" value={summary.courses} subtitle="Training course records" icon="CR" />
          <ReplicaStatCard title="Enrollments" value={summary.enrollments} subtitle="Submitted forms" icon="EN" />
          <ReplicaStatCard title="Pending" value={summary.pending} subtitle="Need review" icon="PN" />
          <ReplicaStatCard title="Confirmed" value={summary.confirmed} subtitle="Accepted students" icon="OK" />
        </div>
        <ReplicaDataCard title="Training enrollments" description="Every visible field from the locked public form is shown here" count={enrollments.length}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-medium text-stone-500">Student</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Course</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Phone</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Status</th>
                <th className="pb-2 pr-4 font-medium text-stone-500">Open</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((item) => (
                <tr key={item._id} className="border-b last:border-0">
                  <td className="py-3 pr-4"><p className="font-semibold text-stone-900">{item.fullName || item.name}</p><p className="text-stone-500">{item.email}</p></td>
                  <td className="py-3 pr-4 text-stone-600">{typeof item.courseId === "object" ? item.courseId.title : item.courseId}</td>
                  <td className="py-3 pr-4 text-stone-600">{item.phone}</td>
                  <td className="py-3 pr-4"><ReplicaStatusBadge>{item.status}</ReplicaStatusBadge></td>
                  <td className="py-3 pr-4"><button onClick={() => { setSelected(item); setResponse(item.response || ""); }} className="font-semibold text-emerald-700 hover:text-emerald-900">Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReplicaDataCard>
      </div>
      {selected ? (
        <DetailPanel title={selected.fullName || selected.name} onClose={() => setSelected(null)}>
          <Detail label="Course" value={typeof selected.courseId === "object" ? selected.courseId.title : selected.courseId} />
          <Detail label="Email" value={selected.email} />
          <Detail label="Phone" value={selected.phone} />
          <Detail label="Age" value={selected.age} />
          <Detail label="Education Level" value={selected.educationLevel || selected.education} />
          <Detail label="Prior Hospitality Experience" value={selected.priorExperience || selected.experience} />
          <Detail label="Motivation" value={selected.motivation || selected.message} block />
          <label className="mt-4 block text-sm font-semibold text-stone-700">Status</label>
          <select value={selected.status} onChange={(event) => updateEnrollment(selected._id, { status: event.target.value })} disabled={saving} className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm">
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <label className="mt-4 block text-sm font-semibold text-stone-700">Admin response</label>
          <textarea value={response} onChange={(event) => setResponse(event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" />
          <button disabled={saving} onClick={() => updateEnrollment(selected._id, { response })} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Save response</button>
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
