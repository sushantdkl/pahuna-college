"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, PageHero, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { TourismMap, type TourismMapMarker } from "@/app/_components/tourism-map";
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
  const mapMarkers = useMemo<TourismMapMarker[]>(
    () =>
      filtered.map((destination) => ({
        id: destination._id,
        name: destination.name,
        category: "destination",
        latitude: destination.latitude,
        longitude: destination.longitude,
        type: destination.category || "Destination",
        location: destination.district || "Karnali",
        href: `/destinations/${destination.slug}`,
        secondaryHref: "/trip-planner",
        secondaryLabel: "Build Route",
      })),
    [filtered],
  );

  return (
    <PageShell>
      <SiteHeader />
      <PageHero eyebrow="Karnali destination guides" title="Karnali Destinations From Surkhet to the high Himalaya" description="Build a careful Karnali route across gateway cities, lakes, temples, heritage places, national parks, trekking villages, and river corridors." image={images.karnaliHero}>
        <ButtonLink href="/trip-planner">Plan your route</ButtonLink>
        <ButtonLink href="/contact" variant="secondary">Ask a local</ButtonLink>
      </PageHero>
      <SectionShell>
        {filtered.slice(0, 6).length ? (
          <div className="mb-14">
            <SectionHeader eyebrow="Featured destinations" title="Start with the key Karnali anchors" description="A reference-style card grid for the places travelers compare first." />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.slice(0, 6).map((destination) => (
                <Link key={destination._id} href={`/destinations/${destination.slug}`} className="group rounded-[8px] border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative h-44 overflow-hidden rounded-[6px] bg-emerald-50">
                    <Image unoptimized src={safeImage(resolveApiAssetUrl(destination.images[0]), images.destinationFallback)} alt={destination.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    {destination.isFeatured ? <span className="absolute right-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-[10px] font-black text-white">Featured</span> : null}
                  </div>
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{destination.district || "Karnali"}</p>
                  <h3 className="mt-2 text-lg font-black">{destination.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{destination.description}</p>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-black text-white">View guide</span>
                    <span className="rounded-md border border-emerald-200 px-3 py-2 text-xs font-black text-emerald-800">Build route</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow="Explore Karnali" title="Places worth building a journey around." description="Every published destination comes from the same catalog managed in the dashboard." />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search place, district, or attraction" className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 md:max-w-sm" />
        </div>
        <div className="mt-8">
          <TourismMap
            markers={mapMarkers}
            heightClass="h-[330px]"
            emptyTitle="Destination coordinates not available"
            emptyDescription="Destination guides remain available in the grid. Exact map markers appear only when valid backend coordinates exist."
          />
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
