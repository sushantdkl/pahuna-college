"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, PageHero, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { getDestinations, type PublicDestination } from "@/lib/api/public-catalog";
import { resolveApiAssetUrl } from "@/lib/api/axios-instance";
import { images, safeImage } from "@/lib/pahuna-content";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<PublicDestination[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDestinations({ limit: 50 })
      .then((response) => setDestinations(response.data || []))
      .catch((failure: Error) => setError(failure.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return destinations;
    return destinations.filter((destination) => [destination.name, destination.description, destination.category, destination.district, ...destination.attractions].filter(Boolean).join(" ").toLowerCase().includes(needle));
  }, [destinations, query]);

  return (
    <PageShell>
      <SiteHeader />
      <PageHero eyebrow="Destinations" title="Surkhet first, Karnali next." description="Browse active destinations maintained by the Pahuna team, then move directly into route planning and local support." image={images.karnaliHero}>
        <ButtonLink href="/trip-planner">Plan your route</ButtonLink>
        <ButtonLink href="/contact" variant="secondary">Ask a local</ButtonLink>
      </PageHero>
      <SectionShell>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow="Explore Karnali" title="Places worth building a journey around." description="Every published destination comes from the same catalog managed in the dashboard." />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search place, district, or attraction" className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 md:max-w-sm" />
        </div>
        {loading || error || !filtered.length ? (
          <CatalogState title={loading ? "Loading destinations" : error ? "Destinations are temporarily unavailable" : "No destinations found"} description={error || (loading ? "Fetching the latest published places." : "Try a broader search term.")} />
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((destination) => (
              <article key={destination._id} className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5 transition hover:-translate-y-1 hover:shadow-xl">
                <Link href={`/destinations/${destination.slug}`} className="relative block h-64 overflow-hidden bg-emerald-50">
                  <Image unoptimized src={safeImage(resolveApiAssetUrl(destination.images[0]), images.destinationFallback)} alt={destination.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  {destination.isFeatured ? <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-950">Featured</span> : null}
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{destination.category || "Destination"}{destination.district ? ` · ${destination.district}` : ""}</p>
                  <h2 className="mt-2 text-2xl font-black">{destination.name}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">{destination.description}</p>
                  <div className="mt-auto grid gap-2 pt-6 sm:grid-cols-2">
                    <Link href={`/destinations/${destination.slug}`} className="rounded-xl border border-emerald-200 px-3 py-2 text-center text-xs font-bold text-emerald-800 hover:bg-emerald-50">View details</Link>
                    <Link href="/trip-planner" className="rounded-xl bg-emerald-700 px-3 py-2 text-center text-xs font-bold text-white hover:bg-emerald-800">Plan trip</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

function CatalogState({ title, description }: { title: string; description: string }) {
  return <div className="mt-10 rounded-[28px] border border-dashed border-emerald-900/20 bg-white/70 p-12 text-center"><h2 className="text-2xl font-black">{title}</h2><p className="mt-3 text-sm text-stone-600">{description}</p></div>;
}
