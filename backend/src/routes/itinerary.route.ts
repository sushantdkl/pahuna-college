import { Router } from "express";
import { ItineraryController } from "../controllers/itinerary.controller";
import { authorized } from "../middlewares/auth.middleware";

const itineraryRouter = Router();
const itineraryController = new ItineraryController();

itineraryRouter.get("/options", itineraryController.getPlannerOptions);
itineraryRouter.use(authorized);
itineraryRouter.post("/", itineraryController.createItinerary);
itineraryRouter.get("/my", itineraryController.listOwnItineraries);
itineraryRouter.get("/:id", itineraryController.getOwnItinerary);
itineraryRouter.patch("/:id", itineraryController.updateOwnItinerary);
itineraryRouter.delete("/:id", itineraryController.deleteOwnItinerary);

export default itineraryRouter;
