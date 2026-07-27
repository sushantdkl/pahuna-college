import { z } from "zod";

const optionalText = (maximum: number) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().trim().max(maximum).optional(),
  );

const textList = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return value;
}, z.array(z.string().trim().min(1).max(80)).max(30));

const optionalBoolean = z.preprocess(
  (value) => value === "" || value === undefined ? undefined : value === true || value === "true",
  z.boolean().optional(),
);

const booleanField = (defaultValue: boolean) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === undefined || value === null) return defaultValue;
      return value === true || value === "true";
    },
    z.boolean(),
  );

const slugField = z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase words and hyphens").max(220).optional();

const blogPostFields = z.object({
  title: z.string().trim().min(1, "Title is required").max(220),
  slug: slugField,
  excerpt: z.string().trim().min(1, "Excerpt is required").max(700),
  content: z.string().trim().min(1, "Content is required").max(50000),
  coverImage: optionalText(500),
  authorName: z.string().trim().min(1, "Author is required").max(160),
  category: optionalText(120),
  tags: textList.default([]),
  seoTitle: optionalText(220),
  seoDescription: optionalText(300),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  isFeatured: booleanField(false),
  publishedAt: z.coerce.date().optional(),
});

const hasUpdateValue = (payload: Record<string, unknown>) => Object.values(payload).some((value) => value !== undefined);

export const CreateBlogPostDTO = blogPostFields;
export type CreateBlogPostDTO = z.infer<typeof CreateBlogPostDTO>;

export const UpdateBlogPostDTO = blogPostFields.partial().refine(hasUpdateValue, "At least one blog post field must be provided");
export type UpdateBlogPostDTO = z.infer<typeof UpdateBlogPostDTO>;

export const BlogPostListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  featured: optionalBoolean,
  category: z.string().trim().optional(),
});
export type BlogPostListQueryDTO = z.infer<typeof BlogPostListQueryDTO>;
