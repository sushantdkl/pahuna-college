import mongoose from "mongoose";
import {
  AdminBlogPostListQueryDTO,
  AdminCreateBlogPostDTO,
  AdminUpdateBlogPostDTO,
} from "../dtos/blog-post.dto";
import { HttpException } from "../exceptions/http-exception";
import { BlogPostModel } from "../models/blog-post.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function removeUndefined<T extends Record<string, unknown>>(payload: T) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
}

export class AdminBlogPostService {
  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid blog post id");
    }
  }

  private populatePost(query: ReturnType<typeof BlogPostModel.findById>) {
    return query.populate("authorId", "fullName email profileImage");
  }

  private async ensureUniqueSlug(slug: string, exceptId?: string) {
    const existing = await BlogPostModel.exists({
      slug,
      ...(exceptId ? { _id: { $ne: exceptId } } : {}),
    });

    if (existing) {
      throw new HttpException(400, "Blog post slug already exists");
    }
  }

  private buildFilter(params: AdminBlogPostListQueryDTO) {
    const filter: Record<string, unknown> = {};

    if (params.status) filter.status = params.status;
    if (params.category) {
      filter.category = {
        $regex: `^${escapeRegex(params.category)}$`,
        $options: "i",
      };
    }
    if (params.tag) {
      filter.tags = {
        $regex: `^${escapeRegex(params.tag)}$`,
        $options: "i",
      };
    }
    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [
        { title: regex },
        { slug: regex },
        { excerpt: regex },
        { content: regex },
        { category: regex },
        { tags: regex },
      ];
    }

    return filter;
  }

  async listPosts(params: AdminBlogPostListQueryDTO) {
    const filter = this.buildFilter(params);
    const skip = (params.page - 1) * params.limit;
    const [posts, total, totalPosts, publishedPosts, draftPosts, archivedPosts] =
      await Promise.all([
        BlogPostModel.find(filter)
          .populate("authorId", "fullName email profileImage")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(params.limit),
        BlogPostModel.countDocuments(filter),
        BlogPostModel.countDocuments(),
        BlogPostModel.countDocuments({ status: "PUBLISHED" }),
        BlogPostModel.countDocuments({ status: "DRAFT" }),
        BlogPostModel.countDocuments({ status: "ARCHIVED" }),
      ]);

    return {
      posts,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
        summary: {
          total: totalPosts,
          published: publishedPosts,
          draft: draftPosts,
          archived: archivedPosts,
        },
      },
    };
  }

  async getPost(id: string) {
    this.assertValidId(id);
    const post = await this.populatePost(BlogPostModel.findById(id));

    if (!post) {
      throw new HttpException(404, "Blog post not found");
    }

    return post;
  }

  async createPost(authorId: string, payload: AdminCreateBlogPostDTO) {
    const slug = slugify(payload.slug || payload.title);

    if (!slug) {
      throw new HttpException(400, "A valid blog post slug is required");
    }

    await this.ensureUniqueSlug(slug);
    const post = await BlogPostModel.create({
      ...payload,
      authorId,
      slug,
      publishedAt: payload.status === "PUBLISHED" ? new Date() : undefined,
    });

    return this.getPost(post._id.toString());
  }

  async updatePost(id: string, payload: AdminUpdateBlogPostDTO) {
    this.assertValidId(id);
    const existing = await BlogPostModel.findById(id);

    if (!existing) {
      throw new HttpException(404, "Blog post not found");
    }

    const slug = payload.slug ? slugify(payload.slug) : undefined;

    if (slug) {
      await this.ensureUniqueSlug(slug, id);
    }

    const nextStatus = payload.status ?? existing.status;
    const updatePayload = removeUndefined({
      ...payload,
      slug,
      status: nextStatus,
      tags: payload.tags ?? existing.tags,
      publishedAt:
        nextStatus === "PUBLISHED"
          ? existing.publishedAt || new Date()
          : existing.publishedAt,
    });
    const post = await this.populatePost(
      BlogPostModel.findByIdAndUpdate(id, updatePayload, {
        returnDocument: "after",
        runValidators: true,
      }),
    );

    return post;
  }

  async deletePost(id: string) {
    this.assertValidId(id);
    const post = await BlogPostModel.findByIdAndDelete(id);

    if (!post) {
      throw new HttpException(404, "Blog post not found");
    }

    return { deleted: true };
  }
}
