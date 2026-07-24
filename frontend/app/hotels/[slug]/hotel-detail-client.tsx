"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HotelActionButtons } from "@/components/hotel-action-buttons";
import { PageShell, SectionShell, SiteFooter, SiteHeader } from "@/components/pahuna-layout";
import { StayMapCard } from "@/components/stay-map-card";
import { getHotel, publicHotelToStay } from "@/lib/api/public-catalog";
import { images, safeImage, type StayCard } from "@/lib/pahuna-content";

export function HotelDetailClient({ slug }: { slug: string }) {
  const [stay, setStay] = useState<StayCard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getHotel(slug)
      .then((response) => setStay(response.data ? publicHotelToStay(response.data) : null))
      .catch((failure: Error) => setError(failure.message));
  }, [slug]);

  return (
    <PageShell>
      <SiteHeader />
      <div className="border-b border-emerald-900/10 bg-white/80 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-sm font-semibold text-stone-500 sm:px-6 lg:px-8">
          <Link href="/hotels" className="text-emerald-800 hover:text-emerald-900">Stays</Link>
          <span>/</span>
          <span className="truncate text-stone-900">{stay?.name || "Stay details"}</span>
        </div>
      </div>

      {!stay ? (
        <SectionShell>
          <div className="rounded-[28px] border border-dashed border-emerald-900/20 bg-white/70 p-12 text-center">
            <h1 className="text-2xl font-black">{error ? "Stay not available" : "Loading stay"}</h1>
            <p className="mt-3 text-sm text-stone-600">{error || "Fetching the latest listing details."}</p>
            {error ? <Link href="/hotels" className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Back to stays</Link> : null}
          </div>
        </SectionShell>
      ) : (
        <SectionShell className="pt-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_390px]">
            <div className="space-y-8">
              <div className="relative min-h-[380px] overflow-hidden rounded-[32px] bg-stone-900">
                <Image unoptimized src={safeImage(stay.image, images.hotelFallback)} alt={stay.name} fill priority sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" />
              </div>
              <article className="rounded-[30px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  <Badge label={stay.typeLabel || stay.type} />
                  {stay.verified ? <Badge label="Verified" accent /> : <Badge label="Public listing" />}
                  {stay.featured ? <Badge label="Featured" warm /> : null}
                </div>
                <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{stay.name}</h1>
                <p className="mt-3 font-semibold text-stone-500">{[stay.address, stay.district].filter(Boolean).join(" · ")}</p>
                <p className="mt-5 text-base leading-8 text-stone-600">{stay.longDescription}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <Detail label="Type" value={stay.typeLabel || stay.type} />
                  <Detail label="Price" value={stay.priceFrom || "Ask price"} />
                  <Detail label="Rating" value={stay.rating ? `${stay.rating.toFixed(1)} / 5` : "Not rated"} />
                </div>
                {stay.amenities.length ? (
                  <div className="mt-8">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Amenities</h2>
                    <div className="mt-4 flex flex-wrap gap-2">{stay.amenities.map((item) => <span key={item} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">{item}</span>)}</div>
                  </div>
                ) : null}
                <HotelActionButtons slug={stay.slug} hotelName={stay.name} googleMapLink={stay.googleMapLink} />
              </article>
            </div>
            <aside className="space-y-5">
              <div className="overflow-hidden rounded-[30px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
                <StayMapCard stay={stay} />
                <div className="p-5"><h2 className="font-black">Location preview</h2><p className="mt-2 text-sm leading-6 text-stone-600">Use the marker or OpenStreetMap link to review the stay location.</p></div>
              </div>
              <div className="rounded-[26px] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">Availability is confirmed through an inquiry so the provider can verify current rooms and pricing.</div>
            </aside>
          </div>
        </SectionShell>
      )}
      <SiteFooter />
    </PageShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[22px] bg-[#fffaf0] p-4"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">{label}</p><p className="mt-2 font-black">{value}</p></div>;
}

function Badge({ label, accent, warm }: { label: string; accent?: boolean; warm?: boolean }) {
  const classes = accent ? "bg-emerald-600 text-white" : warm ? "bg-amber-400 text-amber-950" : "bg-stone-100 text-stone-700";
  return <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${classes}`}>{label}</span>;
}
