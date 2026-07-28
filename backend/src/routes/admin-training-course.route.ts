import { Router } from "express";
import { AdminTrainingCourseController } from "../controllers/admin-training-course.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";
import { uploadTrainingCourseImage } from "../middlewares/upload.middleware";

const adminTrainingCourseRouter = Router();
const adminTrainingCourseController = new AdminTrainingCourseController();

adminTrainingCourseRouter.use(authorized, adminOnly);
adminTrainingCourseRouter.get("/", adminTrainingCourseController.listCourses);
adminTrainingCourseRouter.get("/:id", adminTrainingCourseController.getCourse);
adminTrainingCourseRouter.post(
  "/",
  uploadTrainingCourseImage.single("imageFile"),
  adminTrainingCourseController.createCourse,
);
adminTrainingCourseRouter.patch(
  "/:id",
  uploadTrainingCourseImage.single("imageFile"),
  adminTrainingCourseController.updateCourse,
);
adminTrainingCourseRouter.delete(
  "/:id",
  adminTrainingCourseController.deleteCourse,
);

export default adminTrainingCourseRouter;
