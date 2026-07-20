import { Router } from "express";
import { AdminNewsletterSubscriberController } from "../controllers/admin-newsletter-subscriber.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminNewsletterSubscriberRouter = Router();
const adminNewsletterSubscriberController =
  new AdminNewsletterSubscriberController();

adminNewsletterSubscriberRouter.use(authorized, adminOnly);
adminNewsletterSubscriberRouter.get(
  "/",
  adminNewsletterSubscriberController.listSubscribers,
);
adminNewsletterSubscriberRouter.get(
  "/:id",
  adminNewsletterSubscriberController.getSubscriber,
);
adminNewsletterSubscriberRouter.patch(
  "/:id",
  adminNewsletterSubscriberController.updateSubscriber,
);
adminNewsletterSubscriberRouter.delete(
  "/:id",
  adminNewsletterSubscriberController.deleteSubscriber,
);

export default adminNewsletterSubscriberRouter;
