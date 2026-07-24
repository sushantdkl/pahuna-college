import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  ArrowRight,
  Calculator,
  Filter,
  CheckCircle,
} from "lucide-react";
import { Container } from "@/components/layout";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PackageCard } from "@/components/tourism/package-card";
import {
  tripPackages,
  budgetTiers,
  type BudgetTier,
} from "@server/services";
import { formatPrice } from "@server/lib/utils";

export const metadata: Metadata = {
  title: "Trip Packages — Surkhet Travel Plans",
  description:
    "Pre-planned trip packages for Surkhet at budget, standard, and premium levels. 3-day and 5-day options with full cost breakdowns.",
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Trip Packages — Surkhet Travel Plans",
    description: "Pre-planned trip packages for Surkhet at budget, standard, and premium levels.",
  },
};

function getPackagesByTier(tier: BudgetTier) {
  return tripPackages.filter((p) => p.tier === tier);
}

export default function PackagesPage() {
  return (
    <>
      {/* ── HERO ── */}
      <PageHero
        badge={{
          icon: <Package className="h-3 w-3" />,
          label: "Trip Packages",
        }}
        title="Sample Trip"
        highlight="Packages"
        subtitle="Complete travel plans designed for every budget. Each package includes accommodation, meals, transport, and activities with transparent pricing."
      >
        <div className="flex items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 shadow-lg"
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
            className="border-white/70 bg-transparent text-white hover:bg-white hover:text-primary font-semibold px-8"
          >
            <Link href="/itineraries">Day-by-Day Plans</Link>
          </Button>
        </div>
      </PageHero>

      {/* ── HOW IT WORKS ── */}
      <section className="py-12 border-b">
        <Container>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                step: "1",
                title: "Choose Your Style",
                desc: "Pick budget, standard, or premium based on your comfort level.",
              },
              {
                step: "2",
                title: "Select Duration",
                desc: "3-day highlights or 5-day deep dive into Surkhet.",
              },
              {
                step: "3",
                title: "Inquire & Customize",
                desc: "Send an inquiry — we'll tailor dates, group size, and extras.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold mx-auto mb-3">
                  {step}
                </div>
                <h3 className="font-semibold text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── PACKAGE TIERS ── */}
      {budgetTiers.map((tier) => {
        const packages = getPackagesByTier(tier.id);
        if (packages.length === 0) return null;

        return (
          <section key={tier.id} className="py-16" id={tier.id}>
            <Container>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{tier.emoji}</span>
                    <h2 className="text-2xl font-bold">{tier.label}</h2>
                  </div>
                  <p className="text-muted-foreground max-w-lg">
                    {tier.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-sm px-4 py-2 shrink-0"
                >
                  {formatPrice(tier.perDayMin)} — {formatPrice(tier.perDayMax)}{" "}
                  / day
                </Badge>
              </div>

              {/* What's Included */}
              <div className="mb-8 flex flex-wrap gap-3">
                {tier.includes.map((inc) => (
                  <div
                    key={inc}
                    className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-1.5"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                    {inc}
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    showCostSplit
                  />
                ))}
              </div>

              <Separator className="mt-16" />
            </Container>
          </section>
        );
      })}

      {/* ── COMPARISON ── */}
      <section className="py-16 bg-muted/30">
        <Container>
          <SectionHeader
            title="Quick Comparison"
            subtitle="All prices per person. Choose the style that fits your budget."
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-muted">
                  <th className="p-4 text-left font-medium">Feature</th>
                  <th className="p-4 text-center font-medium">🎒 Budget</th>
                  <th className="p-4 text-center font-medium">🧳 Standard</th>
                  <th className="p-4 text-center font-medium">✨ Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  {
                    feature: "Accommodation",
                    budget: "Lodge / Hostel",
                    standard: "Mid-range Hotel",
                    premium: "Boutique Resort",
                  },
                  {
                    feature: "Meals",
                    budget: "Local dal bhat",
                    standard: "Restaurant mix",
                    premium: "Fine dining",
                  },
                  {
                    feature: "Transport",
                    budget: "Public bus / walk",
                    standard: "Private taxi",
                    premium: "Private car + driver",
                  },
                  {
                    feature: "Activities",
                    budget: "Self-guided + 1 tour",
                    standard: "2-3 guided per day",
                    premium: "Private guide + VIP",
                  },
                  {
                    feature: "3-Day Cost",
                    budget: "NPR 5,000 – 9,000",
                    standard: "NPR 14,000 – 25,000",
                    premium: "NPR 30,000 – 55,000",
                  },
                  {
                    feature: "5-Day Cost",
                    budget: "NPR 8,000 – 16,000",
                    standard: "NPR 22,000 – 42,000",
                    premium: "NPR 55,000 – 1,00,000",
                  },
                ].map(({ feature, budget, standard, premium }) => (
                  <tr key={feature} className="hover:bg-muted/50">
                    <td className="p-4 font-medium">{feature}</td>
                    <td className="p-4 text-center text-muted-foreground">
                      {budget}
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      {standard}
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      {premium}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
        <Container className="relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-3">
              Want a Custom Package?
            </h2>
            <p className="text-white/70 mb-6">
              These packages are starting points. Tell us your dates, group
              size, and preferences — we&apos;ll build a personalized plan.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
              >
                <Link href="/contact">
                  Request Custom Package{" "}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/70 bg-transparent text-white hover:bg-white hover:text-primary font-semibold"
              >
                <Link href="/trip-planner">Use Cost Estimator</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}


