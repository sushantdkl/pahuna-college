import { z } from "zod";

const loose = z
  .object({
    fullName: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
    title: z.string().optional(),
    type: z.string().optional(),
    inquiryType: z.string().optional(),
    hotelId: z.string().optional(),
    hotelName: z.string().optional(),
    tripPackageId: z.string().optional(),
    destinationId: z.string().optional(),
    experienceId: z.string().optional(),
    itineraryId: z.string().optional(),
    serviceProviderId: z.string().optional(),
    preferredTime: z.string().optional(),
    checkIn: z.union([z.string(), z.date()]).optional(),
    checkOut: z.union([z.string(), z.date()]).optional(),
    guests: z.union([z.number(), z.string()]).optional(),
    rooms: z.union([z.number(), z.string()]).optional(),
    courseId: z.string().optional(),
    service: z.string().optional(),
    source: z.string().optional(),
  })
  .passthrough();

export const contactSchema = loose;
export const callbackSchema = loose;
export const hotelLeadSchema = loose;
export const inquirySchema = loose;
export const consultingLeadSchema = loose;
export const partnerSchema = loose;
export const trainingEnrollmentSchema = loose;
export const newsletterSchema = loose;

export type ContactInput = z.infer<typeof contactSchema>;
export type CallbackInput = z.infer<typeof callbackSchema>;
export type HotelLeadInput = z.infer<typeof hotelLeadSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type ConsultingLeadInput = z.infer<typeof consultingLeadSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type TrainingEnrollmentInput = z.infer<typeof trainingEnrollmentSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type HotelFilters = any;
