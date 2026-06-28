"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { featuredStays, images, safeImage } from "@/lib/pahuna-content";

const typeChips = ["All", "Hotel", "Resort", "Guest House", "Homestay", "Lodge"];
const fallbackMap = "https://maps.google.com/?q=Surkhet+Hotels";
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
  const [activeType, setActiveType] = useState("All");
  const [sort, setSort] = useState("recommended");

  const visibleStays = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = featuredStays.filter((stay) => {
      const matchesType = activeType === "All" || stay.type === activeType;
      const haystack = [stay.name, stay.type, stay.area, stay.district, ...stay.amenities].join(" ").toLowerCase();

      return matchesType && (!needle || haystack.includes(needle));
    });

    return [...filtered].sort((a, b) => {
      if (sort === "verified") {
        return Number(Boolean(b.verified)) - Number(Boolean(a.verified));
      }

      if (sort === "price") {
        const priceOf = (value?: string) => Number(value?.replace(/[^\d]/g, "") || Number.MAX_SAFE_INTEGER);
        return priceOf(a.priceFrom) - priceOf(b.priceFrom);
      }

      return Number(Boolean(b.publicListing)) - Number(Boolean(a.publicListing));
    });
  }, [activeType, query, sort]);

  return (
    <PageShell>
      <SiteHeader />
      <SectionShell className="pb-8 pt-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
          <SectionHeader
            eyebrow="Explore stays"
            title="Find stays around Surkhet with clean local context."
            description="Search by area, amenity, or stay type, then open maps or send an availability inquiry without losing the listing."
          />
          <div className="overflow-hidden rounded-[30px] border border-emerald-900/10 bg-white shadow-xl shadow-emerald-900/5">
            <HotelMap stays={visibleStays} />
            <div className="p-5">
              <p className="text-sm font-black text-stone-900">OpenStreetMap preview</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">Uses available stay coordinates, or a safe Surkhet preview center when exact coordinates are not provided.</p>
              <a href={fallbackMap} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full border border-emerald-200 px-4 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-50">
                Open Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[30px] border border-emerald-900/10 bg-white p-4 shadow-lg shadow-emerald-900/5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Search by hotel, area, district, or amenity"
            />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              aria-label="Sort stays"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price">Price: Low to high</option>
              <option value="verified">Verified first</option>
            </select>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {typeChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveType(chip)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                  activeType === chip
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-emerald-100 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-4">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-stone-600">
            Showing {visibleStays.length} of {featuredStays.length} stay listings.
          </p>
          <Link href="/contact" className="w-fit rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">Ask Availability</Link>
        </div>

        {visibleStays.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {visibleStays.map((stay) => (
              <article key={stay.name} className="flex h-full flex-col overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
                <div className="relative h-52 bg-emerald-50">
                  <Image src={safeImage(stay.image, images.hotelFallback)} alt={`${stay.name} in ${stay.area}`} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {stay.publicListing ? <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-800">Public listing</span> : null}
                    {stay.verified ? <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">Verified</span> : null}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{stay.type}</p>
                      <h2 className="mt-2 text-xl font-black">{stay.name}</h2>
                      <p className="mt-1 text-sm text-stone-500">{stay.area}, {stay.district}</p>
                    </div>
                    <p className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">{stay.priceFrom}</p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {stay.amenities.map((amenity) => (
                      <span key={amenity} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{amenity}</span>
                    ))}
                  </div>
                  <div className="mt-auto grid gap-2 pt-6 sm:grid-cols-2">
                    <Link href="/hotels" className="rounded-xl border border-emerald-200 px-3 py-2 text-center text-xs font-bold text-emerald-800 hover:bg-emerald-50">View Details</Link>
                    <a href={stay.googleMapLink || fallbackMap} target="_blank" rel="noreferrer" className="rounded-xl border border-stone-200 px-3 py-2 text-center text-xs font-bold text-stone-700 hover:bg-stone-50">Google Maps</a>
                    <Link href="/contact" className="rounded-xl bg-emerald-700 px-3 py-2 text-center text-xs font-bold text-white hover:bg-emerald-800 sm:col-span-2">Ask Availability / Send Inquiry</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-8 text-center shadow-lg shadow-emerald-900/5">
            <h2 className="text-2xl font-black">No stays match that search.</h2>
            <p className="mt-3 text-sm text-stone-600">Try another area, amenity, or stay type.</p>
            <ButtonLink href="/contact" variant="secondary">Ask Pahuna for help</ButtonLink>
          </div>
        )}
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}
