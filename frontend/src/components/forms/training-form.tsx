// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormSuccess } from "@/components/shared/form-success";
import {
  trainingEnrollmentSchema,
  type TrainingEnrollmentInput,
} from "@backend/lib/validations";
import { submitTrainingEnrollment } from "@/actions/training";
import { trainingCourses } from "@backend/services";

interface TrainingFormProps {
  defaultCourse?: string;
}

export function TrainingForm({ defaultCourse }: TrainingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TrainingEnrollmentInput>({
    resolver: zodResolver(trainingEnrollmentSchema as never) as Resolver<TrainingEnrollmentInput>,
    defaultValues: {
      courseId: defaultCourse || "",
    },
  });

  async function onSubmit(data: TrainingEnrollmentInput) {
    setIsSubmitting(true);
    try {
      const result = await submitTrainingEnrollment(data);
      if (result.success) {
        setSubmitted(true);
        reset();
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <FormSuccess
        title="Enrollment Submitted!"
        message="Our team will review your application and contact you within 24 hours with next steps and payment details."
        details="Check your email for a confirmation. If you don't hear from us within 24 hours, call +977-083-520000."
        actions={[
          { label: "View All Courses", href: "/training", variant: "default" },
        ]}
        onReset={() => setSubmitted(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section 1: Course Selection */}
      <div>
        <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <GraduationCap className="h-4 w-4 text-primary" />
          Course Selection
        </h4>
        <div className="space-y-2">
          <Label htmlFor="courseId">Select Course *</Label>
          <Select
            defaultValue={defaultCourse}
            onValueChange={(value) => setValue("courseId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a course" />
            </SelectTrigger>
            <SelectContent>
              {trainingCourses.map((course) => (
                <SelectItem key={course.slug} value={course.slug}>
                  {course.title} — {course.duration}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.courseId && (
            <p className="text-sm text-destructive">{errors.courseId.message}</p>
          )}
        </div>
      </div>

      {/* Section 2: Personal Details */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Personal Details</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Your full name"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              placeholder="+977-..."
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g. 22"
              {...register("age", { valueAsNumber: true })}
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Background */}
      <div>
        <h4 className="text-sm font-semibold mb-3">Background</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="education">Education Level</Label>
            <Select onValueChange={(value) => setValue("education", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select education" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Below SLC/SEE",
                  "SLC/SEE",
                  "+2 / Intermediate",
                  "Bachelor's Degree",
                  "Master's Degree",
                  "Other",
                ].map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Prior Hospitality Experience</Label>
            <Select onValueChange={(value) => setValue("experience", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "No experience",
                  "Less than 1 year",
                  "1-3 years",
                  "3-5 years",
                  "5+ years",
                ].map((exp) => (
                  <SelectItem key={exp} value={exp}>
                    {exp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="motivation">
            Why do you want to take this course? (Optional)
          </Label>
          <Textarea
            id="motivation"
            placeholder="Tell us about your goals and what motivated you to apply..."
            rows={3}
            {...register("motivation")}
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Submit Enrollment
          </>
        )}
      </Button>
    </form>
  );
}


