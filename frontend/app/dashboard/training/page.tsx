// @ts-nocheck
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminReplicaFrame } from "@/components/dashboard/dashboard-shell";
import { ReplicaDataCard, ReplicaStatusBadge } from "@/components/dashboard/data-table-card";
import { ReplicaStatCard } from "@/components/dashboard/stat-card";
import {
  createAdminTrainingCourseAction,
  deleteAdminTrainingCourseAction,
  deleteAdminTrainingEnrollmentAction,
  getAdminTrainingCoursesAction,
  getAdminTrainingEnrollmentsAction,
  updateAdminTrainingCourseAction,
  updateAdminTrainingEnrollmentAction,
} from "@/lib/actions/admin-training-actions";
import { trainingCourseFormSchema } from "@/schemas/training.schema";

const enrollmentStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
const courseStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const emptyCourse = {
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
const inputClassName = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export default function DashboardTrainingPage() {
  const [tab, setTab] = useState("courses");
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [response, setResponse] = useState("");
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [courseImageFile, setCourseImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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
    void load();
  }, [load]);

  const summary = useMemo(() => ({
    courses: courses.length,
    published: courses.filter((item) => item.status === "PUBLISHED").length,
    enrollments: enrollments.length,
    pending: enrollments.filter((item) => item.status === "PENDING").length,
  }), [courses, enrollments]);

  function openCourse(course = null) {
    setEditingCourse(course || "create");
    setCourseImageFile(null);
    setCourseForm(course ? {
      title: course.title || "",
      slug: course.slug || "",
      description: course.description || "",
      category: course.category || "",
      duration: course.duration || "",
      price: course.price?.toString() || "",
      level: course.level || "",
      mode: course.mode || "",
      location: course.location || "",
      startDate: course.startDate ? course.startDate.slice(0, 10) : "",
      endDate: course.endDate ? course.endDate.slice(0, 10) : "",
      maxParticipants: course.maxParticipants?.toString() || "",
      image: course.image || "",
      status: course.status || "DRAFT",
      isActive: Boolean(course.isActive),
    } : emptyCourse);
  }

  function coursePayload() {
    return {
      ...courseForm,
      price: courseForm.price ? Number(courseForm.price) : undefined,
      maxParticipants: courseForm.maxParticipants ? Number(courseForm.maxParticipants) : undefined,
      slug: courseForm.slug || undefined,
      category: courseForm.category || undefined,
      duration: courseForm.duration || undefined,
      level: courseForm.level || undefined,
      mode: courseForm.mode || undefined,
      location: courseForm.location || undefined,
      startDate: courseForm.startDate || undefined,
      endDate: courseForm.endDate || undefined,
      image: courseForm.image || undefined,
    };
  }

  async function saveCourse(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const parsed = trainingCourseFormSchema.safeParse(coursePayload());
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Invalid course data");
      if (editingCourse === "create") {
        await createAdminTrainingCourseAction(parsed.data, courseImageFile);
        setNotice("Training course added");
      } else {
        await updateAdminTrainingCourseAction(editingCourse._id, parsed.data, courseImageFile);
        setNotice("Training course updated");
      }
      setEditingCourse(null);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save course");
    } finally {
      setSaving(false);
    }
  }

  async function updateCourse(course, payload, message) {
    setError("");
    setNotice("");
    try {
      await updateAdminTrainingCourseAction(course._id, payload);
      setNotice(message);
      await load();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update course");
    }
  }

  async function updateEnrollment(id, payload) {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await updateAdminTrainingEnrollmentAction(id, payload);
      setNotice("Enrollment updated");
      await load();
      setSelectedEnrollment((current) => current ? { ...current, ...payload } : current);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update enrollment");
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
      if (deleting.type === "course") {
        await deleteAdminTrainingCourseAction(deleting.record._id);
        setNotice("Training course deleted");
      } else {
        await deleteAdminTrainingEnrollmentAction(deleting.record._id);
        setNotice("Enrollment deleted");
      }
      setDeleting(null);
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete training record");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminReplicaFrame>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Training</h1>
            <p className="text-sm text-stone-500">Manage courses and review enrollment submissions from the live database.</p>
          </div>
          <button onClick={() => openCourse()} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Add Course</button>
        </div>
        {error ? <Alert tone="error" message={error} /> : null}
        {notice ? <Alert tone="success" message={notice} /> : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReplicaStatCard title="Courses" value={summary.courses} subtitle="Training course records" icon="CR" />
          <ReplicaStatCard title="Published" value={summary.published} subtitle="Public course selector" icon="PB" />
          <ReplicaStatCard title="Enrollments" value={summary.enrollments} subtitle="Submitted forms" icon="EN" />
          <ReplicaStatCard title="Pending" value={summary.pending} subtitle="Need review" icon="PN" />
        </div>
        <div className="flex gap-2">
          <Tab active={tab === "courses"} onClick={() => setTab("courses")}>Courses</Tab>
          <Tab active={tab === "enrollments"} onClick={() => setTab("enrollments")}>Enrollments</Tab>
        </div>
        {tab === "courses" ? (
          <ReplicaDataCard title="Training courses" description="Published active courses appear on the public training page and enrollment selector." count={courses.length}>
            <Table headers={["Course", "Category", "Price", "Status", "Public", "Actions"]}>
              {courses.map((course) => (
                <tr key={course._id} className="border-b last:border-0">
                  <td className="py-3 pr-4"><p className="font-semibold text-stone-900">{course.title}</p><p className="text-stone-500">{course.slug}</p></td>
                  <td className="py-3 pr-4 text-stone-600">{course.category || "-"}</td>
                  <td className="py-3 pr-4 text-stone-600">{course.price ? `NPR ${course.price.toLocaleString()}` : "Free"}</td>
                  <td className="py-3 pr-4"><ReplicaStatusBadge>{course.status}</ReplicaStatusBadge></td>
                  <td className="py-3 pr-4"><ReplicaStatusBadge>{course.isActive ? "Active" : "Inactive"}</ReplicaStatusBadge></td>
                  <td className="py-3 pr-4"><div className="flex flex-wrap gap-2"><SmallButton onClick={() => setSelectedCourse(course)}>View</SmallButton><SmallButton onClick={() => openCourse(course)}>Edit</SmallButton><SmallButton onClick={() => updateCourse(course, { status: course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" }, course.status === "PUBLISHED" ? "Course unpublished" : "Course published")}>{course.status === "PUBLISHED" ? "Unpublish" : "Publish"}</SmallButton><SmallButton onClick={() => updateCourse(course, { isActive: !course.isActive }, course.isActive ? "Course deactivated" : "Course activated")}>{course.isActive ? "Deactivate" : "Activate"}</SmallButton><SmallButton danger onClick={() => setDeleting({ type: "course", record: course })}>Delete</SmallButton></div></td>
                </tr>
              ))}
            </Table>
          </ReplicaDataCard>
        ) : (
          <ReplicaDataCard title="Training enrollments" description="Every visible field from the public form is shown here." count={enrollments.length}>
            <Table headers={["Student", "Course", "Phone", "Status", "Actions"]}>
              {enrollments.map((item) => (
                <tr key={item._id} className="border-b last:border-0">
                  <td className="py-3 pr-4"><p className="font-semibold text-stone-900">{item.fullName || item.name}</p><p className="text-stone-500">{item.email}</p></td>
                  <td className="py-3 pr-4 text-stone-600">{typeof item.courseId === "object" ? item.courseId.title : item.courseId}</td>
                  <td className="py-3 pr-4 text-stone-600">{item.phone}</td>
                  <td className="py-3 pr-4"><ReplicaStatusBadge>{item.status}</ReplicaStatusBadge></td>
                  <td className="py-3 pr-4"><div className="flex gap-2"><SmallButton onClick={() => { setSelectedEnrollment(item); setResponse(item.response || ""); }}>View</SmallButton><SmallButton danger onClick={() => setDeleting({ type: "enrollment", record: item })}>Delete</SmallButton></div></td>
                </tr>
              ))}
            </Table>
          </ReplicaDataCard>
        )}
      </div>
      {editingCourse ? <CourseDialog form={courseForm} imageFile={courseImageFile} saving={saving} onChange={setCourseForm} onImageChange={setCourseImageFile} onSubmit={saveCourse} onClose={() => setEditingCourse(null)} /> : null}
      {selectedCourse ? <DetailPanel title={selectedCourse.title} onClose={() => setSelectedCourse(null)}><Detail label="Description" value={selectedCourse.description} block /><Detail label="Category" value={selectedCourse.category} /><Detail label="Duration" value={selectedCourse.duration} /><Detail label="Location" value={selectedCourse.location} /><Detail label="Status" value={`${selectedCourse.status} / ${selectedCourse.isActive ? "Active" : "Inactive"}`} /></DetailPanel> : null}
      {selectedEnrollment ? (
        <DetailPanel title={selectedEnrollment.fullName || selectedEnrollment.name} onClose={() => setSelectedEnrollment(null)}>
          <Detail label="Course" value={typeof selectedEnrollment.courseId === "object" ? selectedEnrollment.courseId.title : selectedEnrollment.courseId} />
          <Detail label="Email" value={selectedEnrollment.email} /><Detail label="Phone" value={selectedEnrollment.phone} /><Detail label="Age" value={selectedEnrollment.age} /><Detail label="Education Level" value={selectedEnrollment.educationLevel || selectedEnrollment.education} /><Detail label="Prior Hospitality Experience" value={selectedEnrollment.priorExperience || selectedEnrollment.experience} /><Detail label="Motivation" value={selectedEnrollment.motivation || selectedEnrollment.message} block />
          <label className="mt-4 block text-sm font-semibold text-stone-700">Status</label><select value={selectedEnrollment.status} onChange={(event) => updateEnrollment(selectedEnrollment._id, { status: event.target.value })} disabled={saving} className={inputClassName}>{enrollmentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>
          <label className="mt-4 block text-sm font-semibold text-stone-700">Admin response</label><textarea value={response} onChange={(event) => setResponse(event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" /><button disabled={saving} onClick={() => updateEnrollment(selectedEnrollment._id, { response })} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Save response</button>
        </DetailPanel>
      ) : null}
      {deleting ? <ConfirmDialog label={deleting.record.title || deleting.record.fullName || deleting.record.name} saving={saving} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} /> : null}
    </AdminReplicaFrame>
  );
}

function CourseDialog({ form, imageFile, saving, onChange, onImageChange, onSubmit, onClose }) {
  return <Modal title="Training course" onClose={onClose}><form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2"><Field label="Title"><input value={form.title} onChange={(event) => onChange({ ...form, title: event.target.value })} className={inputClassName} /></Field><Field label="Slug"><input value={form.slug} onChange={(event) => onChange({ ...form, slug: event.target.value })} className={inputClassName} /></Field><Field label="Category"><input value={form.category} onChange={(event) => onChange({ ...form, category: event.target.value })} className={inputClassName} /></Field><Field label="Price"><input type="number" value={form.price} onChange={(event) => onChange({ ...form, price: event.target.value })} className={inputClassName} /></Field><Field label="Duration"><input value={form.duration} onChange={(event) => onChange({ ...form, duration: event.target.value })} className={inputClassName} /></Field><Field label="Level"><input value={form.level} onChange={(event) => onChange({ ...form, level: event.target.value })} className={inputClassName} /></Field><Field label="Mode"><input value={form.mode} onChange={(event) => onChange({ ...form, mode: event.target.value })} className={inputClassName} /></Field><Field label="Location"><input value={form.location} onChange={(event) => onChange({ ...form, location: event.target.value })} className={inputClassName} /></Field><Field label="Start date"><input type="date" value={form.startDate} onChange={(event) => onChange({ ...form, startDate: event.target.value })} className={inputClassName} /></Field><Field label="End date"><input type="date" value={form.endDate} onChange={(event) => onChange({ ...form, endDate: event.target.value })} className={inputClassName} /></Field><Field label="Max participants"><input type="number" value={form.maxParticipants} onChange={(event) => onChange({ ...form, maxParticipants: event.target.value })} className={inputClassName} /></Field><Field label="Course image"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => onImageChange(event.target.files?.[0] || null)} className={inputClassName} /><p className="mt-1 text-xs font-medium text-stone-500">{imageFile?.name || (form.image ? "Current image will be kept" : "Choose an image from your device")}</p></Field><Field label="Status"><select value={form.status} onChange={(event) => onChange({ ...form, status: event.target.value })} className={inputClassName}>{courseStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></Field><label className="flex items-center gap-2 text-sm font-semibold text-stone-700"><input type="checkbox" checked={form.isActive} onChange={(event) => onChange({ ...form, isActive: event.target.checked })} />Active</label><label className="space-y-2 text-sm font-semibold text-stone-700 sm:col-span-2"><span>Description</span><textarea value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} className={`${inputClassName} min-h-28`} /></label><div className="flex justify-end gap-3 sm:col-span-2"><button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold">Cancel</button><button disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">{saving ? "Saving..." : "Save course"}</button></div></form></Modal>;
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
