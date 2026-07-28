import { Router } from "express";
import { ReservationController } from "../controllers/reservation.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminReservationRouter = Router();
const controller = new ReservationController();

adminReservationRouter.use(authorized, adminOnly);
adminReservationRouter.get("/", controller.adminList);
adminReservationRouter.get("/:id", controller.adminGet);
adminReservationRouter.patch("/:id", controller.adminUpdate);

export default adminReservationRouter;
