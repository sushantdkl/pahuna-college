import { z } from "zod";
import {
  ContactMessageSchema,
  ContactMessageStatusSchema,
} from "../types/contact-message.type";

export const CreateContactMessageDTO = ContactMessageSchema.pick({
  name: true,
  email: true,
  phone: true,
  subject: true,
  message: true,
});

export type CreateContactMessageDTO = z.infer<
  typeof CreateContactMessageDTO
>;

export const AdminUpdateContactMessageDTO = z
  .object({
    status: ContactMessageStatusSchema.optional(),
    response: z.string().trim().min(1).max(5000).optional(),
  })
  .strict()
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one contact message field must be provided",
  );

export type AdminUpdateContactMessageDTO = z.infer<
  typeof AdminUpdateContactMessageDTO
>;

export const AdminContactMessageListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  status: ContactMessageStatusSchema.optional(),
});

export type AdminContactMessageListQueryDTO = z.infer<
  typeof AdminContactMessageListQueryDTO
>;
