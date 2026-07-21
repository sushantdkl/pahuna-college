import { Response } from "express";
import { z } from "zod";
import {
  AdminPartnerApplicationListQueryDTO,
  AdminUpdatePartnerApplicationDTO,
} from "../dtos/partner-application.dto";
import { AdminPartnerApplicationService } from "../services/admin-partner-application.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminPartnerApplicationService = new AdminPartnerApplicationService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

export class AdminPartnerApplicationController {
  async listApplications(req: AuthRequest, res: Response) {
    try {
      const parsedQuery = AdminPartnerApplicationListQueryDTO.safeParse({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        status: req.query.status,
        type: req.query.type ?? req.query.partnerType,
      });

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { applications, meta } =
        await adminPartnerApplicationService.listApplications(
          parsedQuery.data,
        );

      return ApiResponseHelper.success(
        res,
        applications,
        "Partner applications fetched successfully",
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

  async getApplication(req: AuthRequest, res: Response) {
    try {
      const application =
        await adminPartnerApplicationService.getApplication(readIdParam(req));

      return ApiResponseHelper.success(
        res,
        application,
        "Partner application fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateApplication(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(
          res,
          "Authentication token is required",
          401,
        );
      }

      const parsedData = AdminUpdatePartnerApplicationDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const application =
        await adminPartnerApplicationService.updateApplication(
          readIdParam(req),
          req.user._id.toString(),
          parsedData.data,
        );

      return ApiResponseHelper.success(
        res,
        application,
        "Partner application updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteApplication(req: AuthRequest, res: Response) {
    try {
      const result = await adminPartnerApplicationService.deleteApplication(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Partner application deleted successfully",
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
