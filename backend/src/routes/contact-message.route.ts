import { Router } from "express";
import { ContactMessageController } from "../controllers/contact-message.controller";

const contactMessageRouter = Router();
const contactMessageController = new ContactMessageController();

contactMessageRouter.post("/", contactMessageController.createContactMessage);

export default contactMessageRouter;
