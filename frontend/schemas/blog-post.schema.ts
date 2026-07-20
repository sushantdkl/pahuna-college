import { z } from "zod";

export const blogPostStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

export const blogPostFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words and hyphens for the slug")
    .max(220)
    .optional()
    .or(z.literal("")),
  excerpt: z.string().trim().min(1, "Excerpt is required").max(600),
  content: z.string().trim().min(1, "Content is required").max(50000),
  category: z.string().trim().max(80).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
  featuredImage: z
    .string()
    .trim()
    .max(500)
    .refine(
      (value) => value === "" || (value.startsWith("/") && !value.startsWith("//")),
      "Featured image must be a local path from the public folder",
    )
    .optional(),
  status: blogPostStatusSchema.default("DRAFT"),
});

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>;
export type BlogPostStatus = z.infer<typeof blogPostStatusSchema>;
