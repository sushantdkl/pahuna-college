// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, MapPin, MessageCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getImageOrPlaceholder } from "@/lib/assets";
import { AddToTripButton } from "@/components/trip-planner/add-to-trip-button";
import type { PublicFoodProvider } from "@/lib/services/food";

function getTrustBadge(status: PublicFoodProvider["verificationStatus"]) {
  if (status === "VERIFIED" || status === "PARTNER") return "Verified";
  if (status === "PUBLIC_LISTING") return "Public Listing";
  return null;
}

export function FoodCard({ provider }: { provider: PublicFoodProvider }) {
  const trustBadge = getTrustBadge(provider.verificationStatus);
  const image = getImageOrPlaceholder(provider.images[0], "food");

  return (
    <Card className="overflow-hidden rounded-2xl border-emerald-100/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-muted">
        <Image
          src={image}
          alt={provider.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge className="bg-white text-foreground hover:bg-white">
            {provider.typeLabel}
          </Badge>
          {trustBadge && (
            <Badge
              variant={trustBadge === "Verified" ? "default" : "secondary"}
              className={trustBadge === "Verified" ? "bg-green-600 text-white" : "bg-white text-foreground"}
            >
              {trustBadge === "Verified" && <CheckCircle className="mr-1 h-3 w-3" />}
              {trustBadge}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 text-lg font-semibold leading-snug">
              <Link href={`/food/${provider.slug}`} className="hover:text-primary">
                {provider.name}
              </Link>
            </h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {[provider.area, provider.district].filter(Boolean).join(" / ")}
            </p>
          </div>
          {provider.rating != null && (
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {provider.rating}
            </div>
          )}
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {provider.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {provider.cuisines.slice(0, 3).map((cuisine) => (
            <Badge key={cuisine} variant="outline" className="border-emerald-100 bg-emerald-50/60">
              {cuisine}
            </Badge>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-medium text-primary">
            <MessageCircle className="mr-1 inline h-3.5 w-3.5" />
            Contact via Pahuna Inquiry
          </p>
          <div className="flex gap-2">
            <AddToTripButton listKey="selectedFoodProviders" itemId={provider.slug} label={provider.name} />
            <Button asChild size="sm" variant="outline">
              <Link href={`/food/${provider.slug}`}>View guide</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
