import { z } from "zod";
import {
  TrainingCourseStatusSchema,
  TrainingEnrollmentStatusSchema,
} from "../types/training.type";

const optionalText = (maximum: number) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().trim().max(maximum).optional(),
  );

const localImagePath = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) =>
      value === "" || (value.startsWith("/") && !value.startsWith("//")),
    "Image must be a local public path",
  )
  .optional();

const optionalDate = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.date().optional(),
);

const courseFields = z.object({
    title: z.string().trim().min(1, "Title is required").max(180),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must use lowercase words and hyphens",
      )
      .max(220)
      .optional(),
    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(10000),
    category: optionalText(100),
    duration: optionalText(80),
    price: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.coerce.number().min(0).optional(),
    ),
    level: optionalText(80),
    mode: optionalText(80),
    location: optionalText(160),
    startDate: optionalDate,
    endDate: optionalDate,
    maxParticipants: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.coerce.number().int().min(1).optional(),
    ),
    image: localImagePath,
    status: TrainingCourseStatusSchema.optional(),
  isActive: z.boolean().optional(),
});

export const CreateTrainingCourseDTO = courseFields
  .extend({
    status: TrainingCourseStatusSchema.default("DRAFT"),
    isActive: z.boolean().default(true),
  })
  .refine(
    (payload) =>
      !payload.startDate ||
      !payload.endDate ||
      payload.endDate >= payload.startDate,
    "End date cannot be before start date",
  );

export type CreateTrainingCourseDTO = z.infer<
  typeof CreateTrainingCourseDTO
>;

export const UpdateTrainingCourseDTO = courseFields
  .partial()
  .refine(
    (payload) =>
      !payload.startDate ||
      !payload.endDate ||
      payload.endDate >= payload.startDate,
    "End date cannot be before start date",
  )
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one training course field must be provided",
  );

export type UpdateTrainingCourseDTO = z.infer<
  typeof UpdateTrainingCourseDTO
>;

export const TrainingCourseListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  search: z.string().trim().optional(),
  category: z.string().trim().max(100).optional(),
});

export type TrainingCourseListQueryDTO = z.infer<
  typeof TrainingCourseListQueryDTO
>;

export const AdminTrainingCourseListQueryDTO =
  TrainingCourseListQueryDTO.extend({
    limit: z.coerce.number().int().min(1).max(50).default(10),
    status: TrainingCourseStatusSchema.optional(),
    active: z
      .preprocess(
        (value) =>
          value === "" || value === undefined ? undefined : value === "true",
        z.boolean().optional(),
      )
      .optional(),
  });

export type AdminTrainingCourseListQueryDTO = z.infer<
  typeof AdminTrainingCourseListQueryDTO
>;

export const CreateTrainingEnrollmentDTO = z
  .object({
    courseId: z.string().trim().min(1, "Course is required"),
    name: optionalText(120),
    fullName: optionalText(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(7).max(40),
    age: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.coerce.number().int().min(0).max(120).optional(),
    ),
    education: optionalText(120),
    educationLevel: optionalText(120),
    experience: optionalText(120),
    priorExperience: optionalText(120),
    message: optionalText(3000),
    motivation: optionalText(3000),
  })
  .strict()
  .transform((payload) => ({
    ...payload,
    name: payload.name || payload.fullName || "",
    fullName: payload.fullName || payload.name || "",
    education: payload.education || payload.educationLevel,
    educationLevel: payload.educationLevel || payload.education,
    experience: payload.experience || payload.priorExperience,
    priorExperience: payload.priorExperience || payload.experience,
    message: payload.message || payload.motivation,
    motivation: payload.motivation || payload.message,
  }))
  .refine((payload) => payload.name.length >= 2, "Name is required");

export type CreateTrainingEnrollmentDTO = z.infer<
  typeof CreateTrainingEnrollmentDTO
>;

export const UpdateTrainingEnrollmentDTO = z
  .object({
    status: TrainingEnrollmentStatusSchema.optional(),
    response: z.string().trim().max(5000).optional(),
  })
  .strict()
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one training enrollment field must be provided",
  );

export type UpdateTrainingEnrollmentDTO = z.infer<
  typeof UpdateTrainingEnrollmentDTO
>;

export const AdminTrainingEnrollmentListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  status: TrainingEnrollmentStatusSchema.optional(),
  courseId: z.string().trim().optional(),
});

export type AdminTrainingEnrollmentListQueryDTO = z.infer<
  typeof AdminTrainingEnrollmentListQueryDTO
>;

// ===================== Mobile (own-record) DTOs =====================

export const OwnTrainingEnrollmentListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: TrainingEnrollmentStatusSchema.optional(),
});

export type OwnTrainingEnrollmentListQueryDTO = z.infer<
  typeof OwnTrainingEnrollmentListQueryDTO
>;

// Only the applicant details a learner may correct while still PENDING.
// Course and status are deliberately absent.
export const UpdateOwnTrainingEnrollmentDTO = z
  .object({
    fullName: optionalText(120),
    email: z.string().trim().email().max(254).optional(),
    phone: z.string().trim().min(7).max(40).optional(),
    age: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.coerce.number().int().min(0).max(120).optional(),
    ),
    education: optionalText(120),
    experience: optionalText(120),
    motivation: optionalText(3000),
  })
  .strict()
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one enrollment field must be provided",
  );

export type UpdateOwnTrainingEnrollmentDTO = z.infer<
  typeof UpdateOwnTrainingEnrollmentDTO
>;
