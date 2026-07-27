// @ts-nocheck
import { CloudSun, Heart, MapPinned, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CONFIDENCE_KEYWORDS } from "@/lib/engagement-data";
import { cn } from "@/lib/utils";

interface TripConfidenceScoreProps {
  context?: string;
  difficulty?: string;
  familyFriendly?: boolean;
  requiresGuide?: boolean;
  compact?: boolean;
  className?: string;
}

function includesAny(text: string, words: readonly string[]) {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word.toLowerCase()));
}

export function getTripConfidenceLabels({
  context = "",
  difficulty,
  familyFriendly,
  requiresGuide,
}: Omit<TripConfidenceScoreProps, "compact" | "className">) {
  const text = `${context} ${difficulty ?? ""}`;
  const labels: { label: string; icon: typeof ShieldCheck; className: string }[] = [];

  if (difficulty?.toLowerCase().includes("hard") || includesAny(text, CONFIDENCE_KEYWORDS.hard)) {
    labels.push({ label: "Hard", icon: ShieldAlert, className: "bg-amber-100 text-amber-900" });
  } else if (
    difficulty?.toLowerCase().includes("moderate") ||
    includesAny(text, CONFIDENCE_KEYWORDS.moderate)
  ) {
    labels.push({ label: "Moderate", icon: MapPinned, className: "bg-sky-100 text-sky-900" });
  } else {
    labels.push({ label: "Easy", icon: ShieldCheck, className: "bg-emerald-100 text-emerald-900" });
  }

  if (familyFriendly || includesAny(text, CONFIDENCE_KEYWORDS.family)) {
    labels.push({ label: "Family-friendly", icon: Heart, className: "bg-rose-100 text-rose-900" });
  }
  if (includesAny(text, CONFIDENCE_KEYWORDS.weather)) {
    labels.push({ label: "Weather-sensitive", icon: CloudSun, className: "bg-orange-100 text-orange-900" });
  }
  if (requiresGuide || includesAny(text, CONFIDENCE_KEYWORDS.guide)) {
    labels.push({ label: "Guide recommended", icon: UserCheck, className: "bg-violet-100 text-violet-900" });
  }

  return labels;
}

export function TripConfidenceScore({
  context = "",
  difficulty,
  familyFriendly,
  requiresGuide,
  compact = false,
  className,
}: TripConfidenceScoreProps) {
  const labels = getTripConfidenceLabels({ context, difficulty, familyFriendly, requiresGuide });

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {labels.slice(0, compact ? 3 : labels.length).map(({ label, icon: Icon, className: badgeClass }) => (
        <Badge key={label} variant="secondary" className={cn("gap-1.5 px-3 py-1", badgeClass)}>
          <Icon className="h-3.5 w-3.5" />
          {label}
        </Badge>
      ))}
    </div>
  );
}

