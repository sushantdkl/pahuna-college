import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const callbackSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().optional(),
  service: z.string().optional(),
});
export type CallbackInput = z.infer<typeof callbackSchema>;

export const consultingLeadSchema = z.object({}).passthrough();
export type ConsultingLeadInput = z.infer<typeof consultingLeadSchema>;
export const trainingEnrollmentSchema = z.object({}).passthrough();
export type TrainingEnrollmentInput = z.infer<typeof trainingEnrollmentSchema>;
export const newsletterSchema = z.object({ email: z.string().email() });
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export const partnerSchema = z.object({}).passthrough();
export type PartnerInput = z.infer<typeof partnerSchema>;
export const inquirySchema = z.object({}).passthrough();
export type InquiryInput = z.infer<typeof inquirySchema>;
export const hotelLeadSchema = z.object({}).passthrough();
export type HotelLeadInput = z.infer<typeof hotelLeadSchema>;
export type HotelFilters = Record<string, string>;
