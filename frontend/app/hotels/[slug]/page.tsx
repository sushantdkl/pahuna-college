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

  const gallery = stay.gallery?.length ? stay.gallery : [stay.image];
  const related = featuredStays
    .filter((item) => item.slug !== stay.slug)
    .sort((a, b) => {
      if (a.district === stay.district && b.district !== stay.district) return -1;
      if (b.district === stay.district && a.district !== stay.district) return 1;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    })
    .slice(0, 3);

  return (
    <PageShell>
      <SiteHeader />
      <section className="border-b border-emerald-900/10 bg-[#fffdf7] py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-sm font-semibold text-stone-500 sm:px-6 lg:px-8">
          <Link href="/hotels" className="text-emerald-800 hover:text-emerald-900">Stays & services</Link>
          <span>/</span>
          <span className="text-stone-900">{stay.name}</span>
        </div>
      </section>

      <SectionShell className="pt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_390px]">
          <div className="space-y-8">
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="relative min-h-[360px] overflow-hidden rounded-[32px] bg-stone-900 sm:col-span-3">
                <Image src={safeImage(gallery[0], images.hotelFallback)} alt={stay.name} fill priority sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" />
              </div>
              <div className="hidden gap-3 sm:grid">
                {gallery.slice(1, 3).map((image, index) => (
                  <div key={`${image}-${index}`} className="relative min-h-[172px] overflow-hidden rounded-[24px] bg-emerald-50">
                    <Image src={safeImage(image, images.hotelFallback)} alt={`${stay.name} gallery ${index + 2}`} fill sizes="25vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <Badge label={stay.typeLabel || stay.type} tone="neutral" />
                {stay.verificationStatus === "VERIFIED" || stay.verificationStatus === "PARTNER" ? <Badge label="Verified" tone="verified" /> : null}
                {stay.publicListing ? <Badge label="Public listing" tone="public" /> : null}
                {stay.featured ? <Badge label="Featured" tone="featured" /> : null}
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-stone-950 sm:text-5xl">{stay.name}</h1>
              <p className="mt-3 text-base font-semibold text-stone-500">{[stay.area, stay.district].filter(Boolean).join(" / ")}</p>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-600">{stay.longDescription || stay.shortDescription}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-4">
                <DetailTile label="Type" value={stay.typeLabel || stay.type} />
                <DetailTile label="Price" value={stay.priceFrom || "Ask price"} />
                <DetailTile label="Rating" value={stay.rating ? `${stay.rating.toFixed(1)} / 5` : "Pending"} />
                <DetailTile label="Contact" value={stay.consentStatus === "APPROVED" ? "Inquiry ready" : "Via Pahuna"} />
              </div>

              <InfoSection title="Amenities" values={stay.amenities} />
              <InfoSection title="Services" values={stay.services || []} />

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/contact">Ask Availability</ButtonLink>
                <Link href={`/login?redirect=${encodeURIComponent(`/hotels/${stay.slug}`)}`} className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-900 transition hover:bg-amber-100">
                  Save stay
                </Link>
                {stay.googleMapLink ? (
                  <a href={stay.googleMapLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-50">
                    Open Google Maps
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="overflow-hidden rounded-[30px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
              <StayMapCard stay={stay} />
              <div className="p-5">
                <p className="text-sm font-black text-stone-900">Location preview</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">Exact markers appear only when coordinates are available. Otherwise Pahuna keeps a safe Surkhet preview and Google Maps link.</p>
              </div>
            </div>
            <div className="rounded-[26px] border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-black text-amber-900">Booking note</p>
              <p className="mt-2 text-sm leading-6 text-amber-900/80">Pahuna keeps browsing public. Inquiry and confirmation should happen only after the stay confirms current availability.</p>
            </div>
          </aside>
        </div>
      </SectionShell>

      {related.length ? (
        <SectionShell className="pt-0">
          <SectionHeader eyebrow="Related stays" title="Nearby or similar stay options." />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/hotels/${item.slug}`} className="overflow-hidden rounded-[26px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
                <div className="relative h-44">
                  <Image src={safeImage(item.image, images.hotelFallback)} alt={item.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{item.typeLabel || item.type}</p>
                  <h2 className="mt-2 font-black">{item.name}</h2>
                  <p className="mt-2 text-sm text-stone-600">{item.area}, {item.district}</p>
                </div>
              </Link>
            ))}
          </div>
        </SectionShell>
      ) : null}

      <SiteFooter />
    </PageShell>
  );
}

function DetailTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-emerald-900/10 bg-[#fffaf0] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-2 text-sm font-black text-stone-950">{value}</p>
    </div>
  );
}

function InfoSection({ title, values }: { title: string; values: string[] }) {
  if (!values.length) return null;

  return (
    <div className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {values.map((value) => (
          <span key={value} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">{value}</span>
        ))}
      </div>
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: "verified" | "public" | "featured" | "neutral" }) {
  const classes =
    tone === "verified"
      ? "bg-emerald-600 text-white"
      : tone === "featured"
        ? "bg-amber-400 text-amber-950"
        : tone === "public"
          ? "bg-emerald-50 text-emerald-800"
          : "bg-stone-100 text-stone-700";

  return <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${classes}`}>{label}</span>;
}
