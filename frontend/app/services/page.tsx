import type { Metadata } from "next";
import Link from "next/link";
import {
  ButtonLink,
  PageShell,
  SectionHeader,
  SectionShell,
  SiteFooter,
  SiteHeader,
} from "@/components/pahuna-layout";

export const metadata: Metadata = {
  title: "Pahuna Services | Tourism, Training, Consulting & Route Planning",
  description:
    "Explore Pahuna services for Karnali travelers, hospitality providers, training students, partners, and route planning across Surkhet and Karnali.",
  alternates: { canonical: "/services" },
};

const primaryServices = [
  {
    icon: "🏨",
    eyebrow: "Traveler support",
    title: "Stays & Services",
    description:
      "Find verified hotels, resorts, homestays, and practical stay support for Surkhet-first Karnali travel.",
    href: "/hotels",
    cta: "Explore stays",
    stats: ["Live stay records", "Availability inquiry", "Map-ready listings"],
  },
  {
    icon: "🧭",
    eyebrow: "Planning",
    title: "Trip Planner",
    description:
      "Shape a Karnali route by destination, duration, budget, interests, food, stays, and safety context.",
    href: "/trip-planner",
    cta: "Plan a trip",
    stats: ["Budget tiers", "Suggested routes", "Local context"],
  },
  {
    icon: "🛣️",
    eyebrow: "Routes",
    title: "Route & Cost Estimator",
    description:
      "Review cautious route segments, transport modes, stopovers, cost ranges, timing, and reliability notes.",
    href: "/routes",
    cta: "Estimate route",
    stats: ["Route segments", "NPR ranges", "Stopover advice"],
  },
  {
    icon: "🍲",
    eyebrow: "Food discovery",
    title: "Food & Cafes",
    description:
      "Browse cafes, local food providers, restaurants, tea stops, and traveler-friendly places around Surkhet.",
    href: "/food",
    cta: "Find food",
    stats: ["Cafe cards", "Cuisine filters", "Provider profiles"],
  },
  {
    icon: "💼",
    eyebrow: "Business growth",
    title: "B2B Consulting",
    description:
      "Get hospitality consulting for pricing, operations, digital visibility, staff systems, and guest experience.",
    href: "/consulting",
    cta: "View consulting",
    stats: ["Service cards", "Lead form", "Case studies"],
  },
  {
    icon: "🎓",
    eyebrow: "Academy",
    title: "Training Academy",
    description:
      "Launch a hospitality career through practical training programs, enrollment support, and course guidance.",
    href: "/training",
    cta: "View courses",
    stats: ["Course catalog", "Enrollment form", "Student stories"],
  },
];

const audienceCards = [
  ["Travelers", "Book stays, compare food, explore destinations, and build realistic Karnali plans.", "🌄"],
  ["Hotels & Cafes", "Improve visibility, collect inquiries, and access consulting or partner support.", "🏢"],
  ["Students", "Discover practical hospitality programs and submit enrollment requests.", "📚"],
  ["Route Planners", "Compare transport options, costs, risks, stopovers, and local confirmation needs.", "🚌"],
];

const process = [
  ["Discover", "Browse Surkhet stays, food, destinations, experiences, routes, and packages."],
  ["Compare", "Use filters, cards, maps, prices, badges, and detail pages to shortlist options."],
  ["Ask", "Send contact, inquiry, partner, consulting, training, or availability requests."],
  ["Plan", "Build a day-wise trip with budget tiers, transport notes, and human-reviewed support."],
];

const serviceLinks = [
  ["/consulting", "B2B Consulting"],
  ["/training", "Training Academy"],
  ["/partner", "Partner With Us"],
  ["/routes", "Trip Routes"],
  ["/trip-cost", "Trip Cost"],
  ["/experiences", "Things To Do"],
];

export default function ServicesPage() {
  return (
    <PageShell>
      <SiteHeader />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#071121] via-slate-900 to-emerald-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(16,185,129,0.22),transparent_34%),radial-gradient(circle_at_18%_75%,rgba(245,158,11,0.12),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-24">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-black text-white/75">
              🧩 Pahuna service network
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Tourism services for <span className="text-emerald-300">Karnali</span> travelers and providers
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
              A single clean Pahuna hub for stays, routes, food, destinations, consulting, training, partners, and trip inquiries.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/trip-planner">Start Planning</ButtonLink>
              <ButtonLink href="/contact" variant="ghost">Talk to Pahuna</ButtonLink>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              ["15", "active CRUD modules"],
              ["6", "service pathways"],
              ["OSM", "tourism maps"],
              ["NPR", "route cost ranges"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[8px] border border-white/15 bg-white/8 p-6 text-center shadow-sm backdrop-blur">
                <p className="text-2xl font-black text-emerald-300">{value}</p>
                <p className="mt-2 text-xs text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionShell className="pt-16">
        <SectionHeader
          align="center"
          eyebrow="Service categories"
          title="Choose the Pahuna service you need"
          description="The same compact cards, badges, green actions, and practical product feel used across the reference app."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {primaryServices.map((service) => (
            <article
              key={service.title}
              className="group flex min-h-[320px] flex-col rounded-[8px] border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-emerald-50 text-2xl" aria-hidden="true">
                  {service.icon}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-700">
                  {service.eyebrow}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-tight">{service.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-stone-600">{service.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {service.stats.map((stat) => (
                  <span key={stat} className="rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-900">
                    {stat}
                  </span>
                ))}
              </div>
              <Link
                href={service.href}
                className="mt-6 inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-800"
              >
                {service.cta}
                <span className="ml-2 transition group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </SectionShell>

      <section className="border-y border-emerald-900/10 bg-white">
        <SectionShell>
          <SectionHeader
            align="center"
            eyebrow="Who it helps"
            title="Built for real public flows, not raw CRUD screens"
            description="Each service leads into the current backend-connected pages and forms already used by the platform."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audienceCards.map(([title, description, icon]) => (
              <article key={title} className="rounded-[8px] border border-stone-200 bg-white p-6 text-center shadow-sm">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl" aria-hidden="true">
                  {icon}
                </span>
                <h2 className="mt-5 text-lg font-black">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{description}</p>
              </article>
            ))}
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <div>
            <SectionHeader
              eyebrow="How Pahuna works"
              title="From discovery to human-reviewed planning"
              description="The service experience follows the reference app's clear section rhythm: browse, compare, ask, and plan."
            />
            <div className="mt-8 space-y-4">
              {process.map(([title, description], index) => (
                <div key={title} className="flex gap-4 rounded-[8px] border border-stone-200 bg-white p-5 shadow-sm">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-black">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[8px] border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Services dropdown</p>
            <h2 className="mt-3 text-2xl font-black">Direct service routes</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              These match the public navigation service menu and keep users inside the existing Pahuna flow.
            </p>
            <div className="mt-6 grid gap-2">
              {serviceLinks.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-md border border-emerald-100 bg-white px-4 py-3 text-sm font-black text-stone-900 transition hover:border-emerald-300 hover:text-emerald-800"
                >
                  {label}
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </SectionShell>

      <section className="mx-auto mb-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[8px] bg-[#071121] p-10 text-center text-white">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">Need help choosing?</p>
          <h2 className="mt-3 text-3xl font-black">Tell us what you are planning</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/70">
            Send one message and Pahuna can point you toward the right stay, route, training, consulting, or partner path.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink href="/contact">Contact Pahuna</ButtonLink>
            <ButtonLink href="/trip-planner" variant="ghost">Open Trip Planner</ButtonLink>
          </div>
        </div>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
