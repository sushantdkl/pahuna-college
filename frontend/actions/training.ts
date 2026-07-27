"use server";

import { createTrainingEnrollment } from "@/lib/api/training";
import {
  trainingEnrollmentSchema,
  type TrainingEnrollmentInput,
} from "@server/lib/validations";
import type { ActionResult } from "@server/lib/types/actions";

function text(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function number(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export async function submitTrainingEnrollment(data: TrainingEnrollmentInput): Promise<ActionResult> {
  const parsed = trainingEnrollmentSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  const d = parsed.data;

  try {
    await createTrainingEnrollment({
      courseId: text(d.courseId),
      name: text(d.fullName) || text(d.name),
      fullName: text(d.fullName) || text(d.name),
      email: text(d.email),
      phone: text(d.phone),
      age: number(d.age),
      education: text(d.education),
      educationLevel: text(d.education),
      experience: text(d.experience),
      priorExperience: text(d.experience),
      message: text(d.motivation) || text(d.message),
      motivation: text(d.motivation) || text(d.message),
    });

    return { success: true };
  } catch (error) {
    console.error("Training enrollment error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit enrollment. Please try again.",
    };
  }
}
