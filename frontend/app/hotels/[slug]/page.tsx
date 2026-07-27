import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Bed,
  CheckCircle,
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Shield,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { HotelCard } from "@/components/hotels/hotel-card";
import { CallbackForm } from "@/components/forms/callback-form";
import { InquiryCollectorButton } from "@/components/inquiries/InquiryCollectorButton";
import {
  canShowDirectContact,
  getServiceProviderBySlug,
  getServiceProviders,
  getVerificationBadge,
  isStayProviderType,
} from "@server/services";
import { getLiveDestinations, getLiveExperiences } from "@server/services/public-live";
import { formatPrice } from "@server/lib/utils";
import { getImageOrPlaceholder, isBackendUploadImage } from "@server/lib/assets";
import { findNearbyPlaces } from "@server/lib/geo-utils";
import type { MarkerCategory } from "@/components/maps/map-constants";
import { HotelDetailMapClient } from "@/components/maps/hotel-detail-map-client";
import { ReservationRequestCard } from "@/components/reservations/reservation-request-card";

interface HotelDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: HotelDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getServiceProviderBySlug(slug);
  if (!provider) return { title: "Provider Not Found" };

  return {
    title: `${provider.name} | Stays & Services | Pahuna`,
    description: provider.shortDescription,
    openGraph: {
      title: provider.name,
      description: provider.shortDescription,
    },
  };
}

export default async function HotelDetailPage({
  params,
}: HotelDetailPageProps) {
  const { slug } = await params;
  const provider = await getServiceProviderBySlug(slug);
  if (!provider) notFound();

  const isStay = isStayProviderType(provider.type);
  const contactAllowed = canShowDirectContact(provider);
  const trustBadge = getVerificationBadge(provider);
  const inquiryLabel = isStay ? "Ask Availability" : "Send Inquiry";
  const gallery = provider.images.length > 0
    ? provider.images
    : [getImageOrPlaceholder(undefined, isStay ? "stay" : "service")];
  const displayLocation = [provider.district, provider.area || provider.address]
    .filter(Boolean)
    .join(" / ");
  const chips = Array.from(new Set([...provider.services, ...provider.amenities].filter(Boolean)));
  const [providers, destinations, experiences] = await Promise.all([
    getServiceProviders(),
    getLiveDestinations(),
    getLiveExperiences(),
  ]);
  const relatedProviders = providers
    .filter((item) => item.slug !== provider.slug)
    .sort((a, b) => {
      if (a.district === provider.district && b.district !== provider.district) return -1;
      if (b.district === provider.district && a.district !== provider.district) return 1;
      return Number(b.featured) - Number(a.featured);
    })
    .slice(0, 3);

  const nearbyPlaces =
    provider.latitude && provider.longitude
      ? findNearbyPlaces(provider.latitude, provider.longitude, [
          ...destinations.map((d) => ({
            name: d.name,
            slug: d.slug,
            latitude: d.latitude,
            longitude: d.longitude,
            category: "destination" as const,
            coverImage: d.coverImage,
            subtitle: d.bestSeason ? `Best: ${d.bestSeason}` : undefined,
            href: `/explore#${d.slug}`,
          })),
          ...experiences.map((e) => ({
            name: e.title,
            slug: e.slug,
            latitude: e.latitude,
            longitude: e.longitude,
            category: "experience" as const,
            coverImage: e.coverImage,
            subtitle: e.category,
            href: `/experiences#${e.slug}`,
          })),
        ]).map((place) => ({ ...place, category: place.category as MarkerCategory }))
      : [];

  return (
    <>
      <section className="border-b bg-muted/30 py-4">
        <Container>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/hotels"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Stays & Services
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">{provider.name}</span>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <div className="grid grid-cols-4 gap-3">
                <div className="relative col-span-4 aspect-video overflow-hidden rounded-2xl bg-muted sm:col-span-3">
                  <Image
                    src={gallery[0]}
                    alt={provider.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 75vw"
                    unoptimized={isBackendUploadImage(gallery[0])}
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="col-span-1 hidden gap-3 sm:grid">
                  {gallery.slice(1, 3).map((img, i) => (
                    <div
                      key={`${img}-${i}`}
                      className="relative aspect-square overflow-hidden rounded-2xl bg-muted"
                    >
                      <Image
                        src={img}
                        alt={`${provider.name} gallery ${i + 2}`}
                        fill
                        sizes="25vw"
                        unoptimized={isBackendUploadImage(img)}
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {gallery.length === 1 && (
                    <div className="flex aspect-square items-center justify-center rounded-2xl border bg-primary/5 text-primary">
                      <MessageCircle className="h-8 w-8" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <Badge variant="outline">{provider.typeLabel}</Badge>
                  {trustBadge && (
                    <Badge
                      className={
                        trustBadge === "Verified"
                          ? "bg-green-600 text-white"
                          : "bg-white text-foreground"
                      }
                      variant={trustBadge === "Verified" ? "default" : "secondary"}
                    >
                      {trustBadge === "Verified" && (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      )}
                      {trustBadge}
                    </Badge>
                  )}
                  {provider.featured && <Badge>Featured</Badge>}
                </div>
                <h1 className="mb-2 text-3xl font-bold">{provider.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      {displayLocation || "Karnali Province"}
                    </span>
                  </div>
                  {provider.rating != null && provider.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-foreground">
                        {provider.rating}
                      </span>
                      {provider.reviewCount != null && (
                        <span className="text-sm">
                          ({provider.reviewCount} reviews)
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {provider.googleMapLink ? (
                    <Button asChild variant="outline">
                      <a
                        href={provider.googleMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="h-4 w-4" />
                        View on Google Maps
                      </a>
                    </Button>
                  ) : (
                    <div className="rounded-xl border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
                      Location pending verification
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { icon: Bed, label: "Type", value: provider.typeLabel },
                  {
                    icon: Star,
                    label: "Rating",
                    value: provider.rating ? `${provider.rating}` : "Pending",
                  },
                  {
                    icon: Shield,
                    label: "Status",
                    value: trustBadge ?? "Unverified",
                  },
                  {
                    icon: Clock,
                    label: "Contact",
                    value: contactAllowed ? "Direct" : "Via Pahuna",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl border p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground">
                        {label}
                      </div>
                      <div className="text-sm font-medium">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h2 className="mb-3 text-xl font-semibold">
                  About This {isStay ? "Stay" : "Provider"}
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  {provider.longDescription ?? provider.shortDescription}
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold">
                  Services & Amenities
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {chips.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 rounded-lg border bg-muted/50 p-3"
                    >
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="mb-4 text-xl font-semibold">Contact</h2>
                {contactAllowed ? (
                  <div className="space-y-3">
                    {provider.contactPhone && (
                      <a
                        href={`tel:${provider.contactPhone}`}
                        className="flex items-center gap-3 text-sm transition-colors hover:text-primary"
                      >
                        <Phone className="h-4 w-4" /> {provider.contactPhone}
                      </a>
                    )}
                    {provider.contactEmail && (
                      <a
                        href={`mailto:${provider.contactEmail}`}
                        className="flex items-center gap-3 text-sm transition-colors hover:text-primary"
                      >
                        <Mail className="h-4 w-4" /> {provider.contactEmail}
                      </a>
                    )}
                    {provider.website && (
                      <a
                        href={provider.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 text-sm transition-colors hover:text-primary"
                      >
                        <Globe className="h-4 w-4" /> Website
                      </a>
                    )}
                    {!provider.contactPhone &&
                      !provider.contactEmail &&
                      !provider.website && (
                        <p className="text-sm text-muted-foreground">
                          Direct contact details are not published yet. Send a
                          Pahuna inquiry for support.
                        </p>
                      )}
                  </div>
                ) : (
                  <div className="rounded-2xl border bg-primary/5 p-4 text-sm text-primary">
                    Contact via Pahuna Inquiry
                  </div>
                )}
              </div>

              {provider.latitude && provider.longitude && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">
                    Location{nearbyPlaces.length > 0 ? " & Nearby" : ""}
                  </h2>
                  <HotelDetailMapClient
                    lat={provider.latitude}
                    lng={provider.longitude}
                    name={provider.name}
                    address={provider.address ?? displayLocation}
                    nearbyPlaces={nearbyPlaces}
                  />
                </div>
              )}

              <div className="rounded-2xl bg-primary/5 p-6">
                <h3 className="mb-4 font-semibold">Planning Notes</h3>
                <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
                  <div>
                    <span className="font-medium text-foreground">
                      Listing status:
                    </span>{" "}
                    {trustBadge ?? "Unverified"}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Contact consent:
                    </span>{" "}
                    {provider.consentStatus === "CONSENTED"
                      ? "Consented"
                      : "Pending physical verification"}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Inquiry model:
                    </span>{" "}
                    Availability and details are confirmed before travel.
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Pricing:
                    </span>{" "}
                    {provider.priceFrom
                      ? `Starts from ${formatPrice(provider.priceFrom, provider.currency)}`
                      : "Confirm through inquiry"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-6">
                <h3 className="mb-4 font-semibold">How Inquiry Works</h3>
                <div className="grid gap-6 sm:grid-cols-3">
                  {[
                    {
                      step: "1",
                      title: "Send Inquiry",
                      desc: "Share dates, group size, and what support you need.",
                    },
                    {
                      step: "2",
                      title: "Verify Details",
                      desc: "Pahuna helps confirm availability, contact, and local context.",
                    },
                    {
                      step: "3",
                      title: "Plan Confidently",
                      desc: "Proceed once details are confirmed with the provider or local team.",
                    },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="text-center">
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {step}
                      </div>
                      <h4 className="mb-1 text-sm font-medium">{title}</h4>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {isStay ? (
                <ReservationRequestCard
                  hotelId={provider._id}
                  hotelName={provider.name}
                  hotelSlug={provider.slug}
                />
              ) : null}
              <Card id="inquiry" className="sticky top-20">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground">
                      {provider.priceFrom ? "Starting From" : "Pricing"}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {provider.priceFrom
                        ? formatPrice(provider.priceFrom, provider.currency)
                        : "On inquiry"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {provider.priceFrom
                        ? isStay
                          ? "indicative per night"
                          : "indicative starting rate"
                        : "final details require confirmation"}
                    </div>
                  </div>

                  <Separator className="mb-4" />

                  <Tabs defaultValue="inquiry" className="w-full">
                    <TabsList className="mb-4 grid w-full grid-cols-2">
                      <TabsTrigger value="inquiry" className="text-xs">
                        {inquiryLabel}
                      </TabsTrigger>
                      <TabsTrigger value="callback" className="text-xs">
                        Call Me Back
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="inquiry">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Share your dates, group size, and request details. Pahuna
                          will verify availability and final cost before confirmation.
                        </p>
                        <InquiryCollectorButton
                          label={inquiryLabel}
                          leadType={isStay ? "STAY_INQUIRY" : "SERVICE_INQUIRY"}
                          selectedStay={isStay ? `${provider.name} (${provider.slug})` : undefined}
                          selectedService={!isStay ? `${provider.name} (${provider.slug})` : undefined}
                          sourcePage={`/hotels/${provider.slug}`}
                          leadSource="stay-detail"
                          className="w-full"
                          defaultInterests={provider.services.slice(0, 3)}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="callback">
                      <CallbackForm
                        hotelId={provider.slug}
                        hotelName={provider.name}
                        compact
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {relatedProviders.length > 0 && (
        <section className="bg-muted/30 py-16">
          <Container>
            <SectionHeader
              title="Related Stays & Services"
              subtitle="More public listings and providers across Surkhet and Karnali"
              action={{ label: "View All", href: "/hotels" }}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProviders.map((item) => (
                <HotelCard
                  key={item.slug}
                  name={item.name}
                  slug={item.slug}
                  shortDesc={item.shortDescription}
                  propertyType={item.type}
                  typeLabel={item.typeLabel}
                  district={item.district}
                  area={item.area}
                  address={item.address}
                  priceFrom={item.priceFrom}
                  currency={item.currency}
                  rating={item.rating}
                  isFeatured={item.featured}
                  verificationStatus={item.verificationStatus}
                  consentStatus={item.consentStatus}
                  amenities={item.amenities}
                  services={item.services}
                  coverImage={item.images[0]}
                  googleMapLink={item.googleMapLink}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
