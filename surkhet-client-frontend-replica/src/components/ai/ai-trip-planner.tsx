"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  Compass,
  Loader2,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { InquiryCollector } from "@/components/inquiries/InquiryCollector";
import { BudgetPossibilitySlider } from "@/components/engagement/BudgetPossibilitySlider";
import { TripConfidenceScore } from "@/components/engagement/TripConfidenceScore";
import { VibeTripPlanner } from "@/components/engagement/VibeTripPlanner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  travelConciergeRequestSchema,
  travelConciergeResponseSchema,
  type TravelConciergeResponse,
  STARTING_CITIES,
  DESTINATION_INTERESTS,
  TRAVELER_TYPES,
  INTEREST_OPTIONS,
  TRANSPORT_PREFERENCES,
  STAY_PREFERENCES,
  FITNESS_LEVELS,
} from "@server/lib/ai/travel-concierge";
import { cn } from "@server/lib/utils";
import { unlockPassportBadge } from "@/lib/passport";

const formSchema = travelConciergeRequestSchema.omit({
  mode: true,
  plan: true,
  name: true,
  phone: true,
  email: true,
});

type PlannerFormValues = z.infer<typeof formSchema>;

const BUDGET_OPTIONS = [
  "Under NPR 5,000",
  "NPR 5,000 - 10,000",
  "NPR 10,000 - 20,000",
  "NPR 20,000 - 35,000",
  "NPR 35,000+",
];

export function AITripPlanner() {
  const [result, setResult] = useState<TravelConciergeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collectorOpen, setCollectorOpen] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<PlannerFormValues>({
    resolver: zodResolver(formSchema as never) as Resolver<PlannerFormValues>,
    defaultValues: {
      startingCity: "Surkhet",
      destinationInterest: "Surkhet",
      numberOfDays: 5,
      budgetRange: "NPR 10,000 - 20,000",
      travelersCount: 2,
      travelerType: "couple",
      interests: ["culture", "nature"],
      transportPreference: "bus",
      stayPreference: "standard",
      fitnessLevel: "easy",
    },
  });

  const selectedInterests = watch("interests");

  const interestOptions = useMemo(
    () => INTEREST_OPTIONS.map((interest) => ({
      value: interest,
      label: interest.charAt(0).toUpperCase() + interest.slice(1),
    })),
    [],
  );

  const onSubmit = async (values: PlannerFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/travel-concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, mode: "plan" }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? "Pahuna AI is unavailable right now.");
        setIsLoading(false);
        return;
      }

      const parsed = travelConciergeResponseSchema.safeParse(data);
      if (!parsed.success) {
        setError("Pahuna could not generate a reliable plan right now.");
        setIsLoading(false);
        return;
      }

      setResult(parsed.data);
      setCollectorOpen(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToInquiry = () => {
    setCollectorOpen(true);
  };

  useEffect(() => {
    if (searchParams.get("intent") === "inquiry") {
      setCollectorOpen(true);
    }
    const budget = searchParams.get("budget");
    if (budget) {
      setValue("budgetRange", budget, { shouldValidate: true });
    }
  }, [searchParams]);

  useEffect(() => {
    const destination = watch("destinationInterest");
    if (destination === "Rara") unlockPassportBadge("rara-dreamer");
    if (destination === "Jumla") unlockPassportBadge("sinja-story-hunter");
    if (destination === "Dailekh") unlockPassportBadge("panchakoshi-pilgrim");
    if (destination === "Dolpa") unlockPassportBadge("phoksundo-explorer");
    if (destination === "Humla" || destination === "Karnali Grand Circuit") {
      unlockPassportBadge("karnali-grand-circuit");
    }
  }, [watch("destinationInterest")]);

  const setInterestValue = (value: string) => {
    const current = selectedInterests ?? [];
    const exists = current.includes(value as (typeof INTEREST_OPTIONS)[number]);
    const next = exists
      ? current.filter((item) => item !== value)
      : [...current, value as (typeof INTEREST_OPTIONS)[number]];
    setValue("interests", next, { shouldValidate: true });
  };

  const useVibe = (vibe: { id: string; label: string; budget: string }) => {
    if (vibe.id === "adventure") {
      setValue("destinationInterest", "Rara", { shouldValidate: true });
      setValue("fitnessLevel", "moderate", { shouldValidate: true });
      setInterestValue("adventure");
    }
    if (vibe.id === "culture" || vibe.id === "food") {
      setValue("destinationInterest", "Jumla", { shouldValidate: true });
      setInterestValue("culture");
    }
    if (vibe.id === "family" || vibe.id === "budget") {
      setValue("destinationInterest", "Surkhet", { shouldValidate: true });
      setValue("fitnessLevel", "easy", { shouldValidate: true });
    }
    if (vibe.id === "spiritual") {
      setValue("destinationInterest", "Dailekh", { shouldValidate: true });
      setInterestValue("religious");
    }
    if (vibe.id === "premium" || vibe.id === "hidden") {
      setValue("destinationInterest", "Karnali Grand Circuit", { shouldValidate: true });
      setValue("numberOfDays", 7, { shouldValidate: true });
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <Card ref={formRef} className="rounded-3xl border-amber-100/70 bg-amber-50/40">
        <CardHeader className="gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Sparkles className="h-3 w-3" /> AI Trip Planner
            </Badge>
          </div>
          <CardTitle className="text-2xl">Tell us your Karnali plan</CardTitle>
          <p className="text-sm text-muted-foreground">
            Share your travel style, budget, and interests. Pahuna AI will build
            a day-wise Karnali route grounded in real platform data.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Starting city</label>
                <Select
                  defaultValue="Surkhet"
                  onValueChange={(value) =>
                    setValue("startingCity", value as (typeof STARTING_CITIES)[number], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select starting city" />
                  </SelectTrigger>
                  <SelectContent>
                    {STARTING_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>   
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination interest</label>
                <Select
                  defaultValue="Surkhet"
                  onValueChange={(value) =>
                    setValue("destinationInterest", value as (typeof DESTINATION_INTERESTS)[number], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {DESTINATION_INTERESTS.map((destination) => (
                      <SelectItem key={destination} value={destination}>
                        {destination}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of days</label>
                <Input
                  type="number"
                  min={1}
                  max={21}
                  defaultValue={5}
                  {...register("numberOfDays", { valueAsNumber: true })}
                />
                {errors.numberOfDays && (
                  <p className="text-xs text-destructive">
                    {errors.numberOfDays.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget range</label>
                <Select
                  defaultValue="NPR 10,000 - 20,000"
                  onValueChange={(value) =>
                    setValue("budgetRange", value as string, { shouldValidate: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_OPTIONS.map((budget) => (
                      <SelectItem key={budget} value={budget}>
                        {budget}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Travelers</label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  defaultValue={2}
                  {...register("travelersCount", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Traveler type</label>
                <Select
                  defaultValue="couple"
                  onValueChange={(value) =>
                    setValue("travelerType", value as (typeof TRAVELER_TYPES)[number], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select traveler type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVELER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <VibeTripPlanner
              compact
              title="Choose a planning vibe"
              subtitle="Use a vibe to quickly tune destination, interests, and difficulty."
              onUseVibe={useVibe}
            />

            <div className="space-y-3">
              <label className="text-sm font-medium">Interests</label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest.value}
                    type="button"
                    onClick={() => setInterestValue(interest.value)}
                    className={cn(
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition",
                      selectedInterests?.includes(interest.value)
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-emerald-100 bg-emerald-50/70 text-emerald-800 hover:border-emerald-200",
                    )}
                  >
                    {interest.label}
                  </button>
                ))}
              </div>
              {errors.interests && (
                <p className="text-xs text-destructive">
                  {errors.interests.message}
                </p>
              )}
            </div>

            <BudgetPossibilitySlider
              compact
              onBudgetSelect={(budgetRange) =>
                setValue("budgetRange", budgetRange, { shouldValidate: true })
              }
            />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Transport preference</label>
                <Select
                  defaultValue="bus"
                  onValueChange={(value) =>
                    setValue("transportPreference", value as (typeof TRANSPORT_PREFERENCES)[number], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSPORT_PREFERENCES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stay preference</label>
                <Select
                  defaultValue="standard"
                  onValueChange={(value) =>
                    setValue("stayPreference", value as (typeof STAY_PREFERENCES)[number], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stay" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAY_PREFERENCES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fitness level</label>
                <Select
                  defaultValue="easy"
                  onValueChange={(value) =>
                    setValue("fitnessLevel", value as (typeof FITNESS_LEVELS)[number], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fitness" />
                  </SelectTrigger>
                  <SelectContent>
                    {FITNESS_LEVELS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Planning your Karnali trip...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Compass className="h-4 w-4" /> Start AI Trip Plan
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-3xl border border-emerald-100/80">
          <CardHeader>
            <CardTitle className="text-xl">Your AI Plan</CardTitle>
            <p className="text-sm text-muted-foreground">
              This plan is grounded in verified Pahuna data. Adjust the form and
              regenerate anytime.
            </p>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="rounded-2xl border border-dashed bg-muted/30 p-6 text-sm text-muted-foreground">
                Submit the form to generate your tailored Karnali trip plan.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl border bg-white p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <p className="font-semibold">Trip summary</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {result.summary}
                  </p>
                  <TripConfidenceScore
                    context={`${watch("destinationInterest")} ${result.difficultyScore} ${result.warnings.join(" ")}`}
                    difficulty={result.difficultyScore}
                    familyFriendly={result.familyFriendliness === "HIGH"}
                    compact
                    className="mt-3"
                  />
                </div>

                <div className="grid gap-4">
                  <Card className="rounded-2xl border">
                    <CardHeader>
                      <CardTitle className="text-base">Recommended route</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {result.recommendedRoute.length === 0 ? (
                        <p className="text-muted-foreground">
                          Pahuna needs to verify this detail.
                        </p>
                      ) : (
                        result.recommendedRoute.map((step) => (
                          <div
                            key={`${step.step}-${step.from}-${step.to}`}
                            className="rounded-xl border bg-muted/20 p-3"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">
                                Step {step.step}: {step.from} to {step.to}
                              </p>
                              <Badge variant="outline">{step.mode}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Duration: {step.durationRange} · Cost: {step.costRange}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {step.reliability} reliability · {step.notes}
                            </p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border">
                    <CardHeader>
                      <CardTitle className="text-base">Day-wise itinerary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {result.days.length === 0 ? (
                        <p className="text-muted-foreground">
                          Pahuna needs to verify this detail.
                        </p>
                      ) : (
                        result.days.map((day) => (
                          <div key={day.day} className="rounded-xl border bg-white p-3">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">
                                Day {day.day}: {day.title}
                              </p>
                              <Badge variant="outline">{day.estimatedDailyCostRange}</Badge>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Morning: {day.morning}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Afternoon: {day.afternoon}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Evening: {day.evening}
                            </p>
                            {day.suggestedDestinations.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {day.suggestedDestinations.map((destination) => (
                                  <Badge key={destination} variant="secondary">
                                    {destination}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="rounded-2xl border">
                      <CardHeader>
                        <CardTitle className="text-base">Suggested stays</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        {result.suggestedStays.length === 0 ? (
                          <p className="text-muted-foreground">
                            Pahuna needs to verify this detail.
                          </p>
                        ) : (
                          result.suggestedStays.map((stay) => (
                            <div key={stay.slug} className="rounded-xl border bg-white p-3">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold">{stay.name}</p>
                                <Badge variant="outline">{stay.verificationLabel}</Badge>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {stay.type} · {stay.district}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {stay.area} · {stay.currency} {stay.priceFrom ?? "—"}
                              </p>
                              <p className="mt-2 text-xs text-muted-foreground">
                                {stay.reason}
                              </p>
                              <p className="mt-2 text-xs font-medium text-primary">
                                Contact via Pahuna Inquiry
                              </p>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl border">
                      <CardHeader>
                        <CardTitle className="text-base">Suggested services</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        {result.suggestedServices.length === 0 ? (
                          <p className="text-muted-foreground">
                            Pahuna needs to verify this detail.
                          </p>
                        ) : (
                          result.suggestedServices.map((service) => (
                            <div key={service.slug} className="rounded-xl border bg-white p-3">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold">{service.name}</p>
                                <Badge variant="outline">{service.verificationLabel}</Badge>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {service.type} · {service.district}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {service.area}
                              </p>
                              <p className="mt-2 text-xs text-muted-foreground">
                                {service.reason}
                              </p>
                              <p className="mt-2 text-xs font-medium text-primary">
                                Contact via Pahuna Inquiry
                              </p>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="rounded-2xl border">
                    <CardHeader>
                      <CardTitle className="text-base">Suggested food stops</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {result.suggestedFoodProviders.length === 0 ? (
                        <p className="text-muted-foreground">
                          Pahuna needs to verify this detail.
                        </p>
                      ) : (
                        result.suggestedFoodProviders.map((provider) => (
                          <div key={provider.slug} className="rounded-xl border bg-white p-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold">{provider.name}</p>
                              <Badge variant="outline">{provider.verificationLabel}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {provider.type.replace(/_/g, " ")} Â· {provider.area}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {provider.cuisines.slice(0, 3).map((cuisine) => (
                                <Badge key={cuisine} variant="secondary">
                                  {cuisine}
                                </Badge>
                              ))}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {provider.reason}
                            </p>
                            <p className="mt-2 text-xs font-medium text-primary">
                              Contact via Pahuna Inquiry
                            </p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border">
                    <CardHeader>
                      <CardTitle className="text-base">Estimated cost range</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm md:grid-cols-2">
                      <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs text-muted-foreground">Transport</p>
                        <p className="font-semibold">{result.estimatedCost.transport}</p>
                      </div>
                      <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs text-muted-foreground">Stay</p>
                        <p className="font-semibold">{result.estimatedCost.stay}</p>
                      </div>
                      <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs text-muted-foreground">Food</p>
                        <p className="font-semibold">{result.estimatedCost.food}</p>
                      </div>
                      <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="text-xs text-muted-foreground">Activities</p>
                        <p className="font-semibold">{result.estimatedCost.activities}</p>
                      </div>
                      <div className="rounded-xl border bg-primary/10 p-3 md:col-span-2">
                        <p className="text-xs text-muted-foreground">Total range</p>
                        <p className="text-lg font-semibold">{result.estimatedCost.totalRange}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border">
                    <CardHeader>
                      <CardTitle className="text-base">Warnings & notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      {result.warnings.length > 0 ? (
                        result.warnings.map((warning) => (
                          <div key={warning} className="flex items-start gap-2">
                            <Star className="mt-0.5 h-3.5 w-3.5 text-primary" />
                            <span>{warning}</span>
                          </div>
                        ))
                      ) : (
                        <p>Routes and availability require local confirmation.</p>
                      )}
                      <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 p-3 text-xs">
                        {result.disclaimer}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={scrollToForm}>
                    Edit Plan
                  </Button>
                  <Button variant="secondary" onClick={handleSubmit(onSubmit)}>
                    Regenerate
                  </Button>
                  <Button onClick={scrollToInquiry}>
                    Send this plan to Pahuna
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={scrollToInquiry}>
                    Convert to inquiry
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <InquiryCollector
          open={collectorOpen}
          onOpenChange={setCollectorOpen}
          leadType="TRIP_PLAN"
          sourcePage="/ai-trip-planner"
          leadSource={result ? "ai-trip-planner-result" : "floating-assistant"}
          selectedDestination={String(watch("destinationInterest") ?? "")}
          generatedPlanJson={result ?? undefined}
          defaultBudgetRange={String(watch("budgetRange") ?? "")}
          defaultTravelersCount={Number(watch("travelersCount") ?? 1)}
          defaultInterests={watch("interests")}
        />
      </div>
    </div>
  );
}


