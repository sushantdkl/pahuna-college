import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Calculator,
  Coffee,
  Compass,
  HelpCircle,
  Hotel,
  Mountain,
  Route,
  Search,
  Send,
  UtensilsCrossed,
} from "lucide-react";
import {
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@server/lib/structured-data";
import { assets, getImageOrPlaceholder } from "@server/lib/assets";
import { homeCopy } from "@server/data/site-copy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { HotelCard } from "@/components/hotels/hotel-card";
import { FoodCard } from "@/components/food/food-card";
import { KarnaliPassport } from "@/components/engagement/KarnaliPassport";
import { LocalTipsCards } from "@/components/engagement/LocalTipsCards";
import { getFeaturedServiceProviders } from "@server/services/service-providers";
import { getFeaturedFoodProviders } from "@server/services/food";
import { getFeaturedDestinations } from "@server/services/destinations";

export const metadata: Metadata = {
  title: homeCopy.metadata.title,
  description: homeCopy.metadata.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: homeCopy.metadata.ogTitle,
    description: homeCopy.metadata.ogDescription,
  },
};

const quickActions = [
  {
    title: "Explore Surkhet",
    description: "Places, stays, food, routes, and local tips.",
    href: "/explore",
    icon: Compass,
  },
  {
    title: "Find a stay",
    description: "Hotels, resorts, lodges, and local stays.",
    href: "/hotels",
    icon: Hotel,
  },
  {
    title: "Find food & cafes",
    description: "Cafes, momo, restaurants, and local food.",
    href: "/food",
    icon: UtensilsCrossed,
  },
  {
    title: "Explore destinations",
    description: "Surkhet and Karnali places with guides.",
    href: "/destinations",
    icon: Mountain,
  },
  {
    title: "Plan a trip",
    description: "Build a simple Karnali travel plan.",
    href: "/trip-planner",
    icon: Search,
  },
  {
    title: "Estimate route/cost",
    description: "Check route context and cost ranges.",
    href: "/routes",
    icon: Calculator,
  },
  {
    title: "Send inquiry",
    description: "Ask Pahuna for help with your trip.",
    href: "/contact",
    icon: Send,
  },
];

const surkhetGatewayCards = [
  {
    title: "Top Surkhet places",
    text: "Bulbule Lake, Kakrebihar, Deuti Bajai, Ghantaghar, Gurase, and nearby viewpoints.",
    href: "/explore",
    image: assets.surkhet.bulbuleLake,
  },
  {
    title: "Where to stay",
    text: "Find public stay listings around Birendranagar and Surkhet before heading deeper into Karnali.",
    href: "/hotels",
    image: assets.placeholders.stay,
  },
  {
    title: "Where to eat",
    text: "Cafes, momo spots, family restaurants, viewpoint cafes, and local food providers.",
    href: "/food",
    image: assets.placeholders.food,
  },
];

const surkhetHighlights = [
  { name: "Bulbule Lake", image: assets.surkhet.bulbuleLake },
  { name: "Kakrebihar", image: assets.surkhet.kakrebihar },
  { name: "Deuti Bajai", image: assets.surkhet.deutiBajai },
  { name: "Ghantaghar", image: assets.surkhet.ghantaghar },
  { name: "Gurase View Tower", image: assets.surkhet.guraseViewTower },
  { name: "Bheri Bridge", image: assets.surkhet.bheriRiverBridge },
];

const surkhetGatewayLinks = [
  {
    title: "Where to stay",
    text: "Hotels, resorts, lodges, and public stay listings around Birendranagar.",
    href: "/hotels",
    icon: Hotel,
  },
  {
    title: "Where to eat",
    text: "Cafes, momo spots, family restaurants, tea shops, and viewpoint cafes.",
    href: "/food",
    icon: Coffee,
  },
  {
    title: "Short trip ideas",
    text: "Easy Surkhet day plans before longer Karnali routes.",
    href: "/itineraries",
    icon: Compass,
  },
  {
    title: "Routes from Surkhet",
    text: "Rara, Dailekh, Jumla, Dolpa, Humla, and nearby Karnali travel routes.",
    href: "/routes",
    icon: Route,
  },
];

const surkhetLocalTips = [
  "Use Birendranagar as your base before remote Karnali routes.",
  "Confirm road, flight, stay, and food availability before travel.",
  "Keep buffer days for weather, season, and operator schedule changes.",
];

const routeCards = [
  {
    route: "Kathmandu to Surkhet",
    mode: "Flight or road",
    note: "Good entry route for first-time Karnali travelers.",
    reliability: "Confirm schedule",
  },
  {
    route: "Surkhet to Rara",
    mode: "Road/jeep route",
    note: "Requires weather, road, and overnight planning buffer.",
    reliability: "Season dependent",
  },
  {
    route: "Surkhet to Dailekh",
    mode: "Road",
    note: "Useful short extension from Surkhet for culture and hill routes.",
    reliability: "Moderate",
  },
  {
    route: "Surkhet to Dolpa/Phoksundo",
    mode: "Flight/road mix",
    note: "Remote route. Operator schedule and weather can change quickly.",
    reliability: "Needs confirmation",
  },
  {
    route: "Surkhet to Humla",
    mode: "Flight dependent",
    note: "Plan with flexible days and confirmed flight windows.",
    reliability: "Needs confirmation",
  },
];

const tripPlannerFields = ["Starting city", "Destination", "Days", "Budget", "Travel vibe"];

const disclaimer =
  "Prices, routes, flights, and availability can change due to weather, season, road condition, and operator schedule.";

export default async function HomePage() {
  const [featuredStays, featuredFood, featuredDestinations] = await Promise.all([
    getFeaturedServiceProviders(6),
    getFeaturedFoodProviders(6),
    getFeaturedDestinations(8),
  ]);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      <section className="relative overflow-hidden bg-stone-950 text-white">
        <div className="absolute inset-0">
          <Image
            src={assets.hero.surkhet}
            alt="Surkhet valley and Karnali travel gateway"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-emerald-950/85 via-stone-950/62 to-amber-950/30" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background to-transparent" />
        </div>

        <Container className="relative z-10 py-16 sm:py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
            <div className="max-w-3xl">
              <Badge className="mb-5 border-white/20 bg-white/12 text-white hover:bg-white/12">
                Surkhet-first Karnali tourism platform
              </Badge>
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Discover Surkhet & Plan Your Karnali Stay
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
                Pahuna helps you explore Surkhet, find stays, discover cafes and restaurants,
                compare Karnali destinations, check routes and cost ranges, and send trip inquiries.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-white px-7 font-semibold text-primary hover:bg-white/90">
                  <Link href="/explore">
                    Explore Surkhet <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/70 bg-transparent px-7 font-semibold text-white hover:bg-white hover:text-primary">
                  <Link href="/hotels">Find Stays</Link>
                </Button>
                <Link
                  href="/trip-planner"
                  className="inline-flex h-11 items-center justify-center rounded-xl px-3 text-sm font-semibold text-white/90 underline-offset-4 hover:text-white hover:underline sm:h-auto"
                >
                  Plan a Trip
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/12 p-4 backdrop-blur-md sm:p-5">
              <p className="text-sm font-semibold text-white">Start here</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ["Stay", "Find hotels and local stays", "/hotels"],
                  ["Food", "Cafes, momo, restaurants", "/food"],
                  ["Trip", "Routes, cost, inquiry", "/trip-planner"],
                ].map(([label, text, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="rounded-2xl border border-white/12 bg-white/10 p-4 transition hover:bg-white/16"
                  >
                    <p className="text-lg font-bold">{label}</p>
                    <p className="mt-1 text-sm text-white/70">{text}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 lg:py-14">
        <Container>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                Quick actions
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">What are you looking for?</h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {quickActions.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold leading-tight group-hover:text-primary">{title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-linear-to-br from-amber-50 via-white to-emerald-50 py-16 lg:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                <Compass className="h-3.5 w-3.5" />
                Main gateway
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Start with Surkhet - Gateway to Karnali
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                If you are visiting Karnali for the first time, start from Surkhet.
                See where to go, where to stay, where to eat, and which routes open from Birendranagar.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {surkhetGatewayLinks.map(({ title, text, href, icon: Icon }) => (
                  <Link
                    key={title}
                    href={href}
                    className="group rounded-2xl border border-emerald-100 bg-white/85 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold group-hover:text-primary">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-amber-200/70 bg-amber-50/80 p-4">
                <p className="text-sm font-semibold text-amber-950">Local tips</p>
                <div className="mt-3 grid gap-2">
                  {surkhetLocalTips.map((tip) => (
                    <p key={tip} className="flex gap-2 text-xs leading-5 text-amber-950/75">
                      <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      {tip}
                    </p>
                  ))}
                </div>
              </div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/explore">
                    Open Explore Surkhet <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/trip-planner">Plan from Surkhet</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={assets.hero.surkhet}
                    alt="Surkhet as the gateway to Karnali"
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-emerald-950/75 via-emerald-950/10 to-transparent" />
                  <div className="absolute bottom-0 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                      Surkhet base
                    </p>
                    <h3 className="mt-1 text-2xl font-bold">See, stay, eat, then go deeper into Karnali</h3>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {surkhetGatewayCards.map((card) => (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] bg-muted">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 18vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary">{card.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.text}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {surkhetHighlights.map((place) => (
                  <Link
                    key={place.name}
                    href="/explore"
                    className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative aspect-[5/4]">
                      <Image
                        src={place.image}
                        alt={`${place.name} in Surkhet`}
                        fill
                        sizes="(max-width: 768px) 50vw, 18vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="p-3 text-sm font-semibold leading-tight group-hover:text-primary">
                      {place.name}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white/85 p-4">
                <p className="text-sm font-semibold">Popular Surkhet starts</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Bulbule Lake", "Kakrebihar", "Deuti Bajai", "Ghantaghar", "Gurase", "Bheri Bridge", "Ranimatta"].map((place) => (
                    <span key={place} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900">
                      {place}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <SectionIntro
            eyebrow="Stays"
            title="Find hotels and stays in Surkhet"
            subtitle="Browse active Pahuna stay and service listings. Public listings stay clearly marked until admin verification."
            href="/hotels"
            action="View all stays"
          />
          {featuredStays.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredStays.map((stay) => (
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
          ) : (
            <EmptyDiscoveryCard title="No stays found" href="/contact" />
          )}
        </Container>
      </section>

      <section className="bg-muted/30 py-16 lg:py-24">
        <Container>
          <SectionIntro
            eyebrow="Food & Cafes"
            title="Eat like a local in Surkhet"
            subtitle="Cafes, momo and fast food, family restaurants, viewpoint cafes, local food, and event venues."
            href="/food"
            action="Explore food"
          />
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {["Cafes", "Momo & Fast Food", "Family Restaurants", "Viewpoint Cafes", "Local Food", "Events & Party Venues"].map((item) => (
              <Link
                key={item}
                href="/food"
                className="rounded-2xl border border-emerald-100 bg-white p-4 text-sm font-semibold shadow-sm transition hover:border-primary/30 hover:text-primary"
              >
                <Coffee className="mb-3 h-5 w-5 text-primary" />
                {item}
              </Link>
            ))}
          </div>
          {featuredFood.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredFood.map((provider) => (
                <FoodCard key={provider.slug} provider={provider} />
              ))}
            </div>
          ) : (
            <EmptyDiscoveryCard title="Food listings are being verified" href="/food" />
          )}
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <SectionIntro
            eyebrow="Destinations"
            title="Popular places across Surkhet and Karnali"
            subtitle="Image-led guides for lakes, temples, heritage stops, viewpoints, and remote Karnali routes."
            href="/destinations"
            action="View destination guides"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDestinations.map((destination) => (
              <Link
                key={destination.slug}
                href={`/destinations/${destination.slug}`}
                className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/5] bg-muted">
                  <Image
                    src={getImageOrPlaceholder(destination.gallery[0], "destination")}
                    alt={`${destination.name} in ${destination.district}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <Badge className="mb-2 bg-white/20 text-white backdrop-blur hover:bg-white/20">
                      {destination.categoryLabel}
                    </Badge>
                    <h3 className="text-lg font-bold leading-tight">{destination.name}</h3>
                    <p className="mt-1 text-sm text-white/75">{destination.district}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 text-sm">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-900">
                    {destination.difficultyLabel}
                  </span>
                  <span className="font-semibold text-primary">View guide</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-linear-to-br from-emerald-950 via-slate-950 to-stone-950 py-16 text-white lg:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge className="mb-4 bg-white/12 text-white hover:bg-white/12">
                Trip planning
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Need help planning everything together?
              </h2>
              <p className="mt-4 text-base leading-7 text-white/70">
                After choosing where to stay, eat, and explore, use Pahuna Trip Planner
                to build your route, estimate cost, and send an inquiry.
              </p>
              <Button asChild className="mt-7 bg-white text-primary hover:bg-white/90">
                <Link href="/trip-planner">
                  Open Trip Planner <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-3xl border border-white/12 bg-white/10 p-5 backdrop-blur">
              <div className="grid gap-3 sm:grid-cols-5">
                {tripPlannerFields.map((field) => (
                  <div key={field} className="rounded-2xl bg-white/10 p-3">
                    <p className="text-xs text-white/55">{field}</p>
                    <p className="mt-1 text-sm font-semibold">Choose</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
                <p className="text-sm font-semibold">Preview output</p>
                <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  <span>Suggested route</span>
                  <span>Cost range</span>
                  <span>Stay suggestion</span>
                  <span>Food suggestion</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <SectionIntro
            eyebrow="Routes & Cost"
            title="Check route context before you go"
            subtitle={disclaimer}
            href="/routes"
            action="View routes"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {routeCards.map((item) => (
              <Card key={item.route} className="rounded-3xl border-emerald-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Route className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold leading-tight">{item.route}</h3>
                  <p className="mt-2 text-sm font-medium text-primary">{item.mode}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p>
                  <Badge variant="secondary" className="mt-4">{item.reliability}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-muted/30 py-16 lg:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <KarnaliPassport compact />
            <LocalTipsCards variant="general" title="Local tips for easier travel" compact />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <div className="overflow-hidden rounded-3xl bg-linear-to-br from-primary via-emerald-800 to-slate-950 p-6 text-white sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge className="mb-4 bg-white/15 text-white hover:bg-white/15">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Need help?
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight">
                  Send your travel inquiry to Pahuna
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">
                  Tell us your dates, destination, group size, stay needs, and food or route questions.
                  Pahuna will help you shape a realistic Karnali plan.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link href="/contact">Send Inquiry</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/70 bg-transparent text-white hover:bg-white hover:text-primary">
                  <Link href="/trip-planner">Plan First</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function SectionIntro({
  eyebrow,
  title,
  subtitle,
  href,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
  action: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{subtitle}</p>
      </div>
      <Button asChild variant="outline">
        <Link href={href}>
          {action} <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function EmptyDiscoveryCard({ title, href }: { title: string; href: string }) {
  return (
    <div className="rounded-3xl border border-dashed bg-muted/30 p-8 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">Some public listings are pending physical verification.</p>
      <Button asChild className="mt-4" variant="outline">
        <Link href={href}>Continue</Link>
      </Button>
    </div>
  );
}
