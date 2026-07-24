// @ts-nocheck
"use client";

import Link from "next/link";
import Image from "next/image";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Binoculars,
  Bus,
  Camera,
  Car,
  Compass,
  Landmark,
  Leaf,
  Map,
  MapPin,
  Mountain,
  Plane,
  Route,
  TreePine,
  UtensilsCrossed,
  UsersRound,
  Waves,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@backend/lib/utils";
import { assets } from "@backend/lib/assets";

type TravelStyle =
  | "All"
  | "Heritage"
  | "Lake"
  | "Temple"
  | "Viewpoint"
  | "Family"
  | "Food"
  | "Route to Karnali";

type PlannerState = {
  days: string;
  budget: string;
  interest: string;
  group: string;
};

type SurkhetStay = {
  name: string;
  slug: string;
  typeLabel: string;
  area?: string | null;
  verificationStatus: string;
  consentStatus: string;
};

interface SurkhetGuideClientProps {
  stays: SurkhetStay[];
}

const TRAVEL_STYLES: { label: TravelStyle; icon: ComponentType<{ className?: string }> }[] = [
  { label: "All", icon: Compass },
  { label: "Heritage", icon: Landmark },
  { label: "Lake", icon: Waves },
  { label: "Temple", icon: Landmark },
  { label: "Viewpoint", icon: Mountain },
  { label: "Family", icon: UsersRound },
  { label: "Food", icon: UtensilsCrossed },
  { label: "Route to Karnali", icon: Route },
];

const SURKHET_PLACES = [
  {
    name: "Kakrebihar",
    slug: "kakrebihar",
    categories: ["Heritage", "Family"],
    description:
      "A historic and archaeological site in Surkhet, suitable for heritage walks, photography, and cultural exploration.",
    duration: "1-2 hours",
    difficulty: "Easy",
    accent: "from-emerald-700 via-stone-700 to-amber-500",
    image: assets.surkhet.kakrebihar,
    icon: Landmark,
  },
  {
    name: "Bulbule Lake",
    slug: "bulbule-lake",
    categories: ["Lake", "Family"],
    description:
      "A relaxing lake area near Birendranagar, suitable for family visits, short walks, and evening exploration.",
    duration: "1-2 hours",
    difficulty: "Easy",
    accent: "from-teal-700 via-emerald-600 to-lime-400",
    image: assets.surkhet.bulbuleLake,
    icon: Waves,
  },
  {
    name: "Deuti Bajai Temple",
    slug: "deuti-bajai-temple",
    categories: ["Temple", "Family"],
    description:
      "A major religious stop in Surkhet, commonly visited by local and domestic travelers.",
    duration: "1-2 hours",
    difficulty: "Easy",
    accent: "from-amber-700 via-orange-500 to-yellow-300",
    image: assets.surkhet.deutiBajai,
    icon: Landmark,
  },
  {
    name: "Gothikanda Viewpoint",
    slug: "gothikanda-viewpoint",
    categories: ["Viewpoint", "Family"],
    description:
      "A scenic viewpoint area suitable for sunrise, sunset, photography, and short hill-side escapes.",
    duration: "Half day",
    difficulty: "Moderate",
    accent: "from-emerald-800 via-sky-700 to-amber-300",
    image: assets.surkhet.guraseViewTower,
    icon: Mountain,
  },
  {
    name: "Barahatal / Baraha Lake",
    slug: "baraha-lake-barahatal",
    categories: ["Lake", "Family"],
    description:
      "A peaceful lake destination around Surkhet for nature-focused short trips.",
    duration: "Half day",
    difficulty: "Moderate",
    accent: "from-cyan-800 via-teal-600 to-green-300",
    image: assets.surkhet.ranimatta,
    icon: Leaf,
  },
  {
    name: "Bheri River",
    slug: "bheri-river-surkhet",
    categories: ["Route to Karnali", "Lake"],
    description:
      "A river corridor connected with Karnali travel routes, rafting experiences, and road-trip scenery.",
    duration: "Day trip",
    difficulty: "Moderate",
    accent: "from-blue-800 via-cyan-700 to-emerald-300",
    image: assets.surkhet.bheriRiverBridge,
    icon: Waves,
  },
  {
    name: "Birendranagar Food Stops",
    slug: "birendranagar-city",
    categories: ["Food", "Family"],
    description:
      "Common local food areas and city stops useful for short stays, market walks, and route preparation.",
    duration: "2-3 hours",
    difficulty: "Easy",
    accent: "from-stone-800 via-orange-600 to-amber-300",
    image: assets.surkhet.ghantaghar,
    icon: UtensilsCrossed,
  },
];

const ROUTE_CARDS = [
  {
    title: "Surkhet to Dailekh",
    useCase: "Religious and cultural circuit",
    highlights: "Panchakoshi, Dullu, heritage sites",
    difficulty: "Easy to Moderate",
    href: "/routes?from=Surkhet&to=Dailekh",
    icon: Landmark,
  },
  {
    title: "Surkhet to Kalikot / Jumla / Rara",
    useCase: "Rara gateway route",
    highlights: "Manma, Jumla, Sinja, Rara Lake",
    difficulty: "Moderate to Hard",
    href: "/routes?from=Surkhet&to=Rara",
    icon: Mountain,
  },
  {
    title: "Surkhet to Humla",
    useCase: "Remote Himalayan and Kailash gateway route",
    highlights: "Simikot, Limi Valley, Hilsa",
    difficulty: "Hard",
    href: "/routes?from=Surkhet&to=Humla",
    icon: Plane,
  },
  {
    title: "Surkhet to Dolpa via Nepalgunj / Juphal",
    useCase: "Phoksundo and trekking route",
    highlights: "Juphal, Dunai, Ringmo, Shey Phoksundo Lake",
    difficulty: "Hard",
    href: "/routes?from=Surkhet&to=Dolpa",
    icon: TreePine,
  },
  {
    title: "Surkhet to Salyan / Jajarkot / Rukum West",
    useCase: "Hill culture, lakes, river corridors, local history",
    highlights: "Kupinde Daha, Jajarkot Durbar, Musikot",
    difficulty: "Moderate",
    href: "/routes?from=Surkhet&to=Salyan",
    icon: Car,
  },
];

const PLANNER_OPTIONS = {
  days: ["1 day", "2-3 days", "5+ days"],
  budget: ["Budget", "Standard", "Premium"],
  interests: ["Culture", "Nature", "Religious", "Food", "Adventure", "Family"],
  groups: ["Solo", "Couple", "Family", "Friends", "Business"],
};

function plannerHref(state: PlannerState) {
  const params = new URLSearchParams({
    from: "Surkhet",
    days: state.days,
    budget: state.budget,
    interest: state.interest,
    group: state.group,
  });

  return `/trip-planner?${params.toString()}`;
}

export function SurkhetGuideClient({ stays }: SurkhetGuideClientProps) {
  const [selectedStyle, setSelectedStyle] = useState<TravelStyle>("All");
  const [planner, setPlanner] = useState<PlannerState>({
    days: "2-3 days",
    budget: "Standard",
    interest: "Culture",
    group: "Family",
  });

  const filteredPlaces = useMemo(() => {
    if (selectedStyle === "All") return SURKHET_PLACES;
    return SURKHET_PLACES.filter((place) => place.categories.includes(selectedStyle));
  }, [selectedStyle]);

  return (
    <>
      <section className="py-18 bg-[#f7f1e6]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="outline" className="mb-3 border-primary/20 bg-white/70 text-primary">
                Travel style
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explore by travel style
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Pick a mood and discover the places that match your Karnali plan.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredPlaces.length} Surkhet places
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-3">
            {TRAVEL_STYLES.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedStyle(label)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                  selectedStyle === label
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-white text-foreground hover:border-primary/40 hover:text-primary",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredPlaces.map((place) => {
              const Icon = place.icon;
              return (
                <Card
                  key={place.slug}
                  className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={cn("relative h-48 overflow-hidden bg-linear-to-br", place.accent)}>
                    <Image
                      src={place.image}
                      alt={`${place.name} in Surkhet`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-black/15 via-black/10 to-black/45" />
                    <div className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-lg">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                      {place.categories.slice(0, 2).map((category) => (
                        <Badge key={category} className="bg-white/90 text-foreground hover:bg-white">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                        {place.duration}
                      </span>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
                        {place.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight">{place.name}</h3>
                    <p className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground">
                      {place.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button asChild size="sm">
                        <Link href={`/destinations/${place.slug}`}>
                          View guide <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/trip-planner?destination=${encodeURIComponent(place.slug)}`}>
                          Add to trip
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <Badge variant="outline" className="mb-3 border-primary/20 text-primary">
              Routes from Surkhet
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Where can you go from Surkhet?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Use Birendranagar as the practical base for nearby Surkhet sightseeing and onward Karnali routes.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-5">
            {ROUTE_CARDS.map((route) => {
              const Icon = route.icon;
              return (
                <Card
                  key={route.title}
                  className="rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg lg:col-span-1"
                >
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold leading-tight">{route.title}</h3>
                    <p className="mt-2 text-sm font-medium text-primary">{route.useCase}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{route.highlights}</p>
                    <Badge variant="outline" className="mt-4 w-fit">
                      {route.difficulty}
                    </Badge>
                    <p className="mt-4 text-xs leading-5 text-muted-foreground">
                      Route time, transport cost, and accessibility may change due to road, weather, and operator schedule.
                    </p>
                    <div className="mt-auto pt-5">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={route.href}>
                          Build route <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f4eb] py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Badge variant="outline" className="mb-3 border-primary/20 text-primary">
                    Map preview
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tight">Surkhet Travel Map</h2>
                  <p className="mt-2 text-muted-foreground">
                    Explore places, stays, and routes from Birendranagar.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Places", "Stays", "Transport", "Routes"].map((chip) => (
                    <Badge key={chip} variant="secondary" className="bg-primary/10 text-primary">
                      {chip}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[430px] overflow-hidden rounded-3xl border bg-linear-to-br from-emerald-50 via-stone-100 to-amber-50">
                <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(15,82,57,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,82,57,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
                <div className="absolute left-[11%] top-[20%] h-28 w-28 rounded-full border border-emerald-300/70 bg-emerald-200/25" />
                <div className="absolute right-[13%] top-[18%] h-36 w-36 rounded-full border border-amber-300/70 bg-amber-200/30" />
                <div className="absolute bottom-[12%] left-[30%] h-40 w-40 rounded-full border border-cyan-300/70 bg-cyan-200/20" />
                <div className="absolute left-[10%] right-[10%] top-[55%] h-3 -rotate-6 rounded-full bg-primary/20" />
                <div className="absolute left-[35%] right-[8%] top-[38%] h-3 rotate-12 rounded-full bg-amber-500/20" />

                {[
                  { label: "Birendranagar", icon: MapPin, className: "left-[43%] top-[45%]" },
                  { label: "Kakrebihar", icon: Landmark, className: "left-[28%] top-[55%]" },
                  { label: "Bulbule", icon: Waves, className: "left-[52%] top-[58%]" },
                  { label: "Deuti Bajai", icon: Landmark, className: "left-[58%] top-[35%]" },
                  { label: "Gothikanda", icon: Mountain, className: "left-[33%] top-[24%]" },
                  { label: "Bheri Route", icon: Route, className: "left-[68%] top-[68%]" },
                ].map((marker) => {
                  const Icon = marker.icon;
                  return (
                    <div
                      key={marker.label}
                      className={cn(
                        "absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border bg-white/95 px-3 py-2 text-xs font-semibold shadow-lg",
                        marker.className,
                      )}
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="hidden sm:inline">{marker.label}</span>
                    </div>
                  );
                })}

                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border bg-white/90 p-4 shadow-lg backdrop-blur">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Map markers are a guide preview. Exact location and access details should be confirmed before travel.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="rounded-3xl border bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Map className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Stays and services nearby</h3>
                    <p className="text-sm text-muted-foreground">
                      Public listings around Surkhet for route planning.
                    </p>
                  </div>
                </div>

                {stays.length > 0 ? (
                  <div className="space-y-3">
                    {stays.slice(0, 4).map((stay) => (
                      <Link
                        key={stay.slug}
                        href={`/hotels/${stay.slug}`}
                        className="block rounded-2xl border p-4 transition hover:border-primary/40 hover:bg-primary/5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{stay.name}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {stay.typeLabel}
                              {stay.area ? ` · ${stay.area}` : ""}
                            </p>
                          </div>
                          {stay.verificationStatus === "PUBLIC_LISTING" && (
                            <Badge variant="outline" className="shrink-0">
                              Public Listing
                            </Badge>
                          )}
                        </div>
                        <p className="mt-3 text-xs font-medium text-primary">
                          {stay.consentStatus === "CONSENTED"
                            ? "Contact details available on listing"
                            : "Contact via Pahuna Inquiry"}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
                    Nearby stays and services are being verified by Pahuna.
                  </div>
                )}

                <Button asChild className="mt-6 w-full">
                  <Link href="/hotels">Find Stays</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border bg-linear-to-br from-primary via-emerald-700 to-stone-900 text-white shadow-xl">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
              <div>
                <Badge className="mb-4 bg-white/15 text-white hover:bg-white/20">
                  Build your route
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Build your Karnali route from Surkhet
                </h2>
                <p className="mt-4 max-w-xl text-white/75">
                  Choose your days, budget, travel style, and interests. Pahuna helps you turn Surkhet into a complete Karnali journey.
                </p>
                <div className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <Bus className="mb-2 h-5 w-5" />
                    Road and flight access should be reconfirmed before booking.
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <Binoculars className="mb-2 h-5 w-5" />
                    Mix local sightseeing with onward Karnali route planning.
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-5 text-foreground shadow-lg sm:p-6">
                <PlannerGroup
                  label="Days"
                  options={PLANNER_OPTIONS.days}
                  value={planner.days}
                  onChange={(days) => setPlanner((current) => ({ ...current, days }))}
                />
                <PlannerGroup
                  label="Budget"
                  options={PLANNER_OPTIONS.budget}
                  value={planner.budget}
                  onChange={(budget) => setPlanner((current) => ({ ...current, budget }))}
                />
                <PlannerGroup
                  label="Interests"
                  options={PLANNER_OPTIONS.interests}
                  value={planner.interest}
                  onChange={(interest) => setPlanner((current) => ({ ...current, interest }))}
                />
                <PlannerGroup
                  label="Group type"
                  options={PLANNER_OPTIONS.groups}
                  value={planner.group}
                  onChange={(group) => setPlanner((current) => ({ ...current, group }))}
                />

                <Button asChild size="lg" className="mt-6 w-full">
                  <Link href={plannerHref(planner)}>
                    Continue to Trip Planner <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PlannerGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="border-b py-4 first:pt-0 last:border-b-0">
      <p className="mb-3 text-sm font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition",
              value === option
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}


