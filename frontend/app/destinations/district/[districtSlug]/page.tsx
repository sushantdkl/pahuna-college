import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Compass, MapPinned, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { HotelCard } from "@/components/hotels/hotel-card";
import { DistrictDestinationSection } from "@/components/destinations/district-destination-section";
import {
  fromDistrictSlug,
  getDestinationDistricts,
  getDestinationsByDistrict,
  getDistrictSlugs,
  toDistrictSlug,
} from "@server/services/destinations";
import { getProvidersByDistrict } from "@server/services/service-providers";

interface DistrictDestinationPageProps {
  params: Promise<{ districtSlug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getDistrictSlugs();
  return slugs.map((districtSlug) => ({ districtSlug }));
}

export async function generateMetadata({
  params,
}: DistrictDestinationPageProps): Promise<Metadata> {
  const { districtSlug } = await params;
  const districts = await getDestinationDistricts();
  const district =
    districts.find((item) => toDistrictSlug(item) === districtSlug) ??
    fromDistrictSlug(districtSlug);

  return {
    title: `${district} Destinations | Pahuna Karnali Travel Guide`,
    description: `Explore ${district} destinations, route notes, nearby stays, and planning guidance for Karnali travel with Pahuna.`,
    alternates: { canonical: `/destinations/district/${districtSlug}` },
  };
}

export default async function DistrictDestinationPage({
  params,
}: DistrictDestinationPageProps) {
  const { districtSlug } = await params;
  const districtName = fromDistrictSlug(districtSlug);
  const destinations = await getDestinationsByDistrict(districtName);
  if (destinations.length === 0) notFound();

  const district = destinations[0].district;
  const nearbyProviders = (await getProvidersByDistrict(district)).slice(0, 4);
  const routeNote = getDistrictRouteNote(district);

  return (
    <>
      <PageHero
        variant="light"
        align="left"
        badge={{ icon: <MapPinned className="h-3 w-3" />, label: "District guide" }}
        title={`${district} Destinations`}
        subtitle={`Plan ${district} as part of a wider Karnali route from Surkhet, with cautious access notes, nearby stays, and places to verify before travel.`}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={`/trip-planner?district=${encodeURIComponent(district)}`}>
              <Route className="h-4 w-4" />
              Plan {district}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/destinations">
              <ArrowLeft className="h-4 w-4" />
              All destinations
            </Link>
          </Button>
        </div>
      </PageHero>

      <section className="py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
            <DistrictDestinationSection
              district={district}
              destinations={destinations}
            />

            <aside className="space-y-6">
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                      Suggested route from Surkhet
                    </p>
                    <h2 className="text-xl font-bold tracking-tight">
                      Confirm before departure
                    </h2>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {routeNote}
                </p>
                <div className="mt-4 rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
                  Route time, transport cost, weather, and operator schedule may
                  change. Keep buffer time and confirm locally.
                </div>
              </div>

              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
                <Badge variant="secondary" className="mb-3">
                  Planning status
                </Badge>
                <h2 className="text-xl font-bold tracking-tight">
                  Expandable Karnali district
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Destination entries are temporary planning records. Commercial use
                  should wait for physical verification and local operator checks.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-muted/30 py-14">
        <Container>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-primary">
                Stays and services
              </p>
              <h2 className="text-3xl font-bold tracking-tight">
                Nearby providers in {district}
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href={`/hotels?district=${encodeURIComponent(district)}`}>
                View stays & services
              </Link>
            </Button>
          </div>

          {nearbyProviders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {nearbyProviders.map((provider) => (
                <HotelCard
                  key={provider.slug}
                  name={provider.name}
                  slug={provider.slug}
                  shortDesc={provider.shortDescription}
                  propertyType={provider.type}
                  typeLabel={provider.typeLabel}
                  district={provider.district}
                  area={provider.area}
                  address={provider.address}
                  priceFrom={provider.priceFrom}
                  currency={provider.currency}
                  rating={provider.rating}
                  isFeatured={provider.featured}
                  verificationStatus={provider.verificationStatus}
                  consentStatus={provider.consentStatus}
                  amenities={provider.amenities}
                  services={provider.services}
                  coverImage={provider.images[0]}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
              Nearby stays and services are being verified by Pahuna.
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

function getDistrictRouteNote(district: string) {
  const notes: Record<string, string> = {
    Surkhet:
      "Use Birendranagar as the main urban base for local attractions, stays, transport, and onward Karnali route planning.",
    Dailekh:
      "Plan Dailekh from Surkhet by road and confirm vehicle availability, road condition, and local religious circuit access.",
    Salyan:
      "Plan Salyan from Surkhet by road with buffer time for hill-road conditions and local transport confirmation.",
    Jajarkot:
      "Plan Jajarkot from Surkhet by road and confirm road condition, seasonal disruptions, and district-level transport.",
    "Rukum West":
      "Plan Rukum West from Surkhet as a longer hill-road journey with local confirmation and buffer time.",
    Kalikot:
      "Use Kalikot as an important road corridor toward Jumla and Rara, with road condition checks before departure.",
    Jumla:
      "Reach Jumla through flight or road options depending on schedule and season, then confirm onward routes locally.",
    Mugu:
      "Plan Mugu and Rara with extra buffer time because road, flight, weather, and local transport conditions can change.",
    Dolpa:
      "Plan Dolpa through confirmed air and trekking connections; permits, weather, and guide support should be checked early.",
    Humla:
      "Plan Humla through confirmed remote flight or supported route options, with buffer days for weather-sensitive travel.",
  };

  return notes[district] ?? "Confirm the Surkhet connection, transport options, road condition, and local support before travel.";
}
