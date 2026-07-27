import { Router } from "express";
import { PublicCatalogController } from "../controllers/public-catalog.controller";

const router = Router();
const controller = new PublicCatalogController();

router.get("/hotels", controller.listHotels.bind(controller));
router.get("/hotels/:identifier", controller.getHotel.bind(controller));
router.get("/destinations", controller.listDestinations.bind(controller));
router.get("/destinations/:identifier", controller.getDestination.bind(controller));
router.get("/experiences", controller.listExperiences.bind(controller));
router.get("/experiences/:identifier", controller.getExperience.bind(controller));

export default router;
