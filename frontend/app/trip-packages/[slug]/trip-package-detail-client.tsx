"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ButtonLink, PageHero, PageShell, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { getTripPackage, type TripPackage } from "@/lib/api/trip-packages";

export function TripPackageDetailClient({ slug }: { slug: string }) {
  const [item, setItem] = useState<TripPackage | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { getTripPackage(slug).then((response) => setItem(response.data)).catch((failure: Error) => setError(failure.message)); }, [slug]);

  return <PageShell><SiteHeader />{!item ? <State error={error} /> : <><PageHero eyebrow="Trip package" title={item.title} description={item.description}><ButtonLink href={`/contact?topic=${encodeURIComponent(`Trip package: ${item.title}`)}`}>Reserve package</ButtonLink></PageHero><SectionShell><div className="grid gap-8 lg:grid-cols-[1fr_340px]"><div className="space-y-8"><List title="Highlights" values={item.highlights} /><List title="Itinerary" values={item.itinerary} numbered /><div className="grid gap-6 md:grid-cols-2"><List title="Included" values={item.inclusions} /><List title="Not included" values={item.exclusions} /></div></div><aside className="space-y-4"><Fact label="Duration" value={item.durationDays ? `${item.durationDays} days` : "Flexible"} /><Fact label="Difficulty" value={item.difficulty || "Easy"} /><Fact label="Group" value={item.groupSize || "Flexible"} /><Fact label="Price" value={item.price !== undefined ? `NPR ${item.price.toLocaleString()}` : item.priceMin !== undefined ? `From NPR ${item.priceMin.toLocaleString()}` : "Ask price"} /></aside></div></SectionShell></>}<SiteFooter /></PageShell>;
}

function List({ title, values, numbered }: { title: string; values: string[]; numbered?: boolean }) { return <article className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">{title}</h2>{values.length ? <ol className="mt-5 grid gap-3">{values.map((value, index) => <li key={`${value}-${index}`} className="rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-700">{numbered ? <strong className="mr-2 text-emerald-700">Day {index + 1}</strong> : null}{value}</li>)}</ol> : <p className="mt-4 text-stone-500">Details confirmed during inquiry.</p>}</article>; }
function Fact({ label, value }: { label: string; value: string }) { return <div className="rounded-[24px] border border-emerald-900/10 bg-white p-5"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">{label}</p><p className="mt-2 font-black">{value}</p></div>; }
function State({ error }: { error: string }) { return <SectionShell><div className="rounded-[28px] border border-dashed border-emerald-900/20 bg-white/70 p-12 text-center"><h1 className="text-2xl font-black">{error ? "Package not available" : "Loading package"}</h1><p className="mt-3 text-stone-600">{error || "Fetching the latest package details."}</p><Link href="/trip-packages" className="mt-6 inline-flex font-bold text-emerald-800">Back to trip packages</Link></div></SectionShell>; }
