"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, MapPinned, Sparkles, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { createInquiryApi } from "@/lib/api/inquiries";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { updateTripDraft } from "@/lib/trip-draft";

const PLANNER_STEPS = [
  {
    title: "Where do you want to go?",
    icon: MapPinned,
    field: "destination",
    mode: "append",
    options: ["Surkhet", "Rara", "Dailekh", "Jumla", "Dolpa / Phoksundo", "Humla", "Karnali Grand Circuit"],
  },
  {
    title: "How many days?",
    icon: Compass,
    field: "days",
    mode: "replace",
    options: ["1 day", "2-3 days", "4-5 days", "7+ days"],
  },
  {
    title: "Budget range",
    icon: WalletCards,
    field: "budget",
    mode: "replace",
    options: ["Budget", "Standard", "Premium", "Custom"],
  },
  {
    title: "Travel style",
    icon: Sparkles,
    field: "interests",
    mode: "append",
    options: ["Family", "Culture", "Nature", "Religious", "Food", "Adventure", "Photography"],
  },
] as const;

const initialPlan = {
  startingCity: "",
  destination: "",
  days: "",
  budget: "",
  travelerType: "",
  interests: "",
  transport: "",
};

type PlanForm = typeof initialPlan;
type PlanField = keyof PlanForm;

const fields: Array<{
  name: PlanField;
  label: string;
  placeholder: string;
  className?: string;
}> = [
  { name: "startingCity", label: "Starting city", placeholder: "Kathmandu, Nepalgunj, Surkhet" },
  { name: "destination", label: "Destination", placeholder: "Surkhet, Rara, Jumla, Dolpa" },
  { name: "days", label: "Days", placeholder: "3" },
  { name: "budget", label: "Budget range", placeholder: "NPR 15,000-30,000" },
  { name: "travelerType", label: "Traveler type", placeholder: "Solo, family, group" },
  { name: "interests", label: "Interests", placeholder: "Food, temples, lakes, trekking", className: "md:col-span-2" },
  { name: "transport", label: "Transport preference", placeholder: "Flight, bus, jeep, mixed" },
];

function appendValue(current: string, next: string) {
  const values = current
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (values.includes(next)) {
    return values.filter((value) => value !== next).join(", ");
  }

  return [...values, next].join(", ");
}

function formatPlanMessage(plan: PlanForm) {
  const value = (field: PlanField) => plan[field].trim() || "Not provided";

  return [
    "Source: Simple Trip Planner",
    "",
    `Starting city: ${value("startingCity")}`,
    `Destination: ${value("destination")}`,
    `Days: ${value("days")}`,
    `Budget range: ${value("budget")}`,
    `Traveler type: ${value("travelerType")}`,
    `Interests: ${value("interests")}`,
    `Transport preference: ${value("transport")}`,
  ].join("\n");
}

export function SimplePlannerSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading } = useAuth();
  const initialDestination = titleCaseFromSlug(searchParams.get("destination") || "");
  const [plan, setPlan] = useState<PlanForm>(() => ({
    ...initialPlan,
    destination: initialDestination,
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const packageSlug = searchParams.get("package");
    if (!packageSlug) return;

    updateTripDraft((draft) => ({ ...draft, selectedPackageId: packageSlug }));
    toast.success("Package selected in your trip planner");
  }, [searchParams]);

  const title = useMemo(() => {
    const destination = plan.destination.trim();
    return destination
      ? `Trip planner request: ${destination.slice(0, 120)}`
      : "Trip planner request";
  }, [plan.destination]);

  const updateField = (name: PlanField, value: string) => {
    setPlan((current) => ({ ...current, [name]: value }));
  };

  const chooseOption = (field: PlanField, mode: "append" | "replace", option: string) => {
    setPlan((current) => ({
      ...current,
      [field]: mode === "append" ? appendValue(current[field], option) : option,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");
    setError("");

    if (loading) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent("/trip-planner#planner")}`);
      return;
    }

    const hasPlanDetails = Object.values(plan).some((value) => value.trim());

    if (!hasPlanDetails) {
      setError("Add at least one trip detail before sending the plan.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createInquiryApi({
        title,
        inquiryType: "TRAVEL_SUPPORT",
        message: formatPlanMessage(plan),
      });
      setNotice("Your plan was sent to Pahuna and is now available in admin leads.");
      setPlan(initialPlan);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send this plan. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="planner" className="py-14">
      <Container>
        <div className="rounded-3xl border border-emerald-100 bg-amber-50/50 p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
              Simple planner
            </p>
            <h2 className="mt-1 text-2xl font-bold">Choose your trip shape</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick the destination, days, budget, and travel style first. Then use the brief below to send your plan to Pahuna.
            </p>
          </div>
          <div className="mb-6 grid gap-4 lg:grid-cols-4">
            {PLANNER_STEPS.map(({ title: stepTitle, icon: Icon, field, mode, options }) => (
              <div key={stepTitle} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-semibold">{stepTitle}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => chooseOption(field, mode, option)}
                      className="rounded-full"
                    >
                      <Badge variant="outline" className="bg-emerald-50/60 text-emerald-900 hover:bg-emerald-100">
                        {option}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-4">
            {fields.map(({ name, label, placeholder, className }) => (
              <label key={name} className={className}>
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <input
                  name={name}
                  value={plan[name]}
                  onChange={(event) => updateField(name, event.target.value)}
                  placeholder={placeholder}
                  className="mt-1 h-11 w-full rounded-xl border border-emerald-100 bg-white px-3 text-sm outline-none transition focus:border-primary"
                />
              </label>
            ))}
            <div className="flex items-end">
              <Button type="submit" disabled={isSubmitting || loading} className="h-11 w-full">
                {isSubmitting ? "Sending..." : "Send this plan"}
              </Button>
            </div>
          </form>
          {notice ? (
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              {notice}
            </p>
          ) : null}
          {error ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function titleCaseFromSlug(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
