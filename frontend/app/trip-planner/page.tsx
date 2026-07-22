import Link from "next/link";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { featuredStays, foodProviders, routeCards } from "@/lib/pahuna-content";
import { ItineraryPlannerForm } from "./itinerary-planner-form";

const tripIdeas = [
  ["1 Day Surkhet City Tour", "Birendranagar, Bulbule Lake, Kakrebihar, Deuti Bajai", "orientation"],
  ["2 Days Surkhet + Dailekh", "Surkhet base with Dailekh temples and hill route context", "culture"],
  ["3 Days Surkhet Food + Culture", "Explore Surkhet places, local cafes, temples, and cultural stops", "food/culture"],
  ["5 Days Surkhet to Rara", "Surkhet, Dailekh/Kalikot route context, Mugu, Rara", "mountain journey"],
  ["Jumla + Sinja Route", "A culture-forward, highland route from Karnali highland stops", "heritage"],
  ["Dolpa / Phoksundo Route", "Suitable for high-energy seasons with route and flight confirmation", "remote nature"],
];

const budgets = [
  ["Budget Traveler", "NPR 2,000 - NPR 4,000", "per person / day"],
  ["Standard Traveler", "NPR 5,000 - NPR 10,000", "per person / day"],
  ["Premium Traveler", "NPR 12,000 - NPR 20,000", "per person / day"],
];

const costCards = [
  ["Accommodation", "Budget stay per night", "NPR 2,000 - NPR 12,000"],
  ["Food & Dining", "Breakfast, lunch, dinner", "NPR 800 - NPR 2,500"],
  ["Local Transport", "Within Birendranagar per trip", "NPR 500 - NPR 3,000"],
  ["Activities & Experiences", "Guided tour / cultural activity", "NPR 1,500 - NPR 5,000"],
  ["Miscellaneous", "SIM, snacks, tips, buffers", "NPR 500 - NPR 2,000"],
];

export default function TripPlannerPage() {
  return (
    <PageShell>
      <SiteHeader />
      <section className="bg-gradient-to-br from-[#071121] via-[#111630] to-[#08121f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="mx-auto inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-bold text-white/75">Trip Planner</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Plan Your <span className="text-amber-300">Karnali Trip</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75">Choose your destination, days, budget, travel style, and route. Pahuna helps you plan stays, food, routes, and experiences around Surkhet and Karnali.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="#planner">Start Planning</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">Send Inquiry</ButtonLink>
          </div>
        </div>
      </section>

      <SectionShell id="planner" className="pb-8">
        <div className="rounded-[18px] border border-emerald-200 bg-emerald-50/35 p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Trip Planner</p>
          <h2 className="mt-2 text-2xl font-black">Choose your trip shape</h2>
          <p className="mt-2 text-sm text-stone-600">Pick the destination, day count, and local signals. Then save the final itinerary to your profile.</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
            <div className="grid gap-3 sm:grid-cols-2">
              {["Where do you want to go?", "How many days?", "Budget range", "Travel style"].map((title, index) => (
                <div key={title} className="rounded-2xl border border-emerald-200 bg-white p-4">
                  <p className="text-sm font-black">{title}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(index === 0 ? ["Surkhet", "Rara", "Dailekh", "Dolpa"] : index === 1 ? ["1 day", "2 days", "4-5 days"] : index === 2 ? ["Budget", "Standard", "Premium"] : ["Family", "Food", "Nature", "Heritage"]).map((item) => (
                      <span key={item} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="overflow-hidden rounded-[18px] border border-emerald-200 bg-white">
              <ItineraryPlannerForm />
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="py-10">
        <SectionHeader align="center" title="Trip ideas" description="Start with a route shape, then adjust days, weather buffer, stay choices, and local transport." />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tripIdeas.map(([title, text, tag], index) => (
            <article key={title} className="rounded-[16px] border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold text-stone-400">{index + 1} days</p>
              <h3 className="mt-2 text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
              <div className="mt-4 h-2 rounded-full bg-emerald-50"><div className="h-2 rounded-full bg-emerald-200" style={{ width: `${55 + index * 6}%` }} /></div>
              <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{tag}</span>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="py-12">
        <SectionHeader align="center" title="Budget planning" description="Use ranges, not fixed promises. Confirm route, food, and operator details before travel." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {budgets.map(([title, amount, note], index) => (
            <div key={title} className={`rounded-[16px] border bg-white p-5 shadow-sm ${index === 1 ? "border-blue-500 bg-blue-50" : "border-stone-200"}`}>
              <p className="text-sm font-black">{title}</p>
              <p className="mt-2 text-xl font-black text-blue-700">{amount}</p>
              <p className="mt-1 text-xs text-stone-500">{note}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-[16px] border border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Estimated trip cost</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <p className="text-2xl font-black text-blue-700">NPR 15,000 - NPR 30,000</p>
            <p className="text-2xl font-black text-blue-700">NPR 30,000 - NPR 60,000</p>
          </div>
        </div>
        <h3 className="mt-8 text-xl font-black">Cost breakdown by category</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {costCards.map(([title, note, amount]) => (
            <div key={title} className="rounded-[16px] border border-stone-200 bg-white p-5">
              <p className="font-black">{title}</p>
              <p className="mt-2 text-sm text-stone-600">{note}</p>
              <p className="mt-3 text-sm font-black text-blue-700">{amount}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="pt-4">
        <SectionHeader align="center" title="Route & Cost inside Trip Planner" description="Use these routes as planning guidance, then confirm current road, flight, stay, and operator details." />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {routeCards.map((route) => (
            <article key={route.route} className="rounded-[16px] border border-stone-200 bg-white p-5">
              <h3 className="text-lg font-black">{route.route}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Fact label="Route type" value={route.mode} />
                <Fact label="Status" value={route.status} />
              </div>
              <p className="mt-4 text-sm leading-6 text-stone-600">{route.note}</p>
              <Link href="/routes" className="mt-5 inline-flex rounded-lg border border-emerald-200 px-4 py-2 text-sm font-black text-emerald-800">Use this route</Link>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="pt-4">
        <SectionHeader align="center" title="Suggested stays and food" description="Suggestions are pulled from Pahuna records and fallback public listings." />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[featuredStays[0], featuredStays[1]].filter(Boolean).map((stay) => (
            <Link key={stay.slug} href={`/hotels/${stay.slug}`} className="rounded-[18px] border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Stay</p>
              <h3 className="mt-2 text-xl font-black">{stay.name}</h3>
              <p className="mt-2 text-sm text-stone-600">{stay.shortDescription}</p>
            </Link>
          ))}
          {[foodProviders[0], foodProviders[1]].filter(Boolean).map((food) => (
            <Link key={food.slug} href={`/food/${food.slug}`} className="rounded-[18px] border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Food</p>
              <h3 className="mt-2 text-xl font-black">{food.name}</h3>
              <p className="mt-2 text-sm text-stone-600">{food.shortDescription}</p>
            </Link>
          ))}
        </div>
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-stone-50 p-3"><p className="text-xs font-bold text-stone-400">{label}</p><p className="mt-1 font-black">{value}</p></div>;
}
