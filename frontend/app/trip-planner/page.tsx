import Link from "next/link";
import Image from "next/image";
import { ButtonLink, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { images, routeCards } from "@/lib/pahuna-content";

const fields = ["Starting city", "Destination", "Travel days", "Budget range", "Travel vibe"];

export default function TripPlannerPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      <SectionShell className="pt-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeader eyebrow="Trip planner" title="Plan the Karnali route before confirming anything." description="This page is a clean UI preview for the planning flow. It keeps every action real: contact, route preview, stays, and Surkhet guide." />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Send inquiry</ButtonLink>
              <ButtonLink href="/hotels" variant="secondary">Find stays</ButtonLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-emerald-900/10 bg-white shadow-xl shadow-emerald-900/5">
            <div className="relative h-44">
              <Image src={images.routeFallback} alt="Karnali road route planning context" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="p-6">
            <h2 className="text-xl font-black">Quick trip request</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field} className="space-y-2 text-xs font-black uppercase tracking-[0.14em] text-stone-500">
                  {field}
                  <input className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm normal-case tracking-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" placeholder={field} />
                </label>
              ))}
            </div>
            <Link href="/contact" className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">Continue to inquiry</Link>
            </div>
          </div>
        </div>
      </SectionShell>

      <section id="routes" className="bg-[#f3f0e7]">
        <SectionShell>
          <SectionHeader title="Route and cost preview" description="Prices and availability can change, so the UI keeps confirmation actions clear." />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {routeCards.map((route) => (
              <div key={route.route} className="rounded-[26px] border border-emerald-900/10 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-black">{route.route}</h3>
                    <p className="mt-1 text-sm text-stone-500">{route.mode}</p>
                  </div>
                  <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">{route.status}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-stone-600">{route.note}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>
      <SiteFooter />
    </main>
  );
}
