import { Router } from "express";
import { FoodProviderController } from "../controllers/final-crud.controller";

const foodProviderRouter = Router();
const foodProviderController = new FoodProviderController();

foodProviderRouter.get("/", foodProviderController.list);
foodProviderRouter.get("/:slug", foodProviderController.get);

export default foodProviderRouter;
