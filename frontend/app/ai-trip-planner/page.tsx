import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/layout/container";
import { AITripPlanner } from "@/components/ai/ai-trip-planner";
import { KarnaliPassport } from "@/components/engagement/KarnaliPassport";
import { LocalTipsCards } from "@/components/engagement/LocalTipsCards";

export const metadata: Metadata = {
  title: "AI Karnali Trip Planner | Pahuna",
  description:
    "Plan a Karnali trip from Surkhet with Pahuna AI. Get route ideas, day-wise itinerary, estimated cost ranges, stay suggestions, and travel warnings for Surkhet, Rara, Jumla, Dailekh, Dolpa, and Humla.",
  alternates: { canonical: "/ai-trip-planner" },
};

export default function AITripPlannerPage() {
  return (
    <>
      <PageHero
        badge={{ icon: <Sparkles className="h-3 w-3" />, label: "Pahuna AI" }}
        title="Plan your Karnali trip with"
        highlight="AI"
        subtitle="Tell us your days, budget, interests, and travel style. Pahuna AI will suggest routes, stays, places, and estimated cost ranges using real platform data."
      />

      <section className="py-16">
        <Container>
          <AITripPlanner />
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <KarnaliPassport compact />
            <LocalTipsCards variant="ai" title="AI planner tips" compact />
          </div>
        </Container>
      </section>
    </>
  );
}


