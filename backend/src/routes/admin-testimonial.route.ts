import { Router } from "express";
import { TestimonialController } from "../controllers/final-crud.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminTestimonialRouter = Router();
const testimonialController = new TestimonialController();

adminTestimonialRouter.use(authorized, adminOnly);
adminTestimonialRouter.get("/", testimonialController.adminList);
adminTestimonialRouter.get("/:id", testimonialController.adminGet);
adminTestimonialRouter.post("/", testimonialController.adminCreate);
adminTestimonialRouter.patch("/:id", testimonialController.adminUpdate);
adminTestimonialRouter.delete("/:id", testimonialController.adminDelete);

export default adminTestimonialRouter;
