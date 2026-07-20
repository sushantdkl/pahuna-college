import { apiGet } from "@/lib/api/axios-instance";
import type { BlogPostStatus } from "@/schemas/blog-post.schema";

export type BlogAuthor = {
  _id: string;
  fullName: string;
  email?: string;
  profileImage?: string;
};

export type BlogPost = {
  _id: string;
  authorId: string | BlogAuthor;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category?: string;
  tags: string[];
  featuredImage?: string;
  status: BlogPostStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
};

function queryString(params: BlogPostListParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export function getPublishedBlogPosts(params: BlogPostListParams = {}) {
  return apiGet<BlogPost[]>(`/blog-posts${queryString(params)}`);
}

export function getPublishedBlogPost(slug: string) {
  return apiGet<BlogPost>(`/blog-posts/${encodeURIComponent(slug)}`);
}
