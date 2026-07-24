import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { TourismMap, type TourismMapMarker } from "@/app/_components/tourism-map";
import { featuredStays, foodProviders, images, routeCards } from "@/lib/pahuna-content";

const itineraries = [
  {
    slug: "surkhet-essentials-3-days",
    title: "Surkhet Essentials - 3 Days",
    difficulty: "Easy",
    duration: "3 Days",
    budget: "NPR 8,000 - 15,000",
    travelers: "2 - 8 people",
    season: "October - March",
    image: images.bulbule,
    description: "A perfect introduction to Surkhet covering temples, lakes, heritage sites, and local cuisine.",
    days: [
      ["Day 1", "Arrive in Birendranagar, check in, explore Ghantaghar and local food stops."],
      ["Day 2", "Visit Bulbule Lake, Kakrebihar, and Deuti Bajai with a relaxed evening cafe stop."],
      ["Day 3", "Add Gurase viewpoint or a soft route-planning session before departure."],
    ],
  },
  {
    slug: "karnali-gateway-5-days",
    title: "Karnali Gateway - 5 Days",
    difficulty: "Moderate",
    duration: "5 Days",
    budget: "NPR 15,000 - 30,000",
    travelers: "2 - 6 people",
    season: "October - April",
    image: images.nightView,
    description: "Extended exploration of Surkhet and surrounding areas with deeper cultural and nature immersion.",
    days: [
      ["Day 1", "Arrive in Surkhet and settle into a city stay."],
      ["Day 2", "Explore Bulbule, Kakrebihar, Deuti Bajai, and local food places."],
      ["Day 3", "Take the Dailekh or Gurase route with a cautious road check."],
      ["Day 4", "Add food, viewpoint, and cultural stops around Birendranagar."],
      ["Day 5", "Review onward Karnali routes or depart with confirmed transport."],
    ],
  },
];

export function generateStaticParams() {
  return itineraries.map((itinerary) => ({ slug: itinerary.slug }));
}

export default async function ItineraryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const itinerary = itineraries.find((item) => item.slug === slug);
  if (!itinerary) notFound();

  const markers: TourismMapMarker[] = featuredStays.slice(0, 3).map((stay) => ({
    id: stay.slug,
    name: stay.name,
    category: "stay",
    latitude: stay.latitude,
    longitude: stay.longitude,
    type: stay.typeLabel || stay.type,
    location: `${stay.area}, ${stay.district}`,
    price: stay.priceFrom,
    href: `/hotels/${stay.slug}`,
  }));

  return (
    <PageShell>
      <SiteHeader />
      <section className="bg-gradient-to-br from-white via-emerald-50/50 to-[#fffaf0]">
        <SectionShell className="py-12">
          <nav className="mb-6 flex items-center gap-2 text-sm font-semibold text-stone-500">
            <Link href="/" className="hover:text-emerald-800">Home</Link>
            <span>/</span>
            <Link href="/itineraries" className="hover:text-emerald-800">Trip Ideas</Link>
            <span>/</span>
            <span className="text-stone-950">{itinerary.title}</span>
          </nav>
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <span className="rounded-full border border-emerald-100 bg-white px-3 py-1 text-xs font-black text-emerald-800">{itinerary.difficulty}</span>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">{itinerary.title}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">{itinerary.description}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <Info label="Duration" value={itinerary.duration} />
                <Info label="Budget" value={itinerary.budget} />
                <Info label="Group" value={itinerary.travelers} />
                <Info label="Season" value={itinerary.season} />
              </div>
            </div>
            <div className="relative min-h-[320px] overflow-hidden rounded-[8px] bg-stone-900 shadow-sm">
              <Image src={itinerary.image} alt={itinerary.title} fill priority sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
            </div>
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[8px] border border-emerald-100 bg-white p-6 shadow-sm">
            <SectionHeader eyebrow="Day-wise plan" title="Preview the route before confirming" description="This public itinerary is a planning guide. Confirm stays, transport, weather, and provider availability before travel." />
            <div className="mt-8 space-y-4">
              {itinerary.days.map(([day, text]) => (
                <div key={day} className="rounded-[8px] border border-stone-200 bg-[#fffaf0] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{day}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/trip-planner">Open Trip Planner</ButtonLink>
              <ButtonLink href={`/contact?topic=${encodeURIComponent(`Custom itinerary: ${itinerary.title}`)}`} variant="secondary">Request Custom Trip</ButtonLink>
            </div>
          </div>
          <aside className="space-y-5">
            <TourismMap markers={markers} heightClass="h-[320px]" emptyTitle="Itinerary map coordinates unavailable" emptyDescription="Map markers appear only for route stops with valid coordinates." />
            <div className="rounded-[8px] border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Route context</p>
              <div className="mt-4 grid gap-2">
                {routeCards.slice(0, 3).map((route) => (
                  <Link key={route.route} href="/routes" className="rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-900">{route.route}</Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <SectionHeader align="center" eyebrow="Suggested food" title="Food stops to confirm" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {foodProviders.slice(0, 3).map((food) => (
            <Link key={food.slug} href={`/food/${food.slug}`} className="rounded-[8px] border border-emerald-100 bg-white p-5 shadow-sm">
              <h3 className="font-black">{food.name}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{food.shortDescription}</p>
            </Link>
          ))}
        </div>
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-emerald-100 bg-white p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-2 text-sm font-black text-stone-950">{value}</p>
    </div>
  );
}
