import { Router } from "express";
import { RouteCrudController } from "../controllers/final-crud.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminRouteSegmentRouter = Router();
const routeCrudController = new RouteCrudController();

adminRouteSegmentRouter.use(authorized, adminOnly);
adminRouteSegmentRouter.get("/", routeCrudController.adminRouteSegments);
adminRouteSegmentRouter.get("/:id", routeCrudController.adminRouteSegment);
adminRouteSegmentRouter.post("/", routeCrudController.createRouteSegment);
adminRouteSegmentRouter.patch("/:id", routeCrudController.updateRouteSegment);
adminRouteSegmentRouter.delete("/:id", routeCrudController.deleteRouteSegment);

export default adminRouteSegmentRouter;
