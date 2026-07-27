import type { Metadata } from "next";
import Link from "next/link";
import {
  Map,
  CheckCircle2,
  Clock,
  Rocket,
  CalendarClock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/layout";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { tourismRoadmap, type RoadmapPhase } from "@server/services";
import { roadmapCopy } from "@server/data/site-copy";

export const metadata: Metadata = {
  title: roadmapCopy.metadata.title,
  description: roadmapCopy.metadata.description,
  alternates: { canonical: "/roadmap" },
  openGraph: {
    title: roadmapCopy.metadata.ogTitle,
    description: roadmapCopy.metadata.ogDescription,
  },
};

const statusConfig: Record<
  RoadmapPhase["status"],
  { label: string; icon: React.ReactNode; color: string; badgeClass: string }
> = {
  completed: {
    label: "Completed",
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "text-green-600",
    badgeClass: "bg-green-100 text-green-800 border-green-200",
  },
  "in-progress": {
    label: "In Progress",
    icon: <Clock className="h-5 w-5" />,
    color: "text-blue-600",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
  },
  upcoming: {
    label: "Upcoming",
    icon: <Rocket className="h-5 w-5" />,
    color: "text-amber-600",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
  },
  planned: {
    label: "Planned",
    icon: <CalendarClock className="h-5 w-5" />,
    color: "text-gray-500",
    badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

const lineColors: Record<RoadmapPhase["status"], string> = {
  completed: "bg-green-500",
  "in-progress": "bg-blue-500",
  upcoming: "bg-amber-400",
  planned: "bg-gray-300",
};

const dotColors: Record<RoadmapPhase["status"], string> = {
  completed: "bg-green-500 ring-green-200",
  "in-progress": "bg-blue-500 ring-blue-200 animate-pulse",
  upcoming: "bg-amber-400 ring-amber-200",
  planned: "bg-gray-300 ring-gray-200",
};

export default function RoadmapPage() {
  return (
    <>
      {/* ── HERO ── */}
      <PageHero
        badge={{
          icon: <Map className="h-3 w-3" />,
          label: roadmapCopy.hero.badge,
        }}
        title={roadmapCopy.hero.title}
        highlight={roadmapCopy.hero.highlight}
        subtitle={roadmapCopy.hero.subtitle}
      />

      {/* ── TIMELINE ── */}
      <section className="py-20">
        <Container>
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-12">
              {tourismRoadmap.map((phase, idx) => {
                const config = statusConfig[phase.status];
                return (
                  <div key={phase.phase} className="relative pl-16">
                    {/* Dot on timeline */}
                    <div
                      className={`absolute left-4 top-1 h-5 w-5 rounded-full ring-4 ${dotColors[phase.status]} -translate-x-1/2`}
                    />

                    {/* Colored line segment */}
                    {idx < tourismRoadmap.length - 1 && (
                      <div
                        className={`absolute left-[23px] top-6 w-0.5 ${lineColors[phase.status]}`}
                        style={{ height: "calc(100% + 3rem)" }}
                      />
                    )}

                    <Card className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-sm font-bold`}
                            >
                              {phase.phase}
                            </span>
                            <div>
                              <CardTitle className="text-lg">
                                {phase.title}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground">
                                {phase.timeline}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${config.badgeClass} text-xs`}>
                            <span className={`mr-1.5 ${config.color}`}>
                              {config.icon}
                            </span>
                            {config.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm">
                          {phase.description}
                        </p>

                        <Separator />

                        <div>
                          <h4 className="text-sm font-semibold mb-3">
                            Key Deliverables
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {phase.deliverables.map((d) => (
                              <li
                                key={d}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-muted/30">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto text-center">
            {roadmapCopy.stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-primary">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
        <Container className="relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-3">
              {roadmapCopy.cta.heading}
            </h2>
            <p className="text-white/70 mb-6">
              {roadmapCopy.cta.description}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
              >
                <Link href="/partner">
                  Become a Partner <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/70 bg-transparent text-white hover:bg-white hover:text-primary font-semibold"
              >
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}


