import { Router } from "express";
import { FoodProviderController } from "../controllers/final-crud.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";
import { uploadFoodProviderImages } from "../middlewares/upload.middleware";

const adminFoodProviderRouter = Router();
const foodProviderController = new FoodProviderController();

adminFoodProviderRouter.use(authorized, adminOnly);
adminFoodProviderRouter.get("/", foodProviderController.adminList);
adminFoodProviderRouter.get("/:id", foodProviderController.adminGet);
adminFoodProviderRouter.post("/", uploadFoodProviderImages.array("images", 6), foodProviderController.adminCreate);
adminFoodProviderRouter.patch("/:id", uploadFoodProviderImages.array("images", 6), foodProviderController.adminUpdate);
adminFoodProviderRouter.delete("/:id", foodProviderController.adminDelete);

export default adminFoodProviderRouter;
