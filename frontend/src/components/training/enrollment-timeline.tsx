// @ts-nocheck
import {
  Coffee,
  Hotel,
  GraduationCap,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { TrainingIconName } from "@/lib/services";

const iconMap: Record<string, LucideIcon> = {
  Coffee,
  Hotel,
  GraduationCap,
  Users,
  Sparkles,
};

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: TrainingIconName;
}

interface EnrollmentTimelineProps {
  steps: ProcessStep[];
}

export function EnrollmentTimeline({ steps }: EnrollmentTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line connecting the steps */}
      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-linear-to-b from-primary/50 via-primary/20 to-primary/50 hidden md:block" />

      <div className="space-y-6">
        {steps.map((s, i) => {
          const Icon = iconMap[s.icon] || GraduationCap;
          return (
            <div
              key={`${s.step}-${s.title}-${i}`}
              className="relative flex items-start gap-5 md:gap-6"
            >
              {/* Step number circle */}
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg">
                {s.step}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-base">{s.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="mt-3 border-b border-dashed border-muted-foreground/20 md:hidden" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


