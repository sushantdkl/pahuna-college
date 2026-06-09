import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRouter = Router();
const userController = new UserController();

// Routes only map HTTP endpoints to controller methods; validation and auth rules stay in deeper layers.
userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);

export default userRouter;
