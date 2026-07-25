import { Router } from "express";
import { AdminBlogPostController } from "../controllers/admin-blog-post.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminBlogPostRouter = Router();
const adminBlogPostController = new AdminBlogPostController();

adminBlogPostRouter.use(authorized, adminOnly);
adminBlogPostRouter.get("/", adminBlogPostController.listPosts);
adminBlogPostRouter.get("/:id", adminBlogPostController.getPost);
adminBlogPostRouter.post("/", adminBlogPostController.createPost);
adminBlogPostRouter.patch("/:id", adminBlogPostController.updatePost);
adminBlogPostRouter.delete("/:id", adminBlogPostController.deletePost);

export default adminBlogPostRouter;
