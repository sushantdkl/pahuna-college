import { Request, Response } from "express";
import { z } from "zod";
import { TripPackageListQueryDTO } from "../dtos/trip-package.dto";
import { TripPackageService } from "../services/trip-package.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const tripPackageService = new TripPackageService();

function readSlugParam(req: Request) {
  const slug = req.params.slug;
  return Array.isArray(slug) ? slug[0] : slug;
}

export class TripPackageController {
  async listPackages(req: Request, res: Response) {
    try {
      const parsedQuery = TripPackageListQueryDTO.safeParse(req.query);
      if (!parsedQuery.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsedQuery.error), 400);
      }
      const { packages, meta } = await tripPackageService.listPackages(parsedQuery.data);
      return ApiResponseHelper.success(res, packages, "Trip packages fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async getPackage(req: Request, res: Response) {
    try {
      const tripPackage = await tripPackageService.getPackage(readSlugParam(req));
      return ApiResponseHelper.success(res, tripPackage, "Trip package fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }
}
