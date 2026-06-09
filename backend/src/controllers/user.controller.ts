import { Request, Response } from "express";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      // Controller-level parsing rejects invalid request bodies before service business rules run.
      const userData = CreateUserDTO.safeParse(req.body);

      if (!userData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(userData.error),
          400,
        );
      }

      // The service returns a password-free user object for the API response.
      const user = await userService.createUser(userData.data);

      return ApiResponseHelper.success(
        res,
        { user },
        "User registered successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      // Login accepts only email and password; any extra auth checks remain in the service layer.
      const parsedData = LoginUserDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      // Successful login returns both the JWT and safe user data for frontend storage.
      const { user, token } = await userService.loginUser(parsedData.data);

      return ApiResponseHelper.success(
        res,
        { user, token },
        "Login successful",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
