import { Router } from "express";
import { AdminHotelController } from "../controllers/admin-hotel.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";
import { uploadHotelImages } from "../middlewares/upload.middleware";

const adminHotelRouter = Router();
const adminHotelController = new AdminHotelController();

adminHotelRouter.use(authorized, adminOnly);
adminHotelRouter.get("/", adminHotelController.listHotels);
adminHotelRouter.get("/:id", adminHotelController.getHotel);
adminHotelRouter.post(
  "/",
  uploadHotelImages.array("images", 6),
  adminHotelController.createHotel,
);
adminHotelRouter.patch(
  "/:id",
  uploadHotelImages.array("images", 6),
  adminHotelController.updateHotel,
);
adminHotelRouter.delete("/:id", adminHotelController.deleteHotel);

export default adminHotelRouter;
