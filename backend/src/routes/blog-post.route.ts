import { Router } from "express";
import { BlogPostController } from "../controllers/blog-post.controller";

const blogPostRouter = Router();
const blogPostController = new BlogPostController();

blogPostRouter.get("/", blogPostController.listPosts);
blogPostRouter.get("/:slug", blogPostController.getPost);

export default blogPostRouter;
