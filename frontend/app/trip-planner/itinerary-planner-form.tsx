"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  createItineraryAction,
  getPlannerOptionsAction,
} from "@/lib/actions/itinerary-actions";
import type {
  ItineraryReference,
  PlannerOptions,
} from "@/lib/api/itineraries";
import {
  itineraryFormSchema,
  type ItineraryFormData,
} from "@/schemas/itinerary.schema";

const emptyOptions: PlannerOptions = {
  destinations: [],
  hotels: [],
  experiences: [],
};

const inputClassName =
  "w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm normal-case tracking-normal text-stone-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

export function ItineraryPlannerForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [options, setOptions] = useState(emptyOptions);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [hotelIds, setHotelIds] = useState<string[]>([]);
  const [experienceIds, setExperienceIds] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadOptions = async () => {
    setOptionsLoading(true);
    setOptionsError("");

    try {
      const response = await getPlannerOptionsAction();
      setOptions(response.data || emptyOptions);
    } catch (loadError) {
      setOptionsError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load trip planner options",
      );
    } finally {
      setOptionsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadOptions(), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const selectedDestination = useMemo(
    () => options.destinations.find((item) => item._id === destinationId),
    [destinationId, options.destinations],
  );

  function toggleSelection(
    id: string,
    values: string[],
    onChange: (next: string[]) => void,
  ) {
    onChange(
      values.includes(id)
        ? values.filter((value) => value !== id)
        : [...values, id],
    );
  }

  function rawPayload(): ItineraryFormData {
    return {
      title,
      description: description || undefined,
      destinationId,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      budget: budget ? Number(budget) : undefined,
      hotelIds,
      experienceIds,
      status: "PLANNED",
      isPublic,
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!authLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent("/trip-planner")}`);
      return;
    }

    const parsed = itineraryFormSchema.safeParse(rawPayload());

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Please check the trip plan");
      return;
    }

    setSaving(true);

    try {
      const response = await createItineraryAction(parsed.data);
      setNotice(
        response.message ||
          `${selectedDestination?.name || "Your trip"} was saved successfully`,
      );
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setBudget("");
      setHotelIds([]);
      setExperienceIds([]);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save itinerary",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
            Saved itinerary
          </p>
          <h2 className="mt-2 text-xl font-black">Build your Karnali trip</h2>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
          {user ? `Saving as ${user.fullName}` : "Login required to save"}
        </span>
      </div>

      {optionsError ? (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{optionsError}</span>
          <button type="button" onClick={() => void loadOptions()} className="font-bold underline">
            Retry
          </button>
        </div>
      ) : null}
      {error ? <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {notice ? <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{notice}</p> : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Trip title">
          <input value={title} onChange={(event) => setTitle(event.target.value)} className={inputClassName} placeholder="Rara summer plan" />
        </Field>
        <Field label="Destination">
          <select value={destinationId} onChange={(event) => setDestinationId(event.target.value)} disabled={optionsLoading} className={inputClassName}>
            <option value="">{optionsLoading ? "Loading destinations..." : "Select destination"}</option>
            {options.destinations.map((destination) => <option key={destination._id} value={destination._id}>{destination.name}{destination.district ? ` · ${destination.district}` : ""}</option>)}
          </select>
        </Field>
        <Field label="Start date">
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={inputClassName} />
        </Field>
        <Field label="End date">
          <input type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} className={inputClassName} />
        </Field>
        <Field label="Budget (NPR)">
          <input type="number" min="0" value={budget} onChange={(event) => setBudget(event.target.value)} className={inputClassName} placeholder="25000" />
        </Field>
        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-bold text-stone-700">
          <input type="checkbox" checked={isPublic} onChange={(event) => setIsPublic(event.target.checked)} className="h-4 w-4 accent-emerald-700" />
          Allow this itinerary to be public
        </label>
      </div>

      <Field label="Trip notes" className="mt-4">
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} className={`${inputClassName} min-h-28`} placeholder="Travel pace, group size, transport needs, or other notes" />
      </Field>

      <OptionChecklist title="Preferred stays" items={options.hotels} values={hotelIds} onToggle={(id) => toggleSelection(id, hotelIds, setHotelIds)} emptyText="No active stays are available." />
      <OptionChecklist title="Experiences" items={options.experiences} values={experienceIds} onToggle={(id) => toggleSelection(id, experienceIds, setExperienceIds)} emptyText="No active experiences are available." />

      <button type="submit" disabled={saving || authLoading || optionsLoading} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-800/15 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
        {saving ? "Saving itinerary..." : user ? "Save itinerary" : "Sign in to save itinerary"}
      </button>
    </form>
  );
}

function Field({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return <label className={`space-y-2 text-xs font-black uppercase tracking-[0.14em] text-stone-500 ${className}`}>{label}{children}</label>;
}

function OptionChecklist({ title, items, values, onToggle, emptyText }: { title: string; items: ItineraryReference[]; values: string[]; onToggle: (id: string) => void; emptyText: string }) {
  return (
    <fieldset className="mt-5">
      <legend className="text-xs font-black uppercase tracking-[0.14em] text-stone-500">{title}</legend>
      {items.length ? <div className="mt-3 grid max-h-40 gap-2 overflow-y-auto sm:grid-cols-2">{items.map((item) => <label key={item._id} className="flex items-start gap-3 rounded-2xl border border-stone-200 px-4 py-3 text-sm"><input type="checkbox" checked={values.includes(item._id)} onChange={() => onToggle(item._id)} className="mt-1 h-4 w-4 accent-emerald-700" /><span><strong className="block text-stone-900">{item.name}</strong><span className="text-xs text-stone-500">{item.location || item.address || item.category || "Karnali"}</span></span></label>)}</div> : <p className="mt-3 text-sm text-stone-500">{emptyText}</p>}
    </fieldset>
  );
}
