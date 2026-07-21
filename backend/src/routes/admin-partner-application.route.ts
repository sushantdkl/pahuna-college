import { Router } from "express";
import { AdminPartnerApplicationController } from "../controllers/admin-partner-application.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminPartnerApplicationRouter = Router();
const adminPartnerApplicationController =
  new AdminPartnerApplicationController();

adminPartnerApplicationRouter.use(authorized, adminOnly);
adminPartnerApplicationRouter.get(
  "/",
  adminPartnerApplicationController.listApplications,
);
adminPartnerApplicationRouter.get(
  "/:id",
  adminPartnerApplicationController.getApplication,
);
adminPartnerApplicationRouter.patch(
  "/:id",
  adminPartnerApplicationController.updateApplication,
);
adminPartnerApplicationRouter.delete(
  "/:id",
  adminPartnerApplicationController.deleteApplication,
);

export default adminPartnerApplicationRouter;
