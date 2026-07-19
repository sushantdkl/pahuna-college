import { Response } from "express";
import { z } from "zod";
import {
  AdminCreateItineraryDTO,
  AdminItineraryListQueryDTO,
  AdminUpdateItineraryDTO,
} from "../dtos/itinerary.dto";
import { AdminItineraryService } from "../services/admin-itinerary.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminItineraryService = new AdminItineraryService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function itineraryBody(body: Record<string, unknown>) {
  return Object.fromEntries(Object.entries({
    title: body.title,
    description: body.description,
    destinationId: body.destinationId || body.destination_id,
    startDate: body.startDate || body.start_date,
    endDate: body.endDate || body.end_date,
    totalDays: body.totalDays ?? body.total_days,
    budget: body.budget,
    hotelIds: body.hotelIds || body.hotel_ids,
    experienceIds: body.experienceIds || body.experience_ids,
    status: body.status,
    isPublic: body.isPublic ?? body.is_public,
  }).filter(([, value]) => value !== undefined));
}

export class AdminItineraryController {
  async listItineraries(req: AuthRequest, res: Response) {
    try {
      const parsedQuery = AdminItineraryListQueryDTO.safeParse({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        status: req.query.status,
        isPublic: req.query.isPublic ?? req.query.is_public ?? req.query.public,
        destinationId: req.query.destinationId || req.query.destination_id,
        userId: req.query.userId || req.query.user_id,
      });

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { itineraries, meta } = await adminItineraryService.listItineraries(
        parsedQuery.data,
      );

      return ApiResponseHelper.success(
        res,
        itineraries,
        "Itineraries fetched successfully",
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

  async getItinerary(req: AuthRequest, res: Response) {
    try {
      const itinerary = await adminItineraryService.getItinerary(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        itinerary,
        "Itinerary fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async createItinerary(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminCreateItineraryDTO.safeParse({
        ...itineraryBody(req.body),
        userId: req.body.userId || req.body.user_id,
      });

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const itinerary = await adminItineraryService.createItinerary(
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        itinerary,
        "Itinerary created successfully",
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

  async updateItinerary(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminUpdateItineraryDTO.safeParse(
        itineraryBody(req.body),
      );

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const itinerary = await adminItineraryService.updateItinerary(
        readIdParam(req),
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        itinerary,
        "Itinerary updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteItinerary(req: AuthRequest, res: Response) {
    try {
      const result = await adminItineraryService.deleteItinerary(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Itinerary deleted successfully",
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
