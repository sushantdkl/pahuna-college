import { Router } from "express";
import { AdminItineraryController } from "../controllers/admin-itinerary.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminItineraryRouter = Router();
const adminItineraryController = new AdminItineraryController();

adminItineraryRouter.use(authorized, adminOnly);
adminItineraryRouter.get("/", adminItineraryController.listItineraries);
adminItineraryRouter.get("/:id", adminItineraryController.getItinerary);
adminItineraryRouter.post("/", adminItineraryController.createItinerary);
adminItineraryRouter.patch("/:id", adminItineraryController.updateItinerary);
adminItineraryRouter.delete("/:id", adminItineraryController.deleteItinerary);

export default adminItineraryRouter;
