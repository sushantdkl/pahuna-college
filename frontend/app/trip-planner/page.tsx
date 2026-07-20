import Image from "next/image";
import { ButtonLink, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { images, routeCards } from "@/lib/pahuna-content";
import { ItineraryPlannerForm } from "./itinerary-planner-form";

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
            <ItineraryPlannerForm />
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
