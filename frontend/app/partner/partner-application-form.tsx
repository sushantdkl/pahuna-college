"use client";

import { useState } from "react";
import { createPartnerApplicationAction } from "@/lib/actions/partner-application-actions";
import {
  createPartnerApplicationSchema,
  type PartnerType,
} from "@/schemas/partner-application.schema";

const initialForm = {
  businessName: "",
  partnerType: "" as PartnerType | "",
  ownerName: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  totalRooms: "",
  currentRevenue: "",
  existingOnline: false,
  challenges: "",
  goals: "",
};

const partnerTypes: Array<{ value: PartnerType; label: string }> = [
  { value: "HOTEL", label: "Hotel" },
  { value: "RESORT", label: "Resort" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "TRAVEL_AGENCY", label: "Travel agency / tour operator" },
  { value: "TRANSPORT", label: "Transport provider" },
  { value: "OTHER", label: "Other local service" },
];

export function PartnerApplicationForm() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  }

  return (
    <form
      className="rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setFeedback(null);

        const parsedData = createPartnerApplicationSchema.safeParse({
          ...form,
          partnerType: form.partnerType || undefined,
          address: form.address.trim() || undefined,
          website: form.website.trim() || undefined,
          totalRooms: form.totalRooms === "" ? undefined : Number(form.totalRooms),
          currentRevenue: form.currentRevenue.trim() || undefined,
          challenges: form.challenges.trim() || undefined,
          goals: form.goals.trim() || undefined,
        });

        if (!parsedData.success) {
          setFeedback({
            tone: "error",
            message: parsedData.error.issues[0]?.message || "Check the application form",
          });
          return;
        }

        setSubmitting(true);
        try {
          const response = await createPartnerApplicationAction(parsedData.data);
          setFeedback({
            tone: "success",
            message: response.message || "Partner application submitted successfully",
          });
          setForm(initialForm);
        } catch (submitError) {
          setFeedback({
            tone: "error",
            message: submitError instanceof Error ? submitError.message : "Unable to submit the application",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Business name" htmlFor="partner-business"><input id="partner-business" value={form.businessName} onChange={(event) => setField("businessName", event.target.value)} maxLength={160} className={inputClassName} placeholder="Business name" /></Field>
        <Field label="Partner type" htmlFor="partner-type"><select id="partner-type" value={form.partnerType} onChange={(event) => setField("partnerType", event.target.value as PartnerType | "")} className={inputClassName}><option value="">Select business type</option>{partnerTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></Field>
        <Field label="Owner / manager" htmlFor="partner-owner"><input id="partner-owner" value={form.ownerName} onChange={(event) => setField("ownerName", event.target.value)} maxLength={120} autoComplete="name" className={inputClassName} placeholder="Full name" /></Field>
        <Field label="Email address" htmlFor="partner-email"><input id="partner-email" type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} maxLength={254} autoComplete="email" className={inputClassName} placeholder="you@business.com" /></Field>
        <Field label="Phone" htmlFor="partner-phone"><input id="partner-phone" value={form.phone} onChange={(event) => setField("phone", event.target.value)} maxLength={40} autoComplete="tel" className={inputClassName} placeholder="+977 ..." /></Field>
        <Field label="Address" htmlFor="partner-address"><input id="partner-address" value={form.address} onChange={(event) => setField("address", event.target.value)} maxLength={300} autoComplete="street-address" className={inputClassName} placeholder="Business location" /></Field>
        <Field label="Website (optional)" htmlFor="partner-website"><input id="partner-website" type="url" value={form.website} onChange={(event) => setField("website", event.target.value)} maxLength={500} className={inputClassName} placeholder="https://example.com" /></Field>
        <Field label="Total rooms (if applicable)" htmlFor="partner-rooms"><input id="partner-rooms" type="number" min={0} max={10000} value={form.totalRooms} onChange={(event) => setField("totalRooms", event.target.value)} className={inputClassName} placeholder="20" /></Field>
        <Field label="Current revenue range" htmlFor="partner-revenue"><input id="partner-revenue" value={form.currentRevenue} onChange={(event) => setField("currentRevenue", event.target.value)} maxLength={120} className={inputClassName} placeholder="Optional monthly or annual range" /></Field>
        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 text-sm font-bold text-stone-700"><input type="checkbox" checked={form.existingOnline} onChange={(event) => setField("existingOnline", event.target.checked)} className="h-4 w-4 accent-emerald-700" />Already listed or selling online</label>
        <div className="sm:col-span-2"><Field label="Current challenges" htmlFor="partner-challenges"><textarea id="partner-challenges" value={form.challenges} onChange={(event) => setField("challenges", event.target.value)} maxLength={3000} className={`${inputClassName} min-h-28 resize-y`} placeholder="What makes growth, bookings, visibility, or operations difficult?" /></Field></div>
        <div className="sm:col-span-2"><Field label="Partnership goals" htmlFor="partner-goals"><textarea id="partner-goals" value={form.goals} onChange={(event) => setField("goals", event.target.value)} maxLength={3000} className={`${inputClassName} min-h-28 resize-y`} placeholder="What would you like to achieve with Pahuna?" /></Field></div>
      </div>

      {feedback ? <p aria-live="polite" className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${feedback.tone === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{feedback.message}</p> : null}
      <button type="submit" disabled={submitting} className="mt-6 w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-800/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Submitting application..." : "Submit partner application"}</button>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) { return <label htmlFor={htmlFor} className="grid gap-2 text-sm font-bold text-stone-700"><span>{label}</span>{children}</label>; }
const inputClassName = "w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
