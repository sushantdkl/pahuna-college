import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return ApiResponseHelper.error(res, "Authentication token is required", 401);
  }

  if (req.user.role !== "admin") {
    return ApiResponseHelper.error(res, "Admin access is required", 403);
  }

  return next();
};
