import mongoose, { Document, Schema } from "mongoose";
import { BlogPostStatus } from "../types/blog-post.type";

export interface IBlogPost extends Document {
  _id: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category?: string;
  tags: string[];
  featuredImage?: string;
  status: BlogPostStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostMongoSchema: Schema<IBlogPost> = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 220,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 600,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50000,
    },
    category: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    tags: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
      index: true,
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
  },
);

BlogPostMongoSchema.index({ publishedAt: -1, createdAt: -1 });
BlogPostMongoSchema.index({
  title: "text",
  slug: "text",
  excerpt: "text",
  content: "text",
  category: "text",
  tags: "text",
});

export const BlogPostModel = mongoose.model<IBlogPost>(
  "BlogPost",
  BlogPostMongoSchema,
);
