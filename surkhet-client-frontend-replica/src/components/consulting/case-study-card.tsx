import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@server/lib/utils";
import type { CaseStudy, ConsultingTestimonial } from "@server/services";

// ── Case Study Card ──

interface CaseStudyCardProps {
  study: CaseStudy;
}

export function CaseStudyCard({ study }: CaseStudyCardProps) {
  return (
    <Card className="overflow-hidden border hover:shadow-lg transition-all">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/20">
            {study.businessType}
          </Badge>
          <span className="text-xs text-white/60">{study.duration}</span>
        </div>
        <h3 className="text-xl font-bold">{study.clientName}</h3>
        <p className="text-sm text-white/70 mt-1">{study.location}</p>
      </div>

      <CardContent className="pt-6 space-y-5">
        {/* Challenge & Solution */}
        <div>
          <h4 className="font-semibold text-sm text-red-600 mb-1">
            The Challenge
          </h4>
          <p className="text-sm text-muted-foreground">{study.challenge}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-green-600 mb-1">
            Our Solution
          </h4>
          <p className="text-sm text-muted-foreground">{study.solution}</p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 gap-3">
          {study.results.map((r) => (
            <div
              key={r.metric}
              className="rounded-lg bg-muted/50 p-3 text-center"
            >
              <p className="text-lg font-bold text-primary">{r.value}</p>
              <p className="text-xs text-muted-foreground">{r.metric}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        {study.testimonial && (
          <div className="rounded-xl bg-muted/30 p-4 border-l-4 border-primary">
            <Quote className="h-4 w-4 text-primary/40 mb-2" />
            <p className="text-sm italic text-muted-foreground mb-3">
              &ldquo;{study.testimonial.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {getInitials(study.testimonial.author)}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {study.testimonial.author}
                </p>
                <p className="text-xs text-muted-foreground">
                  {study.testimonial.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Testimonial Card ──

interface TestimonialCardProps {
  testimonial: ConsultingTestimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-1 flex flex-col">
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-amber-400 text-amber-400"
            />
          ))}
        </div>

        <Quote className="h-5 w-5 text-primary/30 mb-2" />
        <p className="text-sm text-muted-foreground italic flex-1 mb-4">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div className="flex items-center gap-3 pt-3 border-t">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {getInitials(testimonial.author)}
          </div>
          <div>
            <p className="text-sm font-semibold">{testimonial.author}</p>
            <p className="text-xs text-muted-foreground">
              {testimonial.role}, {testimonial.company}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


