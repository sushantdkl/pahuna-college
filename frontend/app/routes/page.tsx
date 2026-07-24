"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, PageShell, SectionHeader, SectionShell, SiteFooter, SiteHeader } from "@/app/_components/pahuna-layout";
import { TourismMap } from "@/app/_components/tourism-map";
import { images } from "@/lib/pahuna-content";
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
  const highlighted = visibleSegments[0] || fallbackSegments[0];

  return (
    <PageShell>
      <SiteHeader />
      <section className="bg-gradient-to-b from-emerald-50/90 to-[#fffaf0]">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="mx-auto inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">AI route & cost planning</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Karnali Route &<br />Cost Estimator</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-600">Plan routes from Kathmandu, Nepalgunj, and Surkhet to Karnali destinations with estimated travel time, cost range, reliability notes, and local route guidance.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="#route-segments">Build trip route</ButtonLink>
            <ButtonLink href="/destinations" variant="secondary">Explore destinations</ButtonLink>
          </div>
        </div>
      </section>

      <SectionShell id="route-segments">
        <div className="rounded-[18px] border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Route planner</p>
              <h2 className="text-2xl font-black">Build a cautious Karnali travel plan</h2>
              <p className="mt-2 text-sm text-stone-600">Choose a planning direction, then review route steps and suggested stopovers.</p>
            </div>
            <Link href="/contact" className="rounded-md border border-emerald-200 px-4 py-2 text-sm font-black text-emerald-800">Submit planning request</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="rounded-md border border-stone-300 px-4 py-3 text-sm outline-none focus:border-emerald-500" placeholder="Search Surkhet, Rara, bus, jeep, season..." />
            <select value={mode} onChange={(event) => setMode(event.target.value)} className="rounded-md border border-stone-300 px-4 py-3 text-sm outline-none focus:border-emerald-500">
              <option value="">All modes</option>
              {modes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <p className="mt-4 text-sm font-semibold text-stone-600">{loading ? "Loading live route data..." : `Showing ${visibleSegments.length} route segments.`}</p>
          {error ? <p className="mt-2 text-sm text-amber-700">{error}</p> : null}
          <div className="mt-6">
            <TourismMap
              markers={[]}
              routes={[]}
              heightClass="h-[300px]"
              emptyTitle="Route coordinates not available"
              emptyDescription="Current route records provide textual origin, destination, cost, duration, reliability, and safety notes. A route polyline will render here when valid backend coordinate points are added."
            />
          </div>

          <div className="mt-6 rounded-[14px] border border-amber-200 bg-amber-50 p-4">
            <p className="font-black text-amber-950">{highlighted.from} to {highlighted.to}</p>
            <p className="mt-1 text-sm text-amber-900">Cost: {highlighted.currency} {highlighted.costMin || 0} - {highlighted.costMax || 0} | Duration: {durationLabel(highlighted)}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_330px]">
          <div className="space-y-4">
            {visibleSegments.map((segment, index) => (
              <article key={segment._id} className="rounded-[14px] border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Step {index + 1} | {segment.mode} | {segment.reliability} reliability</p>
                    <h2 className="mt-2 text-2xl font-black">{segment.from} to {segment.to}</h2>
                  </div>
                  {segment.requiresConfirmation ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">Confirm before travel</span> : null}
                </div>
                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                  <Info label="Distance" value={segment.distanceKm ? `${segment.distanceKm} km` : "Varies"} />
                  <Info label="Duration" value={durationLabel(segment)} />
                  <Info label="Cost" value={`${segment.currency} ${segment.costMin || 0} - ${segment.costMax || 0}`} />
                </div>
                {segment.notes ? <p className="mt-5 text-sm leading-7 text-stone-600">{segment.notes}</p> : null}
                {segment.riskNotes ? <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-700">{segment.riskNotes}</p> : null}
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-[14px] border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black">Recommended stopover</h3>
            <p className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-900">{highlighted.recommendedStopover || "Surkhet or Dailekh, depending on route and daylight."}</p>
            <h3 className="mt-6 text-lg font-black">Suggested stay options</h3>
            <div className="mt-3 grid gap-3">
              {visibleSegments.slice(0, 3).map((segment) => (
                <div key={`${segment._id}-stay`} className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                  <p className="text-sm font-black">{segment.recommendedStopover || segment.from}</p>
                  <p className="mt-1 text-xs text-stone-500">{segment.from} to {segment.to}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <SectionHeader eyebrow="Featured route cards" title="Common Karnali route options" description="Use these as a starting point. Weather, road condition, and operator schedules change in this region." />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleSegments.slice(0, 6).map((segment, index) => (
            <article key={`${segment._id}-card`} className="overflow-hidden rounded-[12px] border border-emerald-100 bg-white shadow-sm">
              <div className="relative h-40">
                <Image src={[images.hero, images.rara, images.phoksundo, images.karnaliRiver][index % 4]} alt={`${segment.from} to ${segment.to}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-black">{segment.from} to {segment.to}</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Info label="Time" value={durationLabel(segment)} />
                  <Info label="Range" value={`${segment.currency} ${segment.costMin || 0}`} />
                </div>
                <Link href="/contact" className="mt-5 inline-flex w-full justify-center rounded-md border border-emerald-200 px-4 py-2 text-sm font-black text-emerald-800">Use this route</Link>
              </div>
            </article>
          ))}
        </div>

        {transportRoutes.length ? (
          <div className="mt-12 rounded-[14px] border border-emerald-100 bg-white p-6 shadow-sm">
            <SectionHeader eyebrow="Transport table" title="Getting around Surkhet" />
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead><tr className="border-b text-left text-stone-500"><th className="py-3">Route</th><th>Mode</th><th>Duration</th><th>Cost</th><th>Frequency</th></tr></thead>
                <tbody>{transportRoutes.map((route) => <tr key={route._id} className="border-b last:border-0"><td className="py-4 font-bold">{route.fromLocation} to {route.toLocation}</td><td>{route.mode}</td><td>{route.durationHours || "Flexible"} hrs</td><td>NPR {route.costMin || 0}-{route.costMax || 0}</td><td>{route.frequency || "Confirm locally"}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        ) : null}
      </SectionShell>
      <SiteFooter />
    </PageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-stone-50 p-3"><p className="text-xs font-black uppercase tracking-[0.14em] text-stone-500">{label}</p><p className="mt-1 font-bold text-stone-900">{value}</p></div>;
}

function durationLabel(segment: RouteSegment) {
  const min = segment.durationMin;
  const max = segment.durationMax;
  if (!min && !max) return "Flexible";
  if (min && max) return `${Math.round(min / 60)}-${Math.round(max / 60)} hrs`;
  return `${Math.round((min || max || 0) / 60)} hrs`;
}
