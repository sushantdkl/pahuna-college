"use server";

import { db } from "@server/lib/db";
import {
  trainingEnrollmentSchema,
  type TrainingEnrollmentInput,
} from "@server/lib/validations";
import { isObjectId } from "@server/lib/prisma-id";
import {
  sendEmails,
  buildTrainingConfirmationEmail,
} from "@server/lib/email";
import type { ActionResult } from "@server/lib/types/actions";

async function resolveCourse(value: string) {
  if (isObjectId(value)) {
    const course = await db.trainingCourse.findUnique({
      where: { id: value },
      select: { id: true, title: true },
    });
    if (course) return course;
  }

  return db.trainingCourse.findUnique({
    where: { slug: value },
    select: { id: true, title: true },
  });
}

export async function submitTrainingEnrollment(data: TrainingEnrollmentInput): Promise<ActionResult> {
  const parsed = trainingEnrollmentSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  const d = parsed.data;

  try {
    const course = await resolveCourse(d.courseId);

    if (!course) {
      return { success: false, error: "Selected course is not available." };
    }

    await db.trainingEnrollment.create({
      data: {
        fullName: d.fullName,
        email: d.email,
        phone: d.phone,
        age: d.age || null,
        education: d.education || null,
        courseId: course.id,
        experience: d.experience || null,
        motivation: d.motivation || null,
      },
    });

    // Send user confirmation + admin notification (non-blocking)
    const confirmationEmail = buildTrainingConfirmationEmail({
      studentName: d.fullName,
      courseName: course.title,
    });
    sendEmails(
      { ...confirmationEmail, to: d.email },
      {
        type: "Training Enrollment",
        name: d.fullName,
        email: d.email,
        details: [
          `Phone: ${d.phone}`,
          `Course: ${d.courseId}`,
          d.age ? `Age: ${d.age}` : null,
          d.education ? `Education: ${d.education}` : null,
          d.experience ? `Experience: ${d.experience}` : null,
          d.motivation ? `Motivation: ${d.motivation}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      },
    );

    return { success: true };
  } catch (error) {
    console.error("Training enrollment error:", error);
    return { success: false, error: "Failed to submit enrollment. Please try again." };
  }
}


