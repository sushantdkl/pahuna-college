import { Router } from "express";
import { InquiryController } from "../controllers/inquiry.controller";
import { authorized } from "../middlewares/auth.middleware";

const inquiryRouter = Router();
const inquiryController = new InquiryController();

inquiryRouter.post("/", authorized, inquiryController.createInquiry);

export default inquiryRouter;
