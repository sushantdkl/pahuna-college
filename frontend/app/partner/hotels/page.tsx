import Link from "next/link";
import { PartnerApplicationForm } from "@/app/partner/partner-application-form";
import { SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";

const benefits = [
  "More qualified stay and availability inquiries",
  "Public listing visibility across Pahuna stay pages",
  "Verification pathway for traveler trust",
  "Route, food, and itinerary context around your property",
  "Admin review through the existing PartnerApplication flow",
  "No separate onboarding backend or duplicate application system",
];

const steps = [
  ["1", "Submit your details", "Share property, owner, contact, and current business details."],
  ["2", "Pahuna reviews", "The team checks the application and may request verification details."],
  ["3", "Go live", "Approved partners can be prepared for listing and inquiry routing."],
];

export default function HotelPartnerPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      <section className="bg-[#081124] text-white">
        <SectionShell className="py-20 text-center sm:py-24">
          <p className="mx-auto inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/75">Hotel partner onboarding</p>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">List Your Hotel on Pahuna</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/75">Join the Karnali tourism platform, receive qualified inquiries, and grow your hospitality business through the existing Pahuna partner workflow.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#apply" className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800">Apply Now</a>
            <Link href="/partner" className="rounded-lg border border-white/30 px-5 py-3 text-sm font-black text-white hover:bg-white/10">Partner overview</Link>
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <SectionHeader align="center" title="Why List With Us?" description="Join the growing network of hospitality partners building Karnali tourism." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit} className="rounded-[8px] border border-emerald-100 bg-white p-5 shadow-sm">
              <span className="text-emerald-700" aria-hidden="true">{"\u{2705}"}</span>
              <p className="mt-3 text-sm font-bold leading-6 text-stone-700">{benefit}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <section className="bg-white">
        <SectionShell>
          <SectionHeader align="center" title="How It Works" description="Three simple steps using the canonical partner application backend." />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map(([step, title, description]) => (
              <div key={step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700 text-lg font-black text-white">{step}</div>
                <h3 className="mt-4 font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      <SectionShell id="apply">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader title="Ready to Grow Your Business?" description="Fill out the form and the partnerships team will review it through the current PartnerApplication dashboard flow." />
            <div className="mt-6 rounded-[8px] border border-emerald-100 bg-emerald-50 p-5 text-sm leading-6 text-emerald-900">
              Use business type Hotel, Resort, or Other local service as appropriate. No duplicate hotel onboarding backend is created.
            </div>
          </div>
          <PartnerApplicationForm />
        </div>
      </SectionShell>
      <SiteFooter />
    </main>
  );
}
