import { Response } from "express";
import { z } from "zod";
import {
  AdminCreateDestinationDTO,
  AdminUpdateDestinationDTO,
} from "../dtos/admin-destination.dto";
import { AdminDestinationService } from "../services/admin-destination.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminDestinationService = new AdminDestinationService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function readUploadedImages(req: AuthRequest) {
  const files = req.files;

  if (!Array.isArray(files)) {
    return [];
  }

  return files.map((file) => `/uploads/destinations/${file.filename}`);
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

export class AdminDestinationController {
  async listDestinations(req: AuthRequest, res: Response) {
    try {
      const { destinations, meta } =
        await adminDestinationService.listDestinations({
          page: req.query.page?.toString(),
          limit: req.query.limit?.toString(),
          search: req.query.search?.toString(),
          category: req.query.category?.toString(),
          district: req.query.district?.toString(),
          active: req.query.active?.toString(),
          featured: req.query.featured?.toString(),
        });

      return ApiResponseHelper.success(
        res,
        destinations,
        "Destinations fetched successfully",
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

  async getDestination(req: AuthRequest, res: Response) {
    try {
      const destination = await adminDestinationService.getDestination(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        destination,
        "Destination fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async createDestination(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminCreateDestinationDTO.safeParse(mergeImagePayload(req));

      if (!parsedData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsedData.error), 400);
      }

      const destination = await adminDestinationService.createDestination(
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        destination,
        "Destination created successfully",
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

  async updateDestination(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminUpdateDestinationDTO.safeParse(mergeImagePayload(req));

      if (!parsedData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsedData.error), 400);
      }

      const destination = await adminDestinationService.updateDestination(
        readIdParam(req),
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        destination,
        "Destination updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteDestination(req: AuthRequest, res: Response) {
    try {
      const result = await adminDestinationService.deleteDestination(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Destination deleted successfully",
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
