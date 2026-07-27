import type { Metadata } from "next";
import type { ConsentStatus, VerificationStatus } from "@server/lib/prisma-types";
import Link from "next/link";
import { Calculator, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { RoutesEstimatorClient } from "@/components/routes/routes-estimator-client";
import { getServiceProviders } from "@server/services/service-providers";
import type { RouteOption } from "@server/services/routes";
import { getAllRouteOptions } from "@server/services/routes";

export const metadata: Metadata = {
  title: "Karnali Route & Cost Estimator | Pahuna",
  description:
    "Estimate routes, travel time, cost ranges, stopovers, and reliability notes from Kathmandu, Nepalgunj, and Surkhet to Karnali destinations including Rara, Jumla, Dailekh, Dolpa, Humla, Salyan, and Jajarkot.",
  alternates: { canonical: "/routes" },
  openGraph: {
    title: "Karnali Route & Cost Estimator | Pahuna",
    description:
      "Plan Karnali routes with cautious time ranges, cost ranges, stopovers, reliability notes, and local confirmation guidance.",
  },
};

const featuredRouteIds = [
  "direct-kathmandu-to-surkhet-flight",
  "direct-kathmandu-to-surkhet-bus",
  "direct-surkhet-to-dailekh-road",
  "surkhet-to-rara-road",
  "direct-surkhet-to-humla-simikot-flight",
  "nepalgunj-to-phoksundo",
];

export default async function RoutesPage() {
  const [routeOptions, providers] = await Promise.all([
    getAllRouteOptions(),
    getServiceProviders(),
  ]);

  const featuredOptions = featuredRouteIds
    .map((id) => routeOptions.find((option) => option.id === id))
    .filter((option): option is RouteOption => Boolean(option))
    .concat(routeOptions.filter((option) => option.featured))
    .filter((option, index, all) => all.findIndex((item) => item.id === option.id) === index)
    .slice(0, 6);

  const providerSuggestionsByDistrict = providers.reduce<
    Record<
      string,
      {
        name: string;
        slug: string;
        typeLabel: string;
        district: string;
        area?: string | null;
        verificationStatus: VerificationStatus;
        consentStatus: ConsentStatus;
        services: string[];
      }[]
    >
  >((acc, provider) => {
    acc[provider.district] ??= [];
    if (acc[provider.district].length < 4) {
      acc[provider.district].push({
        name: provider.name,
        slug: provider.slug,
        typeLabel: provider.typeLabel,
        district: provider.district,
        area: provider.area,
        verificationStatus: provider.verificationStatus,
        consentStatus: provider.consentStatus,
        services: provider.services.slice(0, 3),
      });
    }
    return acc;
  }, {});

  return (
    <>
      <PageHero
        variant="light"
        className="bg-linear-to-b from-emerald-50/80 via-amber-50/60 to-background"
        badge={{ icon: <Calculator className="h-3 w-3" />, label: "Karnali travel planning" }}
        title="Karnali Route & Cost Estimator"
        subtitle="Plan routes from Kathmandu, Nepalgunj, and Surkhet to Karnali destinations with estimated travel time, cost ranges, reliability notes, and local route guidance."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="#route-builder">
              <Route className="h-4 w-4" />
              Build My Route
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/destinations">Explore destinations</Link>
          </Button>
        </div>
      </PageHero>

      <section className="py-14">
        <Container>
          <RoutesEstimatorClient
            routeOptions={routeOptions}
            featuredOptions={featuredOptions}
            providerSuggestionsByDistrict={providerSuggestionsByDistrict}
          />
        </Container>
      </section>
    </>
  );
}


