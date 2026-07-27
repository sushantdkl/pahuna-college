import { apiDelete, apiGet, apiPatch, apiPost, resolveApiAssetUrl } from "@/lib/api/axios-instance";

export type BlogPostStatus = "DRAFT" | "PUBLISHED";

export type BlogPost = {
  _id: string;
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
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: BlogPostStatus | "";
  featured?: boolean | "";
  category?: string;
};

export type BlogPostPayload = Omit<Partial<BlogPost>, "_id" | "createdAt" | "updatedAt">;

function queryString(params: BlogPostListParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export function normalizeBlogPost(post: BlogPost): BlogPost {
  return {
    ...post,
    coverImage: resolveApiAssetUrl(post.coverImage),
  };
}

export async function getBlogPosts(params: BlogPostListParams = {}) {
  const response = await apiGet<BlogPost[]>(`/blog-posts${queryString(params)}`);
  return { ...response, data: response.data?.map(normalizeBlogPost) || [] };
}

export async function getBlogPost(slug: string) {
  const response = await apiGet<BlogPost>(`/blog-posts/${encodeURIComponent(slug)}`);
  return { ...response, data: response.data ? normalizeBlogPost(response.data) : null };
}

export async function getAdminBlogPosts(params: BlogPostListParams = {}) {
  const response = await apiGet<BlogPost[]>(`/admin/blog-posts${queryString(params)}`, true);
  return { ...response, data: response.data?.map(normalizeBlogPost) || [] };
}

function toBlogPostFormData(payload: BlogPostPayload, coverImageFile?: File | null) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === "") return;

    if (Array.isArray(value)) {
      formData.set(key, value.join(", "));
      return;
    }

    formData.set(key, String(value));
  });

  if (coverImageFile) {
    formData.set("coverImageFile", coverImageFile);
  }

  return formData;
}

export function createAdminBlogPost(
  payload: BlogPostPayload,
  coverImageFile?: File | null,
) {
  return apiPost<BlogPost>(
    "/admin/blog-posts",
    coverImageFile ? toBlogPostFormData(payload, coverImageFile) : payload,
    true,
  );
}

export function updateAdminBlogPost(
  id: string,
  payload: BlogPostPayload,
  coverImageFile?: File | null,
) {
  return apiPatch<BlogPost>(
    `/admin/blog-posts/${id}`,
    coverImageFile ? toBlogPostFormData(payload, coverImageFile) : payload,
    true,
  );
}

export function deleteAdminBlogPost(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/blog-posts/${id}`, true);
}
