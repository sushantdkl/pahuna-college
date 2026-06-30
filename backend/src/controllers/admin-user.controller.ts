import { Response } from "express";
import { z } from "zod";
import { AdminCreateUserDTO, AdminUpdateUserDTO } from "../dtos/admin-user.dto";
import { AdminUserService } from "../services/admin-user.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminUserService = new AdminUserService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

export class AdminUserController {
  async listUsers(req: AuthRequest, res: Response) {
    try {
      const { users, meta } = await adminUserService.listUsers({
        page: req.query.page?.toString(),
        limit: req.query.limit?.toString(),
        search: req.query.search?.toString(),
      });

      return ApiResponseHelper.success(
        res,
        users,
        "Users fetched successfully",
        200,
        meta,
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async getUser(req: AuthRequest, res: Response) {
    try {
      const user = await adminUserService.getUser(readIdParam(req));

      return ApiResponseHelper.success(res, user, "User fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async createUser(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminCreateUserDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsedData.error), 400);
      }

      const user = await adminUserService.createUser(parsedData.data);

      return ApiResponseHelper.success(res, user, "User created successfully", 201);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateUser(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminUpdateUserDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsedData.error), 400);
      }

      const user = await adminUserService.updateUser(
        readIdParam(req),
        parsedData.data,
      );

      return ApiResponseHelper.success(res, user, "User updated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(res, "Authenticated user was not found", 401);
      }

      const result = await adminUserService.deleteUser(
        readIdParam(req),
        req.user._id.toString(),
      );

      return ApiResponseHelper.success(res, result, "User deleted successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
