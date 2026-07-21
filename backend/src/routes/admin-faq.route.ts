import { Router } from "express";
import { FAQController } from "../controllers/final-crud.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminFaqRouter = Router();
const faqController = new FAQController();

adminFaqRouter.use(authorized, adminOnly);
adminFaqRouter.get("/", faqController.adminList);
adminFaqRouter.get("/:id", faqController.adminGet);
adminFaqRouter.post("/", faqController.adminCreate);
adminFaqRouter.patch("/:id", faqController.adminUpdate);
adminFaqRouter.delete("/:id", faqController.adminDelete);

export default adminFaqRouter;
