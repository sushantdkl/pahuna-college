"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { foodProviders, images, safeImage } from "@/lib/pahuna-content";

const ALL = "All";
const foodCategories = ["Cafes", "Momo & Fast Food", "Family Restaurants", "Viewpoint Cafes", "Local Food", "Events & Party Venues"];

export default function FoodPage() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState(ALL);
  const [activeArea, setActiveArea] = useState(ALL);
  const [activeCuisine, setActiveCuisine] = useState(ALL);
  const [activeFeature, setActiveFeature] = useState(ALL);

  const options = useMemo(() => {
    const unique = (values: string[]) => [ALL, ...Array.from(new Set(values.filter(Boolean))).sort()];

    return {
      types: unique(foodProviders.map((provider) => provider.typeLabel)),
      areas: unique(foodProviders.map((provider) => provider.area)),
      cuisines: unique(foodProviders.flatMap((provider) => provider.cuisines)),
      features: unique(foodProviders.flatMap((provider) => provider.features)),
    };
  }, []);

  const visibleProviders = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return foodProviders.filter((provider) => {
      if (activeType !== ALL && provider.typeLabel !== activeType) return false;
      if (activeArea !== ALL && provider.area !== activeArea) return false;
      if (activeCuisine !== ALL && !provider.cuisines.includes(activeCuisine)) return false;
      if (activeFeature !== ALL && !provider.features.includes(activeFeature)) return false;
      if (!needle) return true;

      return [
        provider.name,
        provider.type,
        provider.typeLabel,
        provider.area,
        provider.district,
        provider.shortDescription,
        ...provider.cuisines,
        ...provider.services,
        ...provider.features,
      ].join(" ").toLowerCase().includes(needle);
    });
  }, [activeArea, activeCuisine, activeFeature, activeType, query]);

  const featured = foodProviders.filter((provider) => provider.featured).slice(0, 4);

  return (
    <PageShell>
      <SiteHeader />
      <SectionShell className="pt-14">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Food & cafes"
              title="Cafes, restaurants, momo spots, tea shops, and route food."
              description="A fuller Surkhet food explorer inspired by the reference: categories, featured listings, search, filters, food detail pages, and inquiry-first planning."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#food-listings">Browse food places</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">Send food inquiry</ButtonLink>
            </div>
          </div>
          <div className="relative min-h-[380px] overflow-hidden rounded-[32px] bg-stone-900 shadow-2xl shadow-emerald-900/10">
            <Image src={images.cafe} alt="Pahuna food and cafe guide" fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200">Surkhet food guide</p>
              <p className="mt-2 text-2xl font-black">Plan food before the route gets difficult.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {foodCategories.map((category) => (
            <div key={category} className="rounded-[24px] border border-emerald-900/10 bg-white p-5 shadow-sm">
              <div className="mb-4 h-1.5 w-14 rounded-full bg-amber-400" />
              <p className="text-sm font-black text-stone-900">{category}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      {featured.length ? (
        <SectionShell className="py-8">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader eyebrow="Featured food places" title="Traveler-friendly food stops around Birendranagar." />
            <ButtonLink href="#food-listings" variant="secondary">View all listings</ButtonLink>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((provider) => (
              <FoodCard key={provider.slug} provider={provider} compact />
            ))}
          </div>
        </SectionShell>
      ) : null}

      <SectionShell id="food-listings" className="pt-8">
        <div className="rounded-[30px] border border-emerald-900/10 bg-white p-4 shadow-lg shadow-emerald-900/5">
          <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto_auto_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Search cafes, momo, thakali, route snacks, area..."
            />
            <FilterSelect label="Type" value={activeType} onChange={setActiveType} options={options.types} />
            <FilterSelect label="Area" value={activeArea} onChange={setActiveArea} options={options.areas} />
            <FilterSelect label="Cuisine" value={activeCuisine} onChange={setActiveCuisine} options={options.cuisines} />
            <FilterSelect label="Feature" value={activeFeature} onChange={setActiveFeature} options={options.features} />
          </div>
          <p className="mt-4 text-sm font-semibold text-stone-600">Showing {visibleProviders.length} of {foodProviders.length} food listings.</p>
        </div>

        {visibleProviders.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleProviders.map((provider) => (
              <FoodCard key={provider.slug} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-emerald-900/10 bg-white p-8 text-center shadow-lg shadow-emerald-900/5">
            <h2 className="text-2xl font-black">No food listings found.</h2>
            <p className="mt-3 text-sm text-stone-600">Try changing the filters or ask Pahuna for local food help.</p>
            <div className="mt-6">
              <ButtonLink href="/contact" variant="secondary">Suggest or ask food place</ButtonLink>
            </div>
          </div>
        )}
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

function FoodCard({ provider, compact = false }: { provider: (typeof foodProviders)[number]; compact?: boolean }) {
  const trustBadge = provider.verificationStatus === "VERIFIED" || provider.verificationStatus === "PARTNER" ? "Verified" : "Public Listing";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
      <div className={`relative bg-emerald-50 ${compact ? "h-48" : "h-56"}`}>
        <Image src={safeImage(provider.image, images.foodFallback)} alt={provider.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-800">{provider.typeLabel}</span>
          <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">{trustBadge}</span>
        </div>
        {provider.rating ? (
          <div className="absolute bottom-4 right-4 rounded-2xl bg-white/95 px-3 py-2 text-sm font-black text-stone-900 shadow">{provider.rating.toFixed(1)} / 5</div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{provider.area}, {provider.district}</p>
        <h2 className="mt-2 text-xl font-black">{provider.name}</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">{provider.shortDescription}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {Array.from(new Set([...provider.cuisines, ...provider.features])).slice(0, 5).map((item) => (
            <span key={item} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{item}</span>
          ))}
        </div>
        <div className="mt-auto grid gap-2 pt-6 sm:grid-cols-2">
          <Link href={`/food/${provider.slug}`} className="rounded-xl border border-emerald-200 px-3 py-2 text-center text-xs font-bold text-emerald-800 hover:bg-emerald-50">View Details</Link>
          <Link href="/contact" className="rounded-xl bg-emerald-700 px-3 py-2 text-center text-xs font-bold text-white hover:bg-emerald-800">Send Inquiry</Link>
        </div>
      </div>
    </article>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500">
        {options.map((option) => (
          <option key={option} value={option}>{option === ALL ? label : option}</option>
        ))}
      </select>
    </label>
  );
}
