import { Router } from "express";
import { InquiryController } from "../controllers/inquiry.controller";
import { authorized } from "../middlewares/auth.middleware";

const inquiryRouter = Router();
const inquiryController = new InquiryController();

inquiryRouter.post("/", authorized, inquiryController.createInquiry);

// Own-record endpoints for the Pahuna mobile app. `/me` is declared before
// `/:id` so it is not swallowed by the id route. Identity always comes from
// the verified token, never from the request body.
inquiryRouter.get("/me", authorized, inquiryController.listOwnInquiries);
inquiryRouter.get("/:id", authorized, inquiryController.getOwnInquiry);
inquiryRouter.patch("/:id", authorized, inquiryController.updateOwnInquiry);
inquiryRouter.patch(
  "/:id/cancel",
  authorized,
  inquiryController.cancelOwnInquiry,
);

export default inquiryRouter;
