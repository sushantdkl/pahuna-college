import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, DollarSign, Map, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { EmptyState } from "@/components/shared/empty-state";
import { ItinerariesExplorerClient } from "@/components/itineraries/itineraries-explorer-client";
import { getLiveItineraries } from "@server/services/public-live";

export const metadata: Metadata = {
  title: "Trip Ideas & Itineraries — Surkhet",
  description:
    "Pre-planned itineraries for Surkhet, Nepal. Choose from curated 3-day or 5-day trips with estimated costs and detailed day-by-day plans.",
  alternates: { canonical: "/itineraries" },
  openGraph: {
    title: "Trip Ideas & Itineraries — Surkhet",
    description: "Pre-planned travel itineraries for your Surkhet adventure.",
  },
};

export default async function ItinerariesPage() {
  const itineraries = await getLiveItineraries();

  return (
    <>
      {/* ── HERO ── */}
      <PageHero
        badge={{ icon: <Map className="h-3 w-3" />, label: "Tourism Roadmap" }}
        title="Trip Ideas &"
        highlight="Itineraries"
        subtitle="Pre-planned journeys to help you make the most of your time in Surkhet. Pick a plan, customize it, and go."
      >
        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 shadow-lg">
            <Link href="/trip-planner"><DollarSign className="h-4 w-4 mr-2" />Open Trip Planner</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/70 bg-transparent text-white hover:bg-white hover:text-primary font-semibold px-8">
            <Link href="/experiences">View Experiences</Link>
          </Button>
        </div>
      </PageHero>

      {/* ── ITINERARIES EXPLORER ── */}
      <section className="py-16">
        <Container>
          {itineraries.length > 0 ? (
            <ItinerariesExplorerClient itineraries={itineraries} />
          ) : (
            <EmptyState
              icon={<Compass className="h-14 w-14" />}
              title="No itineraries available"
              description="We're building curated trip ideas for Surkhet. Check back soon!"
              action={{ label: "Explore Surkhet", href: "/explore" }}
            />
          )}
        </Container>
      </section>

      {/* ── AI CUSTOM ITINERARY ── */}
      <section className="py-10">
        <Container>
          <div className="rounded-3xl border border-emerald-100/70 bg-linear-to-br from-emerald-50 via-amber-50/60 to-background p-6 shadow-sm sm:p-8">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                  Build a custom itinerary
                </p>
                <h2 className="mt-2 text-2xl font-bold">Build a custom itinerary</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Plan a day-wise Karnali route with AI using real Pahuna stays and destinations.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/trip-planner">
                  Open Trip Planner <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-muted/40">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-3">Need a Custom Itinerary?</h2>
            <p className="text-muted-foreground mb-6">
              Want something tailored to your group, dates, and budget? Contact our team and we&apos;ll build a personalized trip plan for you.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Request Custom Trip <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}


