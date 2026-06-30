import Image from "next/image";
import Link from "next/link";
import { ButtonLink, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { destinations, images } from "@/lib/pahuna-content";

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <Image src={images.karnaliHero} alt="Karnali destinations" fill priority sizes="100vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-emerald-950/70 to-transparent" />
        <SectionShell className="relative z-10 py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-200">Destinations</p>
            <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">Surkhet first, Karnali next.</h1>
            <p className="mt-6 text-lg leading-8 text-white/80">A practical visual entry for Rara, Phoksundo, Kupinde Daha, river routes, and cultural extensions.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/explore">Explore Surkhet</ButtonLink>
              <ButtonLink href="/trip-planner" variant="secondary">Plan route</ButtonLink>
            </div>
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <SectionHeader title="Popular Karnali destinations" description="Each card keeps the action visible and routes back to inquiry or planning instead of dead buttons." />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {destinations.map((destination) => (
            <article id={destination.title.toLowerCase().split(" ")[0]} key={destination.title} className="overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
              <div className="relative h-64">
                <Image src={destination.image || images.destinationFallback} alt={destination.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{destination.eyebrow}</p>
                <h2 className="mt-2 text-2xl font-black">{destination.title}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{destination.description}</p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <Link href="/trip-planner" className="rounded-xl border border-emerald-200 px-3 py-2 text-center text-xs font-bold text-emerald-800 hover:bg-emerald-50">Plan Trip</Link>
                  <Link href="/contact" className="rounded-xl bg-emerald-700 px-3 py-2 text-center text-xs font-bold text-white hover:bg-emerald-800">Ask Route</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>
      <SiteFooter />
    </main>
  );
}