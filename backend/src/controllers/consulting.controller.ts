import { Request, Response } from "express";
import { z } from "zod";
import {
  ConsultingServiceListQueryDTO,
  CreateConsultingLeadDTO,
} from "../dtos/consulting.dto";
import { ConsultingService } from "../services/consulting.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const consultingService = new ConsultingService();

function readSlugParam(req: Request) {
  const slug = req.params.slug;
  return Array.isArray(slug) ? slug[0] : slug;
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

  async createLead(req: Request, res: Response) {
    try {
      const parsedData = CreateConsultingLeadDTO.safeParse(req.body);
      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }
      const lead = await consultingService.createLead(parsedData.data);
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
}
