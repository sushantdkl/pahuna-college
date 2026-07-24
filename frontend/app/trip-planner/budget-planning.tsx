"use client";

import { useMemo, useState } from "react";

type BudgetTier = "budget" | "standard" | "premium";

const numberFormatter = new Intl.NumberFormat("en-IN");

const budgetThemes = {
  budget: {
    icon: "\u{1F392}",
    label: "Budget Traveler",
    subtitle: "Smart & simple",
    dailyMin: 2000,
    dailyMax: 4000,
    selectedCard: "border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-200",
    priceText: "text-emerald-700",
    estimatedPanel: "border-emerald-200 bg-emerald-50",
    estimatedText: "text-emerald-700",
    hoverBorder: "hover:border-emerald-300",
  },
  standard: {
    icon: "\u{1F9F3}",
    label: "Standard Traveler",
    subtitle: "Comfort meets value",
    dailyMin: 5000,
    dailyMax: 10000,
    selectedCard: "border-blue-500 bg-blue-50/80 ring-1 ring-blue-200",
    priceText: "text-blue-700",
    estimatedPanel: "border-blue-200 bg-blue-50",
    estimatedText: "text-blue-700",
    hoverBorder: "hover:border-blue-300",
  },
  premium: {
    icon: "\u{2728}",
    label: "Premium Traveler",
    subtitle: "Best of Surkhet",
    dailyMin: 12000,
    dailyMax: 30000,
    selectedCard: "border-amber-500 bg-amber-50/80 ring-1 ring-amber-200",
    priceText: "text-orange-700",
    estimatedPanel: "border-amber-200 bg-amber-50",
    estimatedText: "text-orange-700",
    hoverBorder: "hover:border-amber-300",
  },
} as const;

const categoryMultipliers = {
  accommodation: { icon: "\u{1F3E8}", title: "Accommodation", note: "Nightly stay range", min: 0.38, max: 0.5 },
  food: { icon: "\u{1F372}", title: "Food & Dining", note: "Breakfast, lunch, dinner", min: 0.18, max: 0.24 },
  transport: { icon: "\u{1F68C}", title: "Local Transport", note: "Within Birendranagar per trip", min: 0.16, max: 0.22 },
  activities: { icon: "\u{1F9ED}", title: "Activities & Experiences", note: "Guided tour / cultural activity", min: 0.18, max: 0.28 },
  miscellaneous: { icon: "\u{1F9FE}", title: "Miscellaneous", note: "SIM, snacks, tips, buffer", min: 0.1, max: 0.16 },
} as const;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const money = (value: number) => `NPR ${numberFormatter.format(Math.round(value))}`;

export function BudgetPlanning() {
  const [selectedTier, setSelectedTier] = useState<BudgetTier>("standard");
  const [tripDuration, setTripDuration] = useState(3);
  const [travellers, setTravellers] = useState(2);
  const theme = budgetThemes[selectedTier];

  const costs = useMemo(() => {
    const perPersonMin = theme.dailyMin * tripDuration;
    const perPersonMax = theme.dailyMax * tripDuration;
    const totalMin = perPersonMin * travellers;
    const totalMax = perPersonMax * travellers;

    return { perPersonMin, perPersonMax, totalMin, totalMax };
  }, [theme.dailyMax, theme.dailyMin, travellers, tripDuration]);

  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {(Object.keys(budgetThemes) as BudgetTier[]).map((tier) => {
          const item = budgetThemes[tier];
          const selected = selectedTier === tier;

          return (
            <button
              key={tier}
              type="button"
              onClick={() => setSelectedTier(tier)}
              aria-pressed={selected}
              className={`rounded-[8px] border p-5 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                selected
                  ? item.selectedCard
                  : `border-stone-200 bg-white text-stone-950 ${item.hoverBorder} hover:shadow-md`
              }`}
            >
              <span className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">{item.icon}</span>
                <span>
                  <span className="block text-sm font-black">{item.label}</span>
                  <span className="mt-1 block text-xs text-stone-500">{item.subtitle}</span>
                </span>
              </span>
              <span className={`mt-3 block text-xl font-black ${selected ? item.priceText : "text-stone-950"}`}>
                {money(item.dailyMin)} - {money(item.dailyMax)}
              </span>
              <span className="mt-1 block text-xs text-stone-500">per person / day</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <CounterCard label="Trip duration" subtitle="Number of days" value={tripDuration} unit="days" min={1} max={30} onChange={setTripDuration} />
        <CounterCard label="Travellers" subtitle="Number of people" value={travellers} unit="people" min={1} max={20} onChange={setTravellers} />
      </div>

      <div className={`mt-5 rounded-[8px] border p-5 ${theme.estimatedPanel}`}>
        <p className={`text-xs font-black uppercase tracking-[0.18em] ${theme.estimatedText}`}>
          <span aria-hidden="true">{"\u{1F9EE}"}</span> Estimated Trip Cost
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold text-stone-500">Per Person ({tripDuration} days)</p>
            <p className={`mt-1 text-2xl font-black ${theme.estimatedText}`}>
              {money(costs.perPersonMin)} - {money(costs.perPersonMax)}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-stone-500">Total ({travellers} {travellers === 1 ? "person" : "people"})</p>
            <p className={`mt-1 text-2xl font-black ${theme.estimatedText}`}>
              {money(costs.totalMin)} - {money(costs.totalMax)}
            </p>
          </div>
        </div>
      </div>

      <h3 className="mt-8 text-xl font-black">Cost breakdown by category</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {Object.entries(categoryMultipliers).map(([key, item]) => {
          const min = costs.totalMin * item.min;
          const max = costs.totalMax * item.max;

          return (
            <div key={key} className="rounded-[8px] border border-stone-200 bg-white p-5 shadow-sm">
              <p className="font-black"><span aria-hidden="true">{item.icon}</span> {item.title}</p>
              <p className="mt-2 text-sm text-stone-600">{item.note}</p>
              <p className={`mt-3 text-sm font-black ${theme.priceText}`}>
                {money(min)} - {money(max)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-[8px] border border-stone-200 bg-white p-5 text-sm leading-7 text-stone-600">
        <p className="font-black text-stone-950">{theme.label}</p>
        <p className="mt-2">
          {theme.subtitle} planning profile for {tripDuration} {tripDuration === 1 ? "day" : "days"} and {travellers} {travellers === 1 ? "traveller" : "travellers"}. Confirm route, stay, food, and operator details before travel.
        </p>
      </div>
    </>
  );
}

function CounterCard({
  label,
  subtitle,
  value,
  unit,
  min,
  max,
  onChange,
}: {
  label: string;
  subtitle: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const decreaseDisabled = value <= min;
  const increaseDisabled = value >= max;

  return (
    <div className="flex items-center justify-between gap-4 rounded-[8px] border border-stone-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-black">{label}</p>
        <p className="mt-1 text-xs text-stone-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3 text-lg font-black">
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1, min, max))}
          disabled={decreaseDisabled}
          aria-label={`Decrease ${label.toLowerCase()}`}
          className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          -
        </button>
        <span className="min-w-12 text-center" aria-label={`${value} ${unit}`}>{value}</span>
        <button
          type="button"
          onClick={() => onChange(clamp(value + 1, min, max))}
          disabled={increaseDisabled}
          aria-label={`Increase ${label.toLowerCase()}`}
          className="grid h-9 w-9 place-items-center rounded-full border border-stone-200 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}
