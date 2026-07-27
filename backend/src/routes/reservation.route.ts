import { Router } from "express";
import { ReservationController } from "../controllers/reservation.controller";
import { authorized } from "../middlewares/auth.middleware";

const reservationRouter = Router();
const controller = new ReservationController();

reservationRouter.get("/hotels/:hotelId/room-types", controller.listRoomTypes);
reservationRouter.post("/reservations", authorized, controller.createReservation);
reservationRouter.get("/reservations/me", authorized, controller.myReservations);
reservationRouter.patch("/reservations/:id/cancel", authorized, controller.cancelReservation);

export default reservationRouter;
