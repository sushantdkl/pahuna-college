import { z } from "zod";
import { BlogPostStatusSchema } from "../types/blog-post.type";

const tags = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value;
}, z.array(z.string().trim().min(1).max(50)).max(30));

const localImagePath = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => value === "" || (value.startsWith("/") && !value.startsWith("//")),
    "Featured image must be a local public path",
  )
  .optional();

const blogPostFields = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase words and hyphens")
    .max(220)
    .optional(),
  excerpt: z.string().trim().min(1, "Excerpt is required").max(600),
  content: z.string().trim().min(1, "Content is required").max(50000),
  category: z.string().trim().max(80).optional(),
  tags,
  featuredImage: localImagePath,
  status: BlogPostStatusSchema,
});

export const AdminCreateBlogPostDTO = blogPostFields.extend({
  status: BlogPostStatusSchema.default("DRAFT"),
  tags: tags.default([]),
});

export type AdminCreateBlogPostDTO = z.infer<typeof AdminCreateBlogPostDTO>;

export const AdminUpdateBlogPostDTO = blogPostFields
  .partial()
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one blog post field must be provided",
  );

export type AdminUpdateBlogPostDTO = z.infer<typeof AdminUpdateBlogPostDTO>;

export const BlogPostListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  search: z.string().trim().optional(),
  category: z.string().trim().max(80).optional(),
  tag: z.string().trim().max(50).optional(),
});

export type BlogPostListQueryDTO = z.infer<typeof BlogPostListQueryDTO>;

export const AdminBlogPostListQueryDTO = BlogPostListQueryDTO.extend({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: BlogPostStatusSchema.optional(),
});

export type AdminBlogPostListQueryDTO = z.infer<
  typeof AdminBlogPostListQueryDTO
>;
