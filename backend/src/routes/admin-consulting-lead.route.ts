import { Router } from "express";
import { AdminConsultingLeadController } from "../controllers/admin-consulting-lead.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminConsultingLeadRouter = Router();
const adminConsultingLeadController = new AdminConsultingLeadController();

adminConsultingLeadRouter.use(authorized, adminOnly);
adminConsultingLeadRouter.get("/", adminConsultingLeadController.listLeads);
adminConsultingLeadRouter.get("/:id", adminConsultingLeadController.getLead);
adminConsultingLeadRouter.patch(
  "/:id",
  adminConsultingLeadController.updateLead,
);
adminConsultingLeadRouter.delete(
  "/:id",
  adminConsultingLeadController.deleteLead,
);

export default adminConsultingLeadRouter;
