import Link from "next/link";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { TourismMap, type TourismMapMarker } from "@/app/_components/tourism-map";
import { featuredStays, foodProviders, routeCards, surkhetPlaces } from "@/lib/pahuna-content";

const plannerSteps = [
  ["Where do you want to go?", ["Surkhet", "Rara", "Dailekh", "Dolpa", "Jumla", "Phoksundo"]],
  ["How many days?", ["1 day", "2 days", "4-5 days", "1 week"]],
  ["Budget range", ["Budget", "Standard", "Premium", "Custom"]],
  ["Travel style", ["Family", "Culture", "Nature", "Food", "Adventure"]],
];

const tripIdeas = [
  ["1 Day Surkhet City Tour", "Birendranagar, Bulbule Lake, Kakrebihar, Deuti Bajai", "orientation"],
  ["2 Days Surkhet + Dailekh", "Surkhet base with Dailekh temples and hill-route context", "culture"],
  ["3 Days Surkhet Food + Culture", "Explore Surkhet places, local cafes, temples, and cultural food stops", "food/culture"],
  ["5 Days Surkhet to Rara", "Surkhet, Dailekh/Kalikot route context, Mugu, Rara", "mountain journey"],
  ["Jumla + Sinja Route", "A culture-forward, highland route from Karnali highland stops", "heritage"],
  ["Dolpa / Phoksundo Route", "Suitable for high-energy seasons with route and flight confirmation", "remote nature"],
  ["Humla / Simikot Route", "Flight-dependent highland route with buffer days and local coordination", "remote"],
];

const budgetTiers = [
  ["Budget Traveler", "NPR 2,000 - NPR 4,000", "per person / day", "border-stone-200 bg-white"],
  ["Standard Traveler", "NPR 5,000 - NPR 10,000", "per person / day", "border-blue-500 bg-blue-50"],
  ["Premium Traveler", "NPR 12,000 - NPR 20,000", "per person / day", "border-stone-200 bg-white"],
];

const costCards = [
  ["Accommodation", "Budget stay per night", ["NPR 2,000 - NPR 12,000", "NPR 4,000 - NPR 18,000"]],
  ["Food & Dining", "Breakfast, lunch, dinner", ["NPR 800 - NPR 2,500", "NPR 1,500 - NPR 4,500"]],
  ["Local Transport", "Within Birendranagar per trip", ["NPR 500 - NPR 3,000", "NPR 2,500 - NPR 8,000"]],
  ["Activities & Experiences", "Guided tour / cultural activity", ["NPR 1,500 - NPR 5,000", "NPR 3,000 - NPR 10,000"]],
  ["Miscellaneous", "SIM, snacks, tips, buffer", ["NPR 500 - NPR 2,000", "NPR 1,500 - NPR 5,000"]],
];

export default function TripPlannerPage() {
  const plannerMapMarkers: TourismMapMarker[] = featuredStays.slice(0, 3).map((stay) => ({
    id: `stay-${stay.slug}`,
    name: stay.name,
    category: "stay",
    latitude: stay.latitude,
    longitude: stay.longitude,
    type: stay.typeLabel || stay.type,
    location: `${stay.area}, ${stay.district}`,
    price: stay.priceFrom,
    href: `/hotels/${stay.slug}`,
    secondaryHref: "/routes",
    secondaryLabel: "Build Route",
  }));

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
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Simple planner</p>
          <h2 className="mt-2 text-2xl font-black">Choose your trip shape</h2>
          <p className="mt-2 text-sm text-stone-600">Pick the destination, day count, and local signals. Then use the fields below to send your plan to Pahuna.</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-4">
            {plannerSteps.map(([title, chips]) => (
              <div key={title as string} className="rounded-[8px] border border-emerald-200 bg-white p-4">
                <p className="text-sm font-black">{title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(chips as string[]).map((chip) => (
                    <span key={chip} className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">{chip}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <form action="/contact" className="mt-5 grid gap-3 md:grid-cols-4">
            {[
              ["Starting city", "Kathmandu, Nepalgunj, Surkhet"],
              ["Destination", "Surkhet, Rara, Sinja, Dolpa"],
              ["Days", "3"],
              ["Budget range", "NPR 15,000 - 30,000"],
              ["Travel style", "Solo, family, group"],
              ["Interests", "Food, temples, lakes, trekking"],
              ["Transport preference", "Flight, bus, jeep, mixed"],
            ].map(([label, placeholder], index) => (
              <label key={label} className={index > 3 ? "md:col-span-2" : ""}>
                <span className="sr-only">{label}</span>
                <input className="h-11 w-full rounded-md border border-emerald-200 bg-white px-3 text-sm outline-none focus:border-emerald-600" name={label.toLowerCase().replaceAll(" ", "-")} placeholder={placeholder} />
              </label>
            ))}
            <button className="h-11 rounded-md bg-emerald-700 px-5 text-sm font-black text-white hover:bg-emerald-800">Send this plan</button>
          </form>
        </div>
      </SectionShell>

      <section className="bg-white/55">
        <SectionShell className="py-12">
          <SectionHeader align="center" title="Trip ideas" description="Start with a route shape, then adjust days, weather buffer, stay choices, and local transport." />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tripIdeas.map(([title, text, tag], index) => (
              <article key={title} className="rounded-[8px] border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold text-stone-400">{index + 1} days</p>
                <h3 className="mt-2 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
                <div className="mt-4 h-2 rounded-full bg-emerald-50"><div className="h-2 rounded-full bg-emerald-200" style={{ width: `${50 + index * 6}%` }} /></div>
                <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{tag}</span>
              </article>
            ))}
          </div>
        </SectionShell>
      </section>

      <SectionShell className="py-12">
        <SectionHeader align="center" title="Budget planning" description="Use ranges, not fixed promises. Confirm route, food, and operator details before travel." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {budgetTiers.map(([title, amount, note, classes]) => (
            <div key={title} className={`rounded-[8px] border p-5 shadow-sm ${classes}`}>
              <p className="text-sm font-black">{title}</p>
              <p className="mt-2 text-xl font-black text-blue-700">{amount}</p>
              <p className="mt-1 text-xs text-stone-500">{note}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <CounterCard label="Trip duration" value="3" />
          <CounterCard label="Travelers" value="2" />
        </div>
        <div className="mt-5 rounded-[8px] border border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Estimated trip cost</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <p className="text-2xl font-black text-blue-700">NPR 15,000 - NPR 30,000</p>
            <p className="text-2xl font-black text-blue-700">NPR 30,000 - NPR 60,000</p>
          </div>
        </div>
        <h3 className="mt-8 text-xl font-black">Cost breakdown by category</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {costCards.map(([title, note, ranges]) => (
            <div key={title as string} className="rounded-[8px] border border-stone-200 bg-white p-5">
              <p className="font-black">{title}</p>
              <p className="mt-2 text-sm text-stone-600">{note}</p>
              <div className="mt-3 grid gap-1 text-sm font-black text-blue-700">
                {(ranges as string[]).map((range) => <span key={range}>{range}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-[8px] border border-stone-200 bg-white p-5 text-sm leading-7 text-stone-600">
          <p className="font-black text-stone-950">Standard Traveler</p>
          <p className="mt-2">A balanced expense profile with comfortable hotels, restaurant meals, and careful route selection. Good for couples and families.</p>
        </div>
      </SectionShell>

      <section className="bg-white/55">
        <SectionShell>
          <SectionHeader align="center" title="Route & Cost inside Trip Planner" description="Use these routes as planning guidance, then confirm current road, flight, stay, and operator details." />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {routeCards.slice(0, 4).map((route) => (
              <article key={route.route} className="rounded-[8px] border border-stone-200 bg-white p-5 shadow-sm">
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
          <div className="mt-5 rounded-[8px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
            Roads, routes, flights, and availability can change due to weather, season, road condition, and operator schedule.
          </div>
          <div className="mt-8 overflow-hidden rounded-[8px] border border-emerald-100 bg-white shadow-sm">
            <div className="border-b border-stone-100 p-5">
              <h3 className="text-lg font-black">Getting to Surkhet</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead><tr className="border-b bg-stone-50 text-left text-stone-500"><th className="px-5 py-3">Route</th><th>Mode</th><th>Duration</th><th>Cost</th><th>Frequency</th></tr></thead>
                <tbody>{routeCards.slice(0, 4).map((route) => <tr key={`${route.route}-table`} className="border-b last:border-0"><td className="px-5 py-4 font-bold">{route.route}</td><td>{route.mode}</td><td>4-13 hrs</td><td>NPR 1,500 - NPR 8,500</td><td>Daily / confirm locally</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <SectionHeader align="center" title="Suggested stays and food" description="Suggestions are pulled from Pahuna records and fallback public listings." />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[featuredStays[0], featuredStays[1]].filter(Boolean).map((stay) => (
            <Link key={stay.slug} href={`/hotels/${stay.slug}`} className="rounded-[8px] border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Stay</p>
              <h3 className="mt-2 text-xl font-black">{stay.name}</h3>
              <p className="mt-2 text-sm text-stone-600">{stay.shortDescription}</p>
            </Link>
          ))}
          {[foodProviders[0], foodProviders[1]].filter(Boolean).map((food) => (
            <Link key={food.slug} href={`/food/${food.slug}`} className="rounded-[8px] border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Food</p>
              <h3 className="mt-2 text-xl font-black">{food.name}</h3>
              <p className="mt-2 text-sm text-stone-600">{food.shortDescription}</p>
            </Link>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <SectionHeader align="center" title="Suggested destinations" description="Use these as starting points, then open each destination guide for route and local context." />
        <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {surkhetPlaces.slice(0, 8).map((place) => (
            <Link key={place.title} href={place.href} className="rounded-[8px] border border-stone-200 bg-white p-5 text-sm shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-400">{place.eyebrow}</p>
              <h3 className="mt-2 font-black">{place.title}</h3>
              <span className="mt-3 inline-flex text-xs font-black text-emerald-800">View guide +</span>
            </Link>
          ))}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_340px]">
          <TourismMap
            markers={plannerMapMarkers}
            heightClass="h-[300px]"
            emptyTitle="Trip map coordinates not available"
            emptyDescription="Trip planner suggestions remain available. Exact markers appear only for selected stays, food providers, experiences, and destinations with valid coordinates."
          />
          <aside className="rounded-[8px] border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="font-black">Cost by category</h3>
            <div className="mt-4 grid gap-3 text-sm">
              {["Hotels", "Food", "Experiences", "Transport"].map((item, index) => (
                <p key={item} className="flex justify-between gap-4"><span>{item}</span><strong>NPR {(index + 1) * 2500} - {(index + 2) * 4000}</strong></p>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <ButtonLink href="/routes" variant="secondary">Browse routes</ButtonLink>
              <ButtonLink href="/trip-cost" variant="secondary">Trip ideas</ButtonLink>
            </div>
          </aside>
        </div>
        <div className="mt-8 rounded-[8px] border border-emerald-100 bg-emerald-50 p-5 text-sm leading-7 text-emerald-950">
          <p className="font-black">Planning notes</p>
          <p className="mt-2">Use Surkhet/Birendranagar as the practical base for many Karnali routes. Remote trips such as Dolpa, Rara, and Humla need weather and flight buffers.</p>
        </div>
      </SectionShell>

      <section className="bg-[#071121] text-white">
        <SectionShell className="py-12 text-center">
          <h2 className="text-3xl font-black">Need a human-reviewed Karnali plan?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/70">Send your dates, route idea, group size, and budget range. Pahuna can help prepare a practical plan.</p>
          <div className="mt-7 flex justify-center gap-3">
            <ButtonLink href="/contact">Send the plan to Pahuna</ButtonLink>
            <ButtonLink href="/trip-cost" variant="ghost">Open cost planner</ButtonLink>
          </div>
        </SectionShell>
      </section>
      <SiteFooter />
    </PageShell>
  );
}

function CounterCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[8px] border border-stone-200 bg-white p-5">
      <div>
        <p className="text-sm font-black">{label}</p>
        <p className="mt-1 text-xs text-stone-500">Adjust in your inquiry</p>
      </div>
      <div className="flex items-center gap-4 text-lg font-black">
        <span className="grid h-7 w-7 place-items-center rounded-full border border-stone-200">-</span>
        {value}
        <span className="grid h-7 w-7 place-items-center rounded-full border border-stone-200">+</span>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[8px] bg-stone-50 p-3"><p className="text-xs font-bold text-stone-400">{label}</p><p className="mt-1 font-black">{value}</p></div>;
}
