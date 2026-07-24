"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ButtonLink, PageHero, PageShell, SectionShell, SiteFooter, SiteHeader } from "@/components/pahuna-layout";
import { getTrainingCourse, type TrainingCourse } from "@/lib/api/training";

export function TrainingDetailClient({ slug }: { slug: string }) {
  const [item, setItem] = useState<TrainingCourse | null>(null); const [error, setError] = useState("");
  useEffect(() => { getTrainingCourse(slug).then((response) => setItem(response.data)).catch((failure: Error) => setError(failure.message)); }, [slug]);
  return <PageShell><SiteHeader />{!item ? <State error={error} /> : <><PageHero eyebrow={item.category || "Training"} title={item.title} description={item.description}><ButtonLink href="/training#enrollment">Enroll now</ButtonLink></PageHero><SectionShell><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><Fact label="Duration" value={item.duration || "Flexible"} /><Fact label="Mode" value={item.mode || "In person"} /><Fact label="Level" value={item.level || "All levels"} /><Fact label="Price" value={item.price !== undefined ? `NPR ${item.price.toLocaleString()}` : "Ask price"} /></div><div className="mt-8 rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">Course details</h2><p className="mt-4 leading-8 text-stone-600">{item.description}</p><div className="mt-6"><ButtonLink href="/training#enrollment">Open enrollment form</ButtonLink></div></div></SectionShell></>}<SiteFooter /></PageShell>;
}
function Fact({ label, value }: { label: string; value: string }) { return <div className="rounded-[24px] border border-emerald-900/10 bg-white p-5"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">{label}</p><p className="mt-2 font-black">{value}</p></div>; }
function State({ error }: { error: string }) { return <SectionShell><div className="rounded-[28px] border border-dashed border-emerald-900/20 bg-white/70 p-12 text-center"><h1 className="text-2xl font-black">{error ? "Course not available" : "Loading course"}</h1><p className="mt-3 text-stone-600">{error || "Fetching course details."}</p><Link href="/training" className="mt-6 inline-flex font-bold text-emerald-800">Back to training</Link></div></SectionShell>; }
