import { Router } from "express";
import { AdminDashboardController } from "../controllers/admin-dashboard.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminDashboardRouter = Router();
const adminDashboardController = new AdminDashboardController();

adminDashboardRouter.use(authorized, adminOnly);
adminDashboardRouter.get("/overview", adminDashboardController.overview);

export default adminDashboardRouter;
