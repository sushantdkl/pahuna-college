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
      className="bg-transparent"
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
      <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
        <Field label="Full Name *" htmlFor="contact-name">
          <input id="contact-name" value={form.name} onChange={(event) => setField("name", event.target.value)} maxLength={120} autoComplete="name" className={inputClassName} placeholder="Your full name" />
        </Field>
        <Field label="Email *" htmlFor="contact-email">
          <input id="contact-email" type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} maxLength={254} autoComplete="email" className={inputClassName} placeholder="you@example.com" />
        </Field>
        <Field label="Phone" htmlFor="contact-phone">
          <input id="contact-phone" value={form.phone} onChange={(event) => setField("phone", event.target.value)} maxLength={40} autoComplete="tel" className={inputClassName} placeholder="+977 ..." />
        </Field>
        <Field label="Subject *" htmlFor="contact-subject">
          <input id="contact-subject" value={form.subject} onChange={(event) => setField("subject", event.target.value)} maxLength={160} className={inputClassName} placeholder="What is this about?" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Message *" htmlFor="contact-message">
            <textarea id="contact-message" value={form.message} onChange={(event) => setField("message", event.target.value)} maxLength={5000} className={`${inputClassName} min-h-16 resize-y`} placeholder="Tell us more..." />
          </Field>
        </div>
      </div>
      {feedback ? <p aria-live="polite" className={`mt-3 rounded-md px-3 py-2 text-xs font-semibold ${feedback.tone === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{feedback.message}</p> : null}
      <button type="submit" disabled={submitting} className="mt-5 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-6 text-xs font-black text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60">
        <span aria-hidden="true">{"\u{1F4E8}"}</span>
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="grid gap-1.5 text-xs font-black text-stone-950"><span>{label}</span>{children}</label>;
}

const inputClassName = "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs font-normal outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
