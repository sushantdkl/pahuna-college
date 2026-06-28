import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { StayMapCard } from "@/app/_components/stay-map-card";
import { featuredStays, images, safeImage } from "@/lib/pahuna-content";

export function generateStaticParams() {
  return featuredStays.map((stay) => ({ slug: stay.slug }));
}

export default async function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stay = featuredStays.find((item) => item.slug === slug);

  if (!stay) {
    notFound();
  }

  return (
    <PageShell>
      <SiteHeader />
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <div className="relative min-h-[460px]">
          <Image
            src={safeImage(stay.image, images.hotelFallback)}
            alt={`${stay.name} in ${stay.area}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-stone-950/45 to-transparent" />
          <div className="relative z-10 mx-auto flex min-h-[460px] max-w-7xl flex-col justify-end px-4 pb-12 sm:px-6 lg:px-8">
            <Link href="/hotels" className="w-fit rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur transition hover:bg-white/25">
              Back to stays
            </Link>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-emerald-200">{stay.type} in {stay.area}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">{stay.name}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/85">
              A Pahuna stay listing for {stay.area}, {stay.district}. Confirm availability, room fit, and route timing before final booking.
            </p>
          </div>
        </div>
      </section>

      <SectionShell>
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[30px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5 sm:p-8">
            <SectionHeader
              eyebrow="Stay details"
              title="What to know before asking availability."
              description="The listing keeps important public context visible without inventing booking availability."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <DetailTile label="Area" value={stay.area} />
              <DetailTile label="District" value={stay.district} />
              <DetailTile label="Price" value={stay.priceFrom || "Ask price"} />
            </div>
            <div className="mt-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Amenities</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {stay.amenities.map((amenity) => (
                  <span key={amenity} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">{amenity}</span>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Ask Availability</ButtonLink>
              <ButtonLink href="/hotels" variant="secondary">Compare Stays</ButtonLink>
              {stay.googleMapLink ? (
                <a href={stay.googleMapLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-50">
                  Open Google Maps
                </a>
              ) : null}
            </div>
          </div>
          <aside className="space-y-5">
            <div className="overflow-hidden rounded-[30px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
              <StayMapCard stay={stay} />
              <div className="p-5">
                <p className="text-sm font-black text-stone-900">Location preview</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">OpenStreetMap uses stay coordinates when present, otherwise a safe Surkhet preview center.</p>
              </div>
            </div>
            <div className="rounded-[26px] border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-black text-amber-900">Booking note</p>
              <p className="mt-2 text-sm leading-6 text-amber-900/80">Pahuna keeps browsing public. Inquiry and confirmation should happen only after the stay confirms current availability.</p>
            </div>
          </aside>
        </div>
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

function DetailTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-emerald-900/10 bg-[#fffaf0] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-2 text-base font-black text-stone-950">{value}</p>
    </div>
  );
}
