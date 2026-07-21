import { z } from "zod";

export const TrainingCourseStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

export const TrainingEnrollmentStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
]);

export type TrainingCourseStatus = z.infer<
  typeof TrainingCourseStatusSchema
>;
export type TrainingEnrollmentStatus = z.infer<
  typeof TrainingEnrollmentStatusSchema
>;
