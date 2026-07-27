import { Request, Response } from "express";
import { z } from "zod";
import { BlogPostListQueryDTO } from "../dtos/blog-post.dto";
import { BlogPostService } from "../services/blog-post.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const blogPostService = new BlogPostService();

function readSlug(req: Request) {
  const slug = req.params.slug;
  return Array.isArray(slug) ? slug[0] : slug;
}

export class BlogPostController {
  async listPosts(req: Request, res: Response) {
    try {
      const parsed = BlogPostListQueryDTO.safeParse(req.query);
      if (!parsed.success) return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
      const { posts, meta } = await blogPostService.listPosts(parsed.data, true);
      return ApiResponseHelper.success(res, posts, "Blog posts fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async getPost(req: Request, res: Response) {
    try {
      const post = await blogPostService.getPublicPost(readSlug(req));
      return ApiResponseHelper.success(res, post, "Blog post fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }
}
