import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Users,
  Calendar,
  DollarSign,
  ChevronRight,
  MapPin,
  Utensils,
  Moon,
  ArrowRight,
  CheckCircle,
  PieChart,
  Calculator,
} from "lucide-react";
import { Container } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PackageCard } from "@/components/tourism/package-card";
import { tripPackages, getPackageSlugs } from "@server/services";
import { formatPrice } from "@server/lib/utils";
import { RouteMapSectionClient } from "@/components/maps/route-map-section-client";

interface PackageDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPackageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PackageDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = tripPackages.find((p) => p.slug === slug);
  if (!pkg) return { title: "Package Not Found" };
  return {
    title: `${pkg.title} — Surkhet Trip Package`,
    description: pkg.shortDesc,
  };
}

const tierColors: Record<string, string> = {
  budget: "bg-green-100 text-green-800 border-green-200",
  standard: "bg-blue-100 text-blue-800 border-blue-200",
  premium: "bg-amber-100 text-amber-800 border-amber-200",
};

const tierGradients: Record<string, string> = {
  budget: "from-green-50 via-green-50/50 to-background",
  standard: "from-blue-50 via-blue-50/50 to-background",
  premium: "from-amber-50 via-amber-50/50 to-background",
};

const splitColors: Record<string, string> = {
  Accommodation: "bg-emerald-500",
  Food: "bg-amber-500",
  Transport: "bg-blue-500",
  Activities: "bg-purple-500",
  Misc: "bg-gray-400",
};

export default async function PackageDetailPage({
  params,
}: PackageDetailPageProps) {
  const { slug } = await params;
  const pkg = tripPackages.find((p) => p.slug === slug);

  if (!pkg) notFound();

  const tierLabel = pkg.tier.charAt(0).toUpperCase() + pkg.tier.slice(1);
  const relatedPackages = tripPackages.filter(
    (p) => p.tier === pkg.tier && p.id !== pkg.id
  );

  const costSplitEntries = [
    { label: "Accommodation", pct: pkg.costSplit.accommodation },
    { label: "Food", pct: pkg.costSplit.food },
    { label: "Transport", pct: pkg.costSplit.transport },
    { label: "Activities", pct: pkg.costSplit.activities },
    { label: "Misc", pct: pkg.costSplit.misc },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section
        className={`relative bg-linear-to-br ${tierGradients[pkg.tier]} py-16`}
      >
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/packages" className="hover:text-primary">
              Packages
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{pkg.title}</span>
          </nav>

          <div className="max-w-3xl">
            <Badge className={`${tierColors[pkg.tier]} mb-4 text-xs`}>
              {tierLabel} Package
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {pkg.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {pkg.description}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-medium text-sm">{pkg.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Price / Person</p>
                <p className="font-medium text-sm">
                  {formatPrice(pkg.pricePerPerson.min)} –{" "}
                  {formatPrice(pkg.pricePerPerson.max)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Group Size</p>
                <p className="font-medium text-sm">{pkg.groupSize}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Best Season</p>
                <p className="font-medium text-sm">{pkg.bestSeason}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Tier</p>
                <p className="font-medium text-sm">{tierLabel}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── HIGHLIGHTS + COST SPLIT ── */}
      <section className="py-16">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Highlights */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">
                Package Highlights
              </h2>
              <ul className="space-y-3">
                {pkg.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cost Split */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-6">
                Where Your Money Goes
              </h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {/* Visual Bar */}
                  <div className="flex rounded-lg overflow-hidden h-5">
                    {costSplitEntries.map(({ label, pct }) => (
                      <div
                        key={label}
                        className={`${splitColors[label]} relative group cursor-default`}
                        style={{ width: `${pct}%` }}
                        title={`${label}: ${pct}%`}
                      />
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {costSplitEntries.map(({ label, pct }) => (
                      <div key={label} className="flex items-center gap-2 text-sm">
                        <span
                          className={`h-3 w-3 rounded-sm ${splitColors[label]}`}
                        />
                        <span className="text-muted-foreground">
                          {label}{" "}
                          <span className="font-medium text-foreground">
                            {pct}%
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      Total Per Person
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(pkg.pricePerPerson.min)} –{" "}
                      {formatPrice(pkg.pricePerPerson.max)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* ── DAY-BY-DAY ── */}
      <section className="py-16 bg-muted/30">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight mb-10">
            Day-by-Day Plan
          </h2>

          {/* Route Map */}
          <div className="mb-10">
            <RouteMapSectionClient days={pkg.days} />
          </div>

          <div className="space-y-6">
            {pkg.days.map((day) => (
              <Card key={day.dayNumber} className="overflow-hidden">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                      {day.dayNumber}
                    </span>
                    <div>
                      <p className="text-xs text-muted-foreground font-normal">
                        Day {day.dayNumber}
                      </p>
                      <p className="text-lg">{day.title}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Highlights */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> Activities &
                      Highlights
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {day.highlights.map((hl) => (
                        <li
                          key={hl}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {hl}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Utensils className="h-4 w-4 text-primary" />
                      <span className="font-medium">Meals:</span> {day.meals}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Moon className="h-4 w-4 text-primary" />
                      <span className="font-medium">Overnight:</span>{" "}
                      {day.overnight}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ── RELATED PACKAGES ── */}
      {relatedPackages.length > 0 && (
        <section className="py-16">
          <Container>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Other {tierLabel} Packages
            </h2>
            <p className="text-muted-foreground mb-8">
              More {tierLabel.toLowerCase()}-tier options for your Surkhet trip.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
              {relatedPackages.map((rp) => (
                <PackageCard key={rp.id} pkg={rp} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-16 bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
        <Container className="relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-3">Book This Package</h2>
            <p className="text-white/70 mb-6">
              Send us an inquiry with your preferred dates and group size.
              We&apos;ll customize this package and provide a final quote.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
              >
                <Link href="/contact">
                  Inquire Now <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/70 bg-transparent text-white hover:bg-white hover:text-primary font-semibold"
              >
                <Link href="/trip-planner">
                  <Calculator className="h-4 w-4 mr-2" />
                  Cost Estimator
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/70 bg-transparent text-white hover:bg-white hover:text-primary font-semibold"
              >
                <Link href="/packages">All Packages</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
