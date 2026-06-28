import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { foodHighlights, images, safeImage } from "@/lib/pahuna-content";

export function generateStaticParams() {
  return foodHighlights
    .filter((item) => item.slug)
    .map((item) => ({ slug: item.slug as string }));
}

export default async function FoodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const food = foodHighlights.find((item) => item.slug === slug);

  if (!food) {
    notFound();
  }

  return (
    <PageShell>
      <SiteHeader />
      <SectionShell className="pt-14">
        <div className="grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Link href="/food" className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-800 transition hover:bg-emerald-100">
              Back to food
            </Link>
            <div className="mt-8">
              <SectionHeader
                eyebrow={food.eyebrow || "Food"}
                title={food.title}
                description={food.description}
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Ask for recommendation</ButtonLink>
              <ButtonLink href="/explore" variant="secondary">Explore nearby places</ButtonLink>
            </div>
          </div>
          <div className="relative min-h-[380px] overflow-hidden rounded-[32px] bg-stone-950 shadow-2xl shadow-emerald-900/10">
            <Image
              src={safeImage(food.image, images.foodFallback)}
              alt={food.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 text-lg font-black text-white">Confirm timing, menu fit, and route distance before planning a food stop.</p>
          </div>
        </div>
      </SectionShell>
      <SectionShell className="pt-0">
        <div className="grid gap-5 md:grid-cols-3">
          {["Local context", "Traveler friendly", "Inquiry based"].map((item, index) => (
            <div key={item} className="rounded-[26px] border border-emerald-900/10 bg-white p-6 shadow-sm">
              <div className={`h-1.5 w-20 rounded-full ${index === 1 ? "bg-amber-400" : "bg-emerald-600"}`} />
              <h2 className="mt-6 text-lg font-black">{item}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {index === 0
                  ? "Use Surkhet as the base and ask locally before longer Karnali road movement."
                  : index === 1
                    ? "Good food planning keeps families, riders, and first-time visitors comfortable."
                    : "The page avoids fake reservations and routes travelers to a real inquiry form."}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}
