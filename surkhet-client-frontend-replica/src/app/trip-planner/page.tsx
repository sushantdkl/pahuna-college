import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Compass, Lightbulb, MapPinned, Sparkles, WalletCards } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BudgetEstimator } from "@/components/tourism/budget-estimator";
import { TransportTable } from "@/components/tourism/transport-table";
import { HotelCard } from "@/components/hotels/hotel-card";
import { FoodCard } from "@/components/food/food-card";
import { TripCostMapSectionClient } from "@/components/trip-cost/trip-cost-map-client";
import { getFeaturedFoodProviders } from "@server/services/food";
import { getFeaturedServiceProviders } from "@server/services/service-providers";
import { demoDestinations, demoExperiences } from "@server/services";
import type { MarkerCategory } from "@/components/maps/map-constants";

export const metadata: Metadata = {
  title: "Trip Planner for Karnali | Pahuna",
  description:
    "Plan your Karnali trip with route ideas, itinerary suggestions, cost ranges, stays, food, services, and AI planning support from Pahuna.",
  alternates: { canonical: "/trip-planner" },
};

const TRIP_IDEAS = [
  {
    title: "1 Day Surkhet City Tour",
    route: "Birendranagar, Bulbule Lake, Kakrebihar, Deuti Bajai",
    days: "1 day",
    budget: "Budget to standard",
  },
  {
    title: "2 Days Surkhet + Dailekh",
    route: "Surkhet base with Dailekh temple and hill route context",
    days: "2-3 days",
    budget: "Standard",
  },
  {
    title: "3 Days Surkhet Food + Culture",
    route: "Explore Surkhet places, local cafes, temples, and relaxed food stops",
    days: "3 days",
    budget: "Budget to standard",
  },
  {
    title: "5 Days Surkhet to Rara",
    route: "Surkhet, Dailekh/Kalikot route context, Mugu, Rara",
    days: "5+ days",
    budget: "Standard to premium",
  },
  {
    title: "Jumla + Sinja route",
    route: "Jumla apple belt, Sinja cultural route, Karnali highland stays",
    days: "4-6 days",
    budget: "Standard",
  },
  {
    title: "Dolpa / Phoksundo Route",
    route: "Surkhet or Nepalgunj connection with Dolpa planning buffer",
    days: "7+ days",
    budget: "Premium/remote",
  },
  {
    title: "Humla / Simikot Route",
    route: "Flight-dependent high mountain route with flexible scheduling",
    days: "7+ days",
    budget: "Premium/remote",
  },
];

const PLANNER_STEPS = [
  {
    title: "Where do you want to go?",
    icon: MapPinned,
    options: ["Surkhet", "Rara", "Dailekh", "Jumla", "Dolpa / Phoksundo", "Humla", "Karnali Grand Circuit"],
  },
  {
    title: "How many days?",
    icon: Compass,
    options: ["1 day", "2-3 days", "4-5 days", "7+ days"],
  },
  {
    title: "Budget range",
    icon: WalletCards,
    options: ["Budget", "Standard", "Premium", "Custom"],
  },
  {
    title: "Travel style",
    icon: Sparkles,
    options: ["Family", "Culture", "Nature", "Religious", "Food", "Adventure", "Photography"],
  },
];

const ROUTE_PLANS = [
  {
    route: "Kathmandu / Nepalgunj to Surkhet",
    steps: "Flight or road connection to Birendranagar",
    duration: "Same day to 1 day",
    cost: "Budget to standard range",
    reliability: "Confirm schedule",
    stopover: "Birendranagar",
    note: "Best entry point for first-time Karnali planning.",
  },
  {
    route: "Surkhet to Rara",
    steps: "Surkhet, Dailekh/Kalikot route context, Mugu, Rara",
    duration: "4-6+ days",
    cost: "Standard to premium range",
    reliability: "Season dependent",
    stopover: "Dailekh or Kalikot side",
    note: "Add weather and road-condition buffer before finalizing.",
  },
  {
    route: "Surkhet to Dolpa / Phoksundo",
    steps: "Surkhet or Nepalgunj connection with remote-route coordination",
    duration: "7+ days",
    cost: "Premium/remote range",
    reliability: "Weather and operator dependent",
    stopover: "Confirm with operator",
    note: "Do not treat flight or road timing as guaranteed.",
  },
  {
    route: "Surkhet to Jumla + Sinja",
    steps: "Surkhet, Karnali highway context, Jumla, Sinja cultural route",
    duration: "4-6 days",
    cost: "Standard range",
    reliability: "Road condition dependent",
    stopover: "Jumla",
    note: "Good for culture, highland food, and slower travel.",
  },
];

const DISCLAIMER =
  "Prices, routes, flights, and availability can change due to weather, season, road condition, and operator schedule.";

export default async function TripPlannerPage() {
  const [stays, foods] = await Promise.all([
    getFeaturedServiceProviders(3),
    getFeaturedFoodProviders(3),
  ]);

  const hotelPlaces = stays.map((h) => ({
    name: h.name,
    slug: h.slug,
    latitude: h.latitude ?? undefined,
    longitude: h.longitude ?? undefined,
    coverImage: h.images?.[0],
    category: "hotel" as MarkerCategory,
    costHint: h.priceFrom ? `From NPR ${h.priceFrom.toLocaleString("en-IN")}` : "Confirm locally",
    subtitle: h.typeLabel,
    href: `/hotels/${h.slug}`,
  }));

  const destPlaces = demoDestinations.slice(0, 8).map((d) => ({
    name: d.name,
    slug: d.slug,
    latitude: d.latitude,
    longitude: d.longitude,
    coverImage: d.coverImage,
    category: ((d as { category?: string }).category ?? "destination") as MarkerCategory,
    costHint: d.entryFee === "Free" ? "Free entry" : `Entry: ${d.entryFee}`,
    subtitle: d.bestSeason,
    href: `/destinations/${d.slug}`,
  }));

  const expPlaces = demoExperiences.slice(0, 4).map((e) => ({
    name: e.title,
    slug: e.slug,
    latitude: e.latitude,
    longitude: e.longitude,
    coverImage: e.coverImage,
    category: "experience" as MarkerCategory,
    costHint: e.priceRange,
    subtitle: e.duration,
    href: `/experiences#${e.slug}`,
  }));

  return (
    <>
      <PageHero
        badge={{ icon: <Compass className="h-3 w-3" />, label: "Trip Planner" }}
        title="Plan Your"
        highlight="Karnali Trip"
        subtitle="Choose your destination, days, budget, travel style, and route. Pahuna helps you plan stays, food, routes, and experiences across Surkhet and Karnali."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="bg-white px-8 font-semibold text-primary shadow-lg hover:bg-white/90">
            <Link href="#planner">
              <Sparkles className="mr-2 h-4 w-4" />
              Start Planning
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/70 bg-transparent px-8 font-semibold text-white hover:bg-white hover:text-primary">
            <Link href="/contact">Send Inquiry</Link>
          </Button>
        </div>
      </PageHero>

      <section id="planner" className="py-14">
        <Container>
          <div className="rounded-3xl border border-emerald-100 bg-amber-50/50 p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                Simple planner
              </p>
              <h2 className="mt-1 text-2xl font-bold">Choose your trip shape</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pick the destination, days, budget, and travel style first. Then use the brief below to send your plan to Pahuna.
              </p>
            </div>
            <div className="mb-6 grid gap-4 lg:grid-cols-4">
              {PLANNER_STEPS.map(({ title, icon: Icon, options }) => (
                <div key={title} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm font-semibold">{title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => (
                      <Badge key={option} variant="outline" className="bg-emerald-50/60 text-emerald-900">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <form action="/contact" className="grid gap-3 md:grid-cols-4">
              {[
                ["startingCity", "Starting city", "Kathmandu, Nepalgunj, Surkhet"],
                ["destination", "Destination", "Surkhet, Rara, Jumla, Dolpa"],
                ["days", "Days", "3"],
                ["budget", "Budget range", "NPR 15,000-30,000"],
                ["travelerType", "Traveler type", "Solo, family, group"],
                ["interests", "Interests", "Food, temples, lakes, trekking"],
                ["transport", "Transport preference", "Flight, bus, jeep, mixed"],
              ].map(([name, label, placeholder]) => (
                <label key={name} className={name === "interests" ? "md:col-span-2" : ""}>
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                  <input
                    name={name}
                    placeholder={placeholder}
                    className="mt-1 h-11 w-full rounded-xl border border-emerald-100 bg-white px-3 text-sm outline-none transition focus:border-primary"
                  />
                </label>
              ))}
              <div className="flex items-end">
                <Button type="submit" className="h-11 w-full">
                  Send this plan
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </section>

      <section className="py-14 bg-muted/30">
        <Container>
          <SectionHeader
            title="Trip ideas"
            subtitle="Start with a route shape, then adjust days, weather buffers, stay choices, and local transport."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {TRIP_IDEAS.map((idea) => (
              <article key={idea.title} className="rounded-3xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">{idea.days}</p>
                <h3 className="mt-2 text-lg font-semibold">{idea.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{idea.route}</p>
                <p className="mt-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{idea.budget}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <SectionHeader
            title="Budget planning"
            subtitle="Use ranges, not fixed promises. Confirm route, room, food, and operator details before travel."
          />
          <BudgetEstimator />
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            {DISCLAIMER}
          </div>
        </Container>
      </section>

      <section className="py-14 bg-muted/30">
        <Container>
          <SectionHeader title="Route & Cost inside Trip Planner" subtitle="Use these routes as planning guidance, then confirm current road, flight, stay, and operator details." />
          <div className="grid gap-4 lg:grid-cols-2">
            {ROUTE_PLANS.map((plan) => (
              <article key={plan.route} className="rounded-3xl border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                      {plan.reliability}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">{plan.route}</h3>
                  </div>
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="font-medium">Route steps</p>
                    <p className="mt-1 text-muted-foreground">{plan.steps}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="font-medium">Duration range</p>
                    <p className="mt-1 text-muted-foreground">{plan.duration}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="font-medium">Cost range</p>
                    <p className="mt-1 text-muted-foreground">{plan.cost}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="font-medium">Recommended stopover</p>
                    <p className="mt-1 text-muted-foreground">{plan.stopover}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{plan.note}</p>
                <Button asChild variant="outline" className="mt-5">
                  <Link href={`/contact?route=${encodeURIComponent(plan.route)}`}>Use this route</Link>
                </Button>
              </article>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            {DISCLAIMER}
          </div>
          <div className="mt-8">
            <TransportTable />
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <SectionHeader title="Suggested stays and food" subtitle="Suggestions are pulled from Pahuna records only." />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="grid gap-4">
              {stays.map((stay) => (
                <HotelCard
                  key={stay.slug}
                  name={stay.name}
                  slug={stay.slug}
                  shortDesc={stay.shortDescription}
                  propertyType={stay.type}
                  typeLabel={stay.typeLabel}
                  district={stay.district}
                  area={stay.area}
                  address={stay.address}
                  priceFrom={stay.priceFrom}
                  currency={stay.currency}
                  rating={stay.rating}
                  verificationStatus={stay.verificationStatus}
                  consentStatus={stay.consentStatus}
                  amenities={stay.amenities}
                  services={stay.services}
                  coverImage={stay.images?.[0]}
                  isFeatured={stay.featured}
                />
              ))}
            </div>
            <div className="grid gap-4">
              {foods.map((food) => (
                <FoodCard key={food.slug} provider={food} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 bg-muted/30">
        <Container>
          <SectionHeader title="Suggested destinations" subtitle="Use these as starting points, then open each destination guide for route and local context." />
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {demoDestinations.slice(0, 8).map((destination) => (
              <Link
                key={destination.slug}
                href={`/destinations/${destination.slug}`}
                className="rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                  {destination.category.replace(/-/g, " ")}
                </p>
                <h3 className="mt-2 font-semibold">{destination.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{destination.bestSeason}</p>
                <span className="mt-4 inline-flex text-sm font-semibold text-primary">
                  View guide <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
          <SectionHeader title="Map and destination context" subtitle="Explore stay, destination, and experience locations with map markers where coordinates exist." />
          <TripCostMapSectionClient hotels={hotelPlaces} destinations={destPlaces} experiences={expPlaces} />
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="rounded-3xl bg-primary/5 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Planning notes</h2>
            </div>
            <ul className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <li>Use Surkhet/Birendranagar as the practical base for many Karnali routes.</li>
              <li>Remote trips such as Dolpa, Rara, and Humla need weather and flight buffers.</li>
              <li>Do not treat route, food, or stay prices as guaranteed until the provider confirms.</li>
              <li>Use Pahuna inquiry for public listings until consent and verification are complete.</li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Need a human-reviewed Karnali plan?</h2>
            <p className="mt-3 text-white/70">
              Send your dates, route idea, group size, and budget range. Pahuna can help shape a realistic plan.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/contact">
                  Send this plan to Pahuna <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/70 bg-transparent text-white hover:bg-white hover:text-primary">
                <Link href="/ai-trip-planner">
                  Open AI Planner <Calculator className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
