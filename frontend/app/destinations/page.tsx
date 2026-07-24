"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/components/pahuna-layout";
import { TourismMap, type TourismMapMarker } from "@/components/tourism-map";
import { getDestinations, type PublicDestination } from "@/lib/api/public-catalog";
import { resolveApiAssetUrl } from "@/lib/api/axios-instance";
import { images, safeImage } from "@/lib/pahuna-content";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<PublicDestination[]>([]);
  const [query, setQuery] = useState("");
  const [activeDistrict, setActiveDistrict] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDestinations({ limit: 50 })
      .then((response) => setDestinations(response.data || []))
      .catch((failure: Error) => setError(failure.message))
      .finally(() => setLoading(false));
  }, []);

  const districts = useMemo(() => ["All", ...Array.from(new Set(destinations.map((destination) => destination.district).filter(Boolean) as string[])).sort()], [destinations]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(destinations.map((destination) => destination.category).filter(Boolean) as string[])).sort()], [destinations]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return destinations.filter((destination) => {
      if (activeDistrict !== "All" && destination.district !== activeDistrict) return false;
      if (activeCategory !== "All" && destination.category !== activeCategory) return false;
      if (!needle) return true;
      return [destination.name, destination.description, destination.category, destination.district, ...destination.attractions].filter(Boolean).join(" ").toLowerCase().includes(needle);
    });
  }, [activeCategory, activeDistrict, destinations, query]);
  const featured = filtered.filter((destination) => destination.isFeatured).slice(0, 6);
  const mapMarkers: TourismMapMarker[] = filtered.map((destination) => ({
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
  }));

  return (
    <PageShell>
      <SiteHeader />
      <section className="bg-[#081124] text-white">
        <SectionShell className="py-20 text-center sm:py-24">
          <p className="mx-auto inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/75">
            Karnali travel guide
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Karnali Destinations <span className="block text-amber-400">From Surkhet to the high Himalaya</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/75">
            Build a careful Karnali route across gateway cities, lakes, temples, heritage places, national parks, trekking villages, and river corridors.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/trip-planner">Build My Karnali Route</ButtonLink>
            <ButtonLink href="/hotels" variant="ghost">Find stays & services</ButtonLink>
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        {featured.length ? (
          <div className="mb-14">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeader eyebrow="Featured destinations" title="Start with the key Karnali anchors" />
              <p className="max-w-xl text-sm leading-6 text-stone-600">
                These entries are planning references. Routes, access, permits, stays, and operator availability should be confirmed before travel.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((destination) => (
                <DestinationCard key={destination._id} destination={destination} compact />
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-[8px] border border-stone-200 bg-white p-4 shadow-sm">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search destinations, districts, lakes, temples..." className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <FilterPills label="District" value={activeDistrict} values={districts} onChange={setActiveDistrict} />
            <FilterPills label="Category" value={activeCategory} values={categories} onChange={setActiveCategory} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader eyebrow="Karnali guide" title={`Showing ${filtered.length} destination${filtered.length === 1 ? "" : "s"}`} description="Filter by district or destination type while keeping the same backend destination catalog." />
          <ButtonLink href="/trip-planner" variant="secondary">Build route</ButtonLink>
        </div>

        <div className="mt-8 overflow-hidden rounded-[8px] border border-emerald-100 bg-white p-3 shadow-sm">
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
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((destination) => (
              <DestinationCard key={destination._id} destination={destination} />
            ))}
          </div>
        )}
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

function DestinationCard({ destination, compact = false }: { destination: PublicDestination; compact?: boolean }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/destinations/${destination.slug}`} className={`relative block overflow-hidden bg-emerald-50 ${compact ? "h-44" : "h-52"}`}>
        <Image unoptimized src={safeImage(resolveApiAssetUrl(destination.images[0]), images.destinationFallback)} alt={destination.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
        {destination.isFeatured ? <span className="absolute right-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">Featured</span> : null}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{destination.category || "Destination"}{destination.district ? ` / ${destination.district}` : ""}</p>
        <h2 className="mt-2 text-xl font-black">{destination.name}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">{destination.description}</p>
        <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
          <Link href={`/destinations/${destination.slug}`} className="rounded-md bg-emerald-700 px-3 py-2 text-center text-xs font-black text-white hover:bg-emerald-800">View guide</Link>
          <Link href="/trip-planner" className="rounded-md border border-emerald-200 px-3 py-2 text-center text-xs font-black text-emerald-800 hover:bg-emerald-50">Build route</Link>
        </div>
      </div>
    </article>
  );
}

function FilterPills({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (next: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((item) => (
          <button key={item} type="button" onClick={() => onChange(item)} className={`rounded-full px-3 py-1.5 text-xs font-black transition ${value === item ? "bg-emerald-700 text-white" : "border border-emerald-100 bg-emerald-50 text-emerald-800 hover:border-emerald-300"}`}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function CatalogState({ title, description }: { title: string; description: string }) {
  return <div className="mt-10 rounded-[8px] border border-dashed border-emerald-900/20 bg-white/70 p-12 text-center"><h2 className="text-2xl font-black">{title}</h2><p className="mt-3 text-sm text-stone-600">{description}</p></div>;
}
