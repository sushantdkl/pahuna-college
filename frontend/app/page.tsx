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
  routeCards,
  surkhetPlaces,
} from "@/lib/pahuna-content";

export default function Home() {
  return (
    <PageShell>
      <SiteHeader />

      <section className="relative isolate min-h-[720px] overflow-hidden bg-stone-950 text-white">
        <Image src={images.hero} alt="Karnali river landscape for Pahuna travel planning" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/55 via-stone-950/35 to-[#fffaf0]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffaf0] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl flex-col items-center justify-center px-4 pt-16 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-emerald-200">Pahuna - Karnali Awaits</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl">
            Explore Surkhet, then journey deeper into Karnali
          </h1>
          <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/85 sm:text-lg">
            Start from Surkhet, discover Karnali, and find stays, food, destinations, routes, and local travel support in one simple Pahuna experience.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/explore">Explore Surkhet</ButtonLink>
            <ButtonLink href="/hotels" variant="secondary">Find Stays</ButtonLink>
            <ButtonLink href="/trip-planner" variant="ghost">Plan a Trip</ButtonLink>
          </div>

          <div className="mt-10 grid w-full max-w-4xl gap-3 rounded-[28px] border border-white/20 bg-white/95 p-3 text-left text-stone-900 shadow-2xl shadow-black/20 backdrop-blur sm:grid-cols-4">
            {[
              ["Hotels in Surkhet", "Find verified stays"],
              ["Experiences", "Culture and adventure"],
              ["Destinations", "Rara, Dolpa, Dailekh"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl px-4 py-3 transition hover:bg-emerald-50">
                <p className="text-sm font-black text-stone-900">{title}</p>
                <p className="mt-1 text-xs text-stone-500">{text}</p>
              </div>
            ))}
            <Link href="/hotels" className="flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-4 text-sm font-black text-white transition hover:bg-emerald-800">
              Search
            </Link>
          </div>
        </div>
      </section>

      <SectionShell className="-mt-8 relative z-20 pb-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.slice(0, 4).map((action) => (
            <Link key={action.title} href={action.href} className="rounded-[26px] border border-emerald-900/10 bg-white p-5 shadow-lg shadow-emerald-900/5 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl">
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{action.meta}</span>
              <h3 className="mt-5 text-xl font-black text-stone-950">{action.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="py-12">
        <SectionHeader
          align="center"
          eyebrow="How Pahuna works"
          title="Chalauna sajilo, bujhna sajilo."
          description="Explore, compare, ask, and plan without getting lost in scattered travel information."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["Explore", "Browse curated Surkhet places, stays, food, and route context."],
            ["Discover", "Use simple cards, filters, and visual highlights to compare options."],
            ["Experience", "Send inquiry, ask availability, and prepare before your Karnali journey."],
          ].map(([title, text], index) => (
            <div key={title} className="rounded-[28px] border border-emerald-900/10 bg-white p-7 shadow-sm">
              <div className={`h-1.5 w-28 rounded-full ${index === 1 ? "bg-amber-400" : index === 2 ? "bg-indigo-400" : "bg-emerald-600"}`} />
              <h3 className="mt-8 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <section className="bg-[#f3f0e7]">
        <SectionShell>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionHeader
                eyebrow="Explore Surkhet gateway"
                title="The heart of Pahuna starts from Surkhet."
                description="Use Surkhet as your practical base for local places, food, stays, and onward routes into Karnali."
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <StatPill value="7+" label="Key places" />
                <StatPill value="4" label="Route ideas" />
                <StatPill value="1" label="Simple guide" />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/explore">Open Surkhet Guide</ButtonLink>
                <ButtonLink href="/contact" variant="secondary">Send Inquiry</ButtonLink>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {surkhetPlaces.slice(0, 4).map((place) => (
                <ImageTile key={place.title} title={place.title} subtitle={place.eyebrow || "Surkhet"} image={place.image || images.destinationFallback} href={place.href} />
              ))}
            </div>
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader eyebrow="Featured retreats" title="Surkhet-based stays with local charm." />
          <ButtonLink href="/hotels" variant="secondary">View all stays</ButtonLink>
        </div>
        <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredStays.slice(0, 4).map((stay) => (
            <article key={stay.name} className="overflow-hidden rounded-[26px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
              <div className="relative h-44 bg-emerald-50">
                <Image src={stay.image} alt={stay.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black text-stone-950">{stay.name}</h3>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-black text-amber-800">4.8</span>
                </div>
                <p className="mt-2 text-xs text-stone-500">{stay.area}, {stay.district}</p>
                <p className="mt-5 text-lg font-black text-stone-900">{stay.priceFrom}</p>
                <div className="mt-5 flex gap-2">
                  <Link href={`/hotels/${stay.slug}`} className="flex-1 rounded-xl border border-emerald-200 px-3 py-2 text-center text-xs font-bold text-emerald-800 hover:bg-emerald-50">View Details</Link>
                  <Link href="/contact" className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-center text-xs font-bold text-white hover:bg-emerald-700">Ask</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <section className="bg-white">
        <SectionShell>
          <SectionHeader align="center" eyebrow="Culture & adventure" title="Beyond the stay, discover the soul of the valley." />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <ImageTile title="Bheri River and rafting routes" subtitle="Adventure" image={images.bheriRiver} href="/gallery" tall />
            <div className="grid gap-5 sm:grid-cols-2">
              <ImageTile title="Tharu cultural evening" subtitle="Culture" image={images.tharuCulture} href="/gallery" />
              <ImageTile title="Kakrebihar heritage" subtitle="History" image={images.kakrebiharAlt} href="/explore#kakrebihar" />
              <ImageTile title="Bulbule sunset" subtitle="City escape" image={images.bulbule} href="/explore#bulbule-lake" />
              <ImageTile title="Gurase viewpoint" subtitle="Hill route" image={images.gurase} href="/explore#gurase-view-tower" />
            </div>
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <SectionHeader eyebrow="Plan before you go" title="Trip planner and route preview." description="Pahuna keeps the important travel context visible: route type, reliability, food/stay checks, and inquiry support." />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/trip-planner">Open Trip Planner</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">Ask Pahuna</ButtonLink>
            </div>
          </div>
          <div id="routes" className="grid gap-4">
            {routeCards.map((route) => (
              <div key={route.route} className="rounded-[24px] border border-emerald-900/10 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-black text-stone-950">{route.route}</h3>
                    <p className="mt-1 text-sm text-stone-500">{route.mode}</p>
                  </div>
                  <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">{route.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-600">{route.note}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <section className="bg-[#f3f0e7]">
        <SectionShell>
          <SectionHeader eyebrow="Food, cafes & destinations" title="Everything a traveler checks first." />
          <div className="mt-9 grid gap-6 lg:grid-cols-3">
            {[...foodHighlights.slice(0, 2), ...destinations.slice(0, 1)].map((item) => (
              <Link key={item.title} href={item.href} className="group overflow-hidden rounded-[26px] bg-white shadow-lg shadow-emerald-900/5">
                <div className="relative h-56">
                  <Image src={item.image || images.destinationFallback} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">{item.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <div className="rounded-[36px] bg-emerald-900 p-8 text-white shadow-2xl shadow-emerald-900/20 sm:p-12 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-200">Final inquiry</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">Need stay, route, or food help before booking?</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/80">Send one inquiry and keep your Surkhet-first Karnali plan clear before confirming anything.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 lg:mt-0">
            <ButtonLink href="/contact" variant="secondary">Send Inquiry</ButtonLink>
            <ButtonLink href="/gallery" variant="ghost">View Gallery</ButtonLink>
          </div>
        </div>
      </SectionShell>

      <SiteFooter />
    </PageShell>
  );
}
