// @ts-nocheck
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ExternalLink, Map, MapPin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InquiryCollectorButton } from "@/components/inquiries/InquiryCollectorButton";
import { AddToTripButton } from "@/components/trip-planner/add-to-trip-button";
import { getImageOrPlaceholder } from "@/lib/assets";
import { cn, formatPrice } from "@/lib/utils";

interface HotelCardProps {
  name: string;
  slug: string;
  shortDesc: string;
  propertyType: string;
  typeLabel?: string;
  district?: string | null;
  area?: string | null;
  address?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  priceFrom?: number | null;
  currency?: string;
  starRating?: number | null;
  rating?: number | null;
  isVerified?: boolean;
  isFeatured?: boolean;
  verificationStatus?: string | null;
  consentStatus?: string | null;
  amenities: string[];
  services?: string[];
  coverImage?: string;
  isActive?: boolean;
  onViewMap?: () => void;
  hasMapLocation?: boolean;
  googleMapLink?: string | null;
}

const STAY_TYPES = new Set(["HOTEL", "RESORT", "GUEST_HOUSE", "GUESTHOUSE", "HOMESTAY", "LODGE"]);

function verificationBadge(status?: string | null) {
  if (status === "VERIFIED" || status === "PARTNER") return "Verified";
  if (status === "PUBLIC_LISTING") return "Public Listing";
  return null;
}

export function HotelCard({
  name,
  slug,
  shortDesc,
  propertyType,
  typeLabel,
  district,
  area,
  address,
  priceMin,
  priceFrom,
  currency = "NPR",
  starRating,
  rating,
  isFeatured,
  verificationStatus,
  consentStatus,
  amenities,
  services,
  coverImage,
  isActive,
  onViewMap,
  hasMapLocation,
  googleMapLink,
}: HotelCardProps) {
  const trustBadge = verificationBadge(verificationStatus);
  const displayRating = rating ?? starRating ?? null;
  const displayPrice = priceFrom ?? priceMin ?? null;
  const chips = [...(services ?? []), ...amenities].filter(Boolean);
  const displayLocation = [district, area || address].filter(Boolean).join(" / ");
  const isStay = STAY_TYPES.has(propertyType);
  const inquiryLabel = isStay ? "Ask Availability" : "Send Inquiry";
  const image = getImageOrPlaceholder(coverImage, isStay ? "stay" : "service");

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-3xl border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
        isActive && "border-primary shadow-[0_18px_45px_rgba(22,101,52,0.18)] ring-2 ring-primary/20 -translate-y-0.5",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
        <Image
          src={image}
          alt={`${name} listing image`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-white/95 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
            {typeLabel ?? propertyType.replace(/_/g, " ")}
          </Badge>
          {trustBadge && (
            <Badge
              className={cn(
                "text-xs shadow-sm",
                trustBadge === "Verified"
                  ? "bg-emerald-600 text-white"
                  : "bg-white/95 text-foreground",
              )}
              variant={trustBadge === "Verified" ? "default" : "secondary"}
            >
              {trustBadge === "Verified" && <CheckCircle className="mr-1 h-3 w-3" />}
              {trustBadge}
            </Badge>
          )}
        </div>

        {isFeatured && (
          <div className="absolute right-3 top-3 z-20">
            <Badge className="bg-primary text-primary-foreground text-xs shadow-sm">
              Featured
            </Badge>
          </div>
        )}

        {displayPrice != null && (
          <div className="absolute bottom-3 right-3 z-20 rounded-2xl bg-white/95 px-3.5 py-2 text-right shadow-md backdrop-blur-sm">
            <div className="text-[10px] font-medium uppercase text-muted-foreground">from</div>
            <div className="text-lg font-bold leading-tight text-foreground">
              {formatPrice(displayPrice, currency)}
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          {displayRating != null && displayRating > 0 ? (
            <div className="flex items-center gap-1 text-sm" aria-label={`${displayRating} rating`}>
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{displayRating}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Rating pending</span>
          )}
          {isActive && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              Selected on map
            </span>
          )}
        </div>

        <h3 className="mb-1.5 text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
          {name}
        </h3>

        <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" />
          <span className="line-clamp-1">{displayLocation || "Karnali Province"}</span>
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {shortDesc}
        </p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {chips.slice(0, 4).map((chip, index) => (
            <span
              key={`${chip}-${index}`}
              className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground/75"
            >
              {chip}
            </span>
          ))}
          {chips.length > 4 && (
            <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
              +{chips.length - 4} more
            </span>
          )}
        </div>

        {consentStatus === "PENDING" && (
          <div className="mb-4 rounded-xl bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
            Contact via Pahuna Inquiry
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/hotels/${slug}`}>View Details</Link>
          </Button>
          <AddToTripButton listKey="selectedStays" itemId={slug} label={name} />
        </div>
        <div className="mt-2">
          <InquiryCollectorButton
            label={inquiryLabel}
            leadType={isStay ? "STAY_INQUIRY" : "SERVICE_INQUIRY"}
            selectedStay={isStay ? `${name} (${slug})` : undefined}
            selectedService={!isStay ? `${name} (${slug})` : undefined}
            sourcePage="/hotels"
            leadSource="stays-listing-card"
            size="sm"
            className="w-full"
          />
        </div>
        {googleMapLink && (
          <Button asChild size="sm" variant="outline" className="mt-2 w-full">
            <a href={googleMapLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Google Maps
            </a>
          </Button>
        )}
        {onViewMap && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="mt-2 w-full justify-center gap-2 text-primary"
            onClick={onViewMap}
          >
            <Map className="h-4 w-4" />
            View on Map
            {!hasMapLocation && (
              <span className="text-xs font-normal text-muted-foreground">
                (coordinates pending)
              </span>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
