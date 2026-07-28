import { Router } from "express";
import { AdminContactMessageController } from "../controllers/admin-contact-message.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminContactMessageRouter = Router();
const adminContactMessageController = new AdminContactMessageController();

adminContactMessageRouter.use(authorized, adminOnly);
adminContactMessageRouter.get(
  "/",
  adminContactMessageController.listContactMessages,
);
adminContactMessageRouter.get(
  "/:id",
  adminContactMessageController.getContactMessage,
);
adminContactMessageRouter.patch(
  "/:id",
  adminContactMessageController.updateContactMessage,
);
adminContactMessageRouter.delete(
  "/:id",
  adminContactMessageController.deleteContactMessage,
);

export default adminContactMessageRouter;
