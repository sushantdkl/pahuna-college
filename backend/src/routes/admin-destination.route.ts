import { Router } from "express";
import { AdminDestinationController } from "../controllers/admin-destination.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";
import { uploadDestinationImages } from "../middlewares/upload.middleware";

const adminDestinationRouter = Router();
const adminDestinationController = new AdminDestinationController();

adminDestinationRouter.use(authorized, adminOnly);
adminDestinationRouter.get("/", adminDestinationController.listDestinations);
adminDestinationRouter.get("/:id", adminDestinationController.getDestination);
adminDestinationRouter.post(
  "/",
  uploadDestinationImages.array("images", 6),
  adminDestinationController.createDestination,
);
adminDestinationRouter.patch(
  "/:id",
  uploadDestinationImages.array("images", 6),
  adminDestinationController.updateDestination,
);
adminDestinationRouter.delete(
  "/:id",
  adminDestinationController.deleteDestination,
);

export default adminDestinationRouter;
