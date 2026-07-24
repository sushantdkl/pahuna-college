"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, PageShell, SectionShell, SiteFooter, SiteHeader } from "@/components/pahuna-layout";
import { TourismMap } from "@/components/tourism-map";
import { getDestination, type PublicDestination } from "@/lib/api/public-catalog";
import { resolveApiAssetUrl } from "@/lib/api/axios-instance";
import { images, safeImage } from "@/lib/pahuna-content";

export function DestinationDetailClient({ slug }: { slug: string }) {
  const [destination, setDestination] = useState<PublicDestination | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDestination(slug)
      .then((response) => setDestination(response.data))
      .catch((failure: Error) => setError(failure.message));
  }, [slug]);

  return (
    <PageShell>
      <SiteHeader />
      {!destination ? (
        <SectionShell>
          <State title={error ? "Destination not available" : "Loading destination"} description={error || "Fetching destination details."} />
        </SectionShell>
      ) : (
        <>
          <section className="relative min-h-[440px] overflow-hidden bg-stone-950 text-white">
            <Image unoptimized src={safeImage(resolveApiAssetUrl(destination.images[0]), images.destinationFallback)} alt={destination.name} fill priority sizes="100vw" className="object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-transparent" />
            <SectionShell className="relative z-10 py-24">
              <Link href="/destinations" className="text-sm font-bold text-emerald-200">← All destinations</Link>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-emerald-200">{destination.category || "Destination"}</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">{destination.name}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{destination.description}</p>
            </SectionShell>
          </section>
          <SectionShell>
            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              <article className="rounded-[30px] border border-emerald-900/10 bg-white p-6 shadow-lg sm:p-8">
                <h2 className="text-3xl font-black">What to explore</h2>
                {destination.attractions.length ? (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {destination.attractions.map((item) => <div key={item} className="rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-900">📍 {item}</div>)}
                  </div>
                ) : (
                  <p className="mt-4 text-stone-600">Ask Pahuna for locally recommended stops.</p>
                )}
                <div className="mt-8">
                  <TourismMap
                    markers={[{
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
                    }]}
                    heightClass="h-[320px]"
                    emptyTitle="Destination location not available"
                    emptyDescription="This destination does not yet include valid backend latitude and longitude."
                  />
                </div>
              </article>
              <aside className="space-y-4">
                <Detail label="📍 District" value={destination.district || "Karnali"} />
                <Detail label="🌦️ Best time" value={destination.bestTimeToVisit || "Ask for seasonal advice"} />
                <Detail label="📏 From Surkhet" value={destination.distanceFromSurkhetKm ? `${destination.distanceFromSurkhetKm} km` : "Route dependent"} />
                <div className="flex flex-wrap gap-3 pt-2">
                  <ButtonLink href="/trip-planner">Plan trip</ButtonLink>
                  <ButtonLink href="/contact" variant="secondary">Ask Pahuna</ButtonLink>
                </div>
              </aside>
            </div>
          </SectionShell>
        </>
      )}
      <SiteFooter />
    </PageShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[24px] border border-emerald-900/10 bg-white p-5"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">{label}</p><p className="mt-2 font-black">{value}</p></div>;
}

function State({ title, description }: { title: string; description: string }) {
  return <div className="rounded-[28px] border border-dashed border-emerald-900/20 bg-white/70 p-12 text-center"><h1 className="text-2xl font-black">{title}</h1><p className="mt-3 text-stone-600">{description}</p><Link href="/destinations" className="mt-6 inline-flex text-sm font-bold text-emerald-800">Back to destinations</Link></div>;
}
