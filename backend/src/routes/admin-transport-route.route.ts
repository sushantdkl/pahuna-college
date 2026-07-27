import { Router } from "express";
import { RouteCrudController } from "../controllers/final-crud.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminTransportRouteRouter = Router();
const routeCrudController = new RouteCrudController();

adminTransportRouteRouter.use(authorized, adminOnly);
adminTransportRouteRouter.get("/", routeCrudController.adminTransportRoutes);
adminTransportRouteRouter.get("/:id", routeCrudController.adminTransportRoute);
adminTransportRouteRouter.post("/", routeCrudController.createTransportRoute);
adminTransportRouteRouter.patch("/:id", routeCrudController.updateTransportRoute);
adminTransportRouteRouter.delete("/:id", routeCrudController.deleteTransportRoute);

export default adminTransportRouteRouter;
