// @ts-nocheck
"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Loader2,
  MapPin,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { InquiryCollectorButton } from "@/components/inquiries/InquiryCollectorButton";
import {
  DESTINATION_DISTRICTS,
  DESTINATION_INTERESTS,
  LOCATION_PREFERENCES,
  REQUIRED_AMENITIES,
  STAY_PREFERENCES,
  TRAVEL_TYPES,
  type StayRecommenderResponse,
} from "@/lib/recommendations/stay-recommender";

const DEFAULT_FORM = {
  destinationDistrict: "",
  destinationInterest: "",
  checkIn: "",
  checkOut: "",
  budgetPerNightMin: "",
  budgetPerNightMax: "",
  numberOfGuests: "2",
  numberOfRooms: "1",
  travelType: "couple",
  requiredAmenities: [] as string[],
  locationPreference: "near route",
  routePlan: "",
  stayPreference: "standard",
};

type StayRecommenderForm = typeof DEFAULT_FORM;

function toNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function getTypeLabel(value: string) {
  return value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: StayRecommenderResponse["recommendations"][number];
}) {
  const initials = recommendation.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Card className="overflow-hidden border-slate-200/80 bg-white/95 shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[180px_minmax(0,1fr)]">
        <div className="relative flex min-h-45 items-end justify-between overflow-hidden bg-linear-to-br from-emerald-200 via-lime-100 to-amber-100 p-4 text-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.75),transparent_44%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_35%)]" />
          <div className="relative z-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-sm font-semibold shadow-sm backdrop-blur">
              {initials || recommendation.rank}
            </div>
            <Badge className="bg-slate-950 text-white hover:bg-slate-950">
              #{recommendation.rank}
            </Badge>
          </div>
          <div className="relative z-10 flex items-center gap-1 rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            {recommendation.rating != null ? recommendation.rating.toFixed(1) : "New"}
          </div>
        </div>

        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{getTypeLabel(recommendation.type)}</Badge>
            <Badge variant="outline">{recommendation.verificationLabel}</Badge>
            <Badge variant="outline" className="border-emerald-200 text-emerald-800">
              {recommendation.contactLabel}
            </Badge>
          </div>

          <div>
            <CardTitle className="text-xl">{recommendation.name}</CardTitle>
            <CardDescription className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {recommendation.district}
              </span>
              <span>*</span>
              <span>{recommendation.area}</span>
            </CardDescription>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Price from
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {recommendation.priceFrom != null
                  ? `${recommendation.currency} ${recommendation.priceFrom.toLocaleString()}`
                  : "Price on request"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Best fit
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {recommendation.bestFor.slice(0, 2).join(" * ") || "Flexible stay"}
              </p>
            </div>
          </div>

          <p className="text-sm leading-6 text-slate-700">{recommendation.aiExplanation}</p>

          <div className="flex flex-wrap gap-2">
            {recommendation.matchedReasons.slice(0, 3).map((reason) => (
              <Badge key={reason} variant="secondary" className="rounded-full">
                {reason}
              </Badge>
            ))}
          </div>

          {recommendation.missingInfoWarnings.length > 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {recommendation.missingInfoWarnings[0]}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild size="sm">
              <Link href={recommendation.ctas.viewDetails}>View Details</Link>
            </Button>
            <InquiryCollectorButton
              label="Send Inquiry"
              leadType="STAY_INQUIRY"
              selectedStay={`${recommendation.name} (${recommendation.slug})`}
              sourcePage="/hotels"
              leadSource="stay-recommender"
              defaultBudgetRange={
                recommendation.priceFrom
                  ? `${recommendation.currency} ${recommendation.priceFrom}+`
                  : undefined
              }
              defaultInterests={recommendation.matchedReasons.slice(0, 3)}
              size="sm"
              variant="outline"
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function StayRecommenderSection() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StayRecommenderResponse | null>(null);
  const [form, setForm] = useState<StayRecommenderForm>(DEFAULT_FORM);

  const amenitySummary = useMemo(() => {
    if (form.requiredAmenities.length === 0) return "No amenity preferences yet";
    return form.requiredAmenities.slice(0, 3).join(" * ");
  }, [form.requiredAmenities]);

  function updateField<K extends keyof StayRecommenderForm>(key: K, value: StayRecommenderForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleAmenity(amenity: string) {
    setForm((current) => ({
      ...current,
      requiredAmenities: current.requiredAmenities.includes(amenity)
        ? current.requiredAmenities.filter((item) => item !== amenity)
        : [...current.requiredAmenities, amenity],
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const budgetMin = toNumber(form.budgetPerNightMin);
    const budgetMax = toNumber(form.budgetPerNightMax);
    const normalizedBudgetMin = budgetMin != null && budgetMax != null ? Math.min(budgetMin, budgetMax) : budgetMin;
    const normalizedBudgetMax = budgetMin != null && budgetMax != null ? Math.max(budgetMin, budgetMax) : budgetMax;

    try {
      const response = await fetch("/api/ai/stay-recommender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationDistrict: form.destinationDistrict || undefined,
          destinationInterest: form.destinationInterest || undefined,
          travelDates:
            form.checkIn || form.checkOut
              ? { checkIn: form.checkIn || undefined, checkOut: form.checkOut || undefined }
              : undefined,
          budgetPerNightMin: normalizedBudgetMin,
          budgetPerNightMax: normalizedBudgetMax,
          numberOfGuests: Number(form.numberOfGuests) || 1,
          numberOfRooms: toNumber(form.numberOfRooms),
          travelType: form.travelType,
          requiredAmenities: form.requiredAmenities,
          locationPreference: form.locationPreference,
          routePlan: form.routePlan || undefined,
          stayPreference: form.stayPreference,
        }),
      });

      const payload = (await response.json()) as StayRecommenderResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Pahuna could not build recommendations right now.");
      }

      setResult(payload);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Pahuna could not build recommendations right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="py-10">
        <div className="rounded-[32px] border border-emerald-100/80 bg-linear-to-br from-emerald-50 via-white to-amber-50 p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <Badge className="w-fit rounded-full bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-600">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                AI stay recommender
              </Badge>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Not sure where to stay?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Tell Pahuna your route, budget, and stay style, and get a shortlist of suitable matches from
                  verified and public stay listings without changing the rest of the hotel experience.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">Route-aware filtering</span>
                <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">Budget + amenity matching</span>
                <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">Travel Concierge ready</span>
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-slate-950 p-5 text-white shadow-lg shadow-slate-950/10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Wand2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Find My Best Stay</p>
                  <p className="text-xs text-white/60">Polished cards, fast shortlist, no page redesign.</p>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm text-white/70">
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span>Suggested by route</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span>Matched to budget</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span>Sent to inquiry flow</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              <Button className="mt-5 w-full" size="lg" onClick={() => setOpen(true)}>
                Find My Best Stay
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl border-slate-200 p-0 sm:max-h-[90vh]">
          <div className="grid max-h-[90vh] gap-0 lg:grid-cols-[420px_minmax(0,1fr)]">
            <ScrollArea className="max-h-[90vh] lg:border-r lg:border-slate-200">
              <div className="space-y-6 p-6">
                <DialogHeader className="space-y-3 text-left">
                  <Badge className="w-fit rounded-full bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-600">
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    AI stay recommender
                  </Badge>
                  <div>
                    <DialogTitle className="text-2xl">Build your stay shortlist</DialogTitle>
                    <DialogDescription className="mt-2 text-sm leading-6">
                      Fill in the essentials and Pahuna will score stays by district, budget, route context, and
                      travel style.
                    </DialogDescription>
                  </div>
                </DialogHeader>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="destinationDistrict">Destination district</Label>
                      <select
                        id="destinationDistrict"
                        value={form.destinationDistrict}
                        onChange={(event) => updateField("destinationDistrict", event.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                      >
                        <option value="">Auto-detect from destination</option>
                        {DESTINATION_DISTRICTS.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destinationInterest">Destination interest</Label>
                      <select
                        id="destinationInterest"
                        value={form.destinationInterest}
                        onChange={(event) => updateField("destinationInterest", event.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                      >
                        <option value="">Choose a destination</option>
                        {DESTINATION_INTERESTS.map((destination) => (
                          <option key={destination} value={destination}>
                            {destination}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn">Check-in</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={form.checkIn}
                        onChange={(event) => updateField("checkIn", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOut">Check-out</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={form.checkOut}
                        onChange={(event) => updateField("checkOut", event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="budgetPerNightMin">Budget min per night</Label>
                      <Input
                        id="budgetPerNightMin"
                        type="number"
                        min="0"
                        placeholder="e.g. 2500"
                        value={form.budgetPerNightMin}
                        onChange={(event) => updateField("budgetPerNightMin", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetPerNightMax">Budget max per night</Label>
                      <Input
                        id="budgetPerNightMax"
                        type="number"
                        min="0"
                        placeholder="e.g. 8000"
                        value={form.budgetPerNightMax}
                        onChange={(event) => updateField("budgetPerNightMax", event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfGuests">Guests</Label>
                      <Input
                        id="numberOfGuests"
                        type="number"
                        min="1"
                        max="50"
                        value={form.numberOfGuests}
                        onChange={(event) => updateField("numberOfGuests", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfRooms">Rooms</Label>
                      <Input
                        id="numberOfRooms"
                        type="number"
                        min="1"
                        max="20"
                        value={form.numberOfRooms}
                        onChange={(event) => updateField("numberOfRooms", event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="travelType">Travel style</Label>
                      <select
                        id="travelType"
                        value={form.travelType}
                        onChange={(event) => updateField("travelType", event.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                      >
                        {TRAVEL_TYPES.map((travelType) => (
                          <option key={travelType} value={travelType}>
                            {getTypeLabel(travelType)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stayPreference">Stay preference</Label>
                      <select
                        id="stayPreference"
                        value={form.stayPreference}
                        onChange={(event) => updateField("stayPreference", event.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                      >
                        {STAY_PREFERENCES.map((preference) => (
                          <option key={preference} value={preference}>
                            {getTypeLabel(preference)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Required amenities</Label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {REQUIRED_AMENITIES.map((amenity) => {
                        const selected = form.requiredAmenities.includes(amenity);
                        return (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => toggleAmenity(amenity)}
                            className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                              selected
                                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            {amenity}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-500">{amenitySummary}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="locationPreference">Location preference</Label>
                    <select
                      id="locationPreference"
                      value={form.locationPreference}
                      onChange={(event) => updateField("locationPreference", event.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    >
                      {LOCATION_PREFERENCES.map((location) => (
                        <option key={location} value={location}>
                          {getTypeLabel(location)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="routePlan">Route or plan notes</Label>
                    <Textarea
                      id="routePlan"
                      rows={4}
                      placeholder="Example: Surkhet to Rara via Jumla, scenic stops, family-friendly pace"
                      value={form.routePlan}
                      onChange={(event) => updateField("routePlan", event.target.value)}
                    />
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                      {error}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Find My Best Stay
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setResult(null)}>
                      Clear results
                    </Button>
                  </div>
                </form>
              </div>
            </ScrollArea>

            <div className="min-h-0 bg-slate-50/70">
              <ScrollArea className="h-full max-h-[90vh]">
                <div className="space-y-6 p-6">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">Shortlist preview</h3>
                        <p className="text-sm text-slate-500">
                          Suitable matches will appear here as soon as Pahuna finishes scoring.
                        </p>
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} className="overflow-hidden border-slate-200 bg-white shadow-sm">
                          <div className="grid gap-0 lg:grid-cols-[180px_minmax(0,1fr)]">
                            <div className="min-h-45 animate-pulse bg-slate-200/80" />
                            <CardContent className="space-y-4 p-5">
                              <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200/90" />
                              <div className="h-7 w-3/4 animate-pulse rounded-full bg-slate-200/90" />
                              <div className="h-16 animate-pulse rounded-2xl bg-slate-200/90" />
                              <div className="flex gap-2">
                                <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200/90" />
                                <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200/90" />
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : result ? (
                    <div className="space-y-4">
                      <Card className="border-emerald-200 bg-emerald-50/70 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-xl">{result.summary}</CardTitle>
                          <CardDescription className="text-sm leading-6 text-emerald-900/80">
                            {result.disclaimer}
                          </CardDescription>
                        </CardHeader>
                      </Card>

                      {result.warnings.length > 0 ? (
                        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                          {result.warnings.join(" ")}
                        </div>
                      ) : null}

                      {result.recommendations.length > 0 ? (
                        result.recommendations.map((recommendation) => (
                          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                        ))
                      ) : (
                        <Card className="border-dashed border-slate-300 bg-white shadow-none">
                          <CardContent className="p-6 text-sm text-slate-600">
                            Pahuna could not find a strong match yet. Try widening the district, budget, or stay type.
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <Card className="border-dashed border-slate-300 bg-white shadow-none">
                      <CardContent className="flex min-h-65 flex-col items-start justify-center gap-4 p-6 text-slate-600">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-950">No recommendations yet</p>
                          <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                            Submit your preferences on the left and Pahuna will return a ranked shortlist of suitable
                            matches with inquiry links.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
