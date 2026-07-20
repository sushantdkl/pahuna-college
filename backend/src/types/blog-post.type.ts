import { z } from "zod";

export const BlogPostStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

export type BlogPostStatus = z.infer<typeof BlogPostStatusSchema>;
