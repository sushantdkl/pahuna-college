import { z } from "zod";
import { InquiryStatusSchema, InquiryTypeSchema } from "../types/inquiry.type";

const mongoId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB id");

export const CreateInquiryDTO = z.object({
  hotelId: mongoId.optional(),
  tripPackageId: mongoId.optional(),
  hotelName: z.string().trim().min(1).max(160).optional(),
  title: z.string().trim().min(1, "Title is required").max(160),
  message: z.string().trim().min(1, "Message is required").max(5000),
  inquiryType: InquiryTypeSchema,
});

export type CreateInquiryDTO = z.infer<typeof CreateInquiryDTO>;

export const AdminUpdateInquiryDTO = z
  .object({
    status: InquiryStatusSchema.optional(),
    response: z.string().trim().min(1).max(5000).optional(),
    assignedTo: mongoId.optional(),
  })
  .strict()
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one inquiry field must be provided",
  );

export type AdminUpdateInquiryDTO = z.infer<typeof AdminUpdateInquiryDTO>;

export const AdminInquiryListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  status: InquiryStatusSchema.optional(),
  inquiryType: InquiryTypeSchema.optional(),
  hotelId: mongoId.optional(),
  tripPackageId: mongoId.optional(),
});

export type AdminInquiryListQueryDTO = z.infer<
  typeof AdminInquiryListQueryDTO
>;
