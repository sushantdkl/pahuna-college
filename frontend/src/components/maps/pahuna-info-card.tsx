// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { type MarkerCategory } from "./map-constants";

interface PahunaInfoCardProps {
  name: string;
  href: string;
  image?: string;
  subtitle?: string;
  area?: string | null;
  district?: string | null;
  rating?: number;
  priceFrom?: number | null;
  currency?: string;
  verificationStatus?: string | null;
  category?: MarkerCategory;
}

/**
 * Premium compact card shown inside map InfoWindows.
 * Displays image, name, subtitle, category badge, star rating, and link.
 */
export function PahunaInfoCard({
  name,
  href,
  image,
  subtitle,
  area,
  district,
  rating,
  priceFrom,
  currency = "NPR",
  verificationStatus,
  category,
}: PahunaInfoCardProps) {
  const trustBadge =
    verificationStatus === "VERIFIED" || verificationStatus === "PARTNER"
      ? "Verified"
      : verificationStatus === "PUBLIC_LISTING"
        ? "Public Listing"
        : null;

  const locationLabel = [area, district].filter(Boolean).join(" · ");

  return (
    <div className="flex max-w-[320px] gap-3">
      {image ? (
        <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-lg">
          <Image src={image} alt={name} fill className="object-cover" sizes="72px" />
        </div>
      ) : (
        <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <MapPin className="h-5 w-5 text-slate-400" />
        </div>
      )}
      <div className="flex min-w-0 flex-col justify-center gap-1">
        <p className="font-semibold text-sm leading-tight line-clamp-2" style={{ color: "#111827" }}>
          {name}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {subtitle && (
            <p className="text-xs truncate" style={{ color: "#6b7280" }}>
              {subtitle}
            </p>
          )}
          {rating != null && rating > 0 && (
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium" style={{ color: "#374151" }}>
                {rating}
              </span>
            </div>
          )}
        </div>
        {locationLabel && (
          <p className="text-[11px] text-slate-500">{locationLabel}</p>
        )}
        {category && (
          <span
            className="inline-flex items-center self-start rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
            style={{ background: "#dcfce7", color: "#166534" }}
          >
            {category}
          </span>
        )}
        {trustBadge && (
          <span
            className="inline-flex items-center self-start rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{
              background: trustBadge === "Verified" ? "#dcfce7" : "#f8fafc",
              color: trustBadge === "Verified" ? "#166534" : "#334155",
            }}
          >
            {trustBadge}
          </span>
        )}
        {priceFrom != null && (
          <span className="text-xs font-semibold" style={{ color: "#111827" }}>
            From {currency} {priceFrom.toLocaleString("en-IN")}
          </span>
        )}
        <Link
          href={href}
          className="mt-1 inline-flex items-center gap-1 self-start rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
        >
          View details <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}


