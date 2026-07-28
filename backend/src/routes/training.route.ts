import { Router } from "express";
import { TrainingController } from "../controllers/training.controller";
import { authorized } from "../middlewares/auth.middleware";
import { optionalAuthorized } from "../middlewares/optional-auth.middleware";

const trainingRouter = Router();
const trainingController = new TrainingController();

trainingRouter.get("/training-courses", trainingController.listCourses);
trainingRouter.get("/training-courses/:slug", trainingController.getCourse);

// Guests from the website may still enrol; a signed-in Pahuna mobile user has
// the enrollment linked to their account so it appears in "My Enrollments".
trainingRouter.post(
  "/training-enrollments",
  optionalAuthorized,
  trainingController.createEnrollment,
);

// Own-record endpoints. `/me` precedes `/:id` so it is not captured by it.
trainingRouter.get(
  "/training-enrollments/me",
  authorized,
  trainingController.listOwnEnrollments,
);
trainingRouter.get(
  "/training-enrollments/:id",
  authorized,
  trainingController.getOwnEnrollment,
);
trainingRouter.patch(
  "/training-enrollments/:id",
  authorized,
  trainingController.updateOwnEnrollment,
);
trainingRouter.patch(
  "/training-enrollments/:id/cancel",
  authorized,
  trainingController.cancelOwnEnrollment,
);

export default trainingRouter;
