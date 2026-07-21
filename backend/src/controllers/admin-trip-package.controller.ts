import { Response } from "express";
import { z } from "zod";
import {
  AdminTripPackageListQueryDTO,
  CreateTripPackageDTO,
  UpdateTripPackageDTO,
} from "../dtos/trip-package.dto";
import { AdminTripPackageService } from "../services/admin-trip-package.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminTripPackageService = new AdminTripPackageService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function packageBody(body: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries({
      title: body.title,
      slug: body.slug,
      description: body.description,
      destinationId: body.destinationId ?? body.destination_id,
      durationDays: body.durationDays ?? body.duration_days,
      price: body.price,
      priceMin: body.priceMin ?? body.price_min,
      priceMax: body.priceMax ?? body.price_max,
      itinerary: body.itinerary,
      inclusions: body.inclusions,
      exclusions: body.exclusions,
      highlights: body.highlights,
      difficulty: body.difficulty,
      groupSize: body.groupSize ?? body.group_size,
      images: body.images,
      isActive: body.isActive ?? body.is_active,
      isFeatured: body.isFeatured ?? body.is_featured,
    }).filter(([, value]) => value !== undefined),
  );
}

export class AdminTripPackageController {
  async listPackages(req: AuthRequest, res: Response) {
    try {
      const parsedQuery = AdminTripPackageListQueryDTO.safeParse({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        active: req.query.active ?? req.query.isActive,
        featured: req.query.featured ?? req.query.isFeatured,
        destinationId: req.query.destinationId ?? req.query.destination_id,
        difficulty: req.query.difficulty,
      });
      if (!parsedQuery.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsedQuery.error), 400);
      }
      const { packages, meta } = await adminTripPackageService.listPackages(parsedQuery.data);
      return ApiResponseHelper.success(res, packages, "Trip packages fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async getPackage(req: AuthRequest, res: Response) {
    try {
      const tripPackage = await adminTripPackageService.getPackage(readIdParam(req));
      return ApiResponseHelper.success(res, tripPackage, "Trip package fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async createPackage(req: AuthRequest, res: Response) {
    try {
      const parsedData = CreateTripPackageDTO.safeParse(packageBody(req.body));
      if (!parsedData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsedData.error), 400);
      }
      const tripPackage = await adminTripPackageService.createPackage(parsedData.data);
      return ApiResponseHelper.success(res, tripPackage, "Trip package created successfully", 201);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async updatePackage(req: AuthRequest, res: Response) {
    try {
      const parsedData = UpdateTripPackageDTO.safeParse(packageBody(req.body));
      if (!parsedData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsedData.error), 400);
      }
      const tripPackage = await adminTripPackageService.updatePackage(readIdParam(req), parsedData.data);
      return ApiResponseHelper.success(res, tripPackage, "Trip package updated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async deletePackage(req: AuthRequest, res: Response) {
    try {
      const result = await adminTripPackageService.deletePackage(readIdParam(req));
      return ApiResponseHelper.success(res, result, "Trip package deleted successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }
}
