import { describe, expect, test, vi, beforeEach } from "vitest";
import { clearAuthCookies, getCookie, storeAuthCookies, storeUserCookie } from "../../lib/cookies";
import { cn, formatPrice, getInitials } from "@/lib/utils";
import {
  addTripDraftItem,
  emptyTripDraft,
  hasTripDraftItem,
  normalizeTripDraft,
  readTripDraft,
  removeTripDraftItem,
  subscribeToTripDraft,
  tripDraftCount,
  updateTripDraft,
  writeTripDraft,
} from "../../src/lib/trip-draft";

describe("utility helpers", () => {
  test.each([
    [undefined, "NPR", "On request"],
    [null, "NPR", "On request"],
    ["", "NPR", "On request"],
    [1200, "NPR", "NPR 1,200"],
    ["3500", "NPR", "NPR 3,500"],
    ["free", "NPR", "NPR free"],
    [99, "USD", "USD 99"],
  ])("formatPrice(%p, %s) returns %s", (value, currency, expected) => {
    expect(formatPrice(value as any, currency)).toBe(expected);
  });

  test.each([
    ["Pahuna", "P"],
    ["Sushant Dhakal", "SD"],
    ["  Karnali   Guide  ", "KG"],
    ["one two three", "OT"],
    ["", ""],
  ])("getInitials(%s) returns %s", (name, expected) => {
    expect(getInitials(name)).toBe(expected);
  });

  test("cn merges duplicate Tailwind classes", () => {
    expect(cn("px-2 text-sm", "px-4", false && "hidden")).toContain("px-4");
    expect(cn("px-2 text-sm", "px-4")).not.toContain("px-2");
  });
});

describe("auth cookie helpers", () => {
  beforeEach(() => {
    clearAuthCookies();
  });

  test("stores token and user cookies", () => {
    storeAuthCookies("qa-token", {
      id: "user-1",
      fullName: "QA User",
      email: "qa@example.com",
    });

    expect(getCookie("auth_token")).toBe("qa-token");
    expect(getCookie("user_data")).toContain("qa@example.com");
  });

  test("updates only user cookie", () => {
    storeUserCookie({
      id: "user-2",
      fullName: "Updated User",
      email: "updated@example.com",
    });

    expect(getCookie("user_data")).toContain("Updated User");
  });

  test("returns null for missing cookie", () => {
    expect(getCookie("missing_cookie")).toBeNull();
  });

  test("clears auth cookies", () => {
    storeAuthCookies("qa-token", {
      id: "user-1",
      fullName: "QA User",
      email: "qa@example.com",
    });

    clearAuthCookies();

    expect(getCookie("auth_token")).toBeNull();
    expect(getCookie("user_data")).toBeNull();
  });
});

describe("trip draft helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("normalizes missing draft to empty lists", () => {
    expect(normalizeTripDraft(undefined)).toEqual(emptyTripDraft);
  });

  test("normalizes duplicate and blank ids", () => {
    const draft = normalizeTripDraft({
      selectedDestinations: ["rara", "rara", "", "shey"],
      selectedStays: ["hotel-1", "hotel-1"],
      interests: ["Food", "Food", "Culture"],
    });

    expect(draft.selectedDestinations).toEqual(["rara", "shey"]);
    expect(draft.selectedStays).toEqual(["hotel-1"]);
    expect(draft.interests).toEqual(["Food", "Culture"]);
  });

  test("readTripDraft returns empty draft when storage is empty", () => {
    expect(readTripDraft()).toEqual(emptyTripDraft);
  });

  test("readTripDraft recovers from invalid JSON", () => {
    window.localStorage.setItem("pahuna.tripDraft.v1", "{bad json");
    expect(readTripDraft()).toEqual(emptyTripDraft);
  });

  test("writeTripDraft persists normalized draft", () => {
    const draft = writeTripDraft({
      ...emptyTripDraft,
      selectedDestinations: ["rara", "rara"],
    });

    expect(draft.selectedDestinations).toEqual(["rara"]);
    expect(readTripDraft().selectedDestinations).toEqual(["rara"]);
  });

  test("writeTripDraft dispatches update event", () => {
    const listener = vi.fn();
    window.addEventListener("pahuna:trip-draft-updated", listener);
    writeTripDraft({ ...emptyTripDraft, selectedStays: ["hotel-1"] });
    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener("pahuna:trip-draft-updated", listener);
  });

  test("updateTripDraft writes updater result", () => {
    updateTripDraft((draft) => ({ ...draft, selectedRouteId: "route-1" }));
    expect(readTripDraft().selectedRouteId).toBe("route-1");
  });

  test.each([
    ["selectedDestinations", "rara"],
    ["selectedStays", "hotel-1"],
    ["selectedFoodProviders", "cafe-1"],
    ["selectedExperiences", "exp-1"],
    ["interests", "Food"],
  ] as const)("addTripDraftItem adds unique %s", (key, id) => {
    addTripDraftItem(key, id);
    addTripDraftItem(key, id);
    expect(readTripDraft()[key]).toEqual([id]);
  });

  test.each([
    ["selectedDestinations", "rara"],
    ["selectedStays", "hotel-1"],
    ["selectedFoodProviders", "cafe-1"],
    ["selectedExperiences", "exp-1"],
    ["interests", "Food"],
  ] as const)("hasTripDraftItem detects %s membership", (key, id) => {
    addTripDraftItem(key, id);
    expect(hasTripDraftItem(key, id)).toBe(true);
    expect(hasTripDraftItem(key, "missing")).toBe(false);
  });

  test.each([
    ["selectedDestinations", "rara"],
    ["selectedStays", "hotel-1"],
    ["selectedFoodProviders", "cafe-1"],
    ["selectedExperiences", "exp-1"],
    ["interests", "Food"],
  ] as const)("removeTripDraftItem removes %s item", (key, id) => {
    addTripDraftItem(key, id);
    removeTripDraftItem(key, id);
    expect(readTripDraft()[key]).toEqual([]);
  });

  test("tripDraftCount includes destinations, stays, food, experiences, route and package", () => {
    const count = tripDraftCount({
      ...emptyTripDraft,
      selectedDestinations: ["rara"],
      selectedStays: ["hotel-1"],
      selectedFoodProviders: ["cafe-1"],
      selectedExperiences: ["exp-1"],
      selectedRouteId: "route-1",
      selectedPackageId: "package-1",
    });

    expect(count).toBe(6);
  });

  test("subscribeToTripDraft receives updates and can unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToTripDraft(listener);
    writeTripDraft({ ...emptyTripDraft, selectedDestinations: ["rara"] });
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ selectedDestinations: ["rara"] }));

    listener.mockClear();
    unsubscribe();
    writeTripDraft({ ...emptyTripDraft, selectedDestinations: ["shey"] });
    expect(listener).not.toHaveBeenCalled();
  });
});
