import { Response } from "express";
import { z } from "zod";
import {
  AdminBlogPostListQueryDTO,
  AdminCreateBlogPostDTO,
  AdminUpdateBlogPostDTO,
} from "../dtos/blog-post.dto";
import { AdminBlogPostService } from "../services/admin-blog-post.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminBlogPostService = new AdminBlogPostService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function blogPostBody(body: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      tags: body.tags,
      featuredImage: body.featuredImage ?? body.featured_image,
      status: body.status,
    }).filter(([, value]) => value !== undefined),
  );
}

export class AdminBlogPostController {
  async listPosts(req: AuthRequest, res: Response) {
    try {
      const parsedQuery = AdminBlogPostListQueryDTO.safeParse(req.query);

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { posts, meta } = await adminBlogPostService.listPosts(
        parsedQuery.data,
      );

      return ApiResponseHelper.success(
        res,
        posts,
        "Blog posts fetched successfully",
        200,
        meta,
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async getPost(req: AuthRequest, res: Response) {
    try {
      const post = await adminBlogPostService.getPost(readIdParam(req));

      return ApiResponseHelper.success(
        res,
        post,
        "Blog post fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async createPost(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(
          res,
          "Authentication token is required",
          401,
        );
      }

      const parsedData = AdminCreateBlogPostDTO.safeParse(blogPostBody(req.body));

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const post = await adminBlogPostService.createPost(
        req.user._id.toString(),
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        post,
        "Blog post created successfully",
        201,
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updatePost(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminUpdateBlogPostDTO.safeParse(blogPostBody(req.body));

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const post = await adminBlogPostService.updatePost(
        readIdParam(req),
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        post,
        "Blog post updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deletePost(req: AuthRequest, res: Response) {
    try {
      const result = await adminBlogPostService.deletePost(readIdParam(req));

      return ApiResponseHelper.success(
        res,
        result,
        "Blog post deleted successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
