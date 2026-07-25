// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InquiryCollectorButton } from "@/components/inquiries/InquiryCollectorButton";
import { getImageOrPlaceholder } from "@/lib/assets";
import { formatPrice } from "@/lib/utils";

export interface ProviderMapPopupProvider {
  name: string;
  slug: string;
  images?: string[];
  propertyType?: string;
  typeLabel?: string;
  area?: string | null;
  district?: string | null;
  priceFrom?: number | null;
  priceMin?: number | null;
  currency?: string;
  verificationStatus?: string | null;
  googleMapLink?: string | null;
}

function verificationBadge(status?: string | null) {
  if (status === "VERIFIED" || status === "PARTNER") return "Verified";
  if (status === "PUBLIC_LISTING") return "Public Listing";
  return null;
}

export function ProviderMapPopup({ provider }: { provider: ProviderMapPopupProvider }) {
  const trustBadge = verificationBadge(provider.verificationStatus);
  const price = provider.priceFrom ?? provider.priceMin ?? null;
  const image = getImageOrPlaceholder(provider.images?.[0], "stay");
  const typeLabel = provider.typeLabel ?? provider.propertyType?.replace(/_/g, " ") ?? "Stay";
  const location = [provider.area, provider.district].filter(Boolean).join(" / ");

  return (
    <div className="w-[280px] space-y-3">
      <div className="flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
          <Image src={image} alt={`${provider.name} listing image`} fill sizes="64px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold leading-tight text-slate-950">
            {provider.name}
          </p>
          <p className="mt-1 text-xs text-slate-500">{typeLabel}</p>
          {location && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{location}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {trustBadge && (
          <Badge variant={trustBadge === "Verified" ? "default" : "secondary"} className="text-[10px]">
            {trustBadge}
          </Badge>
        )}
        {price != null && (
          <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-slate-800">
            From {formatPrice(price, provider.currency ?? "NPR")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/hotels/${provider.slug}`}>View Details</Link>
        </Button>
        <InquiryCollectorButton
          label="Send Inquiry"
          leadType="STAY_INQUIRY"
          selectedStay={`${provider.name} (${provider.slug})`}
          sourcePage="/hotels"
          leadSource="stays-map-popup"
          size="sm"
        />
      </div>
      {provider.googleMapLink && (
        <Button asChild size="sm" variant="outline" className="w-full">
          <a href={provider.googleMapLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            View on Google Maps
          </a>
        </Button>
      )}
    </div>
  );
}
