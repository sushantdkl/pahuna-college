"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ButtonLink, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { galleryItems, images } from "@/lib/pahuna-content";

const categories = ["All", "Surkhet", "Karnali", "Culture", "Adventure"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredItems = useMemo(
    () => galleryItems.filter((item) => activeCategory === "All" || item.category === activeCategory),
    [activeCategory],
  );

  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      <section className="relative overflow-hidden bg-emerald-950 text-white">
        <Image src={images.karnaliHero} alt="Karnali visual highlights" fill priority sizes="100vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/80 to-stone-950/30" />
        <SectionShell className="relative z-10 py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-200">Gallery</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Visual moments from Surkhet and Karnali.</h1>
            <p className="mt-6 text-lg leading-8 text-white/80">Real local assets, meaningful alt text, responsive cards, and no hotlinked image dependency.</p>
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader title="Browse by visual category" description="Filter destination, Surkhet, Karnali, culture, and adventure moments using local images." />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                  activeCategory === category
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold text-stone-600">Showing {filteredItems.length} image moments.</p>
        <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filteredItems.map((item, index) => (
            <figure key={item.title} className="mb-5 break-inside-avoid overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
              <div className={`relative ${index % 3 === 0 ? "h-80" : index % 3 === 1 ? "h-64" : "h-96"}`}>
                <Image src={item.image || images.destinationFallback} alt={item.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <figcaption className="p-5">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-800">{item.category}</span>
                <h2 className="mt-3 text-lg font-black">{item.title}</h2>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 rounded-[32px] bg-emerald-900 p-8 text-white sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-200">Need more context?</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight">Turn visual interest into a real trip question.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/80">Ask about route, stay, food, or timing before confirming a booking.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/contact" variant="secondary">Send Inquiry</ButtonLink>
            <ButtonLink href="/explore" variant="ghost">Explore Surkhet</ButtonLink>
          </div>
        </div>
      </SectionShell>
      <SiteFooter />
    </main>
  );
}
