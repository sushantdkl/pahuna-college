"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminReplicaFrame,
  ReplicaDataCard,
  ReplicaStatCard,
} from "@/components/admin-replica-dashboard";
import {
  createAdminTrainingCourseAction,
  deleteAdminTrainingCourseAction,
  deleteAdminTrainingEnrollmentAction,
  getAdminTrainingCoursesAction,
  getAdminTrainingEnrollmentsAction,
  updateAdminTrainingCourseAction,
  updateAdminTrainingEnrollmentAction,
} from "@/lib/actions/admin-training-actions";
import type {
  AdminTrainingCourse,
  AdminTrainingEnrollment,
} from "@/lib/api/admin-training";
import {
  trainingCourseFormSchema,
  type TrainingCourseFormData,
  type TrainingCourseStatus,
  type TrainingEnrollmentStatus,
} from "@/schemas/training.schema";

type CourseFormState = {
  title: string;
  slug: string;
  description: string;
  category: string;
  duration: string;
  price: string;
  level: string;
  mode: string;
  location: string;
  startDate: string;
  endDate: string;
  maxParticipants: string;
  image: string;
  status: TrainingCourseStatus;
  isActive: boolean;
};

const emptyCourseForm: CourseFormState = {
  title: "",
  slug: "",
  description: "",
  category: "",
  duration: "",
  price: "",
  level: "",
  mode: "",
  location: "",
  startDate: "",
  endDate: "",
  maxParticipants: "",
  image: "",
  status: "DRAFT",
  isActive: true,
};

const courseStatuses: TrainingCourseStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const enrollmentStatuses: TrainingEnrollmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DashboardTrainingPage() {
  const [tab, setTab] = useState<"courses" | "enrollments">("courses");
  const [courses, setCourses] = useState<AdminTrainingCourse[]>([]);
  const [enrollments, setEnrollments] = useState<AdminTrainingEnrollment[]>([]);
  const [coursePage, setCoursePage] = useState(1);
  const [enrollmentPage, setEnrollmentPage] = useState(1);
  const [courseMeta, setCourseMeta] = useState({ total: 0, totalPages: 1 });
  const [enrollmentMeta, setEnrollmentMeta] = useState({ total: 0, totalPages: 1 });
  const [summary, setSummary] = useState({ totalCourses: 0, activeCourses: 0, totalEnrollments: 0, pendingEnrollments: 0 });
  const [courseSearchInput, setCourseSearchInput] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [courseStatus, setCourseStatus] = useState<TrainingCourseStatus | "">("");
  const [activeFilter, setActiveFilter] = useState<"" | "true" | "false">("");
  const [enrollmentSearchInput, setEnrollmentSearchInput] = useState("");
  const [enrollmentSearch, setEnrollmentSearch] = useState("");
  const [enrollmentStatus, setEnrollmentStatus] = useState<TrainingEnrollmentStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingCourse, setEditingCourse] = useState<AdminTrainingCourse | "create" | null>(null);
  const [courseForm, setCourseForm] = useState<CourseFormState>(emptyCourseForm);
  const [formError, setFormError] = useState("");
  const [viewingEnrollment, setViewingEnrollment] = useState<AdminTrainingEnrollment | null>(null);
  const [reviewingEnrollment, setReviewingEnrollment] = useState<AdminTrainingEnrollment | null>(null);
  const [responseText, setResponseText] = useState("");
  const [deletingCourse, setDeletingCourse] = useState<AdminTrainingCourse | null>(null);
  const [deletingEnrollment, setDeletingEnrollment] = useState<AdminTrainingEnrollment | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState("");

  const loadCourses = useCallback(async () => {
    const response = await getAdminTrainingCoursesAction({
      page: coursePage,
      limit: 10,
      search: courseSearch,
      status: courseStatus,
      active: activeFilter === "" ? "" : activeFilter === "true",
    });
    setCourses(response.data || []);
    setCourseMeta({
      total: response.meta?.total || 0,
      totalPages: response.meta?.totalPages || 1,
    });
    setSummary({
      totalCourses: response.meta?.summary?.totalCourses || 0,
      activeCourses: response.meta?.summary?.activeCourses || 0,
      totalEnrollments: response.meta?.summary?.totalEnrollments || 0,
      pendingEnrollments: response.meta?.summary?.pendingEnrollments || 0,
    });
  }, [activeFilter, coursePage, courseSearch, courseStatus]);

  const loadEnrollments = useCallback(async () => {
    const response = await getAdminTrainingEnrollmentsAction({
      page: enrollmentPage,
      limit: 10,
      search: enrollmentSearch,
      status: enrollmentStatus,
    });
    setEnrollments(response.data || []);
    setEnrollmentMeta({
      total: response.meta?.total || 0,
      totalPages: response.meta?.totalPages || 1,
    });
  }, [enrollmentPage, enrollmentSearch, enrollmentStatus]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([loadCourses(), loadEnrollments()]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load training workspace");
    } finally {
      setLoading(false);
    }
  }, [loadCourses, loadEnrollments]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadAll(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadAll]);

  function openCreate() {
    setCourseForm(emptyCourseForm);
    setFormError("");
    setEditingCourse("create");
  }

  function openEdit(course: AdminTrainingCourse) {
    setCourseForm({
      title: course.title,
      slug: course.slug,
      description: course.description,
      category: course.category || "",
      duration: course.duration || "",
      price: course.price?.toString() || "",
      level: course.level || "",
      mode: course.mode || "",
      location: course.location || "",
      startDate: dateInput(course.startDate),
      endDate: dateInput(course.endDate),
      maxParticipants: course.maxParticipants?.toString() || "",
      image: course.image || "",
      status: course.status,
      isActive: course.isActive,
    });
    setFormError("");
    setEditingCourse(course);
  }

  function coursePayload(): TrainingCourseFormData {
    return {
      ...courseForm,
      slug: courseForm.slug || undefined,
      category: courseForm.category || undefined,
      duration: courseForm.duration || undefined,
      price: courseForm.price ? Number(courseForm.price) : undefined,
      level: courseForm.level || undefined,
      mode: courseForm.mode || undefined,
      location: courseForm.location || undefined,
      startDate: courseForm.startDate || undefined,
      endDate: courseForm.endDate || undefined,
      maxParticipants: courseForm.maxParticipants ? Number(courseForm.maxParticipants) : undefined,
      image: courseForm.image || undefined,
    };
  }

  async function saveCourse(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const parsed = trainingCourseFormSchema.safeParse(coursePayload());
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || "Please check the course form");
      return;
    }

    setSaving(true);
    try {
      if (editingCourse === "create") {
        await createAdminTrainingCourseAction(parsed.data);
        setNotice("Training course created successfully.");
      } else if (editingCourse) {
        await updateAdminTrainingCourseAction(editingCourse._id, parsed.data);
        setNotice("Training course updated successfully.");
      }
      setEditingCourse(null);
      await loadAll();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Unable to save course");
    } finally {
      setSaving(false);
    }
  }

  async function quickCourse(course: AdminTrainingCourse, payload: Partial<TrainingCourseFormData>) {
    setSavingId(course._id);
    setError("");
    try {
      await updateAdminTrainingCourseAction(course._id, payload);
      setNotice("Training course updated.");
      await loadAll();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update course");
    } finally {
      setSavingId("");
    }
  }

  async function quickEnrollment(enrollment: AdminTrainingEnrollment, status: TrainingEnrollmentStatus, response?: string) {
    setSavingId(enrollment._id);
    setError("");
    try {
      await updateAdminTrainingEnrollmentAction(enrollment._id, { status, response });
      setNotice("Training enrollment updated.");
      setReviewingEnrollment(null);
      await loadAll();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update enrollment");
    } finally {
      setSavingId("");
    }
  }

  async function confirmDelete() {
    setSaving(true);
    try {
      if (deletingCourse) {
        await deleteAdminTrainingCourseAction(deletingCourse._id);
        setDeletingCourse(null);
      }
      if (deletingEnrollment) {
        await deleteAdminTrainingEnrollmentAction(deletingEnrollment._id);
        setDeletingEnrollment(null);
      }
      setNotice("Training item removed successfully.");
      await loadAll();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to remove training item");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Training Management</h1>
            <p className="text-sm text-stone-500">Manage public courses and provider enrollment requests</p>
          </div>
          <button onClick={openCreate} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">New Course</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReplicaStatCard title="Total Courses" value={summary.totalCourses} subtitle="All course offerings" icon="TC" />
          <ReplicaStatCard title="Active Courses" value={summary.activeCourses} subtitle="Published and visible" icon="AC" />
          <ReplicaStatCard title="Total Enrollments" value={summary.totalEnrollments} subtitle="All submissions" icon="TE" />
          <ReplicaStatCard title="Pending Enrollments" value={summary.pendingEnrollments} subtitle="Need review" icon="PE" />
        </div>

        {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p> : null}
        {error ? <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => void loadAll()} className="font-bold underline">Retry</button></div> : null}

        <div className="flex gap-2">
          <button onClick={() => setTab("courses")} className={tabButton(tab === "courses")}>Courses</button>
          <button onClick={() => setTab("enrollments")} className={tabButton(tab === "enrollments")}>Enrollments</button>
        </div>

        {tab === "courses" ? (
          <ReplicaDataCard title="Course offerings" description="Create, refine, publish, archive, or pause programs" count={courseMeta.total}>
            <form onSubmit={(event) => { event.preventDefault(); setCoursePage(1); setCourseSearch(courseSearchInput.trim()); }} className="mb-5 grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
              <input value={courseSearchInput} onChange={(event) => setCourseSearchInput(event.target.value)} placeholder="Search title, category, duration, mode, location" className={inputClassName} />
              <select value={courseStatus} onChange={(event) => { setCoursePage(1); setCourseStatus(event.target.value as TrainingCourseStatus | ""); }} className={inputClassName}><option value="">All statuses</option>{courseStatuses.map((status) => <option key={status} value={status}>{label(status)}</option>)}</select>
              <select value={activeFilter} onChange={(event) => { setCoursePage(1); setActiveFilter(event.target.value as "" | "true" | "false"); }} className={inputClassName}><option value="">Active and inactive</option><option value="true">Active</option><option value="false">Inactive</option></select>
              <button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">Search</button>
            </form>
            {loading ? <Loading text="Loading training courses..." /> : courses.length ? <CourseTable courses={courses} savingId={savingId} onEdit={openEdit} onToggle={(course) => void quickCourse(course, { isActive: !course.isActive })} onPublish={(course) => void quickCourse(course, { status: course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" })} onDelete={setDeletingCourse} /> : <Empty text="No training courses found." />}
            <Pager page={coursePage} totalPages={courseMeta.totalPages} loading={loading} setPage={setCoursePage} />
          </ReplicaDataCard>
        ) : (
          <ReplicaDataCard title="Student enrollments" description="Review, respond, update status, or archive applications" count={enrollmentMeta.total}>
            <form onSubmit={(event) => { event.preventDefault(); setEnrollmentPage(1); setEnrollmentSearch(enrollmentSearchInput.trim()); }} className="mb-5 grid gap-3 lg:grid-cols-[1fr_180px_auto]">
              <input value={enrollmentSearchInput} onChange={(event) => setEnrollmentSearchInput(event.target.value)} placeholder="Search student, email, phone, message, response" className={inputClassName} />
              <select value={enrollmentStatus} onChange={(event) => { setEnrollmentPage(1); setEnrollmentStatus(event.target.value as TrainingEnrollmentStatus | ""); }} className={inputClassName}><option value="">All statuses</option>{enrollmentStatuses.map((status) => <option key={status} value={status}>{label(status)}</option>)}</select>
              <button type="submit" className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">Search</button>
            </form>
            {loading ? <Loading text="Loading enrollments..." /> : enrollments.length ? <EnrollmentTable enrollments={enrollments} savingId={savingId} onView={setViewingEnrollment} onReview={(enrollment) => { setResponseText(enrollment.response || ""); setReviewingEnrollment(enrollment); }} onStatus={(enrollment, status) => void quickEnrollment(enrollment, status, enrollment.response)} onDelete={setDeletingEnrollment} /> : <Empty text="No training enrollments found." />}
            <Pager page={enrollmentPage} totalPages={enrollmentMeta.totalPages} loading={loading} setPage={setEnrollmentPage} />
          </ReplicaDataCard>
        )}
      </div>

      {editingCourse ? <CourseDialog mode={editingCourse === "create" ? "create" : "edit"} form={courseForm} setForm={setCourseForm} error={formError} saving={saving} onClose={() => setEditingCourse(null)} onSubmit={saveCourse} /> : null}
      {viewingEnrollment ? <EnrollmentDialog enrollment={viewingEnrollment} onClose={() => setViewingEnrollment(null)} /> : null}
      {reviewingEnrollment ? <ReviewDialog enrollment={reviewingEnrollment} response={responseText} setResponse={setResponseText} saving={savingId === reviewingEnrollment._id} onClose={() => setReviewingEnrollment(null)} onSave={(status) => void quickEnrollment(reviewingEnrollment, status, responseText.trim() || undefined)} /> : null}
      {deletingCourse || deletingEnrollment ? <ConfirmDialog title="Remove training item?" text="This item will be removed from the workspace." saving={saving} onCancel={() => { setDeletingCourse(null); setDeletingEnrollment(null); }} onConfirm={() => void confirmDelete()} /> : null}
    </AdminReplicaFrame>
  );
}

function CourseTable({ courses, savingId, onEdit, onToggle, onPublish, onDelete }: { courses: AdminTrainingCourse[]; savingId: string; onEdit: (course: AdminTrainingCourse) => void; onToggle: (course: AdminTrainingCourse) => void; onPublish: (course: AdminTrainingCourse) => void; onDelete: (course: AdminTrainingCourse) => void }) {
  return <table className="w-full min-w-[1080px] text-sm"><thead><tr className="border-b text-left text-stone-500"><th className="pb-3 pr-4 font-medium">Title</th><th className="pb-3 pr-4 font-medium">Category</th><th className="pb-3 pr-4 font-medium">Duration</th><th className="pb-3 pr-4 font-medium">Price</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Start Date</th><th className="pb-3 font-medium">Actions</th></tr></thead><tbody>{courses.map((course) => <tr key={course._id} className="border-b border-stone-100 align-top last:border-0"><td className="py-4 pr-4"><p className="font-semibold text-stone-900">{course.title}</p><p className="mt-1 max-w-48 truncate text-xs text-stone-500">{course.description}</p></td><td className="py-4 pr-4 text-stone-600">{course.category || "General"}</td><td className="py-4 pr-4 text-stone-600">{course.duration || "Flexible"}</td><td className="py-4 pr-4 text-stone-600">{course.price !== undefined ? `NPR ${course.price.toLocaleString()}` : "Contact"}</td><td className="py-4 pr-4"><StatusBadge status={course.isActive ? course.status : "INACTIVE"} /></td><td className="py-4 pr-4 text-stone-500">{course.startDate ? formatDate(course.startDate) : "Not set"}</td><td className="py-4"><div className="flex min-w-[360px] flex-wrap gap-2"><button onClick={() => onEdit(course)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold">Edit</button><button disabled={savingId === course._id} onClick={() => onPublish(course)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 disabled:opacity-50">{course.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button><button disabled={savingId === course._id} onClick={() => onToggle(course)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold disabled:opacity-50">{course.isActive ? "Deactivate" : "Activate"}</button><button onClick={() => onDelete(course)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Archive</button></div></td></tr>)}</tbody></table>;
}

function EnrollmentTable({ enrollments, savingId, onView, onReview, onStatus, onDelete }: { enrollments: AdminTrainingEnrollment[]; savingId: string; onView: (enrollment: AdminTrainingEnrollment) => void; onReview: (enrollment: AdminTrainingEnrollment) => void; onStatus: (enrollment: AdminTrainingEnrollment, status: TrainingEnrollmentStatus) => void; onDelete: (enrollment: AdminTrainingEnrollment) => void }) {
  return <table className="w-full min-w-[1080px] text-sm"><thead><tr className="border-b text-left text-stone-500"><th className="pb-3 pr-4 font-medium">Student/Provider</th><th className="pb-3 pr-4 font-medium">Course</th><th className="pb-3 pr-4 font-medium">Email</th><th className="pb-3 pr-4 font-medium">Phone</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Enrolled</th><th className="pb-3 font-medium">Actions</th></tr></thead><tbody>{enrollments.map((enrollment) => <tr key={enrollment._id} className="border-b border-stone-100 align-top last:border-0"><td className="py-4 pr-4 font-semibold text-stone-900">{enrollment.name}</td><td className="py-4 pr-4 text-stone-600">{courseName(enrollment)}</td><td className="py-4 pr-4 text-stone-600">{enrollment.email}</td><td className="py-4 pr-4 text-stone-600">{enrollment.phone}</td><td className="py-4 pr-4"><StatusBadge status={enrollment.status} /></td><td className="py-4 pr-4 text-stone-500">{formatDate(enrollment.createdAt)}</td><td className="py-4"><div className="flex min-w-[390px] flex-wrap gap-2"><button onClick={() => onView(enrollment)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold">View</button><button onClick={() => onReview(enrollment)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">Respond</button><select disabled={savingId === enrollment._id} value={enrollment.status} onChange={(event) => onStatus(enrollment, event.target.value as TrainingEnrollmentStatus)} className="rounded-lg border border-stone-200 px-2 py-2 text-xs">{enrollmentStatuses.map((status) => <option key={status} value={status}>{label(status)}</option>)}</select><button onClick={() => onDelete(enrollment)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Archive</button></div></td></tr>)}</tbody></table>;
}

function CourseDialog({ mode, form, setForm, error, saving, onClose, onSubmit }: { mode: "create" | "edit"; form: CourseFormState; setForm: React.Dispatch<React.SetStateAction<CourseFormState>>; error: string; saving: boolean; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  return <ModalShell title={mode === "create" ? "Create training course" : "Edit training course"} eyebrow="Training" onClose={onClose}><form onSubmit={onSubmit}><div className="grid gap-4 sm:grid-cols-2"><Field label="Title"><input value={form.title} onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))} className={inputClassName} /></Field><Field label="Slug"><input value={form.slug} onChange={(event) => setForm((value) => ({ ...value, slug: event.target.value }))} className={inputClassName} placeholder="auto from title" /></Field><Field label="Category"><input value={form.category} onChange={(event) => setForm((value) => ({ ...value, category: event.target.value }))} className={inputClassName} /></Field><Field label="Duration"><input value={form.duration} onChange={(event) => setForm((value) => ({ ...value, duration: event.target.value }))} className={inputClassName} /></Field><Field label="Price"><input type="number" min="0" value={form.price} onChange={(event) => setForm((value) => ({ ...value, price: event.target.value }))} className={inputClassName} /></Field><Field label="Level"><input value={form.level} onChange={(event) => setForm((value) => ({ ...value, level: event.target.value }))} className={inputClassName} /></Field><Field label="Mode"><input value={form.mode} onChange={(event) => setForm((value) => ({ ...value, mode: event.target.value }))} className={inputClassName} /></Field><Field label="Location"><input value={form.location} onChange={(event) => setForm((value) => ({ ...value, location: event.target.value }))} className={inputClassName} /></Field><Field label="Start date"><input type="date" value={form.startDate} onChange={(event) => setForm((value) => ({ ...value, startDate: event.target.value }))} className={inputClassName} /></Field><Field label="End date"><input type="date" value={form.endDate} onChange={(event) => setForm((value) => ({ ...value, endDate: event.target.value }))} className={inputClassName} /></Field><Field label="Max participants"><input type="number" min="1" value={form.maxParticipants} onChange={(event) => setForm((value) => ({ ...value, maxParticipants: event.target.value }))} className={inputClassName} /></Field><Field label="Image path"><input value={form.image} onChange={(event) => setForm((value) => ({ ...value, image: event.target.value }))} className={inputClassName} placeholder="/images/..." /></Field><Field label="Status"><select value={form.status} onChange={(event) => setForm((value) => ({ ...value, status: event.target.value as TrainingCourseStatus }))} className={inputClassName}>{courseStatuses.map((status) => <option key={status} value={status}>{label(status)}</option>)}</select></Field><label className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm((value) => ({ ...value, isActive: event.target.checked }))} className="accent-emerald-700" />Active</label></div><Field label="Description" className="mt-4"><textarea value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} className={`${inputClassName} min-h-32`} /></Field>{error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save course"}</button></div></form></ModalShell>;
}

function EnrollmentDialog({ enrollment, onClose }: { enrollment: AdminTrainingEnrollment; onClose: () => void }) { return <ModalShell title={enrollment.name} eyebrow="Enrollment details" onClose={onClose}><div className="grid gap-3 sm:grid-cols-2"><Detail label="Course" value={courseName(enrollment)} /><Detail label="Status" value={label(enrollment.status)} /><Detail label="Email" value={enrollment.email} /><Detail label="Phone" value={enrollment.phone} /></div>{enrollment.message ? <TextBlock label="Message" value={enrollment.message} /> : null}{enrollment.response ? <TextBlock label="Response" value={enrollment.response} /> : null}</ModalShell>; }
function ReviewDialog({ enrollment, response, setResponse, saving, onClose, onSave }: { enrollment: AdminTrainingEnrollment; response: string; setResponse: (value: string) => void; saving: boolean; onClose: () => void; onSave: (status: TrainingEnrollmentStatus) => void }) { const [status, setStatus] = useState(enrollment.status); return <ModalShell title={`Respond to ${enrollment.name}`} eyebrow={courseName(enrollment)} onClose={onClose}><label className="grid gap-2 text-sm font-semibold text-stone-700">Status<select value={status} onChange={(event) => setStatus(event.target.value as TrainingEnrollmentStatus)} className={inputClassName}>{enrollmentStatuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label><label className="mt-4 grid gap-2 text-sm font-semibold text-stone-700">Response<textarea value={response} onChange={(event) => setResponse(event.target.value)} maxLength={5000} className={`${inputClassName} min-h-32`} /></label><div className="mt-6 flex justify-end gap-3"><button onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button onClick={() => onSave(status)} disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save response"}</button></div></ModalShell>; }
function ConfirmDialog({ title, text, saving, onCancel, onConfirm }: { title: string; text: string; saving: boolean; onCancel: () => void; onConfirm: () => void }) { return <ModalShell title={title} eyebrow="Workspace action" onClose={onCancel}><p className="text-sm leading-6 text-stone-600">{text}</p><div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button onClick={onConfirm} disabled={saving} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Removing..." : "Remove"}</button></div></ModalShell>; }
function ModalShell({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/55 px-4 py-8"><section className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold">{title}</h2></div><button onClick={onClose} className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold">Close</button></div><div className="mt-6">{children}</div></section></div>; }
function Pager({ page, totalPages, loading, setPage }: { page: number; totalPages: number; loading: boolean; setPage: React.Dispatch<React.SetStateAction<number>> }) { return <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4 text-sm text-stone-500"><span>Page {page} of {totalPages}</span><div className="flex gap-2"><button disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Previous</button><button disabled={page >= totalPages || loading} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-lg border border-stone-200 px-4 py-2 font-semibold disabled:opacity-40">Next</button></div></div>; }
function Field({ label: fieldLabel, className = "", children }: { label: string; className?: string; children: React.ReactNode }) { return <label className={`block space-y-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-500 ${className}`}>{fieldLabel}{children}</label>; }
function Detail({ label: detailLabel, value }: { label: string; value: string }) { return <div className="rounded-xl border border-stone-200 bg-stone-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{detailLabel}</p><p className="mt-1 break-words text-sm font-semibold text-stone-800">{value}</p></div>; }
function TextBlock({ label: blockLabel, value }: { label: string; value: string }) { return <div className="mt-4 rounded-xl border border-stone-200 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">{blockLabel}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-700">{value}</p></div>; }
function StatusBadge({ status }: { status: string }) { const tone = status === "PUBLISHED" || status === "CONFIRMED" || status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : status === "CANCELLED" || status === "ARCHIVED" || status === "INACTIVE" ? "bg-red-50 text-red-700" : status === "DRAFT" ? "bg-stone-100 text-stone-600" : "bg-amber-100 text-amber-800"; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{label(status)}</span>; }
function Loading({ text }: { text: string }) { return <div className="py-14 text-center text-sm font-medium text-stone-500">{text}</div>; }
function Empty({ text }: { text: string }) { return <div className="py-14 text-center"><p className="font-semibold text-stone-800">{text}</p><p className="mt-2 text-sm text-stone-500">Matching items will appear here.</p></div>; }
function tabButton(active: boolean) { return `rounded-lg px-4 py-2 text-sm font-semibold ${active ? "bg-emerald-700 text-white" : "border border-stone-200 bg-white text-stone-600"}`; }
function label(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function formatDate(value: string) { return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
function dateInput(value?: string) { return value ? new Date(value).toISOString().slice(0, 10) : ""; }
function courseName(enrollment: AdminTrainingEnrollment) { return typeof enrollment.courseId === "string" ? "Course unavailable" : enrollment.courseId.title; }
