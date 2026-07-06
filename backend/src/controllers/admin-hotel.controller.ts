import { Response } from "express";
import { z } from "zod";
import { AdminCreateHotelDTO, AdminUpdateHotelDTO } from "../dtos/admin-hotel.dto";
import { AdminHotelService } from "../services/admin-hotel.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminHotelService = new AdminHotelService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function readUploadedImages(req: AuthRequest) {
  const files = req.files;

  if (!Array.isArray(files)) {
    return [];
  }

  return files.map((file) => `/uploads/hotels/${file.filename}`);
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

export class AdminHotelController {
  async listHotels(req: AuthRequest, res: Response) {
    try {
      const { hotels, meta } = await adminHotelService.listHotels({
        page: req.query.page?.toString(),
        limit: req.query.limit?.toString(),
        search: req.query.search?.toString(),
        type: req.query.type?.toString(),
        propertyType: req.query.propertyType?.toString(),
        district: req.query.district?.toString(),
        verified: req.query.verified?.toString(),
        featured: req.query.featured?.toString(),
      });

      return ApiResponseHelper.success(
        res,
        hotels,
        "Hotels fetched successfully",
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

  async getHotel(req: AuthRequest, res: Response) {
    try {
      const hotel = await adminHotelService.getHotel(readIdParam(req));

      return ApiResponseHelper.success(res, hotel, "Hotel fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async createHotel(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminCreateHotelDTO.safeParse(mergeImagePayload(req));

      if (!parsedData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsedData.error), 400);
      }

      const hotel = await adminHotelService.createHotel(parsedData.data);

      return ApiResponseHelper.success(res, hotel, "Hotel created successfully", 201);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateHotel(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminUpdateHotelDTO.safeParse(mergeImagePayload(req));

      if (!parsedData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsedData.error), 400);
      }

      const hotel = await adminHotelService.updateHotel(
        readIdParam(req),
        parsedData.data,
      );

      return ApiResponseHelper.success(res, hotel, "Hotel updated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteHotel(req: AuthRequest, res: Response) {
    try {
      const result = await adminHotelService.deleteHotel(readIdParam(req));

      return ApiResponseHelper.success(res, result, "Hotel deleted successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
