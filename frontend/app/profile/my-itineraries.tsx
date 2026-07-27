"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  deleteMyItineraryAction,
  getMyItinerariesAction,
} from "@/lib/actions/itinerary-actions";
import type { Itinerary, ItineraryReference } from "@/lib/api/itineraries";

export function MyItineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadItineraries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMyItinerariesAction(1, 6);
      setItineraries(response.data || []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your itineraries",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadItineraries(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadItineraries]);

  async function deleteItinerary(itinerary: Itinerary) {
    if (!window.confirm(`Delete ${itinerary.title}? This cannot be undone.`)) {
      return;
    }

    setDeletingId(itinerary._id);
    setNotice("");
    setError("");
    try {
      await deleteMyItineraryAction(itinerary._id);
      setNotice("Itinerary deleted successfully");
      await loadItineraries();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete itinerary",
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <section className="overflow-hidden rounded-[30px] border border-emerald-900/10 bg-white shadow-lg shadow-emerald-900/5">
      <div className="flex flex-col gap-4 border-b border-emerald-900/10 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">My itineraries</p>
          <h2 className="mt-2 text-2xl font-black text-stone-950">Saved Karnali trip plans</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">Only itineraries saved by your account appear here.</p>
        </div>
        <Link href="/trip-planner" className="inline-flex justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800">Create itinerary</Link>
      </div>

      {notice ? <p className="mx-6 mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p> : null}
      {error ? <div className="mx-6 mt-5 flex items-center justify-between gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => void loadItineraries()} className="font-bold underline">Retry</button></div> : null}

      <div className="p-6">
        {loading ? <p className="py-8 text-center text-sm font-semibold text-stone-500">Loading your itineraries...</p> : itineraries.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {itineraries.map((itinerary) => (
              <article key={itinerary._id} className="rounded-[24px] border border-emerald-900/10 bg-[#fffaf0] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{referenceName(itinerary.destinationId)}</p>
                    <h3 className="mt-2 text-lg font-black text-stone-950">{itinerary.title}</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-stone-600 shadow-sm">{formatLabel(itinerary.status)}</span>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
                  <p><strong className="text-stone-800">Dates:</strong> {dateRange(itinerary)}</p>
                  <p><strong className="text-stone-800">Budget:</strong> {itinerary.budget !== undefined ? `NPR ${itinerary.budget.toLocaleString()}` : "Flexible"}</p>
                  <p><strong className="text-stone-800">Stays:</strong> {itinerary.hotelIds.length}</p>
                  <p><strong className="text-stone-800">Experiences:</strong> {itinerary.experienceIds.length}</p>
                </div>
                {itinerary.description ? <p className="mt-4 line-clamp-2 text-sm leading-6 text-stone-600">{itinerary.description}</p> : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href="/trip-planner" className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-50">Plan another trip</Link>
                  <button onClick={() => void deleteItinerary(itinerary)} disabled={deletingId === itinerary._id} className="rounded-full border border-red-100 bg-white px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50 disabled:opacity-50">{deletingId === itinerary._id ? "Deleting..." : "Delete"}</button>
                </div>
              </article>
            ))}
          </div>
        ) : <div className="py-8 text-center"><p className="font-black text-stone-900">No saved itineraries yet.</p><p className="mt-2 text-sm text-stone-500">Build a real trip plan and save it to your account.</p><Link href="/trip-planner" className="mt-5 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white">Start planning</Link></div>}
      </div>
    </section>
  );
}

function referenceName(value: string | ItineraryReference) {
  return typeof value === "string" ? "Karnali destination" : value.name;
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function dateRange(itinerary: Itinerary) {
  if (!itinerary.startDate && !itinerary.endDate) return "Flexible";
  return `${itinerary.startDate ? formatDate(itinerary.startDate) : "Flexible"} - ${itinerary.endDate ? formatDate(itinerary.endDate) : "Flexible"}`;
}
