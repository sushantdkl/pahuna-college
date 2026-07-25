import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { UserMongoRepository } from "../repositories/user.repository";
import { AuthRequest } from "../types/auth-request.type";

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

/**
 * Attaches `req.user` when a valid token is present and otherwise lets the
 * request continue anonymously.
 *
 * Public submission endpoints (training enrollment, consulting lead) accept
 * guests from the website, so they must not start rejecting them. Wrapping
 * them with this middleware is what lets a signed-in Pahuna mobile user have
 * their submission linked to their account, which is the prerequisite for the
 * "my records" screens.
 */
export const optionalAuthorized = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      readCookieToken(req.headers.cookie) ||
      readBearerToken(req.headers.authorization);

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    const user = await userRepository.getUserById(decoded.id);

    if (user) {
      req.user = user;
    }
  } catch (_error) {
    // An expired or malformed token simply means "treat this as a guest".
  }

  return next();
};
