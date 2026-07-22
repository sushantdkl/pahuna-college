import {
  SectionHeader,
  SectionShell,
  SiteFooter,
  SiteHeader,
} from "@/app/_components/pahuna-layout";
import { PartnerApplicationForm } from "@/app/partner/partner-application-form";

const partnerTypes = [
  ["HT", "Hotels & Resorts", "Get listed, boost bookings, and connect with guests."],
  ["RS", "Restaurants & Cafes", "Partner your dining experience with tourism visibility."],
  ["TO", "Travel Agencies", "Collaborate on curated tour packages and itineraries."],
  ["TP", "Transport Providers", "Offer reliable transportation to our platform guests."],
];

const benefits = [
  "Free listing on our platform with detailed business profile",
  "Access to qualified leads and booking inquiries",
  "Co-marketing opportunities and social media features",
  "Consulting support for branding and operations",
  "Training discounts for your staff through our academy",
  "Priority placement for verified and trusted partners",
];

export default function PartnerPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      <section className="border-b border-emerald-900/10 bg-gradient-to-br from-white via-emerald-50/60 to-[#fffaf0]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Partner with Pahuna</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Grow Together With Us</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">Join Pahuna&apos;s partner network and connect with travelers exploring Nepal&apos;s Karnali region. Whether you run a hotel, restaurant, or travel agency, there is a place for you.</p>
          <a href="#apply" className="mt-7 inline-flex rounded-md bg-emerald-700 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-800">Apply now</a>
        </div>
      </section>

      <SectionShell>
        <SectionHeader align="center" title="Who Can Partner?" description="We welcome all hospitality and tourism businesses in the region." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {partnerTypes.map(([icon, title, description]) => (
            <article key={title} className="rounded-[8px] border border-stone-200 bg-white p-6 text-center shadow-sm">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800">{icon}</span>
              <h2 className="mt-5 text-lg font-black">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">{description}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <section className="border-y border-emerald-900/10 bg-white/70">
        <SectionShell>
          <SectionHeader align="center" title="Partner Benefits" description="Here is what you get when you join our network." />
          <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-2">
            {benefits.map((benefit) => <div key={benefit} className="flex gap-3 rounded-[8px] bg-emerald-50 p-4 text-sm font-semibold leading-6 text-stone-700"><span className="mt-0.5 text-emerald-700">OK</span><span>{benefit}</span></div>)}
          </div>
        </SectionShell>
      </section>

      <SectionShell id="apply">
        <div className="mx-auto max-w-2xl">
          <SectionHeader align="center" title="Apply to Become a Partner" description="Fill out the form below and our team will review your application within 48 hours." />
          <div className="mt-8">
            <PartnerApplicationForm />
          </div>
        </div>
      </SectionShell>
      <SiteFooter />
    </main>
  );
}
