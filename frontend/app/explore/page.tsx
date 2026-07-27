import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bus,
  Camera,
  Compass,
  Landmark,
  MapPin,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { SurkhetGuideClient } from "@/components/explore/surkhet-guide-client";
import { KarnaliPassport } from "@/components/engagement/KarnaliPassport";
import { LocalTipsCards } from "@/components/engagement/LocalTipsCards";
import { TripConfidenceScore } from "@/components/engagement/TripConfidenceScore";
import { VibeTripPlanner } from "@/components/engagement/VibeTripPlanner";
import { FoodCard } from "@/components/food/food-card";
import { getFeaturedFoodProviders } from "@server/services/food";
import { getProvidersByDistrict } from "@server/services/service-providers";
import { assets } from "@server/lib/assets";

export const metadata: Metadata = {
  title: "Explore Surkhet | Gateway to Karnali Travel Guide | Pahuna",
  description:
    "Plan your Surkhet journey with Pahuna. Discover Birendranagar, Kakrebihar, Bulbule Lake, Deuti Bajai, viewpoints, local stays, and onward routes to Rara, Jumla, Dailekh, Dolpa, and Humla.",
  alternates: { canonical: "/explore" },
  openGraph: {
    title: "Explore Surkhet | Gateway to Karnali Travel Guide | Pahuna",
    description:
      "Plan your Surkhet journey with Pahuna. Discover Birendranagar, Kakrebihar, Bulbule Lake, Deuti Bajai, viewpoints, local stays, and onward routes to Rara, Jumla, Dailekh, Dolpa, and Humla.",
  },
};

const QUICK_FACTS = [
  {
    label: "Gateway city",
    value: "Birendranagar",
    description: "Main urban base for Surkhet and Karnali travel planning.",
    icon: MapPin,
  },
  {
    label: "Best for",
    value: "Family, transit, culture, religious visits",
    description:
      "Ideal for short stays, local sightseeing, and onward Karnali routes.",
    icon: Sparkles,
  },
  {
    label: "Access",
    value: "Flight + long-distance bus",
    description:
      "Direct Kathmandu-Surkhet flights and road access via Kohalpur/Surkhet corridor.",
    icon: Plane,
  },
  {
    label: "Nearby highlights",
    value: "Kakrebihar, Bulbule, Deuti Bajai, Gothikanda, Barahatal",
    description:
      "A compact mix of heritage, lake, temple, viewpoint, and nature stops.",
    icon: Landmark,
  },
];

export default async function ExplorePage() {
  const [surkhetProviders, featuredFoodProviders] = await Promise.all([
    getProvidersByDistrict("Surkhet"),
    getFeaturedFoodProviders(8),
  ]);
  const staySuggestions = surkhetProviders.slice(0, 6).map((provider) => ({
    name: provider.name,
    slug: provider.slug,
    typeLabel: provider.typeLabel,
    area: provider.area,
    verificationStatus: provider.verificationStatus,
    consentStatus: provider.consentStatus,
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-[#f8f1e4] py-20 sm:py-24">
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background to-transparent" />
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <Badge className="mb-5 bg-primary/10 text-primary hover:bg-primary/15">
                <MapPin className="mr-1.5 h-3.5 w-3.5" />
                Surkhet destination guide
              </Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Explore Surkhet — Gateway to Karnali
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Start your Karnali journey from Birendranagar with stays,
                culture, lakes, temples, viewpoints, and routes to Rara, Jumla,
                Dailekh, Dolpa, and Humla.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/trip-planner">
                    <Compass className="mr-2 h-4 w-4" />
                    Plan My Trip
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/hotels">Find Stays</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl border bg-white p-4 shadow-xl">
                <div className="relative min-h-[430px] overflow-hidden rounded-[1.25rem] bg-muted">
                  <Image
                    src={assets.hero.surkhet}
                    alt="Surkhet landscape and Birendranagar travel base"
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-950/45 via-black/15 to-amber-950/35" />
                  <div className="absolute left-6 top-6 rounded-2xl bg-white/90 p-4 shadow-lg">
                    <p className="text-sm font-semibold">Birendranagar base</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Stays, food, transport, and onward route planning
                    </p>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Local sights", icon: Camera },
                      { label: "Karnali routes", icon: Route },
                      { label: "Road + flight", icon: Bus },
                    ].map(({ label, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-2xl bg-white/90 p-4 text-sm font-semibold shadow-lg"
                      >
                        <Icon className="mb-2 h-5 w-5 text-primary" />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border bg-white px-5 py-4 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Practical planning first</p>
                    <p className="text-xs text-muted-foreground">
                      Routes and access require local confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {QUICK_FACTS.map(({ label, value, description, icon: Icon }) => (
              <Card key={label} className="rounded-3xl border bg-white shadow-sm">
                <CardContent className="p-5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold leading-snug">{value}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <KarnaliPassport
              autoUnlockBadge="surkhet-starter"
              focusBadges={["surkhet-starter", "panchakoshi-pilgrim", "rara-dreamer", "karnali-grand-circuit"]}
              compact
            />
            <VibeTripPlanner
              compact
              title="Pick a Surkhet-to-Karnali vibe"
              subtitle="Start easy in Birendranagar, then choose the mood for your onward route."
            />
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Surkhet trip confidence</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Local city routes feel light; remote onward routes need confirmation.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-emerald-50/60 p-4">
                <p className="font-semibold">Surkhet local sights</p>
                <TripConfidenceScore context="Surkhet Birendranagar Bulbule Deuti Bajai Kakrebihar family" compact className="mt-3" />
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="font-semibold">Dailekh and Jumla routes</p>
                <TripConfidenceScore context="Dailekh Panchakoshi Jumla Sinja Rara road route" compact className="mt-3" />
              </div>
              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="font-semibold">Dolpa, Humla, Rara flights</p>
                <TripConfidenceScore context="Dolpa Phoksundo Humla Limi Rara flight remote weather" compact className="mt-3" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <LocalTipsCards variant="surkhet" title="Surkhet local tips" />
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="outline" className="mb-3 border-primary/20 text-primary">
                Food & Cafes
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Where to eat around Birendranagar
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Public food listings for cafes, restaurants, momo spots, tea stops,
                lounges, and local food around Surkhet. Details require inquiry confirmation.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/food">View food guide</Link>
            </Button>
          </div>
          {featuredFoodProviders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featuredFoodProviders.map((provider) => (
                <FoodCard key={provider.slug} provider={provider} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed bg-card p-8 text-center text-muted-foreground">
              Food listings are being prepared for Surkhet.
            </div>
          )}
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
                Why start here?
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Surkhet works as the calm first step into Karnali.
              </h2>
              <p className="mt-5 text-muted-foreground leading-7">
                Birendranagar gives travelers an easier base for stays, local
                food, short sightseeing, and transport coordination before
                moving toward remote districts. It is a useful stop for family
                travel, cultural visits, and routes that require schedule or
                road-condition confirmation.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {["Stays", "Culture", "Temples", "Viewpoints", "Transport", "Karnali routes"].map(
                  (item) => (
                    <Badge key={item} variant="secondary" className="bg-primary/10 px-3 py-1 text-primary">
                      {item}
                    </Badge>
                  ),
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "First-day friendly",
                  text: "Plan a light city day around Bulbule, local food, and basic route preparation.",
                },
                {
                  title: "Compact attractions",
                  text: "Kakrebihar, Deuti Bajai, and viewpoints can fit into short Surkhet stays.",
                },
                {
                  title: "Onward route base",
                  text: "Use Surkhet to coordinate roads and flights toward Rara, Jumla, Dailekh, Dolpa, and Humla.",
                },
                {
                  title: "Inquiry-led travel",
                  text: "Stay and service availability should be confirmed before travelers commit to remote plans.",
                },
              ].map((item) => (
                <Card key={item.title} className="rounded-3xl border bg-[#fbf8f0] shadow-sm">
                  <CardContent className="p-5">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <SurkhetGuideClient stays={staySuggestions} />

      <section className="pb-20">
        <Container>
          <div className="rounded-3xl border bg-[#f8f1e4] p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge variant="outline" className="mb-3 border-primary/20 text-primary">
                  Keep exploring
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Turn Surkhet into a complete Karnali travel plan.
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Compare destination guides, route estimates, and stays before
                  confirming transport or remote travel details.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/destinations">
                    Explore destinations <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/routes">Route estimator</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}


