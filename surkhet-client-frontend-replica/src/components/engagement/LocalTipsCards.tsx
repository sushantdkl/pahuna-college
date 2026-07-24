import { Lightbulb, MapPinned } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LOCAL_TIPS } from "@/lib/engagement-data";
import { cn } from "@server/lib/utils";

interface LocalTipsCardsProps {
  variant?: keyof typeof LOCAL_TIPS;
  title?: string;
  tips?: string[];
  compact?: boolean;
  className?: string;
}

export function LocalTipsCards({
  variant = "general",
  title = "Local tips",
  tips,
  compact = false,
  className,
}: LocalTipsCardsProps) {
  const selectedTips = tips ?? [...LOCAL_TIPS[variant]];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MapPinned className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">Short notes that make Karnali planning easier.</p>
        </div>
      </div>
      <div className={cn("grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}>
        {selectedTips.map((tip) => (
          <Card key={tip} className="rounded-2xl border-emerald-100 bg-emerald-50/50 shadow-sm">
            <CardContent className="flex gap-3 p-4">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">{tip}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

