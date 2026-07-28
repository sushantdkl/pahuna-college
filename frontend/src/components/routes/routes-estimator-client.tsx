// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { ConsentStatus, TravelMode, VerificationStatus } from "@/lib/prisma-types";
import {
  AlertTriangle,
  ArrowRight,
  Bus,
  CheckCircle,
  Clock,
  MapPin,
  Plane,
  Route,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RouteOption, RouteStep } from "@/lib/services/routes";
import { cn } from "@/lib/utils";
import { assets, getImageOrPlaceholder } from "@/lib/assets";
import { updateTripDraft } from "@/lib/trip-draft";

type SuggestedProvider = {
  name: string;
  slug: string;
  typeLabel: string;
  district: string;
  area?: string | null;
  verificationStatus: VerificationStatus;
  consentStatus: ConsentStatus;
  services: string[];
};

interface RoutesEstimatorClientProps {
  routeOptions: RouteOption[];
  featuredOptions: RouteOption[];
  providerSuggestionsByDistrict: Record<string, SuggestedProvider[]>;
}

const fromOptions = ["Kathmandu", "Nepalgunj", "Surkhet"];
const ROUTE_DATA_DISCLAIMER =
  "Final fare depends on season, road condition, weather, and operator schedule.";
const ROUTE_MODE_LABELS: Record<TravelMode, string> = {
  FLIGHT: "Flight",
  BUS: "Bus",
  JEEP: "Jeep",
  WALK: "Walk",
  TREK: "Trek",
  MIXED: "Mixed",
};
const toOptions = [
  "Surkhet",
  "Dailekh",
  "Rara",
  "Jumla",
  "Dolpa",
  "Humla",
  "Salyan",
  "Jajarkot",
  "Rukum West",
];
const travelStyles = ["Budget", "Standard", "Premium"];
const groupTypes = ["Solo", "Couple", "Family", "Friends", "Business"];

const ROUTE_IMAGES: Record<string, string> = {
  "direct-kathmandu-to-surkhet-flight": assets.hero.surkhet,
  "direct-kathmandu-to-surkhet-bus": assets.karnali.karnaliRiver,
  "direct-surkhet-to-dailekh-road": assets.karnali.mahabuDailekh,
  "surkhet-to-rara-road": assets.karnali.raraLake,
  "direct-surkhet-to-humla-simikot-flight": assets.karnali.karnaliRiver2,
  "nepalgunj-to-phoksundo": assets.karnali.phoksundoLake,
};

export function RoutesEstimatorClient({
  routeOptions,
  featuredOptions,
  providerSuggestionsByDistrict,
}: RoutesEstimatorClientProps) {
  const searchParams = useSearchParams();
  const initialRoute = routeOptions.find((item) => item.id === searchParams.get("routeId"));
  const [from, setFrom] = useState(initialRoute?.from || "Surkhet");
  const [to, setTo] = useState(initialRoute?.to || "Rara");
  const [mode, setMode] = useState<"ANY" | TravelMode>("ANY");
  const [travelStyle, setTravelStyle] = useState("Standard");
  const [groupType, setGroupType] = useState("Family");

  const matchingOptions = useMemo(() => {
    const options = routeOptions.filter((option) => option.from === from && option.to === to);
    if (mode === "ANY") return options;
    return options.filter((option) => option.steps.some((step) => step.mode === mode));
  }, [from, mode, routeOptions, to]);

  function useRoute(option: RouteOption) {
    setFrom(option.from);
    setTo(option.to);
    setMode("ANY");
    updateTripDraft((draft) => ({ ...draft, selectedRouteId: option.id }));
    document.getElementById("route-builder")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="space-y-12">
      <section id="route-builder" className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm md:p-8">
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Route selector
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              Build a cautious Karnali travel plan
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Choose a gateway, destination, route mode, travel style, and group type.
              Estimates are planning references and must be confirmed before booking.
            </p>
          </div>
          <Badge variant="outline" className="w-fit bg-primary/5 px-3 py-1.5 text-primary">
            Surkhet gateway focused
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SelectField label="From" value={from} onChange={setFrom} options={fromOptions} />
          <SelectField label="To" value={to} onChange={setTo} options={toOptions} />
          <SelectField
            label="Mode"
            value={mode}
            onChange={(value) => setMode(value as "ANY" | TravelMode)}
            options={["ANY", "FLIGHT", "BUS", "JEEP", "TREK", "MIXED"]}
            labels={{ ANY: "Any", ...ROUTE_MODE_LABELS }}
          />
          <SelectField
            label="Travel style"
            value={travelStyle}
            onChange={setTravelStyle}
            options={travelStyles}
          />
          <SelectField
            label="Group type"
            value={groupType}
            onChange={setGroupType}
            options={groupTypes}
          />
        </div>

        <div className="mt-8 space-y-5">
          {matchingOptions.length > 0 ? (
            matchingOptions.map((option) => (
              <RouteOptionPanel
                key={option.id}
                option={option}
                travelStyle={travelStyle}
                groupType={groupType}
                providers={providerSuggestionsByDistrict[option.destinationDistrict] ?? []}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-muted/30 p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <AlertTriangle className="h-8 w-8 shrink-0 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold">
                    This route requires local confirmation
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Pahuna can help verify transport options for {from} to {to}.
                    Try another mode preference or use the inquiry CTA for a custom route.
                  </p>
                  <Button asChild className="mt-5">
                    <Link href={`/contact?route=${encodeURIComponent(`${from} to ${to}`)}`}>
                      Request route help
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Featured route cards
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              Common Karnali route options
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Use these cards as a starting point. Weather, road condition, and operator
            schedules can change the final plan.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredOptions.map((option) => (
            <FeaturedRouteCard key={option.id} option={option} onUseRoute={useRoute} />
          ))}
        </div>
      </section>

      <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 text-sm leading-relaxed text-amber-950 shadow-sm">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            {ROUTE_DATA_DISCLAIMER} Pahuna estimates are for planning only and
            must be confirmed before booking.
          </p>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  labels?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm font-medium outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels?.[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function RouteOptionPanel({
  option,
  providers,
  travelStyle,
  groupType,
}: {
  option: RouteOption;
  providers: SuggestedProvider[];
  travelStyle: string;
  groupType: string;
}) {
  const plannerHref = `/trip-planner?from=${encodeURIComponent(option.from)}&to=${encodeURIComponent(option.to)}&style=${encodeURIComponent(travelStyle)}&group=${encodeURIComponent(groupType)}`;

  return (
    <article className="overflow-hidden rounded-3xl border border-border/70 bg-background shadow-sm">
      <div className="border-b border-border/70 bg-linear-to-r from-emerald-50 via-amber-50/70 to-background p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <ReliabilityBadge reliability={option.reliability} label={option.reliabilityLabel} />
              {option.requiresConfirmation && (
                <Badge variant="outline" className="bg-white/80 text-amber-800">
                  Requires confirmation
                </Badge>
              )}
              {option.incomplete && (
                <Badge variant="outline" className="bg-white/80 text-muted-foreground">
                  Partial route
                </Badge>
              )}
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{option.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {option.summary}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-80">
            <MetricCard icon={<Clock className="h-4 w-4" />} label="Time range" value={option.durationLabel} />
            <MetricCard icon={<Wallet className="h-4 w-4" />} label="Cost range" value={option.costLabel} />
          </div>
        </div>
        {option.costNote && (
          <p className="mt-4 rounded-2xl bg-white/80 px-4 py-3 text-sm text-muted-foreground">
            {option.costNote}
          </p>
        )}
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_22rem] md:p-6">
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Route steps
          </h4>
          <div className="space-y-3">
            {option.steps.map((step, index) => (
              <RouteStepRow key={step.id} step={step} index={index + 1} />
            ))}
          </div>

          {option.recommendedStopovers.length > 0 && (
            <div className="mt-5 rounded-2xl bg-muted/40 p-4">
              <p className="text-sm font-semibold">Recommended stopover</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {option.recommendedStopovers.join(" / ")}
              </p>
            </div>
          )}

          {option.riskNotes.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Risk notes
              </h4>
              <ul className="space-y-2">
                {option.riskNotes.slice(0, 5).map((note) => (
                  <li key={note} className="flex gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card p-4">
            <p className="text-sm font-semibold">Planner context</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <span className="rounded-xl bg-muted/50 px-3 py-2 text-muted-foreground">
                {travelStyle}
              </span>
              <span className="rounded-xl bg-muted/50 px-3 py-2 text-muted-foreground">
                {groupType}
              </span>
            </div>
            <Button asChild className="mt-4 w-full">
              <Link href={plannerHref}>
                Build itinerary
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <ProviderSuggestions providers={providers} district={option.destinationDistrict} />
        </aside>
      </div>
    </article>
  );
}

function FeaturedRouteCard({
  option,
  onUseRoute,
}: {
  option: RouteOption;
  onUseRoute: (option: RouteOption) => void;
}) {
  const image = getImageOrPlaceholder(ROUTE_IMAGES[option.id], "route");

  return (
    <article className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] bg-muted">
        <Image
          src={image}
          alt={`${option.title} route scenery`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
          <ModeIcon mode={option.steps[0]?.mode ?? "MIXED"} />
          <ReliabilityBadge reliability={option.reliability} label={option.reliabilityLabel} />
        </div>
      </div>
      <div className="p-5">
      <h3 className="text-xl font-semibold tracking-tight">{option.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {option.steps[0]?.notes ?? "Route requires current local confirmation before planning."}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <MetricCard icon={<Clock className="h-4 w-4" />} label="Time" value={option.durationLabel} compact />
        <MetricCard icon={<Wallet className="h-4 w-4" />} label="Cost" value={option.costLabel} compact />
      </div>

      <Button className="mt-5 w-full" variant="outline" onClick={() => onUseRoute(option)}>
        Use this route
        <ArrowRight className="h-4 w-4" />
      </Button>
      </div>
    </article>
  );
}

function RouteStepRow({ step, index }: { step: RouteStep; index: number }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {index}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">
                {step.from} to {step.to}
              </p>
              <Badge variant="secondary">{step.modeLabel}</Badge>
              {step.external && <Badge variant="outline">External connection</Badge>}
            </div>
            {step.notes && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.notes}
              </p>
            )}
          </div>
        </div>
        <div className="grid min-w-48 grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="rounded-xl bg-muted/50 px-3 py-2">
            {stepDuration(step)}
          </span>
          <span className="rounded-xl bg-muted/50 px-3 py-2">
            {stepCost(step)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProviderSuggestions({
  providers,
  district,
}: {
  providers: SuggestedProvider[];
  district: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">Suggested stays/services</p>
      </div>
      {providers.length > 0 ? (
        <div className="space-y-3">
          {providers.slice(0, 4).map((provider) => (
            <Link
              key={provider.slug}
              href={`/hotels/${provider.slug}`}
              className="block rounded-2xl border border-border/60 bg-background p-3 transition hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{provider.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {provider.typeLabel} {provider.area ? ` / ${provider.area}` : ""}
                  </p>
                </div>
                <ProviderTrustBadge status={provider.verificationStatus} />
              </div>
              {provider.consentStatus === "PENDING" && (
                <p className="mt-2 text-xs font-medium text-primary">
                  Contact via Pahuna Inquiry
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Nearby stays and services are being verified by Pahuna for {district}.
        </p>
      )}
    </div>
  );
}

function ProviderTrustBadge({ status }: { status: VerificationStatus }) {
  if (status === "VERIFIED" || status === "PARTNER") {
    return (
      <Badge className="bg-emerald-600 text-white">
        <CheckCircle className="h-3 w-3" />
        Verified
      </Badge>
    );
  }

  if (status === "PUBLIC_LISTING") {
    return <Badge variant="secondary">Public Listing</Badge>;
  }

  return null;
}

function MetricCard({
  icon,
  label,
  value,
  compact,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card p-4", compact && "p-3")}>
      <div className="mb-2 flex items-center gap-2 text-primary">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-snug">{value}</p>
    </div>
  );
}

function ReliabilityBadge({
  reliability,
  label,
}: {
  reliability: string;
  label: string;
}) {
  return (
    <Badge
      className={cn(
        reliability === "HIGH" && "bg-emerald-600 text-white",
        reliability === "MEDIUM" && "bg-amber-500 text-white",
        reliability === "LOW" && "bg-red-600 text-white",
      )}
    >
      <ShieldCheck className="h-3 w-3" />
      {label} reliability
    </Badge>
  );
}

function ModeIcon({ mode }: { mode: TravelMode }) {
  const className = "h-5 w-5";
  const icon =
    mode === "FLIGHT" ? (
      <Plane className={className} />
    ) : mode === "BUS" ? (
      <Bus className={className} />
    ) : (
      <Route className={className} />
    );

  return (
    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
      {icon}
    </div>
  );
}

function stepDuration(step: RouteStep) {
  if (typeof step.durationMin !== "number" || typeof step.durationMax !== "number") {
    return "Time: confirm";
  }
  return `Time: ${minutes(step.durationMin)} - ${minutes(step.durationMax)}`;
}

function stepCost(step: RouteStep) {
  if (typeof step.costMin !== "number" || typeof step.costMax !== "number") {
    return "Cost: confirm";
  }
  return `NPR ${step.costMin.toLocaleString()} - ${step.costMax.toLocaleString()}`;
}

function minutes(value: number) {
  if (value >= 1440) {
    const days = value / 1440;
    return Number.isInteger(days) ? `${days} day${days > 1 ? "s" : ""}` : `${days.toFixed(1)} days`;
  }
  const hours = Math.floor(value / 60);
  const mins = value % 60;
  if (value < 180) {
    if (hours === 0) return `${value} min`;
    return mins === 0 ? `${hours} hr` : `${hours} hr ${mins} min`;
  }
  const roundedHours = value / 60;
  return Number.isInteger(roundedHours)
    ? `${roundedHours} hrs`
    : `${roundedHours.toFixed(1)} hrs`;
}


