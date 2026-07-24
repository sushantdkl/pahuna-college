"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, PageHero, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { TourismMap, type TourismMapMarker } from "@/app/_components/tourism-map";
import { getExperiences, type PublicExperience } from "@/lib/api/public-catalog";
import { resolveApiAssetUrl } from "@/lib/api/axios-instance";
import { images, safeImage } from "@/lib/pahuna-content";

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<PublicExperience[]>([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getExperiences({ limit: 50 })
      .then((response) => setExperiences(response.data || []))
      .catch((failure: Error) => setError(failure.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(experiences.map((item) => item.category))).sort()], [experiences]);
  const visible = category === "All" ? experiences : experiences.filter((item) => item.category === category);
  const mapMarkers = useMemo<TourismMapMarker[]>(
    () =>
      visible.map((experience) => ({
        id: experience._id,
        name: experience.name,
        category: "experience",
        latitude: experience.latitude,
        longitude: experience.longitude,
        type: experience.category,
        location: experience.location,
        price: experience.price !== undefined ? `NPR ${experience.price.toLocaleString()}` : "Ask price",
        duration: experience.duration,
        href: `/experiences/${experience.slug}`,
        secondaryHref: "/trip-planner",
        secondaryLabel: "Build Route",
      })),
    [visible],
  );

  return (
    <PageShell>
      <SiteHeader />
      <PageHero
        eyebrow="Karnali experiences"
        title="Things to Do in Surkhet"
        description="Curated experiences for every type of traveler - adventure seekers, culture enthusiasts, food lovers, and nature admirers."
        image={images.tharuCulture}
      >
        <ButtonLink href="/contact">Ask about an experience</ButtonLink>
      </PageHero>

      <SectionShell>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader eyebrow="Local experiences" title="Choose a story to step into." description="Browse safely, review practical details, and send an inquiry before confirming." />
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${category === item ? "bg-emerald-700 text-white" : "border border-emerald-200 bg-white text-emerald-800"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <TourismMap
            markers={mapMarkers}
            heightClass="h-[300px]"
            emptyTitle="Experience locations not available"
            emptyDescription="Published experiences without valid coordinates remain listed below, but exact markers appear only when backend latitude and longitude are available."
          />
        </div>

        {loading || error || !visible.length ? (
          <State title={loading ? "Loading experiences" : error ? "Experiences are temporarily unavailable" : "No experiences in this category"} description={error || (loading ? "Fetching the latest published experiences." : "Choose another category to keep exploring.")} />
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((experience) => (
              <article key={experience._id} className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5 transition hover:-translate-y-1 hover:shadow-xl">
                <Link href={`/experiences/${experience.slug}`} className="relative block h-60 overflow-hidden bg-emerald-50">
                  <Image unoptimized src={safeImage(resolveApiAssetUrl(experience.images[0]), images.destinationFallback)} alt={experience.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{experience.category} / {experience.location}</p>
                  <h2 className="mt-2 text-2xl font-black">{experience.name}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">{experience.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {experience.duration ? <Meta value={experience.duration} /> : null}
                    {experience.price !== undefined ? <Meta value={`NPR ${experience.price.toLocaleString()}`} /> : <Meta value="Ask price" />}
                    {experience.rating ? <Meta value={`${experience.rating.toFixed(1)} / 5`} /> : null}
                  </div>
                  <Link href={`/experiences/${experience.slug}`} className="mt-auto pt-6 text-sm font-black text-emerald-800">View experience</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionShell>

      <section className="bg-[#071121] text-white">
        <SectionShell className="text-center">
          <h2 className="text-3xl font-black">Want a Customized Experience?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/70">Tell us what kind of experience you are looking for and we will suggest a personalized itinerary.</p>
          <div className="mt-7 flex justify-center gap-3">
            <ButtonLink href="/contact">Get in Touch</ButtonLink>
            <ButtonLink href="/trip-planner" variant="ghost">View Trip Ideas</ButtonLink>
          </div>
        </SectionShell>
      </section>

      <SiteFooter />
    </PageShell>
  );
}

function Meta({ value }: { value: string }) {
  return <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">{value}</span>;
}

function State({ title, description }: { title: string; description: string }) {
  return <div className="mt-10 rounded-[8px] border border-dashed border-emerald-900/20 bg-white/70 p-12 text-center"><h2 className="text-2xl font-black">{title}</h2><p className="mt-3 text-sm text-stone-600">{description}</p></div>;
}
