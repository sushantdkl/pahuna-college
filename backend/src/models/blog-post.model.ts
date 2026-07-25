import mongoose, { Document, Schema } from "mongoose";

export type BlogPostStatus = "DRAFT" | "PUBLISHED";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorName: string;
  category?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: BlogPostStatus;
  isFeatured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostMongoSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 700 },
    content: { type: String, required: true, trim: true },
    coverImage: { type: String, trim: true },
    authorName: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    status: { type: String, enum: ["DRAFT", "PUBLISHED"], default: "DRAFT" },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

BlogPostMongoSchema.index({ status: 1, publishedAt: -1, createdAt: -1 });
BlogPostMongoSchema.index({ title: "text", excerpt: "text", content: "text", tags: "text" });

export const BlogPostModel = mongoose.model<IBlogPost>("BlogPost", BlogPostMongoSchema);
