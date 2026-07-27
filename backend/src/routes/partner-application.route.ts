import { Router } from "express";
import { PartnerApplicationController } from "../controllers/partner-application.controller";

const partnerApplicationRouter = Router();
const partnerApplicationController = new PartnerApplicationController();

partnerApplicationRouter.post(
  "/",
  partnerApplicationController.createApplication,
);

export default partnerApplicationRouter;
