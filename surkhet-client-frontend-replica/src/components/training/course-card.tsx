"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Users,
  MapPin,
  IndianRupee,
  Coffee,
  Hotel,
  ConciergeBell,
  SprayCan,
  HeartHandshake,
  Sparkles,
  GraduationCap,
  BarChart3,
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
import type { TrainingCourse, TrainingIconName } from "@server/services";
import { formatPrice } from "@server/lib/utils";

export const trainingIconMap: Record<TrainingIconName, LucideIcon> = {
  Coffee,
  Hotel,
  ConciergeBell,
  SprayCan,
  HeartHandshake,
  Sparkles,
  GraduationCap,
  Users,
};

const colorMap: Record<string, { bg: string; text: string; badge: string; border: string }> = {
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    border: "border-amber-200 dark:border-amber-800",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    border: "border-blue-200 dark:border-blue-800",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/20",
    text: "text-violet-600 dark:text-violet-400",
    badge: "bg-violet-100 text-violet-800 border-violet-200",
    border: "border-violet-200 dark:border-violet-800",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950/20",
    text: "text-teal-600 dark:text-teal-400",
    badge: "bg-teal-100 text-teal-800 border-teal-200",
    border: "border-teal-200 dark:border-teal-800",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/20",
    text: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    border: "border-rose-200 dark:border-rose-800",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    text: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
    border: "border-indigo-200 dark:border-indigo-800",
  },
};

// ── Compact Course Card (for grids) ──

interface CourseCardProps {
  course: TrainingCourse;
  compact?: boolean;
}

export function CourseCard({ course, compact = false }: CourseCardProps) {
  const colors = colorMap[course.color] || colorMap.amber;
  const Icon = trainingIconMap[course.icon];

  if (compact) {
    return (
      <Card className="overflow-hidden border hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} mb-3`}>
            <Icon className={`h-6 w-6 ${colors.text}`} />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={`text-xs ${colors.badge}`}>
              {course.level}
            </Badge>
            {course.isUpcoming && (
              <Badge variant="secondary" className="text-xs">
                Enrolling Now
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{course.tagline}</p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-sm text-muted-foreground mb-4 flex-1">
            {course.shortDesc}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5 text-primary" />
              {formatPrice(course.fee)}
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              Max {course.maxStudents}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {course.mode}
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/training/${course.slug}`}>
              View Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Full Featured Card (horizontal layout for featured section) ──
  return (
    <Card className={`overflow-hidden border ${colors.border} hover:shadow-xl transition-all duration-300 group`}>
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* Left panel */}
        <div className={`${colors.bg} p-6 flex flex-col items-center justify-center text-center`}>
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 dark:bg-black/20 mb-4`}>
            <Icon className={`h-8 w-8 ${colors.text}`} />
          </div>
          <h3 className="text-lg font-bold mb-1">{course.title}</h3>
          <p className="text-xs text-muted-foreground mb-3">{course.tagline}</p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <Badge variant="outline" className={`text-xs ${colors.badge}`}>
              {course.level}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {course.mode}
            </Badge>
          </div>
          <div className="mt-4 text-sm font-semibold">
            {formatPrice(course.fee)}
          </div>
        </div>

        {/* Right content */}
        <div className="p-6 flex flex-col">
          <p className="text-sm text-muted-foreground mb-4">
            {course.shortDesc}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary shrink-0" />
              {course.maxStudents} seats
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              Surkhet
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-primary shrink-0" />
              Certificate
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-1">
            <span className="font-medium">Schedule:</span> {course.schedule}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            <span className="font-medium">Batch:</span> {course.batchInfo}
          </p>

          <div className="flex items-center gap-3 mt-auto">
            <Button asChild size="sm">
              <Link href={`/training/${course.slug}`}>
                View Course <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/training/${course.slug}#enroll`}>
                Enroll Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Testimonial Card ──

interface StudentTestimonialCardProps {
  testimonial: {
    name: string;
    course: string;
    currentRole: string;
    company: string;
    quote: string;
  };
}

export function StudentTestimonialCard({ testimonial }: StudentTestimonialCardProps) {
  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <CardContent className="flex-1 pt-6">
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <BarChart3
              key={i}
              className="h-3.5 w-3.5 text-amber-400 fill-amber-400"
            />
          ))}
        </div>
        <blockquote className="text-sm text-muted-foreground italic mb-4 leading-relaxed">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        <div className="border-t pt-3">
          <p className="text-sm font-semibold">{testimonial.name}</p>
          <p className="text-xs text-primary">{testimonial.currentRole}</p>
          <p className="text-xs text-muted-foreground">{testimonial.company}</p>
          <Badge variant="secondary" className="text-xs mt-2">
            {testimonial.course}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}


