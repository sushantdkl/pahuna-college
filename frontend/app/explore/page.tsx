import Image from "next/image";
import Link from "next/link";
import {
  ButtonLink,
  ImageTile,
  SectionHeader,
  SectionShell,
  SiteFooter,
  SiteHeader,
} from "@/components/pahuna-layout";
import { foodHighlights, images, routeCards } from "@/lib/pahuna-content";

const quickFacts = [
  ["Birendranagar", "Main urban base for Surkhet and Karnali travel"],
  ["Family, transit, culture", "Useful for families, short trips, and onward routes"],
  ["Flight + long-distance bus", "Flights and roads connect Surkhet with western Nepal"],
  ["Kakrebihar, Bulbule, Deuti", "Easy local anchors for a first-day plan"],
];

const passportCards = [
  ["Surkhet Starter", "Walkable city context, hotels, cafes, and local temples."],
  ["Route Dreamer", "Compare onward routes to Rara, Dolpa, Jumla, and Humla."],
  ["Food & Culture", "Cafes, Thakali meals, local snacks, and evening walks."],
  ["Karnali Ground Check", "Ask about roads, weather, availability, and pickup timing."],
];

const localTips = [
  "Visit Bulbule in the morning.",
  "Put Kakrebihar with Deuti Bajai for an easy culture day.",
  "Start long trips with Surkhet hotel backup before remote routes.",
  "Try local stops in Birendranagar before onward travel.",
];

export default function ExploreSurkhetPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />

      <SectionShell className="pt-16">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
              Explore Surkhet
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Explore Surkhet - Gateway to Karnali
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600">
              Start your Karnali journey from Birendranagar with stays, culture, lakes, temples, viewpoints, and routes to Rara, Jumla, Dailekh, Dolpa, and Humla.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/trip-planner">Plan My Trip</ButtonLink>
              <ButtonLink href="/hotels" variant="secondary">Find Stays</ButtonLink>
            </div>
          </div>
          <div className="relative min-h-[320px] overflow-hidden rounded-[8px] border border-emerald-100 bg-white p-3 shadow-xl">
            <Image src={images.hero} alt="Surkhet gateway card" fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover p-3" />
            <div className="absolute inset-x-6 bottom-6 rounded-[8px] bg-white/92 p-4 shadow-lg">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-700">Surkhet city base</p>
              <p className="mt-1 text-sm font-black">Easy stays, cafes, temples, lakes, and onward routes.</p>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="py-8">
        <div className="grid gap-4 md:grid-cols-4">
          {quickFacts.map(([title, text]) => (
            <div key={title} className="rounded-[8px] border border-emerald-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black">{title}</p>
              <p className="mt-2 text-xs leading-5 text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[8px] border border-emerald-200 bg-emerald-50/60 p-6">
            <div className="flex items-center justify-between gap-4">
              <SectionHeader eyebrow="Karnali Passport" title="Unlock your Karnali Passport" />
              <span className="text-xs font-black text-emerald-700">1 of 7 badges unlocked</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {passportCards.map(([title, text]) => (
                <div key={title} className="rounded-[8px] border border-emerald-100 bg-white p-4">
                  <h3 className="text-sm font-black">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-stone-600">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/trip-planner">Build personal route</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">Try advisor</ButtonLink>
            </div>
          </div>

          <div className="rounded-[8px] border border-emerald-200 bg-white p-6">
            <SectionHeader eyebrow="Pick a vibe" title="Pick a Surkhet-to-Karnali vibe" description="Choose what your trip should feel like, then build a plan around it." />
            <div className="mt-5 flex flex-wrap gap-2">
              {["Peaceful", "Adventure", "Culture", "Family", "Budget", "Spiritual", "Nature"].map((tag) => (
                <span key={tag} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{tag}</span>
              ))}
            </div>
            <div className="mt-6 rounded-[8px] bg-amber-50 p-4">
              <p className="text-sm font-black">Family route idea</p>
              <p className="mt-2 text-xs leading-5 text-stone-600">Surkhet city stay, Bulbule Lake, Kakrebihar, food stop, and a soft onward route when ready.</p>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="py-8">
        <SectionHeader eyebrow="Surkhet trip confidence" title="Local confidence before you move deeper." />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["Tested local sights", "Dailekh and Jumla routes", "Dolpa, Humla, Rara flights"].map((title) => (
            <div key={title} className="rounded-[8px] border border-emerald-100 bg-white p-5">
              <h3 className="text-sm font-black">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-stone-600">Confirm rooms, weather, and availability before final movement.</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeader eyebrow="Surkhet local tips" title="Small things that make the trip smoother." />
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {localTips.map((tip) => (
            <div key={tip} className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-950">{tip}</div>
          ))}
        </div>
      </SectionShell>

      <section className="bg-white">
        <SectionShell>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader eyebrow="Food near Birendranagar" title="Where to eat around Birendranagar" description="Public food cards link into the backend-connected food provider catalog." />
            <ButtonLink href="/food" variant="secondary">View food guide</ButtonLink>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {foodHighlights.slice(0, 4).map((food) => (
              <Link key={food.title} href={food.href} className="rounded-[8px] border border-emerald-200 bg-white p-4 shadow-sm">
                <div className="relative h-36 overflow-hidden rounded-[8px] bg-emerald-50">
                  <Image src={food.image || images.foodFallback} alt={food.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                </div>
                <h3 className="mt-4 text-base font-black">{food.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-600">{food.description}</p>
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <ImageTile title="Bulbule, Kakrebihar, Deuti Bajai, Gurase" subtitle="Surkhet anchors" image={images.bulbule} href="/experiences" tall />
          <div className="space-y-3">
            {routeCards.slice(0, 4).map((route) => (
              <Link key={route.route} href="/routes" className="block rounded-[8px] border border-emerald-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-black">{route.route}</p>
                <p className="mt-2 text-xs leading-5 text-stone-600">{route.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </SectionShell>

      <SiteFooter />
    </main>
  );
}
