import { NextFunction, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { HttpException } from "../exceptions/http-exception";
import { UserMongoRepository } from "../repositories/user.repository";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

type JwtPayload = {
  id: string;
};

const userRepository = new UserMongoRepository();

function readCookieToken(cookieHeader?: string) {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const authCookie = cookies.find((cookie) => cookie.startsWith("auth_token="));

  return authCookie ? decodeURIComponent(authCookie.split("=")[1]) : null;
}

function readBearerToken(authorization?: string) {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.replace("Bearer ", "").trim();
}

export const authorized = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      readCookieToken(req.headers.cookie) ||
      readBearerToken(req.headers.authorization);

    if (!token) {
      throw new HttpException(401, "Authentication token is required");
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    const user = await userRepository.getUserById(decoded.id);

    if (!user) {
      throw new HttpException(401, "Authenticated user was not found");
    }

    req.user = user;
    next();
  } catch (error: Error | any | unknown) {
    if (error instanceof TokenExpiredError) {
      return ApiResponseHelper.error(res, "Authentication token has expired", 401);
    }

    return ApiResponseHelper.error(
      res,
      error.message || "Invalid authentication token",
      error.status || 401,
    );
  }
};
