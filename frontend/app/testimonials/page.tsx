"use client";

import { useEffect, useState } from "react";
import { PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { getTestimonials, type Testimonial } from "@/lib/actions/final-crud-actions";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTestimonials() {
      setLoading(true);
      setError("");
      try {
        const response = await getTestimonials({ limit: 50 });
        setTestimonials(response.data || []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load testimonials");
      } finally {
        setLoading(false);
      }
    }
    void loadTestimonials();
  }, []);

  return (
    <PageShell>
      <SiteHeader />
      <SectionShell className="pt-14">
        <SectionHeader eyebrow="Testimonials" title="Real stories from travelers, partners, and learners." description="Published Pahuna testimonials are managed from the admin dashboard and shown publicly here." align="center" />
        {loading ? <p className="mt-8 text-center text-sm font-semibold text-stone-500">Loading stories...</p> : null}
        {error ? <p className="mt-8 text-center text-sm font-semibold text-red-600">{error}</p> : null}
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial._id} className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{testimonial.category || "Pahuna story"}</p>
                <p className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">{testimonial.rating}/5</p>
              </div>
              <blockquote className="mt-5 text-lg font-semibold leading-8 text-stone-800">“{testimonial.quote}”</blockquote>
              <div className="mt-6 border-t border-stone-100 pt-4">
                <p className="font-black">{testimonial.name}</p>
                <p className="mt-1 text-sm text-stone-500">{[testimonial.role, testimonial.company].filter(Boolean).join(" · ") || "Pahuna guest"}</p>
              </div>
            </article>
          ))}
        </div>
        {!loading && !testimonials.length ? <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm"><p className="font-black">No published testimonials yet.</p><p className="mt-2 text-sm text-stone-600">Admin-created published stories will appear here.</p></div> : null}
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}
