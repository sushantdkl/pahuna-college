"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  createTripPackageInquiryAction,
  getTripPackagesAction,
} from "@/lib/actions/trip-package-actions";
import type { TripPackage } from "@/lib/api/trip-packages";

export function TripPackagesClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [packages, setPackages] = useState<TripPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      try {
        const response = await getTripPackagesAction({ page: 1, limit: 50 });
        setPackages(response.data || []);
      } catch (error) {
        setFeedback({
          tone: "error",
          message: error instanceof Error ? error.message : "Unable to load trip packages",
        });
      } finally {
        setLoading(false);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  async function reservePackage(tripPackage: TripPackage) {
    setFeedback(null);
    if (!authLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent("/trip-packages")}`);
      return;
    }
    setSavingId(tripPackage._id);
    try {
      const response = await createTripPackageInquiryAction(tripPackage);
      setFeedback({
        tone: "success",
        message: response.message || "Package reservation inquiry sent successfully",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Unable to send package inquiry",
      });
    } finally {
      setSavingId("");
    }
  }

  return (
    <div className="mt-10 space-y-6">
      {feedback ? <p aria-live="polite" className={`rounded-[8px] px-4 py-3 text-sm font-semibold ${feedback.tone === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{feedback.message}</p> : null}
      {loading ? (
        <div className="rounded-[8px] border border-stone-200 bg-white p-8 text-sm font-semibold text-stone-500 shadow-sm">Loading active trip packages...</div>
      ) : packages.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((tripPackage) => (
            <article key={tripPackage._id} className="rounded-[8px] border border-emerald-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">{destinationName(tripPackage)}</p>
                  <h3 className="mt-2 text-2xl font-black text-stone-950">{tripPackage.title}</h3>
                </div>
                {tripPackage.isFeatured ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">Featured</span> : null}
              </div>
              <p className="mt-4 line-clamp-4 text-sm leading-6 text-stone-600">{tripPackage.description}</p>
              <div className="mt-5 grid gap-3 text-sm text-stone-600">
                <Fact label="Duration" value={tripPackage.durationDays ? `${tripPackage.durationDays} days` : "Flexible"} />
                <Fact label="Price" value={priceLabel(tripPackage)} />
                <Fact label="Difficulty" value={tripPackage.difficulty || "Easy"} />
                <Fact label="Group" value={tripPackage.groupSize || "Flexible"} />
              </div>
              {tripPackage.highlights.length ? <p className="mt-4 text-sm text-stone-500">{tripPackage.highlights.slice(0, 4).join(" / ")}</p> : null}
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <Link href={`/trip-packages/${tripPackage.slug}`} className="rounded-[8px] border border-emerald-200 px-5 py-3 text-center text-sm font-black text-emerald-800 hover:bg-emerald-50">View details</Link>
                <button type="button" disabled={savingId === tripPackage._id} onClick={() => void reservePackage(tripPackage)} className="rounded-[8px] bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-800/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">{savingId === tripPackage._id ? "Sending..." : "Reserve"}</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[8px] border border-stone-200 bg-white p-8 text-center shadow-sm">
          <p className="font-bold text-stone-800">No active trip packages yet.</p>
          <p className="mt-2 text-sm text-stone-500">Published packages will appear here when the admin team adds them.</p>
        </div>
      )}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[8px] border border-stone-200 bg-stone-50 px-4 py-3"><p className="text-xs font-black uppercase tracking-[0.14em] text-stone-400">{label}</p><p className="mt-1 font-semibold text-stone-800">{value}</p></div>;
}

function destinationName(tripPackage: TripPackage) {
  return !tripPackage.destinationId || typeof tripPackage.destinationId === "string" ? "Karnali" : tripPackage.destinationId.name;
}

function priceLabel(tripPackage: TripPackage) {
  if (tripPackage.price !== undefined) return `NPR ${tripPackage.price.toLocaleString()}`;
  if (tripPackage.priceMin !== undefined && tripPackage.priceMax !== undefined) return `NPR ${tripPackage.priceMin.toLocaleString()} - NPR ${tripPackage.priceMax.toLocaleString()}`;
  return "Contact for price";
}
