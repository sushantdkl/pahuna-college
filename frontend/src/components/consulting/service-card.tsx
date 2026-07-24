// @ts-nocheck
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Hotel,
  Building2,
  Coffee,
  Globe,
  BarChart3,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ConsultingService, ConsultingIconName } from "@backend/services";

const iconMap: Record<ConsultingIconName, LucideIcon> = {
  Hotel,
  Building2,
  Coffee,
  Globe,
  BarChart3,
  TrendingUp,
  Users,
};

const colorMap: Record<string, { bg: string; text: string; badge: string }> = {
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
  },
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    badge: "bg-violet-100 text-violet-800 border-violet-200",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
  },
  teal: {
    bg: "bg-teal-50",
    text: "text-teal-600",
    badge: "bg-teal-100 text-teal-800 border-teal-200",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
};

interface ServiceCardProps {
  service: ConsultingService;
  /** Compact card for grids */
  compact?: boolean;
}

export function ServiceCard({ service, compact = false }: ServiceCardProps) {
  const colors = colorMap[service.color] || colorMap.emerald;
  const Icon = iconMap[service.icon];

  if (compact) {
    return (
      <Card className="overflow-hidden border hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
        <CardHeader className="pb-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} mb-3`}
          >
            <Icon className={`h-6 w-6 ${colors.text}`} />
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {service.title}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{service.tagline}</p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-sm text-muted-foreground mb-4 flex-1">
            {service.shortDesc}
          </p>
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-xs text-muted-foreground">
              From {service.startingPrice}
            </span>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link href={`/consulting/${service.slug}`}>
                Learn More <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full horizontal card
  return (
    <Card className="overflow-hidden border hover:shadow-lg transition-all duration-300 group">
      <div className="grid md:grid-cols-[280px_1fr] items-stretch">
        {/* Left panel */}
        <div
          className={`${colors.bg} p-6 flex flex-col items-center justify-center text-center gap-3`}
        >
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm`}
          >
            <Icon className={`h-8 w-8 ${colors.text}`} />
          </div>
          <h3 className="font-bold text-lg">{service.title}</h3>
          <p className="text-xs text-muted-foreground">{service.tagline}</p>
          {service.isFeatured && (
            <Badge className={`${colors.badge} text-xs`}>Popular</Badge>
          )}
        </div>

        {/* Right content */}
        <div className="p-6 flex flex-col">
          <p className="text-sm text-muted-foreground mb-4">
            {service.shortDesc}
          </p>

          <div className="grid sm:grid-cols-2 gap-2 mb-4 flex-1">
            {service.features.slice(0, 4).map((f) => (
              <div key={f.title} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{f.title}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm">
              <span className="text-muted-foreground">From </span>
              <span className="font-semibold">{service.startingPrice}</span>
              <span className="text-muted-foreground ml-2">
                · {service.duration}
              </span>
            </div>
            <Button asChild size="sm">
              <Link href={`/consulting/${service.slug}`}>
                View Details <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}


