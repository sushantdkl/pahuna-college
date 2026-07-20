import { Response } from "express";
import { z } from "zod";
import {
  AdminNewsletterSubscriberListQueryDTO,
  AdminUpdateNewsletterSubscriberDTO,
} from "../dtos/newsletter-subscriber.dto";
import { AdminNewsletterSubscriberService } from "../services/admin-newsletter-subscriber.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminNewsletterSubscriberService =
  new AdminNewsletterSubscriberService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

export class AdminNewsletterSubscriberController {
  async listSubscribers(req: AuthRequest, res: Response) {
    try {
      const parsedQuery = AdminNewsletterSubscriberListQueryDTO.safeParse({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        active: req.query.active ?? req.query.isActive,
      });

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { subscribers, meta } =
        await adminNewsletterSubscriberService.listSubscribers(
          parsedQuery.data,
        );

      return ApiResponseHelper.success(
        res,
        subscribers,
        "Newsletter subscribers fetched successfully",
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

  async getSubscriber(req: AuthRequest, res: Response) {
    try {
      const subscriber = await adminNewsletterSubscriberService.getSubscriber(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        subscriber,
        "Newsletter subscriber fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateSubscriber(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminUpdateNewsletterSubscriberDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const subscriber =
        await adminNewsletterSubscriberService.updateSubscriber(
          readIdParam(req),
          parsedData.data,
        );

      return ApiResponseHelper.success(
        res,
        subscriber,
        "Newsletter subscriber updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteSubscriber(req: AuthRequest, res: Response) {
    try {
      const result = await adminNewsletterSubscriberService.deleteSubscriber(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Newsletter subscriber deleted successfully",
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
