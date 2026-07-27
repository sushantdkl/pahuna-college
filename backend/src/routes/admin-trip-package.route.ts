import { Router } from "express";
import { AdminTripPackageController } from "../controllers/admin-trip-package.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";
import { uploadTripPackageImages } from "../middlewares/upload.middleware";

const adminTripPackageRouter = Router();
const adminTripPackageController = new AdminTripPackageController();

adminTripPackageRouter.use(authorized, adminOnly);
adminTripPackageRouter.get("/", adminTripPackageController.listPackages);
adminTripPackageRouter.get("/:id", adminTripPackageController.getPackage);
adminTripPackageRouter.post("/", uploadTripPackageImages.array("images", 8), adminTripPackageController.createPackage);
adminTripPackageRouter.patch("/:id", uploadTripPackageImages.array("images", 8), adminTripPackageController.updatePackage);
adminTripPackageRouter.delete("/:id", adminTripPackageController.deletePackage);

export default adminTripPackageRouter;
