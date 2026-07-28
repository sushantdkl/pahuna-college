import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  ArrowRight,
  Phone,
  CheckCircle,
  Shield,
  Award,
  Zap,
} from "lucide-react";
import { Container } from "@/components/layout";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ServiceCard } from "@/components/consulting/service-card";
import { CaseStudyCard, TestimonialCard } from "@/components/consulting/case-study-card";
import { ProcessTimeline } from "@/components/consulting/process-timeline";
import { ConsultingCta } from "@/components/consulting/consulting-cta";
import { ConsultingForm } from "@/components/forms/consulting-form";
import {
  getConsultingServices,
  caseStudies,
  consultingTestimonials,
  consultingStats,
} from "@server/services";
import { SITE_CONFIG } from "@server/lib/constants";
import { consultingCopy } from "@server/data/site-copy";

export const metadata: Metadata = {
  title: consultingCopy.metadata.title,
  description: consultingCopy.metadata.description,
  alternates: { canonical: "/consulting" },
  openGraph: {
    title: consultingCopy.metadata.ogTitle,
    description: consultingCopy.metadata.ogDescription,
  },
  keywords: [...consultingCopy.metadata.keywords],
};

const trustBadges = [
  {
    icon: Shield,
    label: consultingCopy.trustBadges[0].label,
    desc: consultingCopy.trustBadges[0].description,
  },
  {
    icon: Award,
    label: consultingCopy.trustBadges[1].label,
    desc: consultingCopy.trustBadges[1].description,
  },
  {
    icon: Zap,
    label: consultingCopy.trustBadges[2].label,
    desc: consultingCopy.trustBadges[2].description,
  },
];

export default async function ConsultingPage() {
  const consultingServices = await getConsultingServices();
  const featuredServices = consultingServices.filter((s) => s.isFeatured);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO — Dark, premium, authority-establishing                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

        <Container className="relative z-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-center">
            {/* Left */}
            <div>
              <Badge
                variant="outline"
                className="border-primary/40 text-primary bg-primary/10 mb-6 text-sm px-4 py-1.5"
              >
                <Briefcase className="h-3.5 w-3.5 mr-2" />
                Registered Hotel Service Consultants
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.08]">
                Grow Your{" "}
                <span className="text-primary">Hospitality</span>{" "}
                Business
              </h1>

              <p className="mt-6 text-lg text-white/60 max-w-2xl leading-relaxed">
                {consultingCopy.hero.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 shadow-lg shadow-primary/25"
                >
                  <a href="#inquiry-form">
                    Book Free Consultation
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/70 bg-transparent text-white hover:bg-white hover:text-primary font-semibold px-8"
                >
                  <a href={`tel:${SITE_CONFIG.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    {SITE_CONFIG.phone}
                  </a>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex flex-wrap gap-6">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                      <badge.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-white/90">
                        {badge.label}
                      </p>
                      <p className="text-xs text-white/50">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Stats */}
            <div className="grid grid-cols-2 gap-3">
              {consultingStats.map((stat) => (
                <Card
                  key={stat.label}
                  className="bg-white/5 border-white/10 backdrop-blur-sm"
                >
                  <CardContent className="pt-5 pb-4 text-center">
                    <p className="text-3xl font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="text-xs text-white/60 mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* WHO WE SERVE                                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-14 border-b">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">We serve:</span>
            {consultingCopy.serveList.map((type) => (
              <span key={type} className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-primary" />
                {type}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SERVICE CATEGORIES                                                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <Container>
          <SectionHeader
            title={consultingCopy.services.title}
            subtitle={consultingCopy.services.subtitle}
          />

          {/* Featured services — horizontal cards */}
          <div className="space-y-6 mb-12">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <Separator className="my-8" />

          {/* Remaining services — compact grid */}
          <h3 className="text-lg font-semibold mb-6">{consultingCopy.services.moreServicesLabel}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {consultingServices
              .filter((s) => !s.isFeatured)
              .map((service) => (
                <ServiceCard key={service.id} service={service} compact />
              ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PROCESS TIMELINE                                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <ProcessTimeline />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CASE STUDIES                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <Container>
          <SectionHeader
            title={consultingCopy.caseStudies.title}
            subtitle={consultingCopy.caseStudies.subtitle}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.id} study={study} />
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-muted/20">
        <Container>
          <SectionHeader
            title={consultingCopy.testimonials.title}
            subtitle={consultingCopy.testimonials.subtitle}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {consultingTestimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* WHY CHOOSE US                                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6 leading-[1.15]">
                {consultingCopy.whyUs.heading}
              </h2>
              <div className="space-y-5">
                {consultingCopy.whyUs.reasons.map((item, idx) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — CTA card */}
            <Card className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mx-auto">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{consultingCopy.discoveryCall.heading}</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {consultingCopy.discoveryCall.description}
                </p>
                <div className="pt-2 space-y-3">
                  <Button asChild size="lg" className="w-full font-semibold">
                    <a href="#inquiry-form">
                      Book Your Free Call
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full font-semibold"
                  >
                    <a href={`tel:${SITE_CONFIG.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now: {SITE_CONFIG.phone}
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground/60">
                  {consultingCopy.discoveryCall.socialProof}
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* INQUIRY FORM                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="inquiry-form"
        className="py-24 bg-linear-to-b from-muted/40 to-background"
      >
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-5">
                <Briefcase className="h-3 w-3 mr-1.5" /> Consulting Inquiry
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                {consultingCopy.inquiryForm.heading}
              </h2>
              <p className="text-muted-foreground mt-2">
                {consultingCopy.inquiryForm.description}
              </p>
            </div>

            <Card className="border-2 shadow-lg">
              <CardContent className="pt-6">
                <ConsultingForm />
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BOTTOM CTA                                                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <ConsultingCta variant="dark" />
    </>
  );
}


