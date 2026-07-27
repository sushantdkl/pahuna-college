"use client";

export type TripDraft = {
  selectedVibe?: string;
  selectedRouteId?: string;
  selectedPackageId?: string;
  selectedDestinations: string[];
  selectedStays: string[];
  selectedFoodProviders: string[];
  selectedExperiences: string[];
  durationDays?: number;
  travelers?: number;
  budgetMin?: number;
  budgetMax?: number;
  interests: string[];
};

export type TripDraftListKey =
  | "selectedDestinations"
  | "selectedStays"
  | "selectedFoodProviders"
  | "selectedExperiences"
  | "interests";

const storageKey = "pahuna.tripDraft.v1";
const draftEvent = "pahuna:trip-draft-updated";

export const emptyTripDraft: TripDraft = {
  selectedDestinations: [],
  selectedStays: [],
  selectedFoodProviders: [],
  selectedExperiences: [],
  interests: [],
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function unique(values: unknown[]) {
  return Array.from(
    new Set(values.filter((value): value is string => typeof value === "string" && value.trim().length > 0)),
  );
}

export function normalizeTripDraft(value: Partial<TripDraft> | null | undefined): TripDraft {
  return {
    ...emptyTripDraft,
    ...value,
    selectedDestinations: unique(value?.selectedDestinations || []),
    selectedStays: unique(value?.selectedStays || []),
    selectedFoodProviders: unique(value?.selectedFoodProviders || []),
    selectedExperiences: unique(value?.selectedExperiences || []),
    interests: unique(value?.interests || []),
  };
}

export function readTripDraft(): TripDraft {
  if (!canUseStorage()) return emptyTripDraft;

  try {
    return normalizeTripDraft(JSON.parse(window.localStorage.getItem(storageKey) || "null"));
  } catch {
    return emptyTripDraft;
  }
}

export function writeTripDraft(nextDraft: TripDraft) {
  const normalized = normalizeTripDraft(nextDraft);
  if (canUseStorage()) {
    window.localStorage.setItem(storageKey, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent(draftEvent, { detail: normalized }));
  }
  return normalized;
}

export function updateTripDraft(updater: (draft: TripDraft) => TripDraft) {
  return writeTripDraft(updater(readTripDraft()));
}

export function hasTripDraftItem(key: TripDraftListKey, id: string) {
  return readTripDraft()[key].includes(id);
}

export function addTripDraftItem(key: TripDraftListKey, id: string) {
  return updateTripDraft((draft) => ({
    ...draft,
    [key]: unique([...draft[key], id]),
  }));
}

export function removeTripDraftItem(key: TripDraftListKey, id: string) {
  return updateTripDraft((draft) => ({
    ...draft,
    [key]: draft[key].filter((value) => value !== id),
  }));
}

export function tripDraftCount(draft = readTripDraft()) {
  return (
    draft.selectedDestinations.length +
    draft.selectedStays.length +
    draft.selectedFoodProviders.length +
    draft.selectedExperiences.length +
    (draft.selectedRouteId ? 1 : 0) +
    (draft.selectedPackageId ? 1 : 0)
  );
}

export function subscribeToTripDraft(listener: (draft: TripDraft) => void) {
  if (!canUseStorage()) return () => undefined;
  const handler = (event: Event) => {
    listener((event as CustomEvent<TripDraft>).detail || readTripDraft());
  };
  window.addEventListener(draftEvent, handler);
  return () => window.removeEventListener(draftEvent, handler);
}
