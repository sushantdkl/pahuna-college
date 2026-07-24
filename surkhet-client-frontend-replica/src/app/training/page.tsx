import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  Phone,
  CheckCircle,
  Shield,
  Award,
  Zap,
  Star,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { Container } from "@/components/layout";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CourseCard, StudentTestimonialCard } from "@/components/training/course-card";
import { EnrollmentTimeline } from "@/components/training/enrollment-timeline";
import { TrainingFAQ } from "@/components/training/training-faq";
import { TrainingCta } from "@/components/training/training-cta";
import { TrainingForm } from "@/components/forms/training-form";
import {
  trainingCourses,
  trainingStats,
  enrollmentProcess,
  studentTestimonials,
  generalFAQs,
  getFeaturedCourses,
} from "@server/services";
import { SITE_CONFIG } from "@server/lib/constants";
import { trainingCopy } from "@server/data/site-copy";

export const metadata: Metadata = {
  title: trainingCopy.metadata.title,
  description: trainingCopy.metadata.description,
  alternates: { canonical: "/training" },
  openGraph: {
    title: trainingCopy.metadata.ogTitle,
    description: trainingCopy.metadata.ogDescription,
  },
  keywords: [...trainingCopy.metadata.keywords],
};

const trustBadges = [
  {
    icon: Shield,
    label: trainingCopy.trustBadges[0].label,
    desc: trainingCopy.trustBadges[0].description,
  },
  {
    icon: Award,
    label: trainingCopy.trustBadges[1].label,
    desc: trainingCopy.trustBadges[1].description,
  },
  {
    icon: Zap,
    label: trainingCopy.trustBadges[2].label,
    desc: trainingCopy.trustBadges[2].description,
  },
];

export default function TrainingPage() {
  const featuredCourses = getFeaturedCourses();
  const otherCourses = trainingCourses.filter((c) => !c.isFeatured);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO — Dark premium feel */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-linear-to-br from-gray-900 via-gray-800 to-primary/30 text-white py-28 lg:py-32 overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/[0.04] rounded-full blur-3xl" />

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <Badge
              variant="secondary"
              className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm"
            >
              <GraduationCap className="mr-1.5 h-3.5 w-3.5" /> Pahuna
              Training Academy
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.08]">
              Launch Your{" "}
              <span className="text-primary">Hospitality Career</span>
            </h1>

            <p className="mt-5 text-lg text-white/60 max-w-2xl leading-relaxed">
              {trainingCopy.hero.description}
            </p>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-start gap-3 rounded-lg bg-white/5 border border-white/10 p-3"
                >
                  <badge.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{badge.label}</p>
                    <p className="text-xs text-white/60">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <a href="#courses">
                  View Courses <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                  className="border-white/70 bg-transparent text-white hover:bg-white hover:text-primary"
              >
                <a href="#enroll">Enroll Now</a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STATS BAR */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b bg-background">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y md:divide-y-0">
            {trainingStats.map((stat) => (
              <div key={stat.label} className="px-4 py-6 text-center">
                <p className="text-2xl font-bold text-primary">
                  {stat.value}
                  <span className="text-lg">{stat.suffix}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* WHY TRAIN WITH US */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-muted/30">
        <Container>
          <SectionHeader
            title={trainingCopy.whyTrainWithUs.title}
            subtitle={trainingCopy.whyTrainWithUs.subtitle}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Industry-Certified Instructors",
                desc: "Learn from professionals with 10+ years at top hotels in Nepal and abroad.",
              },
              {
                icon: Briefcase,
                title: "Job Placement Assistance",
                desc: "92% of our graduates get placed within 3 months through our 25+ partner hotels.",
              },
              {
                icon: Star,
                title: "Hands-On Practical Training",
                desc: "Real equipment, real scenarios, and supervised internships — not just classroom lectures.",
              },
              {
                icon: GraduationCap,
                title: "Recognized Certificates",
                desc: "Our certificates are accepted by hotel chains and hospitality businesses across Nepal.",
              },
              {
                icon: Shield,
                title: "Small Batch Sizes",
                desc: "15-25 students per batch ensures personalized attention and better learning outcomes.",
              },
              {
                icon: Award,
                title: "Affordable & Flexible",
                desc: "Competitive fees with installment options. Morning and afternoon batches for working students.",
              },
            ].map((item) => (
              <Card key={item.title} className="border-0 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CardContent className="pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 mb-3">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* FEATURED COURSES — Full cards */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="courses" className="py-24">
        <Container>
          <SectionHeader
            title={trainingCopy.featuredPrograms.title}
            subtitle={trainingCopy.featuredPrograms.subtitle}
          />
          <div className="space-y-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ALL COURSES GRID — Compact cards */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {otherCourses.length > 0 && (
        <section className="py-24 bg-muted/30">
          <Container>
            <SectionHeader
              title={trainingCopy.morePrograms.title}
              subtitle={trainingCopy.morePrograms.subtitle}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCourses.map((course) => (
                <CourseCard key={course.id} course={course} compact />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HOW ENROLLMENT WORKS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
            <div>
              <SectionHeader
                title={trainingCopy.enrollment.title}
                subtitle={trainingCopy.enrollment.subtitle}
                align="left"
              />
              <EnrollmentTimeline steps={enrollmentProcess} />
            </div>

            {/* Quick info card */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Quick Facts
                  </h3>
                  <Separator />
                  <div className="space-y-3 text-sm">
                    {[
                      ["Courses Available", `${trainingCourses.length} programs`],
                      ["Batch Sizes", "15 – 25 students"],
                      ["Duration", "2 weeks – 3 months"],
                      ["Fees", "NPR 12,000 – 65,000"],
                      ["Location", "Birendranagar, Surkhet"],
                      ["Payment", "Installments available"],
                      ["Certificate", "Industry-recognized"],
                      ["Placement", "92% within 3 months"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <Button asChild className="w-full" size="sm">
                    <a href="#enroll">
                      Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full" size="sm">
                    <a href="tel:+977083520000">
                      <Phone className="mr-2 h-4 w-4" /> +977-083-520000
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STUDENT SUCCESS STORIES */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-muted/30">
        <Container>
          <SectionHeader
            title={trainingCopy.studentStories.title}
            subtitle={trainingCopy.studentStories.subtitle}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentTestimonials.map((t) => (
              <StudentTestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* FAQ */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeader
              title={trainingCopy.faq.title}
              subtitle={trainingCopy.faq.subtitle}
            />
            <TrainingFAQ faqs={generalFAQs} />
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ENROLLMENT FORM */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="enroll" className="py-24 bg-muted/30">
        <Container>
          <div className="mx-auto max-w-2xl">
            <SectionHeader
              title={trainingCopy.enrollForm.title}
              subtitle={trainingCopy.enrollForm.subtitle}
            />
            <Card>
              <CardContent className="pt-6">
                <TrainingForm />
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BOTTOM CTA */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <Container>
          <TrainingCta variant="dark" />
        </Container>
      </section>
    </>
  );
}


