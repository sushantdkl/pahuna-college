import {
  createAdminBlogPost,
  deleteAdminBlogPost,
  getAdminBlogPost,
  getAdminBlogPosts,
  updateAdminBlogPost,
} from "@/lib/api/admin-blog-posts";

export const getAdminBlogPostsAction = getAdminBlogPosts;
export const getAdminBlogPostAction = getAdminBlogPost;
export const createAdminBlogPostAction = createAdminBlogPost;
export const updateAdminBlogPostAction = updateAdminBlogPost;
export const deleteAdminBlogPostAction = deleteAdminBlogPost;
