import { Router } from "express";
import { AdminTrainingEnrollmentController } from "../controllers/admin-training-enrollment.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminTrainingEnrollmentRouter = Router();
const adminTrainingEnrollmentController =
  new AdminTrainingEnrollmentController();

adminTrainingEnrollmentRouter.use(authorized, adminOnly);
adminTrainingEnrollmentRouter.get(
  "/",
  adminTrainingEnrollmentController.listEnrollments,
);
adminTrainingEnrollmentRouter.get(
  "/:id",
  adminTrainingEnrollmentController.getEnrollment,
);
adminTrainingEnrollmentRouter.patch(
  "/:id",
  adminTrainingEnrollmentController.updateEnrollment,
);
adminTrainingEnrollmentRouter.delete(
  "/:id",
  adminTrainingEnrollmentController.deleteEnrollment,
);

export default adminTrainingEnrollmentRouter;
