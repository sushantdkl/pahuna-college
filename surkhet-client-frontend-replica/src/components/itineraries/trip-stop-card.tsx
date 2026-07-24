import { MapPin, Utensils, Moon, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@server/lib/utils";

interface TripStopCardProps {
  dayNumber: number;
  title: string;
  description?: string;
  activities: string[];
  meals?: string;
  overnight?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
  isCompact?: boolean;
  onDirections?: () => void;
}

export function TripStopCard({
  dayNumber,
  title,
  description,
  activities,
  meals,
  overnight,
  isActive,
  isCompact,
  onDirections,
}: TripStopCardProps) {
  if (isCompact) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-lg border p-3 transition-all cursor-pointer",
          isActive
            ? "ring-2 ring-primary shadow-lg bg-primary/5"
            : "hover:shadow-md hover:bg-muted/30",
        )}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white text-sm font-bold">
          {dayNumber}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm leading-tight">{title}</p>
          <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-muted-foreground">
            {meals && (
              <span className="flex items-center gap-1">
                <Utensils className="h-3 w-3" /> {meals}
              </span>
            )}
            {overnight && overnight !== "N/A" && (
              <span className="flex items-center gap-1">
                <Moon className="h-3 w-3" /> {overnight}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all",
        isActive && "ring-2 ring-primary shadow-xl",
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white text-sm font-bold shadow-md">
            {dayNumber}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <p className="text-xs text-muted-foreground">Day {dayNumber}</p>
                <h4 className="font-semibold">{title}</h4>
              </div>
              {onDirections && (
                <button
                  onClick={onDirections}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors shrink-0"
                >
                  <Navigation className="h-3.5 w-3.5" /> Directions
                </button>
              )}
            </div>

            {description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {description}
              </p>
            )}

            {/* Activities */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Activities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activities.map((act) => (
                  <Badge
                    key={act}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {act}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Meals & Stay */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t pt-3">
              {meals && (
                <span className="flex items-center gap-1.5">
                  <Utensils className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground">Meals:</span>{" "}
                  {meals}
                </span>
              )}
              {overnight && overnight !== "N/A" && (
                <span className="flex items-center gap-1.5">
                  <Moon className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground">Stay:</span>{" "}
                  {overnight}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


