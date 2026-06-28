import Image from "next/image";
import Link from "next/link";
import { ButtonLink, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { foodHighlights, images } from "@/lib/pahuna-content";

export default function FoodPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      <SectionShell className="pt-14">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionHeader eyebrow="Food & cafes" title="Find simple food stops before the route gets difficult." description="A clean public page for cafes, restaurants, local meals, route-side tea stops, and inquiry-based recommendations." />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Ask for food suggestion</ButtonLink>
              <ButtonLink href="/explore" variant="secondary">Explore Surkhet</ButtonLink>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-[32px] bg-stone-900 shadow-2xl shadow-emerald-900/10">
            <Image src={images.cafe} alt="Pahuna food and cafe guide" fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 text-xl font-black text-white">Cafes, family meals, local restaurants, and route snacks.</p>
          </div>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {foodHighlights.map((item) => (
            <Link key={item.title} href={item.href} className="overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
              <div className="relative h-56">
                <Image src={item.image || images.food} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{item.eyebrow}</p>
                <h2 className="mt-2 text-xl font-black">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </SectionShell>
      <SiteFooter />
    </main>
  );
}