import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Coffee, MapPin, MessageCircle, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { FoodCard } from "@/components/food/food-card";
import { FoodExplorer } from "@/components/food/food-explorer";
import { InquiryCollectorButton } from "@/components/inquiries/InquiryCollectorButton";
import { getFeaturedFoodProviders, getFoodProviders } from "@server/services/food";

export const metadata: Metadata = {
  title: "Cafes & Restaurants in Surkhet | Pahuna",
  description:
    "Explore cafes, restaurants, momo spots, bakeries, tea shops, lounges, party venues, and local food places in Birendranagar and Surkhet with Pahuna.",
  alternates: { canonical: "/food" },
};

const FOOD_CATEGORIES = [
  "Cafes",
  "Momo & Fast Food",
  "Family Restaurants",
  "Viewpoint Cafes",
  "Local Food",
  "Events & Party Venues",
];

export default async function FoodPage() {
  const [providers, featuredProviders] = await Promise.all([
    getFoodProviders(),
    getFeaturedFoodProviders(6),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-[#f8f1e4] py-20 sm:py-24">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
        <Container className="relative">
          <div className="max-w-3xl">
            <Badge className="mb-5 bg-primary/10 text-primary hover:bg-primary/15">
              <UtensilsCrossed className="mr-1.5 h-3.5 w-3.5" />
              Surkhet food guide
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Cafes & Restaurants in Surkhet
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Find local cafes, restaurants, momo spots, tea shops, bakeries, lounges,
              party venues, and hangout places around Birendranagar and Surkhet.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="#food-listings">
                  Browse food places <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <InquiryCollectorButton
                label="Send food inquiry"
                leadType="SERVICE_INQUIRY"
                selectedService="Food & Cafes inquiry"
                sourcePage="/food"
                leadSource="food-page"
                size="lg"
                variant="outline"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {FOOD_CATEGORIES.map((category) => (
              <Card key={category} className="rounded-2xl border-emerald-100 bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Coffee className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold leading-snug">{category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {featuredProviders.length > 0 && (
        <section className="py-12">
          <Container>
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Featured food places
                </p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight">
                  Traveler-friendly food stops around Birendranagar
                </h2>
              </div>
              <Button asChild variant="outline">
                <Link href="#food-listings">View all listings</Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredProviders.map((provider) => (
                <FoodCard key={provider.slug} provider={provider} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section id="food-listings" className="py-14">
        <Container>
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                All listings
              </p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight">
                Search food places in Surkhet
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Listings marked as public require physical verification before final commercial use.
                Opening hours, prices, menus, and availability should be confirmed through inquiry.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Map support can be enabled when coordinates are added.
            </div>
          </div>
          <FoodExplorer providers={providers} />
        </Container>
      </section>

      <section className="bg-muted/30 py-16">
        <Container>
          <div className="rounded-3xl border border-primary/20 bg-white p-8 text-center shadow-sm">
            <MessageCircle className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-2xl font-bold tracking-tight">
              Suggest a food place
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Know a cafe, restaurant, tea shop, local food provider, or group dining venue
              that travelers should discover around Surkhet?
            </p>
            <div className="mt-6">
              <InquiryCollectorButton
                label="Suggest a food place"
                leadType="SERVICE_INQUIRY"
                selectedService="Food place suggestion"
                sourcePage="/food"
                leadSource="food-suggestion"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
