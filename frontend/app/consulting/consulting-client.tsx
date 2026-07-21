"use client";

import { useEffect, useState } from "react";
import {
  createConsultingLeadAction,
  getConsultingServicesAction,
} from "@/lib/actions/consulting-actions";
import type { ConsultingService } from "@/lib/api/consulting";
import { consultingLeadFormSchema } from "@/schemas/consulting.schema";

const initialForm = {
  serviceId: "",
  name: "",
  email: "",
  phone: "",
  businessName: "",
  message: "",
};

export function ConsultingClient() {
  const [services, setServices] = useState<ConsultingService[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      try {
        const response = await getConsultingServicesAction({ page: 1, limit: 50 });
        setServices(response.data || []);
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Unable to load consulting services",
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

  async function submitLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = consultingLeadFormSchema.safeParse({
      ...form,
      serviceId: form.serviceId || undefined,
      businessName: form.businessName.trim() || undefined,
    });
    if (!parsed.success) {
      setFeedback({
        tone: "error",
        message: parsed.error.issues[0]?.message || "Please check the request form",
      });
      return;
    }
    setSubmitting(true);
    try {
      const response = await createConsultingLeadAction(parsed.data);
      setFeedback({
        tone: "success",
        message: response.message || "Consulting request submitted successfully",
      });
      setForm(initialForm);
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Unable to submit request",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-4">
        {loading ? (
          <div className="rounded-[28px] border border-stone-200 bg-white p-8 text-sm font-semibold text-stone-500 shadow-sm">Loading consulting services...</div>
        ) : services.length ? (
          services.map((service) => (
            <article key={service._id} className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">{service.category || "Consulting"}</p>
                  <h3 className="mt-2 text-2xl font-black text-stone-950">{service.title}</h3>
                </div>
                <button type="button" onClick={() => setField("serviceId", service._id)} className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800">Request</button>
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-600">{service.description}</p>
              <div className="mt-5 grid gap-3 text-sm text-stone-600 sm:grid-cols-2">
                <Fact label="Price" value={service.price || "Custom quote"} />
                <Fact label="Duration" value={service.duration || "Flexible"} />
              </div>
              {service.deliverables.length ? <p className="mt-4 text-sm text-stone-500">{service.deliverables.slice(0, 4).join(" • ")}</p> : null}
            </article>
          ))
        ) : (
          <div className="rounded-[28px] border border-stone-200 bg-white p-8 text-center shadow-sm"><p className="font-bold text-stone-800">No active consulting services yet.</p><p className="mt-2 text-sm text-stone-500">Published consulting services will appear here.</p></div>
        )}
      </section>

      <form onSubmit={submitLead} className="h-fit rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8">
        <h3 className="text-2xl font-black text-stone-950">Request consulting</h3>
        <p className="mt-2 text-sm leading-6 text-stone-600">Tell us what you want to improve and the admin team will follow up.</p>
        <div className="mt-6 grid gap-4">
          <Field label="Service" htmlFor="consulting-service"><select id="consulting-service" value={form.serviceId} onChange={(event) => setField("serviceId", event.target.value)} className={inputClassName}><option value="">General consulting request</option>{services.map((service) => <option key={service._id} value={service._id}>{service.title}</option>)}</select></Field>
          <Field label="Name" htmlFor="consulting-name"><input id="consulting-name" value={form.name} onChange={(event) => setField("name", event.target.value)} className={inputClassName} autoComplete="name" /></Field>
          <Field label="Email" htmlFor="consulting-email"><input id="consulting-email" type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} className={inputClassName} autoComplete="email" /></Field>
          <Field label="Phone" htmlFor="consulting-phone"><input id="consulting-phone" value={form.phone} onChange={(event) => setField("phone", event.target.value)} className={inputClassName} autoComplete="tel" /></Field>
          <Field label="Business name" htmlFor="consulting-business"><input id="consulting-business" value={form.businessName} onChange={(event) => setField("businessName", event.target.value)} className={inputClassName} /></Field>
          <Field label="Message" htmlFor="consulting-message"><textarea id="consulting-message" value={form.message} onChange={(event) => setField("message", event.target.value)} className={`${inputClassName} min-h-32 resize-y`} placeholder="What support do you need?" /></Field>
        </div>
        {feedback ? <p aria-live="polite" className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${feedback.tone === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{feedback.message}</p> : null}
        <button type="submit" disabled={submitting} className="mt-6 w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-800/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Submitting request..." : "Submit request"}</button>
      </form>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"><p className="text-xs font-black uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-1 font-semibold text-stone-800">{value}</p></div>; }
function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) { return <label htmlFor={htmlFor} className="grid gap-2 text-sm font-bold text-stone-700"><span>{label}</span>{children}</label>; }
const inputClassName = "w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
