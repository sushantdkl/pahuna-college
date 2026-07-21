"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  createTrainingEnrollmentAction,
  getTrainingCoursesAction,
} from "@/lib/actions/training-actions";
import type { TrainingCourse } from "@/lib/api/training";
import { trainingEnrollmentFormSchema } from "@/schemas/training.schema";

const initialForm = {
  courseId: "",
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function TrainingClient() {
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      try {
        const response = await getTrainingCoursesAction({ page: 1, limit: 50 });
        setCourses(response.data || []);
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Unable to load training courses",
        });
      } finally {
        setLoading(false);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  }

  async function submitEnrollment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    const parsed = trainingEnrollmentFormSchema.safeParse({
      ...form,
      message: form.message.trim() || undefined,
    });

    if (!parsed.success) {
      setFeedback({
        tone: "error",
        message: parsed.error.issues[0]?.message || "Please check the enrollment form",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await createTrainingEnrollmentAction(parsed.data);
      setFeedback({
        tone: "success",
        message: response.message || "Enrollment submitted successfully",
      });
      setForm(initialForm);
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Unable to submit enrollment",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-4">
        {loading ? (
          <div className="rounded-[28px] border border-stone-200 bg-white p-8 text-sm font-semibold text-stone-500 shadow-sm">
            Loading active training courses...
          </div>
        ) : courses.length ? (
          courses.map((course) => (
            <article key={course._id} className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">{course.category || "Pahuna training"}</p>
                  <h3 className="mt-2 text-2xl font-black text-stone-950">{course.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setField("courseId", course._id)}
                  className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800"
                >
                  Enroll
                </button>
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-600">{course.description}</p>
              <div className="mt-5 grid gap-3 text-sm text-stone-600 sm:grid-cols-2">
                <Fact label="Duration" value={course.duration || "Flexible"} />
                <Fact label="Price" value={course.price !== undefined ? `NPR ${course.price.toLocaleString()}` : "Contact for price"} />
                <Fact label="Mode" value={course.mode || "In person"} />
                <Fact label="Starts" value={course.startDate ? formatDate(course.startDate) : "To be announced"} />
              </div>
              <Link href={`/training/${course.slug}`} className="mt-5 inline-flex text-sm font-black text-emerald-800">View course details →</Link>
            </article>
          ))
        ) : (
          <div className="rounded-[28px] border border-stone-200 bg-white p-8 text-center shadow-sm">
            <p className="font-bold text-stone-800">No active training courses yet.</p>
            <p className="mt-2 text-sm text-stone-500">Published courses will appear here when the admin team adds them.</p>
          </div>
        )}
      </section>

      <form id="enrollment" onSubmit={submitEnrollment} className="h-fit scroll-mt-24 rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8">
        <h3 className="text-2xl font-black text-stone-950">Enroll in a course</h3>
        <p className="mt-2 text-sm leading-6 text-stone-600">Send your details and the Pahuna team will confirm the next batch.</p>
        <div className="mt-6 grid gap-4">
          <Field label="Course" htmlFor="training-course"><select id="training-course" value={form.courseId} onChange={(event) => setField("courseId", event.target.value)} className={inputClassName}><option value="">Select course</option>{courses.map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}</select></Field>
          <Field label="Full name" htmlFor="training-name"><input id="training-name" value={form.name} onChange={(event) => setField("name", event.target.value)} className={inputClassName} autoComplete="name" /></Field>
          <Field label="Email" htmlFor="training-email"><input id="training-email" type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} className={inputClassName} autoComplete="email" /></Field>
          <Field label="Phone" htmlFor="training-phone"><input id="training-phone" value={form.phone} onChange={(event) => setField("phone", event.target.value)} className={inputClassName} autoComplete="tel" /></Field>
          <Field label="Message" htmlFor="training-message"><textarea id="training-message" value={form.message} onChange={(event) => setField("message", event.target.value)} className={`${inputClassName} min-h-28 resize-y`} placeholder="Share your background or preferred batch" /></Field>
        </div>
        {feedback ? <p aria-live="polite" className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${feedback.tone === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{feedback.message}</p> : null}
        <button type="submit" disabled={submitting || loading || !courses.length} className="mt-6 w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-800/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Submitting enrollment..." : "Submit enrollment"}</button>
      </form>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"><p className="text-xs font-black uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-1 font-semibold text-stone-800">{value}</p></div>;
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="grid gap-2 text-sm font-bold text-stone-700"><span>{label}</span>{children}</label>;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const inputClassName = "w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
