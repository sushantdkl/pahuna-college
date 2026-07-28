import { Router } from "express";
import { AdminUserController } from "../controllers/admin-user.controller";
import { adminOnly } from "../middlewares/admin.middleware";
import { authorized } from "../middlewares/auth.middleware";

const adminUserRouter = Router();
const adminUserController = new AdminUserController();

adminUserRouter.use(authorized, adminOnly);
adminUserRouter.get("/", adminUserController.listUsers);
adminUserRouter.get("/:id", adminUserController.getUser);
adminUserRouter.post("/", adminUserController.createUser);
adminUserRouter.patch("/:id", adminUserController.updateUser);
adminUserRouter.delete("/:id", adminUserController.deleteUser);

export default adminUserRouter;
