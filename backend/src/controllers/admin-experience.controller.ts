import { Response } from "express";
import { z } from "zod";
import {
  AdminCreateExperienceDTO,
  AdminUpdateExperienceDTO,
} from "../dtos/admin-experience.dto";
import { AdminExperienceService } from "../services/admin-experience.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminExperienceService = new AdminExperienceService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function readUploadedImages(req: AuthRequest) {
  const files = req.files;

  if (!Array.isArray(files)) {
    return [];
  }

  return files.map((file) => `/uploads/experiences/${file.filename}`);
}

function mergeImagePayload(req: AuthRequest) {
  const uploadedImages = readUploadedImages(req);

  if (!uploadedImages.length) {
    return req.body;
  }

  return {
    ...req.body,
    images: uploadedImages,
  };
}

export class AdminExperienceController {
  async listExperiences(req: AuthRequest, res: Response) {
    try {
      const { experiences, meta } = await adminExperienceService.listExperiences({
        page: req.query.page?.toString(),
        limit: req.query.limit?.toString(),
        search: req.query.search?.toString(),
        category: req.query.category?.toString(),
        active: req.query.active?.toString(),
        providerId: req.query.providerId?.toString(),
      });

      return ApiResponseHelper.success(
        res,
        experiences,
        "Experiences fetched successfully",
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

  async getExperience(req: AuthRequest, res: Response) {
    try {
      const experience = await adminExperienceService.getExperience(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        experience,
        "Experience fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async createExperience(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminCreateExperienceDTO.safeParse(mergeImagePayload(req));

      if (!parsedData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsedData.error), 400);
      }

      const experience = await adminExperienceService.createExperience(
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        experience,
        "Experience created successfully",
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

  async updateExperience(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminUpdateExperienceDTO.safeParse(mergeImagePayload(req));

      if (!parsedData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsedData.error), 400);
      }

      const experience = await adminExperienceService.updateExperience(
        readIdParam(req),
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        experience,
        "Experience updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteExperience(req: AuthRequest, res: Response) {
    try {
      const result = await adminExperienceService.deleteExperience(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Experience deleted successfully",
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
