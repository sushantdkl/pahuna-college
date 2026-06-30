import Image from "next/image";
import Link from "next/link";
import {
  ButtonLink,
  ImageTile,
  SectionHeader,
  SectionShell,
  SiteFooter,
  SiteHeader,
  StatPill,
} from "@/app/_components/pahuna-layout";
import { featuredStays, foodHighlights, images, routeCards, surkhetPlaces } from "@/lib/pahuna-content";

const quickFacts = [
  ["Best base", "Birendranagar"],
  ["Good for", "Families, short trips, Karnali routes"],
  ["Plan style", "1-2 days in Surkhet + onward route"],
  ["Need to confirm", "Roads, flights, rooms, and local timings"],
];

const tripIdeas = [
  "Morning: Deuti Bajai, Ghantaghar, local breakfast, and city walk.",
  "Afternoon: Kakrebihar heritage stop, tea break, then Bulbule Lake.",
  "Easy extension: Gurase viewpoint or Bheri River Bridge depending on time.",
];

const localTips = [
  "Keep Surkhet as the practical base before deeper Karnali routes.",
  "Ask stay providers about parking, early breakfast, and route pickup timing.",
  "For Rara, Dolpa, Humla, and Jumla, keep buffer days for weather and roads.",
  "Use Google Maps links as a guide, but confirm local road status before leaving.",
];

export default function ExploreSurkhetPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />

      <section className="relative isolate overflow-hidden bg-stone-950 text-white">
        <Image src={images.hero} alt="Surkhet valley gateway" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-stone-950/55 to-amber-900/20" />
        <SectionShell className="relative z-10 py-24 sm:py-32">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-200">Explore Surkhet</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl">Your Surkhet gateway guide.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
              Places, stays, food, local tips, and onward Karnali routes in one easy-to-scan destination page.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#top-places">Top Places</ButtonLink>
              <ButtonLink href="/hotels" variant="secondary">Find Stays</ButtonLink>
              <ButtonLink href="/contact" variant="ghost">Send Inquiry</ButtonLink>
            </div>
          </div>
        </SectionShell>
      </section>

      <SectionShell className="-mt-10 relative z-20 py-0">
        <div className="grid gap-4 rounded-[32px] border border-emerald-900/10 bg-white p-5 shadow-2xl shadow-emerald-900/10 md:grid-cols-4">
          {quickFacts.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-emerald-50/70 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{label}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-stone-800">{value}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="top-places" className="pt-16">
        <SectionHeader eyebrow="Top places" title="Start with the places travelers ask about most." description="The page is image-rich, practical, and focused on what a visitor needs before moving around Surkhet." />
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {surkhetPlaces.map((place) => (
            <article id={place.title.toLowerCase().replaceAll(" ", "-")} key={place.title} className="overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
              <div className="relative h-56">
                <Image src={place.image || images.destinationFallback} alt={place.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">{place.eyebrow}</p>
                <h2 className="mt-2 text-2xl font-black">{place.title}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{place.description}</p>
                <div className="mt-5 flex gap-2">
                  <Link href="/gallery" className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50">View photos</Link>
                  <Link href="/contact" className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800">Ask local tip</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <section className="bg-[#f3f0e7]">
        <SectionShell>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <SectionHeader eyebrow="Stay, eat, move" title="Surkhet is not only a place to see. It is your base." />
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <StatPill value="Stays" label="Hotels & lodges" />
                <StatPill value="Food" label="Cafes & meals" />
                <StatPill value="Routes" label="Karnali access" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard title="Where to stay" href="/hotels" items={featuredStays.slice(0, 3).map((stay) => `${stay.name} · ${stay.area}`)} />
              <InfoCard title="Where to eat" href="/food" items={foodHighlights.map((food) => food.title)} />
              <InfoCard title="Short Surkhet trip ideas" href="/trip-planner" items={tripIdeas} />
              <InfoCard title="Routes from Surkhet" href="/trip-planner#routes" items={routeCards.map((route) => `${route.route} · ${route.status}`)} />
            </div>
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <ImageTile title="Bulbule, Kakrebihar, Gurase and Bheri moments" subtitle="Visual guide" image={images.bulbule} href="/gallery" tall />
          <div className="rounded-[28px] border border-emerald-900/10 bg-white p-7 shadow-lg shadow-emerald-900/5">
            <SectionHeader eyebrow="Local tips" title="Before you confirm the plan" />
            <ul className="mt-6 space-y-4">
              {localTips.map((tip) => (
                <li key={tip} className="flex gap-3 text-sm leading-6 text-stone-600">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-600" />
                  {tip}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Send Inquiry</ButtonLink>
              <ButtonLink href="/gallery" variant="secondary">Open Gallery</ButtonLink>
            </div>
          </div>
        </div>
      </SectionShell>

      <SiteFooter />
    </main>
  );
}

function InfoCard({ title, href, items }: { title: string; href: string; items: string[] }) {
  return (
    <div className="rounded-[26px] border border-emerald-900/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-black">{title}</h3>
        <Link href={href} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100">Open</Link>
      </div>
      <ul className="mt-5 space-y-3">
        {items.slice(0, 4).map((item) => (
          <li key={item} className="text-sm leading-6 text-stone-600">• {item}</li>
        ))}
      </ul>
    </div>
  );
}