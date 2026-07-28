import { z } from "zod";

export const consultingLeadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
]);

export const consultingServiceFormSchema = z.object({
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
  price: z.string().trim().max(120).optional(),
  duration: z.string().trim().max(80).optional(),
  deliverables: z.array(z.string().trim().min(1).max(160)).max(40).default([]),
  image: z
    .string()
    .trim()
    .max(500)
    .refine(
      (value) => value === "" || (value.startsWith("/") && !value.startsWith("//")),
      "Image must be a local public path",
    )
    .optional(),
  isActive: z.boolean().default(true),
});

export const consultingLeadFormSchema = z.object({
  serviceId: z.string().trim().optional(),
  name: z.string().trim().min(2, "Name is required").max(120).optional(),
  contactName: z.string().trim().min(2, "Contact person is required").max(120).optional(),
  email: z.string().trim().email("Enter a valid email").max(254),
  phone: z.string().trim().min(7, "Phone is required").max(40),
  businessName: z.string().trim().max(160).optional(),
  businessType: z.string().trim().max(120).optional(),
  businessStage: z.string().trim().max(120).optional(),
  stage: z.string().trim().max(120).optional(),
  businessSize: z.string().trim().max(120).optional(),
  location: z.string().trim().max(160).optional(),
  serviceType: z.string().trim().max(160).optional(),
  timeline: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(120).optional(),
  budgetRange: z.string().trim().max(120).optional(),
  message: z.string().trim().min(1, "Message is required").max(5000),
}).refine((data) => data.name || data.contactName, {
  message: "Contact person is required",
  path: ["contactName"],
});

export type ConsultingLeadStatus = z.infer<typeof consultingLeadStatusSchema>;
export type ConsultingServiceFormData = z.infer<
  typeof consultingServiceFormSchema
>;
export type ConsultingLeadFormData = z.infer<
  typeof consultingLeadFormSchema
>;
