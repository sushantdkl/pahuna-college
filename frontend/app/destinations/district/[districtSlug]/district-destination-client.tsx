"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { TourismMap, type TourismMapMarker } from "@/app/_components/tourism-map";
import { getDestinations, getHotels, publicHotelToStay, type PublicDestination, type PublicHotel } from "@/lib/api/public-catalog";
import { resolveApiAssetUrl } from "@/lib/api/axios-instance";
import { images, safeImage } from "@/lib/pahuna-content";

function fromDistrictSlug(slug: string) {
  return slug.split("-").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function DistrictDestinationClient({ districtSlug }: { districtSlug: string }) {
  const districtName = fromDistrictSlug(districtSlug);
  const [destinations, setDestinations] = useState<PublicDestination[]>([]);
  const [stays, setStays] = useState<PublicHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getDestinations({ district: districtName, limit: 50 }),
      getHotels({ district: districtName, limit: 4 }),
    ])
      .then(([destinationResponse, hotelResponse]) => {
        setDestinations(destinationResponse.data || []);
        setStays(hotelResponse.data || []);
      })
      .catch((failure: Error) => setError(failure.message))
      .finally(() => setLoading(false));
  }, [districtName]);

  const mapMarkers = useMemo<TourismMapMarker[]>(
    () =>
      destinations.map((destination) => ({
        id: destination._id,
        name: destination.name,
        category: "destination",
        latitude: destination.latitude,
        longitude: destination.longitude,
        type: destination.category || "Destination",
        location: destination.district || districtName,
        href: `/destinations/${destination.slug}`,
        secondaryHref: `/trip-planner?district=${encodeURIComponent(districtName)}`,
        secondaryLabel: "Plan district",
      })),
    [destinations, districtName],
  );

  return (
    <PageShell>
      <SiteHeader />
      <section className="bg-[#f8f1e4]">
        <SectionShell className="py-16">
          <Link href="/destinations" className="text-xs font-black uppercase tracking-[0.18em] text-emerald-800">{"\u{2190}"} All destinations</Link>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">{districtName} Destinations</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600">Plan {districtName} as part of a wider Karnali route from Surkhet, with cautious access notes, nearby stays, and places to verify before travel.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href={`/trip-planner?district=${encodeURIComponent(districtName)}`}>Plan {districtName}</ButtonLink>
            <ButtonLink href="/destinations" variant="secondary">All destinations</ButtonLink>
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        {loading || error || !destinations.length ? (
          <div className="rounded-[8px] border border-dashed border-emerald-200 bg-white p-10 text-center">
            <h2 className="text-2xl font-black">{loading ? "Loading district guide" : error ? "District guide unavailable" : "No published destinations found"}</h2>
            <p className="mt-3 text-sm text-stone-600">{error || (loading ? "Fetching published Karnali destinations." : "Try the all-destinations guide.")}</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
            <div>
              <SectionHeader eyebrow="District guide" title={`${destinations.length} places to compare in ${districtName}`} description="Destination entries are inquiry-first planning records. Confirm route time, weather, transport, and local support before final travel." />
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {destinations.map((destination) => (
                  <Link key={destination._id} href={`/destinations/${destination.slug}`} className="group rounded-[8px] border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="relative h-44 overflow-hidden rounded-[6px] bg-emerald-50">
                      <Image unoptimized src={safeImage(resolveApiAssetUrl(destination.images[0]), images.destinationFallback)} alt={destination.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                    <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{destination.category || districtName}</p>
                    <h2 className="mt-2 text-xl font-black">{destination.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{destination.description}</p>
                    <span className="mt-4 inline-flex rounded-md bg-emerald-700 px-3 py-2 text-xs font-black text-white">View guide</span>
                  </Link>
                ))}
              </div>
            </div>
            <aside className="space-y-5">
              <div className="rounded-[8px] border border-emerald-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Suggested route from Surkhet</p>
                <h2 className="mt-2 text-xl font-black">Confirm before departure</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{getDistrictRouteNote(districtName)}</p>
                <p className="mt-4 rounded-[8px] bg-amber-50 p-3 text-xs leading-5 text-amber-900">Route time, transport cost, weather, and operator schedule may change. Keep buffer time and confirm locally.</p>
              </div>
              <TourismMap markers={mapMarkers} heightClass="h-[300px]" emptyTitle="District map coordinates unavailable" emptyDescription="Exact markers appear only when backend coordinates exist." />
            </aside>
          </div>
        )}
      </SectionShell>

      <section className="bg-white">
        <SectionShell>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader eyebrow="Stays and services" title={`Nearby providers in ${districtName}`} />
            <ButtonLink href={`/hotels?district=${encodeURIComponent(districtName)}`} variant="secondary">View stays & services</ButtonLink>
          </div>
          {stays.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {stays.map((hotel) => {
                const stay = publicHotelToStay(hotel);
                return (
                  <Link key={hotel._id} href={`/hotels/${hotel.slug}`} className="rounded-[8px] border border-emerald-100 bg-white p-4 shadow-sm">
                    <div className="relative h-36 overflow-hidden rounded-[6px] bg-emerald-50">
                      <Image unoptimized src={safeImage(stay.image, images.hotelFallback)} alt={hotel.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                    </div>
                    <h3 className="mt-4 font-black">{hotel.name}</h3>
                    <p className="mt-2 text-xs leading-5 text-stone-600">{hotel.address}</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[8px] border border-dashed border-emerald-200 bg-white p-8 text-center text-stone-600">Nearby stays and services are being verified by Pahuna.</div>
          )}
        </SectionShell>
      </section>
      <SiteFooter />
    </PageShell>
  );
}

function getDistrictRouteNote(district: string) {
  const notes: Record<string, string> = {
    Surkhet: "Use Birendranagar as the main urban base for local attractions, stays, transport, and onward Karnali route planning.",
    Dailekh: "Plan Dailekh from Surkhet by road and confirm vehicle availability, road condition, and local religious circuit access.",
    Salyan: "Plan Salyan from Surkhet by road with buffer time for hill-road conditions and local transport confirmation.",
    Jajarkot: "Plan Jajarkot from Surkhet by road and confirm road condition, seasonal disruptions, and district-level transport.",
    Kalikot: "Use Kalikot as an important road corridor toward Jumla and Rara, with road condition checks before departure.",
    Jumla: "Reach Jumla through flight or road options depending on schedule and season, then confirm onward routes locally.",
    Mugu: "Plan Mugu and Rara with extra buffer time because road, flight, weather, and local transport conditions can change.",
    Dolpa: "Plan Dolpa through confirmed air and trekking connections; permits, weather, and guide support should be checked early.",
    Humla: "Plan Humla through confirmed remote flight or supported route options, with buffer days for weather-sensitive travel.",
  };

  return notes[district] ?? "Confirm the Surkhet connection, transport options, road condition, and local support before travel.";
}
