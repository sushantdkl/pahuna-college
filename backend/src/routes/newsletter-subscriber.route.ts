import { Router } from "express";
import { NewsletterSubscriberController } from "../controllers/newsletter-subscriber.controller";

const newsletterSubscriberRouter = Router();
const newsletterSubscriberController = new NewsletterSubscriberController();

newsletterSubscriberRouter.post(
  "/",
  newsletterSubscriberController.subscribe,
);

export default newsletterSubscriberRouter;
