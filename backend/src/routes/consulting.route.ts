import { Router } from "express";
import { ConsultingController } from "../controllers/consulting.controller";

const consultingRouter = Router();
const consultingController = new ConsultingController();

consultingRouter.get(
  "/consulting-services",
  consultingController.listServices,
);
consultingRouter.get(
  "/consulting-services/:slug",
  consultingController.getService,
);
consultingRouter.post("/consulting-leads", consultingController.createLead);

export default consultingRouter;
