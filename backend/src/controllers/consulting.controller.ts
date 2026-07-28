import { Request, Response } from "express";
import { z } from "zod";
import {
  ConsultingServiceListQueryDTO,
  CreateConsultingLeadDTO,
  OwnConsultingLeadListQueryDTO,
  UpdateOwnConsultingLeadDTO,
} from "../dtos/consulting.dto";
import { HttpException } from "../exceptions/http-exception";
import { ConsultingService } from "../services/consulting.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const consultingService = new ConsultingService();

function readSlugParam(req: Request) {
  const slug = req.params.slug;
  return Array.isArray(slug) ? slug[0] : slug;
}

function readParamId(req: Request) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function requireUserId(req: AuthRequest) {
  if (!req.user) {
    throw new HttpException(401, "Authentication token is required");
  }

  return req.user._id.toString();
}

export class ConsultingController {
  async listServices(req: Request, res: Response) {
    try {
      const parsedQuery = ConsultingServiceListQueryDTO.safeParse(req.query);
      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }
      const { services, meta } = await consultingService.listServices(
        parsedQuery.data,
      );
      return ApiResponseHelper.success(
        res,
        services,
        "Consulting services fetched successfully",
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

  async getService(req: Request, res: Response) {
    try {
      const service = await consultingService.getService(readSlugParam(req));
      return ApiResponseHelper.success(
        res,
        service,
        "Consulting service fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async createLead(req: AuthRequest, res: Response) {
    try {
      const parsedData = CreateConsultingLeadDTO.safeParse(req.body);
      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }
      const lead = await consultingService.createLead(
        parsedData.data,
        req.user?._id?.toString(),
      );
      return ApiResponseHelper.success(
        res,
        lead,
        "Consulting request submitted successfully",
        201,
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  // ============== Mobile: own consulting request endpoints ==============

  async listOwnLeads(req: AuthRequest, res: Response) {
    try {
      const userId = requireUserId(req);
      const parsedQuery = OwnConsultingLeadListQueryDTO.safeParse(req.query);

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { leads, meta } = await consultingService.listOwnLeads(
        userId,
        parsedQuery.data,
      );

      return ApiResponseHelper.success(
        res,
        leads,
        "Consulting requests fetched successfully",
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

  async getOwnLead(req: AuthRequest, res: Response) {
    try {
      const lead = await consultingService.getOwnLead(
        requireUserId(req),
        readParamId(req),
      );

      return ApiResponseHelper.success(
        res,
        lead,
        "Consulting request fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateOwnLead(req: AuthRequest, res: Response) {
    try {
      const userId = requireUserId(req);
      const parsedData = UpdateOwnConsultingLeadDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const lead = await consultingService.updateOwnLead(
        userId,
        readParamId(req),
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        lead,
        "Consulting request updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async cancelOwnLead(req: AuthRequest, res: Response) {
    try {
      const lead = await consultingService.cancelOwnLead(
        requireUserId(req),
        readParamId(req),
      );

      return ApiResponseHelper.success(
        res,
        lead,
        "Consulting request cancelled successfully",
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
