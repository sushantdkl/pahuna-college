"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, PageShell, SectionShell, SiteFooter, SiteHeader } from "@/components/pahuna-layout";
import { TourismMap } from "@/components/tourism-map";
import { getExperience, type PublicExperience } from "@/lib/api/public-catalog";
import { resolveApiAssetUrl } from "@/lib/api/axios-instance";
import { images, safeImage } from "@/lib/pahuna-content";

export function ExperienceDetailClient({ slug }: { slug: string }) {
  const [experience, setExperience] = useState<PublicExperience | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getExperience(slug)
      .then((response) => setExperience(response.data))
      .catch((failure: Error) => setError(failure.message));
  }, [slug]);

  return (
    <PageShell>
      <SiteHeader />
      {!experience ? (
        <SectionShell>
          <div className="rounded-[28px] border border-dashed border-emerald-900/20 bg-white/70 p-12 text-center">
            <h1 className="text-2xl font-black">{error ? "Experience not available" : "Loading experience"}</h1>
            <p className="mt-3 text-stone-600">{error || "Fetching the latest details."}</p>
            <Link href="/experiences" className="mt-6 inline-flex font-bold text-emerald-800">← Back to experiences</Link>
          </div>
        </SectionShell>
      ) : (
        <SectionShell className="pt-10">
          <Link href="/experiences" className="text-sm font-bold text-emerald-800">← All experiences</Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="relative min-h-[420px] overflow-hidden rounded-[32px] bg-stone-900">
                <Image unoptimized src={safeImage(resolveApiAssetUrl(experience.images[0]), images.destinationFallback)} alt={experience.name} fill priority sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" />
              </div>
              <article className="mt-8 rounded-[30px] border border-emerald-900/10 bg-white p-6 shadow-lg sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">{experience.category}</p>
                <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{experience.name}</h1>
                <p className="mt-5 text-base leading-8 text-stone-600">{experience.description}</p>
              </article>
              <div className="mt-8">
                <TourismMap
                  markers={[{
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
                  }]}
                  heightClass="h-[320px]"
                  emptyTitle="Experience location not available"
                  emptyDescription="This experience does not yet include valid backend latitude and longitude."
                />
              </div>
            </div>
            <aside className="space-y-4">
              <Detail label="📍 Location" value={experience.location} />
              <Detail label="⏱️ Duration" value={experience.duration || "Confirm by inquiry"} />
              <Detail label="💰 Price" value={experience.price !== undefined ? `NPR ${experience.price.toLocaleString()}` : "Ask price"} />
              <Detail label="👥 Group size" value={experience.maxParticipants ? `Up to ${experience.maxParticipants}` : "Confirm by inquiry"} />
              <div className="pt-2">
                <ButtonLink href={`/contact?topic=${encodeURIComponent(`Experience inquiry: ${experience.name}`)}`}>Send inquiry</ButtonLink>
              </div>
            </aside>
          </div>
        </SectionShell>
      )}
      <SiteFooter />
    </PageShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[24px] border border-emerald-900/10 bg-white p-5"><p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">{label}</p><p className="mt-2 font-black">{value}</p></div>;
}
