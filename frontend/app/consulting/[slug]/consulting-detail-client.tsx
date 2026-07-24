"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ButtonLink, PageHero, PageShell, SectionShell, SiteFooter, SiteHeader } from "@/components/pahuna-layout";
import { getConsultingService, type ConsultingService } from "@/lib/api/consulting";

export function ConsultingDetailClient({ slug }: { slug: string }) {
  const [item, setItem] = useState<ConsultingService | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { getConsultingService(slug).then((response) => setItem(response.data)).catch((failure: Error) => setError(failure.message)); }, [slug]);

  return <PageShell><SiteHeader />{!item ? <State error={error} /> : <><PageHero eyebrow={item.category || "Consulting"} title={item.title} description={item.description}><ButtonLink href="/consulting#request">Request this service</ButtonLink></PageHero><SectionShell><div className="grid gap-8 lg:grid-cols-[1fr_340px]"><article className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">What you receive</h2>{item.deliverables.length ? <div className="mt-5 grid gap-3">{item.deliverables.map((value) => <div key={value} className="rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-900">{value}</div>)}</div> : <p className="mt-4 text-stone-600">Deliverables are tailored after discovery.</p>}</article><aside className="space-y-4"><Fact label="Duration" value={item.duration || "Scope dependent"} /><Fact label="Price" value={item.price || "Custom quote"} /><ButtonLink href="/consulting#request">Start a request</ButtonLink></aside></div></SectionShell></>}<SiteFooter /></PageShell>;
}

function Fact({ label, value }: { label: string; value: string }) { return <div className="rounded-[24px] border border-emerald-900/10 bg-white p-5"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">{label}</p><p className="mt-2 font-black">{value}</p></div>; }
function State({ error }: { error: string }) { return <SectionShell><div className="rounded-[28px] border border-dashed border-emerald-900/20 bg-white/70 p-12 text-center"><h1 className="text-2xl font-black">{error ? "Service not available" : "Loading service"}</h1><p className="mt-3 text-stone-600">{error || "Fetching service details."}</p><Link href="/consulting" className="mt-6 inline-flex font-bold text-emerald-800">Back to consulting</Link></div></SectionShell>; }
