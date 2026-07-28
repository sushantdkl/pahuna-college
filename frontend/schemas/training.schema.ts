import { z } from "zod";

export const trainingCourseStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

export const trainingEnrollmentStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
]);

export const trainingCourseFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(180),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words and hyphens")
    .max(220)
    .optional()
    .or(z.literal("")),
  description: z.string().trim().min(1, "Description is required").max(10000),
  category: z.string().trim().max(100).optional(),
  duration: z.string().trim().max(80).optional(),
  price: z.number().min(0).optional(),
  level: z.string().trim().max(80).optional(),
  mode: z.string().trim().max(80).optional(),
  location: z.string().trim().max(160).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  maxParticipants: z.number().int().min(1).optional(),
  image: z
    .string()
    .trim()
    .max(500)
    .refine(
      (value) => value === "" || (value.startsWith("/") && !value.startsWith("//")),
      "Image must be a local public path",
    )
    .optional(),
  status: trainingCourseStatusSchema.default("DRAFT"),
  isActive: z.boolean().default(true),
});

export const trainingEnrollmentFormSchema = z.object({
  courseId: z.string().trim().min(1, "Choose a course"),
  name: z.string().trim().min(2, "Name is required").max(120).optional(),
  fullName: z.string().trim().min(2, "Full name is required").max(120).optional(),
  email: z.string().trim().email("Enter a valid email").max(254),
  phone: z.string().trim().min(7, "Phone is required").max(40),
  age: z.number().int().min(0).max(120).optional(),
  education: z.string().trim().max(120).optional(),
  educationLevel: z.string().trim().max(120).optional(),
  experience: z.string().trim().max(120).optional(),
  priorExperience: z.string().trim().max(120).optional(),
  message: z.string().trim().max(3000).optional(),
  motivation: z.string().trim().max(3000).optional(),
}).refine((data) => data.name || data.fullName, {
  message: "Full name is required",
  path: ["fullName"],
});

export type TrainingCourseStatus = z.infer<
  typeof trainingCourseStatusSchema
>;
export type TrainingEnrollmentStatus = z.infer<
  typeof trainingEnrollmentStatusSchema
>;
export type TrainingCourseFormData = z.infer<
  typeof trainingCourseFormSchema
>;
export type TrainingEnrollmentFormData = z.infer<
  typeof trainingEnrollmentFormSchema
>;
