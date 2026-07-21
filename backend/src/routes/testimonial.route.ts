import { Router } from "express";
import { TestimonialController } from "../controllers/final-crud.controller";

const testimonialRouter = Router();
const testimonialController = new TestimonialController();

testimonialRouter.get("/", testimonialController.list);
testimonialRouter.get("/:id", testimonialController.get);

export default testimonialRouter;
