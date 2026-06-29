"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { featuredStays, images, safeImage } from "@/lib/pahuna-content";

const fallbackMap = "https://maps.google.com/?q=Surkhet+Hotels";
const ALL = "All";
const HotelMap = dynamic(
  () => import("@/app/_components/hotel-map").then((mod) => mod.HotelMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[320px] items-center justify-center rounded-[28px] border border-emerald-900/10 bg-white text-sm font-bold text-stone-500">
        Loading map preview...
      </div>
    ),
  },
);

export default function HotelsPage() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState(ALL);
  const [activeArea, setActiveArea] = useState(ALL);
  const [activeFeature, setActiveFeature] = useState(ALL);
  const [sort, setSort] = useState("recommended");

  const options = useMemo(() => {
    const unique = (values: string[]) => [ALL, ...Array.from(new Set(values.filter(Boolean))).sort()];

    return {
      types: unique(featuredStays.map((stay) => stay.type)),
      areas: unique(featuredStays.map((stay) => stay.area)),
      features: unique(featuredStays.flatMap((stay) => [...stay.amenities, ...(stay.services || [])])),
    };
  }, []);

  const visibleStays = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = featuredStays.filter((stay) => {
      const matchesType = activeType === ALL || stay.type === activeType;
      const matchesArea = activeArea === ALL || stay.area === activeArea;
      const features = [...stay.amenities, ...(stay.services || [])];
      const matchesFeature = activeFeature === ALL || features.includes(activeFeature);
      const haystack = [
        stay.name,
        stay.type,
        stay.typeLabel,
        stay.area,
        stay.district,
        stay.address,
        stay.shortDescription,
        ...features,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesType && matchesArea && matchesFeature && (!needle || haystack.includes(needle));
    });

    return [...filtered].sort((a, b) => {
      if (sort === "verified") {
        return Number(Boolean(b.verified)) - Number(Boolean(a.verified));
      }

      if (sort === "price") {
        const priceOf = (value?: number) => value && value > 0 ? value : Number.MAX_SAFE_INTEGER;
        return priceOf(a.priceValue) - priceOf(b.priceValue);
      }

      if (sort === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }

      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [activeArea, activeFeature, activeType, query, sort]);

  const featured = featuredStays.filter((stay) => stay.featured).slice(0, 3);
  const mappedCount = featuredStays.filter((stay) => typeof stay.latitude === "number" && typeof stay.longitude === "number").length;

  return (
    <PageShell>
      <SiteHeader />
      <SectionShell className="pb-8 pt-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_390px] lg:items-end">
          <div>
            <SectionHeader
              eyebrow="Stays & services"
              title="Search Surkhet stays with provider-style details."
              description="A richer Pahuna stay explorer inspired by the reference: filters, verified/public listing badges, details pages, Google Maps, and inquiry-first booking safety."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatTile value={`${featuredStays.length}`} label="stays & services" />
              <StatTile value={`${mappedCount}`} label="map-ready listings" />
              <StatTile value={`${featured.length}`} label="featured stays" />
            </div>
          </div>
          <div className="overflow-hidden rounded-[30px] border border-emerald-900/10 bg-white shadow-xl shadow-emerald-900/5">
            <HotelMap stays={visibleStays} />
            <div className="p-5">
              <p className="text-sm font-black text-stone-900">OpenStreetMap preview</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">Only listings with verified coordinates show exact markers. Others keep Google Maps links and the safe Surkhet preview.</p>
              <a href={fallbackMap} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full border border-emerald-200 px-4 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-50">
                Open Google Maps
              </a>
            </div>
          </div>
        </div>

        {featured.length ? (
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featured.map((stay) => (
              <Link key={stay.slug} href={`/hotels/${stay.slug}`} className="group overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
                <div className="relative h-56 bg-emerald-50">
                  <Image src={safeImage(stay.image, images.hotelFallback)} alt={`${stay.name} featured stay`} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-950">Featured</div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{stay.typeLabel || stay.type}</p>
                  <h2 className="mt-2 text-xl font-black">{stay.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{stay.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-8 rounded-[30px] border border-emerald-900/10 bg-white p-4 shadow-lg shadow-emerald-900/5">
          <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Search by hotel, area, route, service, or amenity"
            />
            <FilterSelect label="Type" value={activeType} onChange={setActiveType} options={options.types} />
            <FilterSelect label="Area" value={activeArea} onChange={setActiveArea} options={options.areas} />
            <FilterSelect label="Feature" value={activeFeature} onChange={setActiveFeature} options={options.features} />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-stone-600">
              Showing {visibleStays.length} of {featuredStays.length} stay listings.
            </p>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 sm:w-auto"
              aria-label="Sort stays"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Rating first</option>
              <option value="price">Price: Low to high</option>
              <option value="verified">Verified first</option>
            </select>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-4">
        {visibleStays.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleStays.map((stay) => (
              <article key={stay.slug} className="flex h-full flex-col overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
                <div className="relative h-56 bg-emerald-50">
                  <Image src={safeImage(stay.image, images.hotelFallback)} alt={`${stay.name} in ${stay.area}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {stay.verificationStatus === "VERIFIED" || stay.verificationStatus === "PARTNER" ? <Badge tone="verified" label="Verified" /> : null}
                    {stay.publicListing ? <Badge tone="public" label="Public listing" /> : null}
                    {stay.featured ? <Badge tone="featured" label="Featured" /> : null}
                  </div>
                  {stay.rating ? (
                    <div className="absolute bottom-4 right-4 rounded-2xl bg-white/95 px-3 py-2 text-sm font-black text-stone-900 shadow">
                      {stay.rating.toFixed(1)} / 5
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{stay.typeLabel || stay.type}</p>
                      <h2 className="mt-2 text-xl font-black">{stay.name}</h2>
                      <p className="mt-1 text-sm text-stone-500">{stay.area}, {stay.district}</p>
                    </div>
                    <p className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">{stay.priceFrom}</p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-stone-600">{stay.shortDescription}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {Array.from(new Set([...stay.amenities, ...(stay.services || [])])).slice(0, 5).map((amenity) => (
                      <span key={amenity} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{amenity}</span>
                    ))}
                  </div>
                  {stay.consentStatus === "PENDING" ? (
                    <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">Contact via Pahuna Inquiry while direct details are verified.</p>
                  ) : null}
                  <div className="mt-auto grid gap-2 pt-6 sm:grid-cols-2">
                    <Link href={`/hotels/${stay.slug}`} className="rounded-xl border border-emerald-200 px-3 py-2 text-center text-xs font-bold text-emerald-800 hover:bg-emerald-50">View Details</Link>
                    <a href={stay.googleMapLink || fallbackMap} target="_blank" rel="noreferrer" className="rounded-xl border border-stone-200 px-3 py-2 text-center text-xs font-bold text-stone-700 hover:bg-stone-50">Google Maps</a>
                    <Link href={`/login?redirect=${encodeURIComponent(`/hotels/${stay.slug}`)}`} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs font-bold text-amber-900 hover:bg-amber-100">Save</Link>
                    <Link href="/contact" className="rounded-xl bg-emerald-700 px-3 py-2 text-center text-xs font-bold text-white hover:bg-emerald-800">Ask Availability</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-8 text-center shadow-lg shadow-emerald-900/5">
            <h2 className="text-2xl font-black">No stays match that search.</h2>
            <p className="mt-3 text-sm text-stone-600">Try another area, feature, or stay type.</p>
            <div className="mt-6">
              <ButtonLink href="/contact" variant="secondary">Ask Pahuna for help</ButtonLink>
            </div>
          </div>
        )}
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="grid gap-1">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500">
        {options.map((option) => (
          <option key={option} value={option}>{option === ALL ? label : option}</option>
        ))}
      </select>
    </label>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[22px] border border-emerald-900/10 bg-white p-4 shadow-sm">
      <p className="text-2xl font-black text-emerald-800">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-stone-500">{label}</p>
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: "verified" | "public" | "featured" }) {
  const classes = tone === "verified" ? "bg-emerald-600 text-white" : tone === "featured" ? "bg-amber-400 text-amber-950" : "bg-white/95 text-emerald-800";

  return <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] shadow-sm ${classes}`}>{label}</span>;
}
