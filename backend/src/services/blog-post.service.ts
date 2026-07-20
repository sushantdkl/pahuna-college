import { BlogPostListQueryDTO } from "../dtos/blog-post.dto";
import { HttpException } from "../exceptions/http-exception";
import { BlogPostModel } from "../models/blog-post.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class BlogPostService {
  async listPublishedPosts(params: BlogPostListQueryDTO) {
    const filter: Record<string, unknown> = {
      status: "PUBLISHED",
      publishedAt: { $lte: new Date() },
    };

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

    const skip = (params.page - 1) * params.limit;
    const [posts, total] = await Promise.all([
      BlogPostModel.find(filter)
        .populate("authorId", "fullName profileImage")
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      BlogPostModel.countDocuments(filter),
    ]);

    return {
      posts,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
      },
    };
  }

  async getPublishedPost(slug: string) {
    const normalizedSlug = slug.trim().toLowerCase();
    const post = await BlogPostModel.findOne({
      slug: normalizedSlug,
      status: "PUBLISHED",
      publishedAt: { $lte: new Date() },
    }).populate("authorId", "fullName profileImage");

    if (!post) {
      throw new HttpException(404, "Blog post not found");
    }

    return post;
  }
}
