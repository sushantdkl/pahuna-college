"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function HotelActionButtons({
  slug,
  googleMapLink,
}: {
  slug: string;
  googleMapLink?: string;
}) {
  const { isAuthenticated } = useAuth();
  const detailPath = `/hotels/${slug}`;
  const loginHref = `/login?redirect=${encodeURIComponent(detailPath)}`;
  const availabilityHref = isAuthenticated
    ? `/contact?topic=${encodeURIComponent(`Availability for ${slug}`)}`
    : loginHref;
  const saveHref = isAuthenticated ? "/profile" : loginHref;

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link
        href={availabilityHref}
        className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
      >
        Ask Availability
      </Link>
      <Link
        href={saveHref}
        className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-900 transition hover:bg-amber-100"
      >
        Save stay
      </Link>
      {googleMapLink ? (
        <a
          href={googleMapLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-50"
        >
          Open Google Maps
        </a>
      ) : null}
    </div>
  );
}
