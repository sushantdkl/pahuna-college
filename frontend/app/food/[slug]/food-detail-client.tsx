"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { TourismMap, type TourismMapMarker } from "@/app/_components/tourism-map";
import { getFoodProvider, getFoodProviders, type FoodProvider } from "@/lib/actions/final-crud-actions";
import { resolveApiAssetUrl } from "@/lib/api/axios-instance";
import { images, safeImage } from "@/lib/pahuna-content";

export function FoodDetailClient({ slug }: { slug: string }) {
  const [provider, setProvider] = useState<FoodProvider | null>(null);
  const [related, setRelated] = useState<FoodProvider[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getFoodProvider(slug), getFoodProviders({ limit: 50 })])
      .then(([providerResponse, providersResponse]) => {
        setProvider(providerResponse.data);
        const current = providerResponse.data;
        setRelated((providersResponse.data || []).filter((item) => item.slug !== current?.slug).slice(0, 3));
      })
      .catch((failure: Error) => setError(failure.message));
  }, [slug]);

  const canShowContact = provider?.verificationStatus === "VERIFIED" || provider?.verificationStatus === "PARTNER";
  const image = safeImage(resolveApiAssetUrl(provider?.images?.[0]), images.foodFallback);
  const gallery = (provider?.images || []).slice(1, 4).map((item) => safeImage(resolveApiAssetUrl(item), images.foodFallback));
  const marker = useMemo<TourismMapMarker[]>(
    () =>
      provider
        ? [{
            id: provider._id,
            name: provider.name,
            category: "food",
            latitude: provider.latitude,
            longitude: provider.longitude,
            type: provider.type,
            location: `${provider.area}, ${provider.district}`,
            price: provider.priceLevel || "Ask price",
            href: `/food/${provider.slug}`,
            secondaryHref: "/trip-planner",
            secondaryLabel: "Build Route",
          }]
        : [],
    [provider],
  );

  return (
    <PageShell>
      <SiteHeader />
      {!provider ? (
        <SectionShell>
          <div className="rounded-[8px] border border-dashed border-emerald-200 bg-white p-12 text-center">
            <h1 className="text-2xl font-black">{error ? "Food listing not available" : "Loading food listing"}</h1>
            <p className="mt-3 text-stone-600">{error || "Fetching the latest public food details."}</p>
            <Link href="/food" className="mt-6 inline-flex font-bold text-emerald-800">{"\u{2190}"} Back to food guide</Link>
          </div>
        </SectionShell>
      ) : (
        <>
          <section className="border-b border-emerald-900/10 bg-[#fffdf7] py-4">
            <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-sm font-semibold text-stone-500 sm:px-6 lg:px-8">
              <Link href="/food" className="text-emerald-800 hover:text-emerald-900">Food & cafes</Link>
              <span>/</span>
              <span className="text-stone-900">{provider.name}</span>
            </div>
          </section>

          <SectionShell className="pt-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
              <div className="space-y-8">
                <div className="relative min-h-[390px] overflow-hidden rounded-[8px] bg-stone-950">
                  <Image unoptimized src={image} alt={provider.name} fill priority sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200">{provider.type}</p>
                    <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{provider.name}</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">{provider.shortDescription}</p>
                  </div>
                </div>

                <div className="rounded-[8px] border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                  <SectionHeader eyebrow={provider.type} title="Food listing details" description={provider.longDescription || provider.shortDescription} />
                  <div className="mt-8 grid gap-4 sm:grid-cols-4">
                    <DetailTile label="Area" value={provider.area} />
                    <DetailTile label="District" value={provider.district} />
                    <DetailTile label="Price" value={provider.priceLevel || "Confirm"} />
                    <DetailTile label="Rating" value={provider.rating ? `${provider.rating.toFixed(1)} / 5` : "Pending"} />
                  </div>

                  <InfoSection title="Cuisines" values={provider.cuisines} />
                  <InfoSection title="Services" values={provider.services} />
                  <InfoSection title="Features" values={provider.features} />

                  <div className="mt-8">
                    <TourismMap
                      markers={marker}
                      heightClass="h-[300px]"
                      emptyTitle="Food provider location not available"
                      emptyDescription="Exact markers appear only after backend latitude and longitude are available."
                    />
                  </div>

                  <div className="mt-8 rounded-[8px] border border-amber-200 bg-amber-50 p-5">
                    <p className="text-sm font-black text-amber-900">Verification note</p>
                    <p className="mt-2 text-sm leading-6 text-amber-900/80">Opening hours, menu, prices, and group availability should be confirmed through Pahuna inquiry before planning around this food stop.</p>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink href={`/contact?topic=${encodeURIComponent(`Food inquiry: ${provider.name}`)}`}>Contact via Pahuna Inquiry</ButtonLink>
                    <Link href={`/login?redirect=${encodeURIComponent(`/food/${provider.slug}`)}`} className="inline-flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-900 transition hover:bg-amber-100">
                      Mark interested
                    </Link>
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <div className="rounded-[8px] border border-emerald-100 bg-white p-6 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Food inquiry</p>
                  <h2 className="mt-3 text-2xl font-black">Confirm before you go.</h2>
                  <p className="mt-3 text-sm leading-6 text-stone-600">Send one inquiry for timing, menu fit, group size, and nearby route context.</p>
                  <div className="mt-6">
                    <ButtonLink href={`/contact?topic=${encodeURIComponent(`Food inquiry: ${provider.name}`)}`}>Send Inquiry</ButtonLink>
                  </div>
                  <div className="mt-6 space-y-2 border-t border-stone-200 pt-5 text-sm">
                    {canShowContact ? (
                      <>
                        {provider.phone ? <a href={`tel:${provider.phone}`} className="block font-bold text-stone-700 hover:text-emerald-700">{"\u{1F4DE}"} {provider.phone}</a> : null}
                        {provider.email ? <a href={`mailto:${provider.email}`} className="block font-bold text-stone-700 hover:text-emerald-700">{"\u{2709}\u{FE0F}"} {provider.email}</a> : null}
                        {provider.website ? <a href={provider.website} target="_blank" rel="noreferrer" className="block font-bold text-stone-700 hover:text-emerald-700">{"\u{1F310}"} Website</a> : null}
                        {!provider.phone && !provider.email && !provider.website ? <p className="text-stone-600">Direct contact details are not published yet.</p> : null}
                      </>
                    ) : (
                      <p className="rounded-[8px] bg-emerald-50 p-3 font-bold text-emerald-800">Contact via Pahuna Inquiry</p>
                    )}
                  </div>
                </div>
                {gallery.length ? (
                  <div className="grid gap-3">
                    {gallery.map((item, index) => (
                      <div key={`${item}-${index}`} className="relative h-32 overflow-hidden rounded-[8px] bg-emerald-50">
                        <Image unoptimized src={item} alt={`${provider.name} gallery ${index + 2}`} fill sizes="380px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                ) : null}
              </aside>
            </div>
          </SectionShell>

          {related.length ? (
            <SectionShell className="pt-0">
              <SectionHeader eyebrow="Related food" title="Similar food places to compare." />
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {related.map((item) => (
                  <Link key={item.slug} href={`/food/${item.slug}`} className="overflow-hidden rounded-[8px] border border-emerald-100 bg-white shadow-sm">
                    <div className="relative h-44">
                      <Image unoptimized src={safeImage(resolveApiAssetUrl(item.images?.[0]), images.foodFallback)} alt={item.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{item.type}</p>
                      <h2 className="mt-2 font-black">{item.name}</h2>
                      <p className="mt-2 text-sm text-stone-600">{item.area}, {item.district}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </SectionShell>
          ) : null}
        </>
      )}
      <SiteFooter />
    </PageShell>
  );
}

function DetailTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-emerald-100 bg-[#fffaf0] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-2 text-sm font-black text-stone-950">{value}</p>
    </div>
  );
}

function InfoSection({ title, values }: { title: string; values: string[] }) {
  if (!values.length) return null;

  return (
    <div className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {values.map((value) => (
          <span key={value} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">{value}</span>
        ))}
      </div>
    </div>
  );
}
