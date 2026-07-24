import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Info, Map, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { HotelCard } from "@/components/hotels/hotel-card";
import { FoodCard } from "@/components/food/food-card";
import { DestinationHero } from "@/components/destinations/destination-hero";
import { DestinationQuickFacts } from "@/components/destinations/destination-quick-facts";
import { SuggestedItineraryCard } from "@/components/destinations/suggested-itinerary-card";
import { InquiryCollectorButton } from "@/components/inquiries/InquiryCollectorButton";
import {
  getDestinationBySlug,
  getDestinationSlugs,
} from "@server/services/destinations";
import { getProvidersByDistrict } from "@server/services/service-providers";
import { getFoodProvidersForTripContext } from "@server/services/food";

interface DestinationDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DestinationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return { title: "Destination Not Found | Pahuna" };
  }

  return {
    title: `${destination.name} Travel Guide | Pahuna`,
    description: destination.shortDescription,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: {
      title: `${destination.name} Travel Guide | Pahuna`,
      description: destination.shortDescription,
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: DestinationDetailPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const [nearbyProviders, nearbyFood] = await Promise.all([
    getProvidersByDistrict(destination.district),
    getFoodProvidersForTripContext({ district: destination.district }),
  ]);

  return (
    <>
      <DestinationHero destination={destination} />

      <section className="py-14">
        <Container>
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/destinations">
              <ArrowLeft className="h-4 w-4" />
              Back to destinations
            </Link>
          </Button>

          <DestinationQuickFacts destination={destination} />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_24rem]">
            <div className="space-y-8">
              <article className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm md:p-8">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge className="bg-primary text-primary-foreground">
                    {destination.categoryLabel}
                  </Badge>
                  <Badge variant="outline">{destination.district}</Badge>
                  <Badge variant="secondary">{destination.difficultyLabel}</Badge>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Destination overview
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {destination.longDescription}
                </p>
              </article>

              <article className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Map className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                      Access notes
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight">
                      How to reach and plan safely
                    </h2>
                  </div>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  {destination.accessNotes ??
                    "Confirm road, weather, permits, operator schedule, and local access before travel."}
                </p>
              </article>

              <SuggestedItineraryCard destination={destination} />
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-start gap-3">
                  <Info className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      Accuracy note
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {destination.sourceNotes ??
                        "Temporary tourism database entry. Details should be physically verified before final commercial use."}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
                  Exact fares, route time, permits, and availability are not guaranteed.
                  Confirm locally before booking.
                </div>
              </div>

              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
                <h2 className="text-xl font-bold tracking-tight">
                  Need help planning this stop?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Share your days, budget, group type, and interests. Pahuna can help
                  turn this destination into a practical Karnali route.
                </p>
                <div className="mt-5 grid gap-3">
                  <Button asChild>
                    <Link href={`/trip-planner?destination=${destination.slug}`}>
                      <Route className="h-4 w-4" />
                      Add to trip planner
                    </Link>
                  </Button>
                  <InquiryCollectorButton
                    label="Send inquiry"
                    leadType="DESTINATION_INQUIRY"
                    selectedDestination={`${destination.name} (${destination.slug})`}
                    sourcePage={`/destinations/${destination.slug}`}
                    leadSource="destination-detail"
                    variant="outline"
                  />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {destination.district === "Surkhet" && (
        <section className="py-14">
          <Container>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-primary">
                  Nearby food options
                </p>
                <h2 className="text-3xl font-bold tracking-tight">
                  Food stops around Surkhet
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Public listings only. Confirm hours, menus, price, and availability through inquiry.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/food">View Food & Cafes</Link>
              </Button>
            </div>
            {nearbyFood.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {nearbyFood.slice(0, 4).map((provider) => (
                  <FoodCard key={provider.slug} provider={provider} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed bg-card p-8 text-center text-muted-foreground">
                Nearby food listings are being verified by Pahuna.
              </div>
            )}
          </Container>
        </section>
      )}

      <section className="bg-muted/30 py-14">
        <Container>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-primary">
                Nearby stays and services
              </p>
              <h2 className="text-3xl font-bold tracking-tight">
                Provider options around {destination.district}
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href={`/hotels?district=${encodeURIComponent(destination.district)}`}>
                View stays & services
              </Link>
            </Button>
          </div>

          {nearbyProviders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {nearbyProviders.slice(0, 4).map((provider) => (
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
