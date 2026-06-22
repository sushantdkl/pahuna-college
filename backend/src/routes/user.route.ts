import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorized } from "../middlewares/auth.middleware";
import { uploadProfileImage } from "../middlewares/upload.middleware";

const userRouter = Router();
const userController = new UserController();

// Routes only map HTTP endpoints to controller methods; validation and auth rules stay in deeper layers.
userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/whoami", authorized, userController.getCurrentUser);
userRouter.patch(
  "/update",
  authorized,
  uploadProfileImage.single("profileImage"),
  userController.updateUser,
);
userRouter.patch("/update-password", authorized, userController.updatePassword);

export default userRouter;
