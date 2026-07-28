import { Response } from "express";
import { z } from "zod";
import {
  AdminContactMessageListQueryDTO,
  AdminUpdateContactMessageDTO,
} from "../dtos/contact-message.dto";
import { AdminContactMessageService } from "../services/admin-contact-message.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminContactMessageService = new AdminContactMessageService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

export class AdminContactMessageController {
  async listContactMessages(req: AuthRequest, res: Response) {
    try {
      const parsedQuery = AdminContactMessageListQueryDTO.safeParse({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        status: req.query.status,
      });

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { messages, meta } =
        await adminContactMessageService.listContactMessages(parsedQuery.data);

      return ApiResponseHelper.success(
        res,
        messages,
        "Contact messages fetched successfully",
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

  async getContactMessage(req: AuthRequest, res: Response) {
    try {
      const message = await adminContactMessageService.getContactMessage(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        message,
        "Contact message fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateContactMessage(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(
          res,
          "Authentication token is required",
          401,
        );
      }

      const parsedData = AdminUpdateContactMessageDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const message = await adminContactMessageService.updateContactMessage(
        readIdParam(req),
        req.user._id.toString(),
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        message,
        "Contact message updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteContactMessage(req: AuthRequest, res: Response) {
    try {
      const result = await adminContactMessageService.deleteContactMessage(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Contact message deleted successfully",
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
