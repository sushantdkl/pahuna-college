import { Router } from "express";
import { AdminConsultingServiceController } from "../controllers/admin-consulting-service.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";
import { uploadConsultingServiceImage } from "../middlewares/upload.middleware";

const adminConsultingServiceRouter = Router();
const adminConsultingServiceController =
  new AdminConsultingServiceController();

adminConsultingServiceRouter.use(authorized, adminOnly);
adminConsultingServiceRouter.get(
  "/",
  adminConsultingServiceController.listServices,
);
adminConsultingServiceRouter.get(
  "/:id",
  adminConsultingServiceController.getService,
);
adminConsultingServiceRouter.post(
  "/",
  uploadConsultingServiceImage.single("imageFile"),
  adminConsultingServiceController.createService,
);
adminConsultingServiceRouter.patch(
  "/:id",
  uploadConsultingServiceImage.single("imageFile"),
  adminConsultingServiceController.updateService,
);
adminConsultingServiceRouter.delete(
  "/:id",
  adminConsultingServiceController.deleteService,
);

export default adminConsultingServiceRouter;
