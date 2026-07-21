import { Router } from "express";
import { TripPackageController } from "../controllers/trip-package.controller";

const tripPackageRouter = Router();
const tripPackageController = new TripPackageController();

tripPackageRouter.get("/", tripPackageController.listPackages);
tripPackageRouter.get("/:slug", tripPackageController.getPackage);

export default tripPackageRouter;
