import { Response } from "express";
import { z } from "zod";
import {
  AdminConsultingServiceListQueryDTO,
  CreateConsultingServiceDTO,
  UpdateConsultingServiceDTO,
} from "../dtos/consulting.dto";
import { AdminConsultingServiceService } from "../services/admin-consulting-service.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminConsultingServiceService = new AdminConsultingServiceService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function serviceBody(body: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries({
      title: body.title,
      slug: body.slug,
      description: body.description,
      category: body.category,
      price: body.price,
      duration: body.duration,
      deliverables: body.deliverables,
      image: body.image,
      isActive: body.isActive ?? body.is_active,
    }).filter(([, value]) => value !== undefined),
  );
}

function uploadedServiceImage(req: AuthRequest) {
  return req.file ? `/uploads/consulting/${req.file.filename}` : undefined;
}

export class AdminConsultingServiceController {
  async listServices(req: AuthRequest, res: Response) {
    try {
      const parsedQuery = AdminConsultingServiceListQueryDTO.safeParse({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        category: req.query.category,
        active: req.query.active ?? req.query.isActive,
      });
      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }
      const { services, meta } =
        await adminConsultingServiceService.listServices(parsedQuery.data);
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

  async getService(req: AuthRequest, res: Response) {
    try {
      const service = await adminConsultingServiceService.getService(
        readIdParam(req),
      );
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

  async createService(req: AuthRequest, res: Response) {
    try {
      const parsedData = CreateConsultingServiceDTO.safeParse(
        {
          ...serviceBody(req.body),
          ...(uploadedServiceImage(req) ? { image: uploadedServiceImage(req) } : {}),
        },
      );
      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }
      const service = await adminConsultingServiceService.createService(
        parsedData.data,
      );
      return ApiResponseHelper.success(
        res,
        service,
        "Consulting service created successfully",
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

  async updateService(req: AuthRequest, res: Response) {
    try {
      const parsedData = UpdateConsultingServiceDTO.safeParse(
        {
          ...serviceBody(req.body),
          ...(uploadedServiceImage(req) ? { image: uploadedServiceImage(req) } : {}),
        },
      );
      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }
      const service = await adminConsultingServiceService.updateService(
        readIdParam(req),
        parsedData.data,
      );
      return ApiResponseHelper.success(
        res,
        service,
        "Consulting service updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteService(req: AuthRequest, res: Response) {
    try {
      const result = await adminConsultingServiceService.deleteService(
        readIdParam(req),
      );
      return ApiResponseHelper.success(
        res,
        result,
        "Consulting service deleted successfully",
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
