import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Clock,
  DollarSign,
  Users,
  FileText,
  Hotel,
  Building2,
  Coffee,
  Globe,
  BarChart3,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CaseStudyCard, TestimonialCard } from "@/components/consulting/case-study-card";
import { ServiceCard } from "@/components/consulting/service-card";
import { ConsultingCta } from "@/components/consulting/consulting-cta";
import {
  consultingServices,
  getServiceBySlug,
  getServiceSlugs,
  getCaseStudiesForService,
  getTestimonialsForService,
  type ConsultingIconName,
} from "@server/services";

const iconMap: Record<ConsultingIconName, LucideIcon> = {
  Hotel,
  Building2,
  Coffee,
  Globe,
  BarChart3,
  TrendingUp,
  Users,
};

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} — B2B Consulting`,
    description: service.shortDesc,
  };
}

const colorMap: Record<string, { bg: string; text: string; gradient: string; ring: string }> = {
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    gradient: "from-emerald-50 via-emerald-50/50 to-background",
    ring: "ring-emerald-200",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    gradient: "from-blue-50 via-blue-50/50 to-background",
    ring: "ring-blue-200",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    gradient: "from-amber-50 via-amber-50/50 to-background",
    ring: "ring-amber-200",
  },
  violet: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    gradient: "from-violet-50 via-violet-50/50 to-background",
    ring: "ring-violet-200",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    gradient: "from-rose-50 via-rose-50/50 to-background",
    ring: "ring-rose-200",
  },
  teal: {
    bg: "bg-teal-50",
    text: "text-teal-600",
    gradient: "from-teal-50 via-teal-50/50 to-background",
    ring: "ring-teal-200",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    gradient: "from-indigo-50 via-indigo-50/50 to-background",
    ring: "ring-indigo-200",
  },
};

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  const Icon = iconMap[service.icon];
  const colors = colorMap[service.color] || colorMap.emerald;
  const relatedCases = getCaseStudiesForService(service.slug);
  const relatedTestimonials = getTestimonialsForService(service.slug);
  const otherServices = consultingServices.filter(
    (s) => s.id !== service.id
  );

  return (
    <>
      {/* ── HERO ── */}
      <section
        className={`relative bg-linear-to-br ${colors.gradient} py-16 lg:py-20`}
      >
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/consulting" className="hover:text-primary">
              Consulting
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">
              {service.title}
            </span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg}`}
                >
                  <Icon className={`h-7 w-7 ${colors.text}`} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    {service.title}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {service.tagline}
                  </p>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mt-4 leading-relaxed max-w-2xl">
                {service.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="font-semibold px-8">
                  <Link href="/consulting#inquiry-form">
                    Get Started <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="font-semibold"
                >
                  <Link href="/contact">Schedule a Call</Link>
                </Button>
              </div>
            </div>

            {/* Quick Facts Card */}
            <Card className="border-2 shadow-md">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Starting From
                    </p>
                    <p className="font-bold text-lg">
                      {service.startingPrice}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Typical Duration
                    </p>
                    <p className="font-semibold">{service.duration}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Ideal For
                    </p>
                    <ul className="space-y-1 mt-1">
                      {service.idealFor.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Separator />
                <Button asChild className="w-full font-semibold">
                  <Link href="/consulting#inquiry-form">
                    Request This Service
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20">
        <Container>
          <SectionHeader
            title="What's Included"
            subtitle={`A comprehensive approach to ${service.title.toLowerCase()} for your hospitality business.`}
          />

          <div className="grid md:grid-cols-2 gap-6">
            {service.features.map((feature, idx) => (
              <Card key={feature.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors.bg} ${colors.text} text-sm font-bold`}
                    >
                      {idx + 1}
                    </span>
                    <CardTitle className="text-base">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ── DELIVERABLES ── */}
      <section className="py-16 bg-muted/30">
        <Container>
          <SectionHeader
            title="What You'll Receive"
            subtitle="Tangible deliverables — not just advice."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {service.deliverables.map((del) => (
              <Card key={del.title}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className={`h-5 w-5 ${colors.text}`} />
                    <CardTitle className="text-base">{del.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {del.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CASE STUDIES ── */}
      {relatedCases.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionHeader
              title="Results in Action"
              subtitle={`See how ${service.title.toLowerCase()} has transformed businesses like yours.`}
            />
            <div
              className={`grid gap-6 ${
                relatedCases.length === 1
                  ? "max-w-lg mx-auto"
                  : relatedCases.length === 2
                    ? "md:grid-cols-2 max-w-3xl mx-auto"
                    : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {relatedCases.map((study) => (
                <CaseStudyCard key={study.id} study={study} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {relatedTestimonials.length > 0 && (
        <section className="py-16 bg-muted/30">
          <Container>
            <SectionHeader
              title="Client Feedback"
              subtitle={`What businesses say about our ${service.title.toLowerCase()} consulting.`}
            />
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {relatedTestimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── OTHER SERVICES ── */}
      <section className="py-16">
        <Container>
          <SectionHeader
            title="Explore Other Services"
            subtitle="We offer end-to-end consulting — combine services for maximum impact."
            action={{ label: "All Services", href: "/consulting" }}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.slice(0, 3).map((s) => (
              <ServiceCard key={s.id} service={s} compact />
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <ConsultingCta
        title={`Ready for ${service.title}?`}
        subtitle={`Book a free discovery call to discuss how ${service.title.toLowerCase()} can transform your business.`}
      />
    </>
  );
}
