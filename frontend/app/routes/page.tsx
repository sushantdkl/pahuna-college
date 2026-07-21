"use client";

import { useEffect, useMemo, useState } from "react";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { getRouteSegments, getTransportRoutes, type RouteSegment, type TransportRoute } from "@/lib/actions/final-crud-actions";

const fallbackSegments: RouteSegment[] = [
  {
    _id: "fallback-surkhet-rara",
    from: "Surkhet",
    to: "Rara",
    slug: "surkhet-rara-jeep",
    mode: "JEEP",
    distanceKm: 300,
    durationMin: 720,
    durationMax: 960,
    costMin: 4500,
    costMax: 8500,
    currency: "NPR",
    seasonality: "Best in clear weather; confirm road status in monsoon.",
    reliability: "MEDIUM",
    notes: "Use Surkhet as the base and confirm vehicle availability before departure.",
    riskNotes: "Road condition can change quickly after rain or landslides.",
    recommendedStopover: "Dailekh or Kalikot",
    requiresConfirmation: true,
    active: true,
    featured: true,
    createdAt: "",
    updatedAt: "",
  },
];

export default function RoutesPage() {
  const [segments, setSegments] = useState<RouteSegment[]>(fallbackSegments);
  const [transportRoutes, setTransportRoutes] = useState<TransportRoute[]>([]);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRoutes() {
      setLoading(true);
      setError("");
      try {
        const [segmentResponse, transportResponse] = await Promise.all([
          getRouteSegments({ limit: 50 }),
          getTransportRoutes({ limit: 50 }),
        ]);
        if (segmentResponse.data?.length) setSegments(segmentResponse.data);
        setTransportRoutes(transportResponse.data || []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load live route data; showing fallback guidance.");
      } finally {
        setLoading(false);
      }
    }
    void loadRoutes();
  }, []);

  const visibleSegments = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return segments.filter((segment) => {
      if (mode && segment.mode !== mode) return false;
      if (!needle) return true;
      return [segment.from, segment.to, segment.mode, segment.notes, segment.riskNotes, segment.seasonality]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [mode, query, segments]);

  const modes = Array.from(new Set(segments.map((segment) => segment.mode))).sort();

  return (
    <PageShell>
      <SiteHeader />
      <SectionShell className="pt-14">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Routes"
              title="Karnali route planning with cost, time, and reliability notes."
              description="Browse public route segments and transport summaries. Use this as planning guidance, then confirm road, weather, and vehicle availability before travel."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#route-segments">Browse routes</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">Confirm route</ButtonLink>
            </div>
          </div>
          <div className="rounded-[32px] border border-emerald-900/10 bg-white p-8 shadow-xl shadow-emerald-900/5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Travel note</p>
            <h2 className="mt-3 text-3xl font-black">Route data is advisory.</h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              Karnali travel can change because of weather, road work, festivals, and seasonal transport. Pahuna keeps route data structured, but final movement should always be confirmed locally.
            </p>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="route-segments" className="pt-8">
        <div className="rounded-[30px] border border-emerald-900/10 bg-white p-4 shadow-lg shadow-emerald-900/5">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" placeholder="Search Surkhet, Rara, bus, jeep, season..." />
            <select value={mode} onChange={(event) => setMode(event.target.value)} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500">
              <option value="">All modes</option>
              {modes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <p className="mt-4 text-sm font-semibold text-stone-600">{loading ? "Loading live route data..." : `Showing ${visibleSegments.length} route segments.`}</p>
          {error ? <p className="mt-2 text-sm text-amber-700">{error}</p> : null}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {visibleSegments.map((segment) => (
            <article key={segment._id} className="rounded-[28px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{segment.mode} · {segment.reliability} reliability</p>
                  <h2 className="mt-2 text-2xl font-black">{segment.from} → {segment.to}</h2>
                </div>
                {segment.requiresConfirmation ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">Confirm before travel</span> : null}
              </div>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                <Info label="Distance" value={segment.distanceKm ? `${segment.distanceKm} km` : "Varies"} />
                <Info label="Duration" value={durationLabel(segment)} />
                <Info label="Cost" value={`${segment.currency} ${segment.costMin || 0} - ${segment.costMax || 0}`} />
              </div>
              {segment.notes ? <p className="mt-5 text-sm leading-7 text-stone-600">{segment.notes}</p> : null}
              {segment.riskNotes ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm leading-6 text-red-700">{segment.riskNotes}</p> : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/contact" variant="secondary">Ask about this route</ButtonLink>
                {segment.recommendedStopover ? <span className="rounded-full bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-700">Stopover: {segment.recommendedStopover}</span> : null}
              </div>
            </article>
          ))}
        </div>

        {transportRoutes.length ? (
          <div className="mt-12 rounded-[30px] border border-emerald-900/10 bg-white p-6 shadow-lg shadow-emerald-900/5">
            <SectionHeader eyebrow="Transport summaries" title="Simple route frequency and cost notes." />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {transportRoutes.map((route) => (
                <div key={route._id} className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
                  <p className="font-black">{route.fromLocation} → {route.toLocation}</p>
                  <p className="mt-2 text-sm text-stone-600">{route.mode} · {route.durationHours || "Flexible"} hours · NPR {route.costMin || 0}-{route.costMax || 0}</p>
                  {route.frequency ? <p className="mt-2 text-xs font-semibold text-emerald-700">{route.frequency}</p> : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-stone-50 p-4"><p className="text-xs font-black uppercase tracking-[0.18em] text-stone-500">{label}</p><p className="mt-1 font-bold text-stone-900">{value}</p></div>;
}

function durationLabel(segment: RouteSegment) {
  const min = segment.durationMin;
  const max = segment.durationMax;
  if (!min && !max) return "Flexible";
  if (min && max) return `${Math.round(min / 60)}-${Math.round(max / 60)} hrs`;
  return `${Math.round((min || max || 0) / 60)} hrs`;
}
