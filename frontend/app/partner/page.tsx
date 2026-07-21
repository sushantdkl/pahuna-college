import {
  SectionHeader,
  SectionShell,
  SiteFooter,
  SiteHeader,
} from "@/app/_components/pahuna-layout";
import { PartnerApplicationForm } from "@/app/partner/partner-application-form";

const partnerTypes = [
  ["HT", "Hotels & Resorts", "Present rooms, amenities, and local hospitality to Pahuna travelers."],
  ["HS", "Homestays & Lodges", "Bring community-led stays and authentic Karnali hosting into view."],
  ["TO", "Tour Operators", "Coordinate guides, experiences, and practical regional trip support."],
  ["TR", "Transport & Services", "Help travelers move safely with locally informed service options."],
];

const benefits = [
  "Reach travelers already planning Surkhet and Karnali journeys",
  "Receive relevant inquiries through a clear Pahuna workflow",
  "Present accurate business details with local destination context",
  "Work with a platform focused on responsible regional tourism",
];

export default function PartnerPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] text-stone-950">
      <SiteHeader />
      <section className="border-b border-emerald-900/10 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-200">Pahuna partner network</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Grow local tourism with a trusted Karnali travel platform.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/80">Hotels, homestays, resorts, tour operators, restaurants, transport providers, and local services can apply publicly. Our team reviews every application before approval.</p>
          <a href="#apply" className="mt-8 inline-flex rounded-full bg-amber-400 px-6 py-3 text-sm font-black text-emerald-950 transition hover:bg-amber-300">Apply to partner</a>
        </div>
      </section>

      <SectionShell>
        <SectionHeader eyebrow="Who can apply" title="Partnerships built around real local service." description="Pahuna welcomes businesses that can improve a traveler’s stay, route, food, or destination experience." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {partnerTypes.map(([icon, title, description]) => (
            <article key={title} className="rounded-[26px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-xs font-black text-emerald-800">{icon}</span>
              <h2 className="mt-5 text-lg font-black">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">{description}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <section className="border-y border-emerald-900/10 bg-emerald-50/70">
        <SectionShell>
          <SectionHeader eyebrow="Why Pahuna" title="Practical visibility, not empty promises." description="Applications are reviewed by the Pahuna admin team so every partnership starts with accurate expectations." />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {benefits.map((benefit) => <div key={benefit} className="flex gap-3 rounded-2xl bg-white p-5 text-sm font-semibold leading-6 text-stone-700 shadow-sm"><span className="mt-0.5 text-emerald-700">✓</span><span>{benefit}</span></div>)}
          </div>
        </SectionShell>
      </section>

      <SectionShell id="apply">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <SectionHeader eyebrow="Partner application" title="Tell us about your business." description="Complete the form with real contact and operating details. Pahuna will review the application and record follow-up notes securely in the admin dashboard." />
          <PartnerApplicationForm />
        </div>
      </SectionShell>
      <SiteFooter />
    </main>
  );
}
