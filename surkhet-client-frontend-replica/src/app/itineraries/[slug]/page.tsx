import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Users,
  Mountain,
  Calendar,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { demoItineraries, getItinerarySlugs } from "@server/services";
import { TripMapPanelClient } from "@/components/itineraries/trip-map-panel-client";
import { InquiryCollectorButton } from "@/components/inquiries/InquiryCollectorButton";
import { BudgetPossibilitySlider } from "@/components/engagement/BudgetPossibilitySlider";
import { KarnaliPassport } from "@/components/engagement/KarnaliPassport";
import { LocalTipsCards } from "@/components/engagement/LocalTipsCards";
import { TripConfidenceScore } from "@/components/engagement/TripConfidenceScore";
import { FoodCard } from "@/components/food/food-card";
import { getFoodProvidersForTripContext } from "@server/services/food";

interface ItineraryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getItinerarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ItineraryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const itinerary = demoItineraries.find((i) => i.slug === slug);
  if (!itinerary) return { title: "Itinerary Not Found" };
  return {
    title: itinerary.title,
    description: itinerary.shortDesc,
  };
}

export default async function ItineraryDetailPage({
  params,
}: ItineraryDetailPageProps) {
  const { slug } = await params;
  const itinerary = demoItineraries.find((i) => i.slug === slug);

  if (!itinerary) notFound();
  const foodSuggestions = await getFoodProvidersForTripContext({
    district: "Surkhet",
  });

  return (
    <>
      {/* Hero */}
      <section className="relative bg-linear-to-br from-slate-100/80 via-indigo-50/40 to-background py-16">
        <Container>
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/itineraries" className="hover:text-primary">
              Trip Ideas
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">
              {itinerary.title}
            </span>
          </nav>

          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              {itinerary.difficulty}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {itinerary.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {itinerary.description}
            </p>
          </div>

          {/* Quick Info */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-medium text-sm">{itinerary.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Difficulty</p>
                <p className="font-medium text-sm">{itinerary.difficulty}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Est. Cost</p>
                <p className="font-medium text-sm">{itinerary.estimatedCost}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Best Season</p>
                <p className="font-medium text-sm">{itinerary.bestSeason}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Group Size</p>
                <p className="font-medium text-sm">{itinerary.groupSize}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <TripConfidenceScore
              context={`${itinerary.title} ${itinerary.description} ${itinerary.difficulty}`}
              difficulty={itinerary.difficulty}
              familyFriendly={itinerary.title.toLowerCase().includes("surkhet")}
            />
          </div>
        </Container>
      </section>

      {/* Trip Map Panel */}
      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight mb-10">
            Day-by-Day Itinerary
          </h2>

          <TripMapPanelClient
            days={itinerary.days}
            title={itinerary.title}
            duration={itinerary.duration}
            estimatedCost={itinerary.estimatedCost}
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <KarnaliPassport
              focusBadges={["surkhet-starter", "rara-dreamer", "karnali-grand-circuit"]}
              compact
            />
            <LocalTipsCards
              variant={itinerary.difficulty.toLowerCase().includes("hard") ? "remote" : "general"}
              title="Tips for this itinerary"
              compact
            />
          </div>

          <div className="mt-12">
            <BudgetPossibilitySlider compact />
          </div>

          <div className="mt-12">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Food suggestions
                </p>
                <h2 className="text-2xl font-bold tracking-tight">
                  Food stops to confirm for this route
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Suggestions come from Pahuna FoodProvider records only. Confirm details before travel.
                </p>
              </div>
              <Link href="/food" className="text-sm font-semibold text-primary hover:underline">
                View Food & Cafes
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {foodSuggestions.slice(0, 4).map((provider) => (
                <FoodCard key={provider.slug} provider={provider} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-primary/5 p-8 text-center">
            <h3 className="text-2xl font-bold">Want to Book This Trip?</h3>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              Submit an inquiry and our team will customize this itinerary to
              your group size, dates, and budget.
            </p>
            <InquiryCollectorButton
              label="Send this itinerary to Pahuna"
              leadType="ITINERARY_INQUIRY"
              selectedItinerary={`${itinerary.title} (${itinerary.slug})`}
              sourcePage={`/itineraries/${itinerary.slug}`}
              leadSource="itinerary-detail"
              defaultBudgetRange={itinerary.estimatedCost}
              className="mt-6"
              size="lg"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
