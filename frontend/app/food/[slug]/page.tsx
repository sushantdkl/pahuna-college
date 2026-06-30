import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { featuredStays, foodProviders, images, safeImage } from "@/lib/pahuna-content";

export function generateStaticParams() {
  return foodProviders.map((item) => ({ slug: item.slug }));
}

export default async function FoodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const food = foodProviders.find((item) => item.slug === slug);

  if (!food) {
    notFound();
  }

  const gallery = food.gallery?.length ? food.gallery : [food.image];
  const relatedFood = foodProviders
    .filter((item) => item.slug !== food.slug)
    .filter((item) => item.area === food.area || item.cuisines.some((cuisine) => food.cuisines.includes(cuisine)))
    .slice(0, 3);
  const nearbyStays = featuredStays.filter((stay) => stay.district.includes(food.district) || stay.area === food.area).slice(0, 3);

  return (
    <PageShell>
      <SiteHeader />
      <section className="border-b border-emerald-900/10 bg-[#fffdf7] py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-sm font-semibold text-stone-500 sm:px-6 lg:px-8">
          <Link href="/food" className="text-emerald-800 hover:text-emerald-900">Food & cafes</Link>
          <span>/</span>
          <span className="text-stone-900">{food.name}</span>
        </div>
      </section>

      <SectionShell className="pt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <div className="relative min-h-[390px] overflow-hidden rounded-[32px] bg-stone-950">
              <Image src={safeImage(gallery[0], images.foodFallback)} alt={food.name} fill priority sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200">{food.typeLabel}</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{food.name}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">{food.shortDescription}</p>
              </div>
            </div>

            <div className="rounded-[30px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5 sm:p-8">
              <SectionHeader eyebrow={food.typeLabel} title="Food listing details" description={food.longDescription || food.shortDescription} />
              <div className="mt-8 grid gap-4 sm:grid-cols-4">
                <DetailTile label="Area" value={food.area} />
                <DetailTile label="District" value={food.district} />
                <DetailTile label="Price" value={food.priceLevel || "Confirm"} />
                <DetailTile label="Rating" value={food.rating ? `${food.rating.toFixed(1)} / 5` : "Pending"} />
              </div>

              <InfoSection title="Cuisines" values={food.cuisines} />
              <InfoSection title="Services" values={food.services} />
              <InfoSection title="Features" values={food.features} />

              <div className="mt-8 rounded-[24px] border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm font-black text-amber-900">Verification note</p>
                <p className="mt-2 text-sm leading-6 text-amber-900/80">Opening hours, menu, prices, and group availability should be confirmed through Pahuna inquiry before planning around this food stop.</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/contact">Contact via Pahuna Inquiry</ButtonLink>
                <Link href={`/login?redirect=${encodeURIComponent(`/food/${food.slug}`)}`} className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-900 transition hover:bg-amber-100">
                  Mark interested
                </Link>
                {food.googleMapLink ? (
                  <a href={food.googleMapLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:bg-stone-50">
                    Open Google Maps
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[30px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Food inquiry</p>
              <h2 className="mt-3 text-2xl font-black">Confirm before you go.</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">Send one inquiry for timing, menu fit, group size, and nearby route context.</p>
              <div className="mt-6">
                <ButtonLink href="/contact">Send Inquiry</ButtonLink>
              </div>
            </div>
            <div className="grid gap-3">
              {gallery.slice(1, 4).map((image, index) => (
                <div key={`${image}-${index}`} className="relative h-32 overflow-hidden rounded-[22px] bg-emerald-50">
                  <Image src={safeImage(image, images.foodFallback)} alt={`${food.name} gallery ${index + 2}`} fill sizes="380px" className="object-cover" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </SectionShell>

      {nearbyStays.length ? (
        <SectionShell className="pt-0">
          <SectionHeader eyebrow="Nearby stays" title={`Stay options around ${food.district}.`} />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {nearbyStays.map((stay) => (
              <Link key={stay.slug} href={`/hotels/${stay.slug}`} className="overflow-hidden rounded-[26px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
                <div className="relative h-44">
                  <Image src={safeImage(stay.image, images.hotelFallback)} alt={stay.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{stay.typeLabel || stay.type}</p>
                  <h2 className="mt-2 font-black">{stay.name}</h2>
                  <p className="mt-2 text-sm text-stone-600">{stay.area}, {stay.district}</p>
                </div>
              </Link>
            ))}
          </div>
        </SectionShell>
      ) : null}

      {relatedFood.length ? (
        <SectionShell className="pt-0">
          <SectionHeader eyebrow="Related food" title="Similar food places to compare." />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {relatedFood.map((item) => (
              <Link key={item.slug} href={`/food/${item.slug}`} className="overflow-hidden rounded-[26px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
                <div className="relative h-44">
                  <Image src={safeImage(item.image, images.foodFallback)} alt={item.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{item.typeLabel}</p>
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
