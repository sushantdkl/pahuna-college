import { Response } from "express";
import { z } from "zod";
import { BlogPostListQueryDTO, CreateBlogPostDTO, UpdateBlogPostDTO } from "../dtos/blog-post.dto";
import { BlogPostService } from "../services/blog-post.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const blogPostService = new BlogPostService();

function readId(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function bodyPayload(body: Record<string, unknown>) {
  return Object.fromEntries(Object.entries({
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    content: body.content,
    coverImage: body.coverImage ?? body.cover_image,
    authorName: body.authorName ?? body.author_name,
    category: body.category,
    tags: body.tags,
    seoTitle: body.seoTitle ?? body.seo_title,
    seoDescription: body.seoDescription ?? body.seo_description,
    status: body.status,
    isFeatured: body.isFeatured ?? body.is_featured,
    publishedAt: body.publishedAt ?? body.published_at,
  }).filter(([, value]) => value !== undefined));
}

function blogPostPayload(req: AuthRequest) {
  const file = req.file;
  const payload = bodyPayload(req.body);

  if (!file) {
    return payload;
  }

  return {
    ...payload,
    coverImage: `/uploads/blog/${file.filename}`,
  };
}

export class AdminBlogPostController {
  async listPosts(req: AuthRequest, res: Response) {
    try {
      const parsed = BlogPostListQueryDTO.safeParse(req.query);
      if (!parsed.success) return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
      const { posts, meta } = await blogPostService.listPosts(parsed.data, false);
      return ApiResponseHelper.success(res, posts, "Blog posts fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async getPost(req: AuthRequest, res: Response) {
    try {
      const post = await blogPostService.getAdminPost(readId(req));
      return ApiResponseHelper.success(res, post, "Blog post fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async createPost(req: AuthRequest, res: Response) {
    try {
      const parsed = CreateBlogPostDTO.safeParse(blogPostPayload(req));
      if (!parsed.success) return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
      const post = await blogPostService.createPost(parsed.data);
      return ApiResponseHelper.success(res, post, "Blog post created successfully", 201);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async updatePost(req: AuthRequest, res: Response) {
    try {
      const parsed = UpdateBlogPostDTO.safeParse(blogPostPayload(req));
      if (!parsed.success) return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
      const post = await blogPostService.updatePost(readId(req), parsed.data);
      return ApiResponseHelper.success(res, post, "Blog post updated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async deletePost(req: AuthRequest, res: Response) {
    try {
      const result = await blogPostService.deletePost(readId(req));
      return ApiResponseHelper.success(res, result, "Blog post deleted successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }
}
