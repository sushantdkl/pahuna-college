import mongoose from "mongoose";
import { BlogPostListQueryDTO, CreateBlogPostDTO, UpdateBlogPostDTO } from "../dtos/blog-post.dto";
import { HttpException } from "../exceptions/http-exception";
import { BlogPostModel } from "../models/blog-post.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function removeUndefined<T extends Record<string, unknown>>(payload: T) {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
}

export class BlogPostService {
  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException(400, "Invalid blog post id");
  }

  private async ensureUniqueSlug(slug: string, exceptId?: string) {
    const existing = await BlogPostModel.exists({ slug, ...(exceptId ? { _id: { $ne: exceptId } } : {}) });
    if (existing) throw new HttpException(400, "Blog post slug already exists");
  }

  private buildFilter(params: BlogPostListQueryDTO, publicOnly: boolean) {
    const filter: Record<string, unknown> = publicOnly ? { status: "PUBLISHED" } : {};
    if (!publicOnly && params.status) filter.status = params.status;
    if (params.featured !== undefined) filter.isFeatured = params.featured;
    if (params.category) filter.category = { $regex: `^${escapeRegex(params.category)}$`, $options: "i" };
    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [{ title: regex }, { excerpt: regex }, { content: regex }, { authorName: regex }, { category: regex }, { tags: regex }];
    }
    return filter;
  }

  async listPosts(params: BlogPostListQueryDTO, publicOnly = false) {
    const filter = this.buildFilter(params, publicOnly);
    const skip = (params.page - 1) * params.limit;
    const [posts, total, all, published, drafts, featured] = await Promise.all([
      BlogPostModel.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(params.limit),
      BlogPostModel.countDocuments(filter),
      BlogPostModel.countDocuments(),
      BlogPostModel.countDocuments({ status: "PUBLISHED" }),
      BlogPostModel.countDocuments({ status: "DRAFT" }),
      BlogPostModel.countDocuments({ isFeatured: true }),
    ]);
    return {
      posts,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
        summary: { total: all, published, drafts, featured },
      },
    };
  }

  async getAdminPost(id: string) {
    this.assertValidId(id);
    const post = await BlogPostModel.findById(id);
    if (!post) throw new HttpException(404, "Blog post not found");
    return post;
  }

  async getPublicPost(slug: string) {
    const post = await BlogPostModel.findOne({ slug, status: "PUBLISHED" });
    if (!post) throw new HttpException(404, "Blog post not found");
    return post;
  }

  async createPost(payload: CreateBlogPostDTO) {
    const slug = slugify(payload.slug || payload.title);
    if (!slug) throw new HttpException(400, "A valid blog post slug is required");
    await this.ensureUniqueSlug(slug);
    return BlogPostModel.create({
      ...payload,
      slug,
      publishedAt: payload.status === "PUBLISHED" ? payload.publishedAt || new Date() : payload.publishedAt,
    });
  }

  async updatePost(id: string, payload: UpdateBlogPostDTO) {
    this.assertValidId(id);
    const existing = await BlogPostModel.findById(id);
    if (!existing) throw new HttpException(404, "Blog post not found");
    const slug = payload.slug ? slugify(payload.slug) : undefined;
    if (slug) await this.ensureUniqueSlug(slug, id);
    const publishingNow = payload.status === "PUBLISHED" && existing.status !== "PUBLISHED";
    return BlogPostModel.findByIdAndUpdate(
      id,
      removeUndefined({ ...payload, slug, publishedAt: publishingNow ? new Date() : payload.publishedAt }),
      { returnDocument: "after", runValidators: true },
    );
  }

  async deletePost(id: string) {
    this.assertValidId(id);
    const deleted = await BlogPostModel.findByIdAndDelete(id);
    if (!deleted) throw new HttpException(404, "Blog post not found");
    return { deleted: true };
  }
}
