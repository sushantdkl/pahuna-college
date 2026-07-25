import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { DestinationCard } from "@/components/destinations/destination-card";
import { DestinationsExplorer } from "@/components/destinations/destinations-explorer";
import { getDestinations, getFeaturedDestinations } from "@server/services/destinations";

export const metadata: Metadata = {
  title: "Karnali Destinations | Explore Surkhet, Rara, Jumla, Dolpa & Humla",
  description:
    "Explore Karnali destinations across Surkhet, Dailekh, Salyan, Jajarkot, Rukum West, Kalikot, Jumla, Mugu, Dolpa, and Humla with Pahuna.",
  alternates: { canonical: "/destinations" },
};

export default async function DestinationsPage() {
  const [destinations, featuredDestinations] = await Promise.all([
    getDestinations(),
    getFeaturedDestinations(6),
  ]);

  return (
    <>
      <PageHero
        badge={{ icon: <Compass className="h-3 w-3" />, label: "Karnali travel guide" }}
        title="Karnali Destinations"
        highlight="From Surkhet to the high Himalaya"
        subtitle="Build a careful Karnali route across gateway cities, lakes, temples, heritage places, national parks, trekking villages, and river corridors."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/trip-planner">
              <Route className="h-4 w-4" />
              Build My Karnali Route
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-white/10 text-white hover:bg-white/20">
            <Link href="/hotels">Find stays & services</Link>
          </Button>
        </div>
      </PageHero>

      {featuredDestinations.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-primary">
                  Featured destinations
                </p>
                <h2 className="text-3xl font-bold tracking-tight">
                  Start with the key Karnali anchors
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                These entries are planning references. Routes, access, permits, stays,
                and operator availability should be confirmed before travel.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredDestinations.map((destination) => (
                <DestinationCard key={destination.slug} destination={destination} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-muted/30 py-16">
        <Container>
          <DestinationsExplorer destinations={destinations} />
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-3xl border border-border/70 bg-linear-to-br from-emerald-50 via-amber-50/70 to-background p-8 shadow-sm md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-primary">
                  Route planning
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  Build your Karnali route around real districts
                </h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Choose days, budget, interests, and gateway points. Pahuna helps turn
                  Surkhet, Rara, Jumla, Dailekh, Dolpa, Humla, and other Karnali stops
                  into a practical route plan.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/trip-planner">
                  Build My Karnali Route
                  <Route className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}


