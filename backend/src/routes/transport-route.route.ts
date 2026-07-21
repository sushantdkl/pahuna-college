import { Router } from "express";
import { RouteCrudController } from "../controllers/final-crud.controller";

const transportRouteRouter = Router();
const routeCrudController = new RouteCrudController();

transportRouteRouter.get("/", routeCrudController.publicTransportRoutes);

export default transportRouteRouter;
