import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Users,
  MapPin,
  IndianRupee,
  GraduationCap,
  Calendar,
  BookOpen,
  CheckCircle,
  Award,
  Briefcase,
  Phone,
  Coffee,
  Hotel,
  ConciergeBell,
  SprayCan,
  HeartHandshake,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrainingFAQ } from "@/components/training/training-faq";
import { CourseCard, StudentTestimonialCard } from "@/components/training/course-card";
import { TrainingCta } from "@/components/training/training-cta";
import { TrainingForm } from "@/components/forms/training-form";
import {
  trainingCourses,
  getCourseBySlug,
  getRelatedCourses,
  getTestimonialsForCourse,
  type TrainingIconName,
} from "@server/services";
import { formatPrice } from "@server/lib/utils";

const iconMap: Record<TrainingIconName, LucideIcon> = {
  Coffee,
  Hotel,
  ConciergeBell,
  SprayCan,
  HeartHandshake,
  Sparkles,
  GraduationCap,
  Users,
};

const colorMap: Record<string, { bg: string; text: string; bgLight: string; border: string }> = {
  amber: {
    bg: "from-amber-600 via-amber-700 to-amber-900",
    bgLight: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  blue: {
    bg: "from-blue-600 via-blue-700 to-blue-900",
    bgLight: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  violet: {
    bg: "from-violet-600 via-violet-700 to-violet-900",
    bgLight: "bg-violet-50 dark:bg-violet-950/20",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800",
  },
  teal: {
    bg: "from-teal-600 via-teal-700 to-teal-900",
    bgLight: "bg-teal-50 dark:bg-teal-950/20",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-800",
  },
  rose: {
    bg: "from-rose-600 via-rose-700 to-rose-900",
    bgLight: "bg-rose-50 dark:bg-rose-950/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
  },
  indigo: {
    bg: "from-indigo-600 via-indigo-700 to-indigo-900",
    bgLight: "bg-indigo-50 dark:bg-indigo-950/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
  },
};

// ── Static paths ──
export function generateStaticParams() {
  return trainingCourses.map((c) => ({ slug: c.slug }));
}

// ── Metadata ──
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Course Not Found" };

  return {
    title: `${course.title} — Training Academy | Pahuna`,
    description: course.shortDesc,
  };
}

// ── Page ──
export default async function TrainingDetailPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const colors = colorMap[course.color] || colorMap.amber;
  const Icon = iconMap[course.icon];
  const relatedCourses = getRelatedCourses(slug, 3);
  const testimonials = getTestimonialsForCourse(slug);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO — Color-coded per course */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        className={`relative bg-linear-to-br ${colors.bg} text-white py-20 overflow-hidden`}
      >
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-black/10 rounded-full blur-3xl" />

        <Container className="relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/training" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Training Academy
            </Link>
            <span>/</span>
            <span className="text-white/90">{course.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {course.level}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {course.mode}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {course.category}
                  </Badge>
                </div>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-3">
                {course.title}
              </h1>
              <p className="text-lg text-white/80 mb-2">{course.tagline}</p>
              <p className="text-sm text-white/70 max-w-2xl">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary">
                  <a href="#enroll">
                    Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/70 bg-transparent text-white hover:bg-white hover:text-primary"
                >
                  <a href="tel:+977083520000">
                    <Phone className="mr-2 h-4 w-4" /> Call for Info
                  </a>
                </Button>
              </div>
            </div>

            {/* Quick Facts Card */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-bold text-lg mb-2">Course Details</h3>
                <Separator className="bg-white/20" />
                {[
                  { icon: Clock, label: "Duration", value: course.duration },
                  {
                    icon: IndianRupee,
                    label: "Fee",
                    value: formatPrice(course.fee),
                  },
                  {
                    icon: Users,
                    label: "Batch Size",
                    value: `Max ${course.maxStudents} students`,
                  },
                  {
                    icon: Calendar,
                    label: "Schedule",
                    value: course.schedule,
                  },
                  { icon: MapPin, label: "Location", value: "Surkhet" },
                  {
                    icon: GraduationCap,
                    label: "Certificate",
                    value: "Included",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    <item.icon className="h-4 w-4 text-white/60 shrink-0" />
                    <span className="text-white/60">{item.label}</span>
                    <span className="ml-auto text-right font-medium">
                      {item.value}
                    </span>
                  </div>
                ))}
                <Separator className="bg-white/20" />
                <p className="text-xs text-white/60">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {course.batchInfo}
                </p>
                {course.prerequisites && (
                  <p className="text-xs text-white/60">
                    <BookOpen className="h-3 w-3 inline mr-1" />
                    Prerequisites: {course.prerequisites}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CURRICULUM */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16">
        <Container>
          <SectionHeader
            title="Course Curriculum"
            subtitle={`${course.modules.length} comprehensive modules designed by industry professionals`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.modules.map((module, i) => (
              <Card key={i} className={`${colors.border} hover:shadow-md transition-shadow`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bgLight} shrink-0`}>
                      <span className={`font-bold text-sm ${colors.text}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <CardTitle className="text-base">{module.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {module.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className={`h-4 w-4 ${colors.text} mt-0.5 shrink-0`} />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* INSTRUCTOR */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-muted/30">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeader
              title="Your Instructor"
              subtitle="Learn from experienced industry professionals"
            />
            <Card className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar placeholder */}
                  <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${colors.bgLight}`}>
                    <Users className={`h-10 w-10 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{course.instructor.name}</h3>
                    <p className={`text-sm font-medium ${colors.text} mb-2`}>
                      {course.instructor.title}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {course.instructor.bio}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      {course.instructor.experience}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {course.instructor.specialties.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CERTIFICATION & CAREER OUTCOMES */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16">
        <Container>
          <SectionHeader
            title="Certificate & Career Outcomes"
            subtitle="What you'll earn and where it can take you"
          />

          {/* Certificate info */}
          <Card className={`${colors.border} mb-8`}>
            <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-4">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${colors.bgLight}`}>
                <GraduationCap className={`h-7 w-7 ${colors.text}`} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Certificate of Completion</h3>
                <p className="text-sm text-muted-foreground">
                  {course.certification}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recognized by hospitality businesses across Nepal • Awarded upon
                  successful completion of all modules and assessments
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Career paths */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {course.careerOutcomes.map((outcome) => (
              <Card key={outcome.role} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className={`h-5 w-5 ${colors.text}`} />
                    <h4 className="font-semibold">{outcome.role}</h4>
                  </div>
                  <Badge variant="outline" className="mb-3 text-xs">
                    {outcome.salary}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {outcome.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STUDENT TESTIMONIALS (if any for this course) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-muted/30">
          <Container>
            <SectionHeader
              title="Student Stories"
              subtitle={`Hear from ${course.title} graduates`}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <StudentTestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* COURSE FAQ */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {course.faqs.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <SectionHeader
                title="Frequently Asked Questions"
                subtitle={`Common questions about ${course.title}`}
              />
              <TrainingFAQ faqs={course.faqs} />
            </div>
          </Container>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ENROLLMENT FORM */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="enroll" className="py-16 bg-muted/30">
        <Container>
          <div className="mx-auto max-w-2xl">
            <SectionHeader
              title={`Enroll in ${course.title}`}
              subtitle="Fill out the form and our team will contact you within 24 hours."
            />
            <Card>
              <CardContent className="pt-6">
                <TrainingForm defaultCourse={course.slug} />
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* RELATED COURSES */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {relatedCourses.length > 0 && (
        <section className="py-16">
          <Container>
            <SectionHeader
              title="Explore Other Courses"
              subtitle="Find the right program to match your career goals"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCourses.map((c) => (
                <CourseCard key={c.id} course={c} compact />
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/training">
                  View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Container>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BOTTOM CTA */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-muted/30">
        <Container>
          <TrainingCta variant="gradient" />
        </Container>
      </section>
    </>
  );
}
