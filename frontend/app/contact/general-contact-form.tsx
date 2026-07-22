"use client";

import { useState } from "react";
import { createContactMessageAction } from "@/lib/actions/contact-message-actions";
import { createContactMessageSchema } from "@/schemas/contact-message.schema";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function GeneralContactForm({ initialSubject = "" }: { initialSubject?: string }) {
  const [form, setForm] = useState({ ...initialForm, subject: initialSubject });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  const setField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFeedback(null);
  };

  return (
    <form
      className="rounded-[8px] border border-stone-200 bg-white p-6 shadow-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setFeedback(null);

        const parsedData = createContactMessageSchema.safeParse({
          ...form,
          phone: form.phone.trim() || undefined,
        });

        if (!parsedData.success) {
          setFeedback({
            tone: "error",
            message: parsedData.error.issues[0]?.message || "Check the contact form",
          });
          return;
        }

        setSubmitting(true);

        try {
          const response = await createContactMessageAction(parsedData.data);
          setFeedback({
            tone: "success",
            message: response.message || "Contact message submitted successfully",
          });
          setForm(initialForm);
        } catch (submitError) {
          setFeedback({
            tone: "error",
            message: submitError instanceof Error
              ? submitError.message
              : "Unable to submit contact message",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="contact-name">
          <input id="contact-name" value={form.name} onChange={(event) => setField("name", event.target.value)} maxLength={120} autoComplete="name" className={inputClassName} placeholder="Your full name" />
        </Field>
        <Field label="Email address" htmlFor="contact-email">
          <input id="contact-email" type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} maxLength={254} autoComplete="email" className={inputClassName} placeholder="you@example.com" />
        </Field>
        <Field label="Phone (optional)" htmlFor="contact-phone">
          <input id="contact-phone" value={form.phone} onChange={(event) => setField("phone", event.target.value)} maxLength={40} autoComplete="tel" className={inputClassName} placeholder="Phone number" />
        </Field>
        <Field label="Subject" htmlFor="contact-subject">
          <input id="contact-subject" value={form.subject} onChange={(event) => setField("subject", event.target.value)} maxLength={160} className={inputClassName} placeholder="How can Pahuna help?" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Message" htmlFor="contact-message">
            <textarea id="contact-message" value={form.message} onChange={(event) => setField("message", event.target.value)} maxLength={5000} className={`${inputClassName} min-h-40 resize-y`} placeholder="Tell us what you need help with" />
          </Field>
        </div>
      </div>
      {feedback ? <p aria-live="polite" className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${feedback.tone === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{feedback.message}</p> : null}
      <button type="submit" disabled={submitting} className="mt-6 inline-flex w-full justify-center rounded-md bg-emerald-700 px-6 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? "Sending message..." : "Send message"}
      </button>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="grid gap-2 text-sm font-bold text-stone-700"><span>{label}</span>{children}</label>;
}

const inputClassName = "w-full rounded-sm border border-stone-300 px-3 py-2 text-sm font-normal outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
