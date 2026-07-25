import { Router } from "express";
import { ConsultingController } from "../controllers/consulting.controller";
import { authorized } from "../middlewares/auth.middleware";
import { optionalAuthorized } from "../middlewares/optional-auth.middleware";

const consultingRouter = Router();
const consultingController = new ConsultingController();

consultingRouter.get(
  "/consulting-services",
  consultingController.listServices,
);
consultingRouter.get(
  "/consulting-services/:slug",
  consultingController.getService,
);

// Guests from the website may still submit; a signed-in Pahuna mobile user has
// the request linked to their account so it appears in "My Consulting
// Requests".
consultingRouter.post(
  "/consulting-leads",
  optionalAuthorized,
  consultingController.createLead,
);

// Own-record endpoints. `/me` precedes `/:id` so it is not captured by it.
consultingRouter.get(
  "/consulting-leads/me",
  authorized,
  consultingController.listOwnLeads,
);
consultingRouter.get(
  "/consulting-leads/:id",
  authorized,
  consultingController.getOwnLead,
);
consultingRouter.patch(
  "/consulting-leads/:id",
  authorized,
  consultingController.updateOwnLead,
);
consultingRouter.patch(
  "/consulting-leads/:id/cancel",
  authorized,
  consultingController.cancelOwnLead,
);

export default consultingRouter;
