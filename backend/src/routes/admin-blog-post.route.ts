import { Router } from "express";
import { AdminBlogPostController } from "../controllers/admin-blog-post.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";
import { uploadBlogCoverImage } from "../middlewares/upload.middleware";

const adminBlogPostRouter = Router();
const adminBlogPostController = new AdminBlogPostController();

adminBlogPostRouter.use(authorized, adminOnly);
adminBlogPostRouter.get("/", adminBlogPostController.listPosts);
adminBlogPostRouter.get("/:id", adminBlogPostController.getPost);
adminBlogPostRouter.post("/", uploadBlogCoverImage.single("coverImageFile"), adminBlogPostController.createPost);
adminBlogPostRouter.patch("/:id", uploadBlogCoverImage.single("coverImageFile"), adminBlogPostController.updatePost);
adminBlogPostRouter.delete("/:id", adminBlogPostController.deletePost);

export default adminBlogPostRouter;
