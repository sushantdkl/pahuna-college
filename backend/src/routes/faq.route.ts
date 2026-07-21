import { Router } from "express";
import { FAQController } from "../controllers/final-crud.controller";

const faqRouter = Router();
const faqController = new FAQController();

faqRouter.get("/", faqController.list);
faqRouter.get("/:id", faqController.get);

export default faqRouter;
