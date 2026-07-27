import { Router } from "express";
import { RouteCrudController } from "../controllers/final-crud.controller";

const routeSegmentRouter = Router();
const routeCrudController = new RouteCrudController();

routeSegmentRouter.get("/", routeCrudController.publicRouteSegments);
routeSegmentRouter.get("/:slug", routeCrudController.publicRouteSegment);

export default routeSegmentRouter;
