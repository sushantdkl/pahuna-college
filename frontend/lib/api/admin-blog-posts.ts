import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/axios-instance";
import type { BlogPost } from "@/lib/api/blog-posts";
import type {
  BlogPostFormData,
  BlogPostStatus,
} from "@/schemas/blog-post.schema";

export type AdminBlogPost = BlogPost;

export type AdminBlogPostListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: BlogPostStatus | "";
  category?: string;
  tag?: string;
};

function queryString(params: AdminBlogPostListParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export function getAdminBlogPosts(params: AdminBlogPostListParams = {}) {
  return apiGet<AdminBlogPost[]>(
    `/admin/blog-posts${queryString(params)}`,
    true,
  );
}

export function getAdminBlogPost(id: string) {
  return apiGet<AdminBlogPost>(`/admin/blog-posts/${id}`, true);
}

export function createAdminBlogPost(payload: BlogPostFormData) {
  return apiPost<AdminBlogPost>("/admin/blog-posts", payload, true);
}

export function updateAdminBlogPost(
  id: string,
  payload: Partial<BlogPostFormData>,
) {
  return apiPatch<AdminBlogPost>(`/admin/blog-posts/${id}`, payload, true);
}

export function deleteAdminBlogPost(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/blog-posts/${id}`, true);
}
