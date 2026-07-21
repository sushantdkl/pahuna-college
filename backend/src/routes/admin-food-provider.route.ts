import { Router } from "express";
import { FoodProviderController } from "../controllers/final-crud.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminFoodProviderRouter = Router();
const foodProviderController = new FoodProviderController();

adminFoodProviderRouter.use(authorized, adminOnly);
adminFoodProviderRouter.get("/", foodProviderController.adminList);
adminFoodProviderRouter.get("/:id", foodProviderController.adminGet);
adminFoodProviderRouter.post("/", foodProviderController.adminCreate);
adminFoodProviderRouter.patch("/:id", foodProviderController.adminUpdate);
adminFoodProviderRouter.delete("/:id", foodProviderController.adminDelete);

export default adminFoodProviderRouter;
