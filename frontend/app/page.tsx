import Image from "next/image";
import Link from "next/link";
import {
  ButtonLink,
  ImageTile,
  PageShell,
  SectionHeader,
  SectionShell,
  SiteFooter,
  SiteHeader,
  StatPill,
} from "@/app/_components/pahuna-layout";
import {
  destinations,
  featuredStays,
  foodHighlights,
  images,
  quickActions,
  surkhetPlaces,
} from "@/lib/pahuna-content";

const heroSuggestions = [
  ["Stay", "Find hotels and local stays"],
  ["Food", "Cafes, momo, restaurants"],
  ["Trip", "Routes, cost, and safety"],
];

const gatewayCards = [
  ["Where to stay", "Hotels, resorts, lodges, and practical stopovers."],
  ["Where to eat", "Cafes, local meals, and easy food stops."],
  ["Plan a trip", "Routes, cost, destinations, and travel style."],
  ["Send inquiry", "Ask the Pahuna team before confirming."],
];

export default function Home() {
  return (
    <PageShell>
      <SiteHeader />

      <section className="relative isolate overflow-hidden bg-[#071121] text-white">
        <Image src={images.hero} alt="Surkhet and Karnali landscape" fill priority sizes="100vw" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071121]/95 via-[#071121]/70 to-[#071121]/35" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fffaf0] to-transparent" />
        <SectionShell className="relative z-10 py-20 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-100">
                Karnali first public planner
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.98] tracking-tight sm:text-6xl">
                Discover Surkhet &amp; Plan Your Karnali Stay
              </h1>
              <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-white/82 sm:text-base">
                Pahuna helps you explore Surkhet, find stays, discover cafes and authentic experiences, plan routes, estimate costs, and send one clean inquiry.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/explore">Explore Surkhet</ButtonLink>
                <ButtonLink href="/hotels" variant="secondary">Find Stays</ButtonLink>
                <ButtonLink href="/trip-planner" variant="ghost">Plan a Trip</ButtonLink>
              </div>
            </div>

            <div className="rounded-[8px] border border-white/25 bg-white/12 p-4 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-sm font-black">Start here</p>
              <div className="mt-3 space-y-3">
                {heroSuggestions.map(([title, text]) => (
                  <Link key={title} href={title === "Stay" ? "/hotels" : title === "Food" ? "/food" : "/trip-planner"} className="block rounded-[8px] border border-white/20 bg-white/10 p-4 transition hover:bg-white/18">
                    <span className="text-sm font-black">{title}</span>
                    <span className="mt-1 block text-xs text-white/75">{text}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      <SectionShell className="pt-8">
        <SectionHeader eyebrow="What are you looking for?" title="Fast public paths into Pahuna." />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {quickActions.slice(0, 7).map((action) => (
            <Link key={action.title} href={action.href} className="rounded-[8px] border border-emerald-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-700">{action.meta}</p>
              <h2 className="mt-3 text-sm font-black text-stone-950">{action.title}</h2>
              <p className="mt-2 text-xs leading-5 text-stone-500">{action.description}</p>
            </Link>
          ))}
        </div>
      </SectionShell>

      <section className="bg-gradient-to-b from-[#fffaf0] to-emerald-50/70">
        <SectionShell>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionHeader
                eyebrow="Begin in Surkhet"
                title="Start with Surkhet - Gateway to Karnali"
                description="If you are visiting Karnali for the first time, start from Surkhet. Use where to go, where to stay, what to eat, and practical route notes before moving deeper."
              />
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {gatewayCards.map(([title, text]) => (
                  <div key={title} className="rounded-[8px] border border-emerald-200 bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-black">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-stone-600">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[8px] border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                Local tip: confirm rooms, route condition, weather, and pickup timing before leaving Surkhet.
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/explore">Open Surkhet Guide</ButtonLink>
                <ButtonLink href="/trip-planner" variant="secondary">Plan from Surkhet</ButtonLink>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <ImageTile title="Surkhet" subtitle="Stay, eat, shop, then go deeper into Karnali" image={images.hero} href="/explore" tall />
              </div>
              {surkhetPlaces.slice(0, 6).map((place) => (
                <ImageTile key={place.title} title={place.title} subtitle={place.eyebrow || "Surkhet"} image={place.image || images.destinationFallback} href={place.href} />
              ))}
            </div>
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader eyebrow="Hotels & stays" title="Find hotels and stays in Surkhet" description="Browse active-style stay cards, then open the backend-connected stay catalog for live listings and availability requests." />
          <ButtonLink href="/hotels" variant="secondary">View all stays</ButtonLink>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredStays.slice(0, 6).map((stay) => (
            <article key={stay.name} className="overflow-hidden rounded-[8px] border border-emerald-200 bg-white shadow-sm">
              <div className="relative h-52 bg-stone-100">
                <Image src={stay.image} alt={stay.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                <span className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1 text-xs font-black text-stone-900">{stay.priceFrom}</span>
              </div>
              <div className="p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-700">{stay.area}, {stay.district}</p>
                <h3 className="mt-2 text-lg font-black">{stay.name}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{stay.shortDescription || "Traveler-friendly stay support from the Pahuna public catalog."}</p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Link href={`/hotels/${stay.slug}`} className="rounded-[8px] border border-emerald-300 px-3 py-2 text-center text-xs font-black text-emerald-800">View Details</Link>
                  <Link href="/contact" className="rounded-[8px] bg-emerald-700 px-3 py-2 text-center text-xs font-black text-white">Ask Availability</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <section className="bg-white">
        <SectionShell>
          <SectionHeader align="center" eyebrow="Plan the rest" title="Food, destinations, trips, and route cost in one public flow." />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[foodHighlights[0], destinations[0], destinations[1]].filter(Boolean).map((item) => (
              <Link key={item.title} href={item.href} className="overflow-hidden rounded-[8px] border border-emerald-100 bg-white shadow-sm transition hover:border-emerald-300">
                <div className="relative h-48">
                  <Image src={item.image || images.destinationFallback} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-700">{item.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 grid gap-3 rounded-[8px] border border-emerald-200 bg-emerald-50 p-5 sm:grid-cols-3">
            <StatPill value="Routes" label="Transport context" />
            <StatPill value="Planner" label="Style and budget" />
            <StatPill value="Inquiry" label="Human follow-up" />
          </div>
        </SectionShell>
      </section>

      <section className="bg-[#071121] text-white">
        <SectionShell className="text-center">
          <h2 className="text-3xl font-black">Need a human-reviewed Karnali plan?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/70">
            Send your stay, food, route, or package question and the Pahuna team can review the next step.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <ButtonLink href="/contact">Send Inquiry</ButtonLink>
            <ButtonLink href="/trip-cost" variant="ghost">Try Cost Estimator</ButtonLink>
          </div>
        </SectionShell>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
