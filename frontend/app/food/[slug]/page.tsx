import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/layout/container";
import { FoodCard } from "@/components/food/food-card";
import { HotelCard } from "@/components/hotels/hotel-card";
import { InquiryCollectorButton } from "@/components/inquiries/InquiryCollectorButton";
import { AddToTripButton } from "@/components/trip-planner/add-to-trip-button";
import { getImageOrPlaceholder } from "@server/lib/assets";
import {
  canShowFoodDirectContact,
  getFeaturedFoodProviders,
  getFoodProviderBySlug,
  getFoodProviderSlugs,
  getFoodVerificationBadge,
} from "@server/services/food";
import { getProvidersByDistrict } from "@server/services/service-providers";

interface FoodDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getFoodProviderSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FoodDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getFoodProviderBySlug(slug);
  if (!provider) return { title: "Food Listing Not Found | Pahuna" };

  return {
    title: `${provider.name} | Surkhet Food Guide | Pahuna`,
    description: `View public listing details, food style, services, and inquiry options for ${provider.name} in Surkhet.`,
    alternates: { canonical: `/food/${provider.slug}` },
  };
}

export default async function FoodDetailPage({ params }: FoodDetailPageProps) {
  const { slug } = await params;
  const provider = await getFoodProviderBySlug(slug);
  if (!provider) notFound();

  const [featuredFood, nearbyStays] = await Promise.all([
    getFeaturedFoodProviders(4),
    getProvidersByDistrict(provider.district),
  ]);

  const trustBadge = getFoodVerificationBadge(provider);
  const canShowContact = canShowFoodDirectContact(provider);
  const image = getImageOrPlaceholder(provider.images[0], "food");
  const relatedFood = featuredFood.filter((item) => item.slug !== provider.slug).slice(0, 3);

  return (
    <>
      <section className="border-b bg-muted/30 py-4">
        <Container>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/food" className="flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Food & Cafes
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">{provider.name}</span>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
            <div className="space-y-8">
              <div className="relative aspect-video overflow-hidden rounded-3xl bg-muted">
                <Image
                  src={image}
                  alt={provider.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{provider.typeLabel}</Badge>
                  {trustBadge && (
                    <Badge
                      variant={trustBadge === "Verified" ? "default" : "secondary"}
                      className={trustBadge === "Verified" ? "bg-green-600 text-white" : "bg-white text-foreground"}
                    >
                      {trustBadge === "Verified" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {trustBadge}
                    </Badge>
                  )}
                  {provider.featured && <Badge>Featured</Badge>}
                </div>
                <h1 className="text-4xl font-bold tracking-tight">{provider.name}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {[provider.area || provider.address, provider.district].filter(Boolean).join(" / ")}
                  </span>
                  {provider.rating != null && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{provider.rating}</span>
                      {provider.reviewCount != null && <span>({provider.reviewCount} public reviews)</span>}
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  { icon: UtensilsCrossed, label: "Type", value: provider.typeLabel },
                  { icon: Shield, label: "Status", value: trustBadge ?? "Unverified" },
                  { icon: Clock, label: "Hours", value: provider.openingHours ?? "Confirm by inquiry" },
                  { icon: MessageCircle, label: "Contact", value: canShowContact ? "Direct details available" : "Via Pahuna Inquiry" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-2xl border bg-white p-4">
                    <Icon className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold tracking-tight">About this food place</h2>
                <p className="mt-4 leading-7 text-muted-foreground">
                  {provider.longDescription ?? provider.shortDescription}
                </p>
              </div>

              <InfoGrid title="Cuisines" values={provider.cuisines} />
              <InfoGrid title="Services" values={provider.services} />
              <InfoGrid title="Features" values={provider.features} />

              {provider.openingHours && (
                <div className="rounded-2xl border bg-muted/20 p-5">
                  <h2 className="font-semibold">Opening hours</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{provider.openingHours}</p>
                </div>
              )}

              <div className="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-5 text-sm leading-6 text-muted-foreground">
                Public listing details require physical verification. Pahuna does not guarantee
                opening hours, menu items, delivery, reservation, price, or availability.
              </div>
            </div>

            <aside className="space-y-6">
              <Card className="sticky top-20 rounded-3xl">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold tracking-tight">Food inquiry</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Ask Pahuna to help confirm details before you plan around this listing.
                  </p>
                  <InquiryCollectorButton
                    label="Contact via Pahuna Inquiry"
                    leadType="SERVICE_INQUIRY"
                    selectedService={`${provider.name} (${provider.slug})`}
                    sourcePage={`/food/${provider.slug}`}
                    leadSource="food-detail"
                    defaultInterests={provider.cuisines.slice(0, 3)}
                    className="mt-5 w-full"
                  />
                  <AddToTripButton
                    listKey="selectedFoodProviders"
                    itemId={provider.slug}
                    label={provider.name}
                    size="default"
                    className="mt-3 w-full"
                  />
                  <Separator className="my-5" />
                  <div className="space-y-3 text-sm">
                    {canShowContact ? (
                      <>
                        {provider.phone && (
                          <a href={`tel:${provider.phone}`} className="flex items-center gap-2 hover:text-primary">
                            <Phone className="h-4 w-4" /> {provider.phone}
                          </a>
                        )}
                        {provider.email && (
                          <a href={`mailto:${provider.email}`} className="flex items-center gap-2 hover:text-primary">
                            <Mail className="h-4 w-4" /> {provider.email}
                          </a>
                        )}
                        {provider.website && (
                          <a href={provider.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
                            <Globe className="h-4 w-4" /> Website
                          </a>
                        )}
                        {!provider.phone && !provider.email && !provider.website && (
                          <p className="text-muted-foreground">Direct contact details are not published yet.</p>
                        )}
                      </>
                    ) : (
                      <p className="rounded-2xl bg-primary/5 p-4 font-medium text-primary">
                        Contact via Pahuna Inquiry
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </Container>
      </section>

      {nearbyStays.length > 0 && (
        <section className="bg-muted/30 py-14">
          <Container>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Nearby stays
                </p>
                <h2 className="text-3xl font-bold tracking-tight">
                  Stay options around {provider.district}
                </h2>
              </div>
              <Button asChild variant="outline">
                <Link href="/hotels">View stays</Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {nearbyStays.slice(0, 4).map((stay) => (
                <HotelCard
                  key={stay.slug}
                  name={stay.name}
                  slug={stay.slug}
                  shortDesc={stay.shortDescription}
                  propertyType={stay.type}
                  typeLabel={stay.typeLabel}
                  district={stay.district}
                  area={stay.area}
                  address={stay.address}
                  priceFrom={stay.priceFrom}
                  currency={stay.currency}
                  rating={stay.rating}
                  isFeatured={stay.featured}
                  verificationStatus={stay.verificationStatus}
                  consentStatus={stay.consentStatus}
                  amenities={stay.amenities}
                  services={stay.services}
                  coverImage={stay.images[0]}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {relatedFood.length > 0 && (
        <section className="py-14">
          <Container>
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                More food stops
              </p>
              <h2 className="text-3xl font-bold tracking-tight">
                Featured food places in Surkhet
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedFood.map((item) => (
                <FoodCard key={item.slug} provider={item} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

function InfoGrid({ title, values }: { title: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((value) => (
          <div key={value} className="flex items-center gap-2.5 rounded-lg border bg-muted/40 p-3">
            <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-sm">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
