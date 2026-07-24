import { Metadata } from "next";
import Link from "next/link";
import { Hotel, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { StayRecommenderSection } from "@/components/hotels/stay-recommender-section";
import { HotelsExplorerClient } from "@/components/hotels/hotels-explorer-client";
import { getServiceProviders } from "@server/services/service-providers";
import { hotelsCopy } from "@server/data/site-copy";

export const metadata: Metadata = {
  title: hotelsCopy.metadata.title,
  description: hotelsCopy.metadata.description,
  alternates: { canonical: "/hotels" },
  openGraph: {
    title: hotelsCopy.metadata.ogTitle,
    description: hotelsCopy.metadata.ogDescription,
  },
};

export const dynamic = "force-dynamic";

export default async function HotelsPage() {
  const providers = await getServiceProviders();
  const explorerProviders = providers.map((provider) => ({
    id: provider.id,
    name: provider.name,
    slug: provider.slug,
    shortDesc: provider.shortDescription,
    propertyType: provider.type,
    typeLabel: provider.typeLabel,
    district: provider.district,
    area: provider.area,
    address: provider.address,
    priceFrom: provider.priceFrom,
    currency: provider.currency,
    starRating: provider.rating,
    rating: provider.rating,
    isVerified:
      provider.verificationStatus === "VERIFIED" ||
      provider.verificationStatus === "PARTNER",
    isFeatured: provider.featured,
    verificationStatus: provider.verificationStatus,
    consentStatus: provider.consentStatus,
    amenities: provider.amenities,
    services: provider.services,
    images: provider.images,
    googleMapLink: provider.googleMapLink,
    latitude: provider.latitude ?? null,
    longitude: provider.longitude ?? null,
  }));

  return (
    <>
      {/* ── HERO ── */}
      <PageHero
        badge={{ icon: <Hotel className="h-3 w-3" />, label: hotelsCopy.hero.badge }}
        title={hotelsCopy.hero.title}
        highlight={hotelsCopy.hero.highlight}
        subtitle={hotelsCopy.hero.subtitle}
      />

      <StayRecommenderSection />

      {/* ── LISTING + MAP EXPLORER ── */}
      <section className="py-14">
        <Container>
          <HotelsExplorerClient hotels={explorerProviders} />
        </Container>
      </section>

      {/* ── ASSISTED BOOKING CTA ── */}
      <section className="py-20 bg-muted/30">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-3 tracking-tight">
              {hotelsCopy.assistance.heading}
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {hotelsCopy.assistance.description}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">Request Assistance</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/trip-planner">
                  Estimate Trip Cost{" "}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-20 bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute -top-10 right-0 h-72 w-72 rounded-full bg-white/4 blur-3xl" />
        <Container className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-2 tracking-tight">{hotelsCopy.newsletter.heading}</h2>
              <p className="text-white/60 text-sm">
                {hotelsCopy.newsletter.description}
              </p>
            </div>
            <NewsletterForm />
          </div>
        </Container>
      </section>
    </>
  );
}


