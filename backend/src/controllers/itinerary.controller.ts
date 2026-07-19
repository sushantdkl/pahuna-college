import { Response } from "express";
import { z } from "zod";
import {
  CreateItineraryDTO,
  ItineraryListQueryDTO,
  UpdateItineraryDTO,
} from "../dtos/itinerary.dto";
import { ItineraryService } from "../services/itinerary.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const itineraryService = new ItineraryService();

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
    totalDays: body.totalDays || body.total_days,
    budget: body.budget,
    hotelIds: body.hotelIds || body.hotel_ids,
    experienceIds: body.experienceIds || body.experience_ids,
    status: body.status,
    isPublic: body.isPublic ?? body.is_public,
  }).filter(([, value]) => value !== undefined));
}

export class ItineraryController {
  async getPlannerOptions(req: AuthRequest, res: Response) {
    try {
      const options = await itineraryService.getPlannerOptions();

      return ApiResponseHelper.success(
        res,
        options,
        "Trip planner options fetched successfully",
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
      if (!req.user) {
        return ApiResponseHelper.error(
          res,
          "Authentication token is required",
          401,
        );
      }

      const parsedData = CreateItineraryDTO.safeParse(itineraryBody(req.body));

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const itinerary = await itineraryService.createItinerary(
        req.user._id.toString(),
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        itinerary,
        "Itinerary saved successfully",
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

  async listOwnItineraries(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(
          res,
          "Authentication token is required",
          401,
        );
      }

      const parsedQuery = ItineraryListQueryDTO.safeParse(req.query);

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { itineraries, meta } = await itineraryService.listOwnItineraries(
        req.user._id.toString(),
        parsedQuery.data.page,
        parsedQuery.data.limit,
      );

      return ApiResponseHelper.success(
        res,
        itineraries,
        "Your itineraries fetched successfully",
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

  async getOwnItinerary(req: AuthRequest, res: Response) {
    try {
      const itinerary = await itineraryService.getOwnItinerary(
        req.user!._id.toString(),
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

  async updateOwnItinerary(req: AuthRequest, res: Response) {
    try {
      const parsedData = UpdateItineraryDTO.safeParse(itineraryBody(req.body));

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const itinerary = await itineraryService.updateOwnItinerary(
        req.user!._id.toString(),
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

  async deleteOwnItinerary(req: AuthRequest, res: Response) {
    try {
      const result = await itineraryService.deleteOwnItinerary(
        req.user!._id.toString(),
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
