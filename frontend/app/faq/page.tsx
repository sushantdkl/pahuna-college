"use client";

import { useEffect, useState } from "react";
import { PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { getFAQs, type FAQ } from "@/lib/actions/final-crud-actions";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFaqs() {
      setLoading(true);
      setError("");
      try {
        const response = await getFAQs({ limit: 50 });
        setFaqs(response.data || []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load FAQs");
      } finally {
        setLoading(false);
      }
    }
    void loadFaqs();
  }, []);

  const categories = Array.from(new Set(faqs.map((faq) => faq.category))).sort();
  const visibleFaqs = (() => {
    const needle = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      if (category && faq.category !== category) return false;
      if (!needle) return true;
      return [faq.question, faq.answer, faq.category].join(" ").toLowerCase().includes(needle);
    });
  })();

  return (
    <PageShell>
      <SiteHeader />
      <SectionShell className="pt-14">
        <SectionHeader eyebrow="FAQ" title="Questions travelers and partners ask Pahuna." description="Search published answers about stays, routes, food, trip planning, partner onboarding, and support." align="center" />
        <div className="mx-auto mt-8 grid max-w-4xl gap-3 rounded-[28px] border border-emerald-900/10 bg-white p-4 shadow-lg shadow-emerald-900/5 md:grid-cols-[1fr_220px]">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions..." className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" />
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500">
            <option value="">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        {loading ? <p className="mt-8 text-center text-sm font-semibold text-stone-500">Loading FAQs...</p> : null}
        {error ? <p className="mt-8 text-center text-sm font-semibold text-red-600">{error}</p> : null}
        <div className="mx-auto mt-10 grid max-w-4xl gap-4">
          {visibleFaqs.map((faq) => (
            <details key={faq._id} className="rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer text-lg font-black text-stone-900">{faq.question}</summary>
              <p className="mt-4 text-sm leading-7 text-stone-600">{faq.answer}</p>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{faq.category}</p>
            </details>
          ))}
          {!loading && !visibleFaqs.length ? <div className="rounded-2xl bg-white p-8 text-center shadow-sm"><p className="font-black">No FAQs found.</p><p className="mt-2 text-sm text-stone-600">Try another search or contact Pahuna directly.</p></div> : null}
        </div>
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}
