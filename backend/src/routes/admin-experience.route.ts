import { Router } from "express";
import { AdminExperienceController } from "../controllers/admin-experience.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";
import { uploadExperienceImages } from "../middlewares/upload.middleware";

const adminExperienceRouter = Router();
const adminExperienceController = new AdminExperienceController();

adminExperienceRouter.use(authorized, adminOnly);
adminExperienceRouter.get("/", adminExperienceController.listExperiences);
adminExperienceRouter.get("/:id", adminExperienceController.getExperience);
adminExperienceRouter.post(
  "/",
  uploadExperienceImages.array("images", 6),
  adminExperienceController.createExperience,
);
adminExperienceRouter.patch(
  "/:id",
  uploadExperienceImages.array("images", 6),
  adminExperienceController.updateExperience,
);
adminExperienceRouter.delete("/:id", adminExperienceController.deleteExperience);

export default adminExperienceRouter;
