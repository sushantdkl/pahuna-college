import { Router } from "express";
import { AdminInquiryController } from "../controllers/admin-inquiry.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminInquiryRouter = Router();
const adminInquiryController = new AdminInquiryController();

adminInquiryRouter.use(authorized, adminOnly);
adminInquiryRouter.get("/", adminInquiryController.listInquiries);
adminInquiryRouter.get("/:id", adminInquiryController.getInquiry);
adminInquiryRouter.patch("/:id", adminInquiryController.updateInquiry);
adminInquiryRouter.delete("/:id", adminInquiryController.deleteInquiry);

export default adminInquiryRouter;
