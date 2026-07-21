import { Router } from "express";
import { TrainingController } from "../controllers/training.controller";

const trainingRouter = Router();
const trainingController = new TrainingController();

trainingRouter.get("/training-courses", trainingController.listCourses);
trainingRouter.get("/training-courses/:slug", trainingController.getCourse);
trainingRouter.post("/training-enrollments", trainingController.createEnrollment);

export default trainingRouter;
