import { Response } from "express";
import { z } from "zod";
import {
  AdminConsultingLeadListQueryDTO,
  UpdateConsultingLeadDTO,
} from "../dtos/consulting.dto";
import { AdminConsultingLeadService } from "../services/admin-consulting-lead.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminConsultingLeadService = new AdminConsultingLeadService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

export class AdminConsultingLeadController {
  async listLeads(req: AuthRequest, res: Response) {
    try {
      const parsedQuery = AdminConsultingLeadListQueryDTO.safeParse(req.query);
      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }
      const { leads, meta } = await adminConsultingLeadService.listLeads(
        parsedQuery.data,
      );
      return ApiResponseHelper.success(
        res,
        leads,
        "Consulting leads fetched successfully",
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

  async getLead(req: AuthRequest, res: Response) {
    try {
      const lead = await adminConsultingLeadService.getLead(readIdParam(req));
      return ApiResponseHelper.success(
        res,
        lead,
        "Consulting lead fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateLead(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(
          res,
          "Authentication token is required",
          401,
        );
      }
      const parsedData = UpdateConsultingLeadDTO.safeParse(req.body);
      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }
      const lead = await adminConsultingLeadService.updateLead(
        readIdParam(req),
        req.user._id.toString(),
        parsedData.data,
      );
      return ApiResponseHelper.success(
        res,
        lead,
        "Consulting lead updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteLead(req: AuthRequest, res: Response) {
    try {
      const result = await adminConsultingLeadService.deleteLead(
        readIdParam(req),
      );
      return ApiResponseHelper.success(
        res,
        result,
        "Consulting lead deleted successfully",
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
