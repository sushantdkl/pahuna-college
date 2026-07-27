import { Request, Response } from "express";
import { AdminDestinationService } from "../services/admin-destination.service";
import { AdminExperienceService } from "../services/admin-experience.service";
import { AdminHotelService } from "../services/admin-hotel.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const hotelService = new AdminHotelService();
const destinationService = new AdminDestinationService();
const experienceService = new AdminExperienceService();

function queryValue(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function readIdentifier(req: Request) {
  const identifier = req.params.identifier;
  return Array.isArray(identifier) ? identifier[0] : identifier;
}

function publicQuery(req: Request) {
  return {
    page: queryValue(req.query.page),
    limit: queryValue(req.query.limit),
    search: queryValue(req.query.search),
    type: queryValue(req.query.type),
    propertyType: queryValue(req.query.propertyType),
    category: queryValue(req.query.category),
    district: queryValue(req.query.district),
    verified: queryValue(req.query.verified),
    featured: queryValue(req.query.featured),
  };
}

function handleError(res: Response, error: unknown) {
  const failure = error as { message?: string; status?: number };
  return ApiResponseHelper.error(
    res,
    failure.message || "Internal Server Error",
    failure.status || 500,
  );
}

export class PublicCatalogController {
  async listHotels(req: Request, res: Response) {
    try {
      const { hotels, meta } = await hotelService.listPublicHotels(publicQuery(req));
      return ApiResponseHelper.success(res, hotels, "Hotels fetched successfully", 200, meta);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getHotel(req: Request, res: Response) {
    try {
      const hotel = await hotelService.getPublicHotel(readIdentifier(req));
      return ApiResponseHelper.success(res, hotel, "Hotel fetched successfully");
    } catch (error) {
      return handleError(res, error);
    }
  }

  async listDestinations(req: Request, res: Response) {
    try {
      const { destinations, meta } = await destinationService.listPublicDestinations(publicQuery(req));
      return ApiResponseHelper.success(res, destinations, "Destinations fetched successfully", 200, meta);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getDestination(req: Request, res: Response) {
    try {
      const destination = await destinationService.getPublicDestination(readIdentifier(req));
      return ApiResponseHelper.success(res, destination, "Destination fetched successfully");
    } catch (error) {
      return handleError(res, error);
    }
  }

  async listExperiences(req: Request, res: Response) {
    try {
      const { experiences, meta } = await experienceService.listPublicExperiences(publicQuery(req));
      return ApiResponseHelper.success(res, experiences, "Experiences fetched successfully", 200, meta);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getExperience(req: Request, res: Response) {
    try {
      const experience = await experienceService.getPublicExperience(readIdentifier(req));
      return ApiResponseHelper.success(res, experience, "Experience fetched successfully");
    } catch (error) {
      return handleError(res, error);
    }
  }
}
