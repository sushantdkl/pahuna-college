import Link from "next/link";
import Image from "next/image";
import { ButtonLink, PageHero, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/components/pahuna-layout";
import { TourismMap, type TourismMapMarker } from "@/components/tourism-map";
import { destinations, featuredStays, foodProviders, images, routeCards } from "@/lib/pahuna-content";

const ideas = [
  {
    slug: "surkhet-essentials-3-days",
    title: "Surkhet Essentials - 3 Days",
    duration: "3 days",
    budget: "NPR 8,000 - 15,000",
    image: images.bulbule,
    steps: ["Bulbule Lake", "Kakrebihar", "Deuti Bajai"],
  },
  {
    slug: "karnali-gateway-5-days",
    title: "Karnali Gateway - 5 Days",
    duration: "5 days",
    budget: "NPR 15,000 - 30,000",
    image: images.nightView,
    steps: ["Surkhet base", "Dailekh route", "Local food stops", "Viewpoints"],
  },
];

const suggestionCards = [
  {
    title: featuredStays[0]?.name || "Featured stay",
    href: featuredStays[0] ? `/hotels/${featuredStays[0].slug}` : "/hotels",
    description: featuredStays[0]?.shortDescription || "Compare active stay listings before confirming your route.",
  },
  {
    title: foodProviders[0]?.name || "Featured food stop",
    href: foodProviders[0] ? `/food/${foodProviders[0].slug}` : "/food",
    description: foodProviders[0]?.shortDescription || "Find cafes, restaurants, and food providers around Surkhet.",
  },
  {
    title: destinations[0]?.title || "Featured destination",
    href: destinations[0]?.href || "/destinations",
    description: destinations[0]?.description || "Explore Karnali destination guides with practical travel context.",
  },
];

export default function ItinerariesPage() {
  const itineraryMarkers: TourismMapMarker[] = [
    ...featuredStays.slice(0, 2).map((stay) => ({
      id: `stay-${stay.slug}`,
      name: stay.name,
      category: "stay" as const,
      latitude: stay.latitude,
      longitude: stay.longitude,
      type: stay.typeLabel || stay.type,
      location: `${stay.area}, ${stay.district}`,
      price: stay.priceFrom,
      href: `/hotels/${stay.slug}`,
    })),
  ];

  return (
    <PageShell>
      <SiteHeader />
      <PageHero
        eyebrow="Tourism roadmap"
        title="Trip Ideas & Itineraries"
        description="Pre-planned journeys to help you make the most of your time in Surkhet. Pick a plan, customize it, and go."
      >
        <ButtonLink href="/trip-planner">Open Trip Planner</ButtonLink>
        <ButtonLink href="/experiences" variant="secondary">View Experiences</ButtonLink>
      </PageHero>

      <SectionShell>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5">
            {ideas.map((idea) => (
              <article key={idea.title} className="grid overflow-hidden rounded-[18px] border border-stone-200 bg-white shadow-sm sm:grid-cols-[220px_1fr]">
                <div className="relative min-h-56 bg-stone-100">
                  <Image src={idea.image} alt={idea.title} fill sizes="(max-width: 640px) 100vw, 220px" className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border px-3 py-1 text-xs font-semibold">{idea.duration}</span>
                    <span className="rounded-full border px-3 py-1 text-xs font-semibold">Easy</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-black">{idea.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">A Surkhet-first route with practical stays, local food, and flexible route context.</p>
                  <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-emerald-900">
                    <span>{idea.budget}</span>
                    <span>{idea.steps.length} stops</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {idea.steps.map((step) => <span key={step} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">{step}</span>)}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <ButtonLink href={`/itineraries/${idea.slug}`}>View Full Plan</ButtonLink>
                    <ButtonLink href="/contact" variant="secondary">Request custom trip</ButtonLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="rounded-[18px] border border-stone-200 bg-white p-5 shadow-sm">
            <SectionHeader eyebrow="Map context" title="Start in Surkhet, then expand outward." description="Use route and destination context from the final Pahuna CRUD modules before confirming travel." />
            <div className="mt-6">
              <TourismMap
                markers={itineraryMarkers}
                heightClass="h-[360px]"
                emptyTitle="Itinerary map coordinates not available"
                emptyDescription="This itinerary can still be reviewed through the route cards. Map markers appear only for selected stops with valid backend coordinates."
              />
            </div>
            <div className="mt-6 grid gap-3">
              {routeCards.map((route) => (
                <Link key={route.route} href="/routes" className="rounded-xl border border-emerald-100 p-4 text-sm transition hover:bg-emerald-50">
                  <span className="font-black">{route.route}</span>
                  <span className="mt-1 block text-stone-600">{route.mode} - {route.status}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-4">
        <SectionHeader align="center" title="Suggested stays, food, and destinations" description="These public suggestions connect into the active stays, food provider, and destination flows." />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {suggestionCards.map((item) => (
            <Link key={item.title} href={item.href} className="rounded-[18px] border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Suggested</p>
              <h3 className="mt-3 text-xl font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}
