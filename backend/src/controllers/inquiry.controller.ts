import { Response } from "express";
import { z } from "zod";
import {
  CreateInquiryDTO,
  OwnInquiryListQueryDTO,
  UpdateOwnInquiryDTO,
} from "../dtos/inquiry.dto";
import { emailNotificationService } from "../services/email-notification.service";
import { InquiryService } from "../services/inquiry.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const inquiryService = new InquiryService();

/// Express types route params as `string | string[]`; the mobile routes only
/// ever carry a single id.
function readParamId(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

export class InquiryController {
  async createInquiry(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(
          res,
          "Authentication token is required",
          401,
        );
      }

      const parsedData = CreateInquiryDTO.safeParse({
        hotelId: req.body.hotelId || req.body.hotel_id,
        tripPackageId: req.body.tripPackageId || req.body.trip_package_id,
        destinationId: req.body.destinationId,
        experienceId: req.body.experienceId,
        itineraryId: req.body.itineraryId,
        hotelName: req.body.hotelName || req.body.hotel_name,
        title: req.body.title,
        message: req.body.message,
        inquiryType: req.body.inquiryType || req.body.inquiry_type,
      });

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const inquiry = await inquiryService.createInquiry(
        req.user._id.toString(),
        parsedData.data,
      );

      await emailNotificationService.sendNotification({
        subject: `[Pahuna Inquiry] ${parsedData.data.title}`,
        replyTo: req.user.email,
        text: [
          `Customer: ${req.user.fullName}`,
          `Email: ${req.user.email}`,
          `Hotel: ${parsedData.data.hotelName || parsedData.data.hotelId || "General"}`,
          `Package: ${parsedData.data.tripPackageId || "None"}`,
          `Type: ${parsedData.data.inquiryType}`,
          `Subject: ${parsedData.data.title}`,
          "",
          parsedData.data.message,
          "",
          `Inquiry ID: ${inquiry._id}`,
        ].join("\n"),
      });

      return ApiResponseHelper.success(
        res,
        inquiry,
        "Inquiry submitted successfully",
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

  // ============== Mobile: own-record endpoints ==============

  async listOwnInquiries(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(
          res,
          "Authentication token is required",
          401,
        );
      }

      const parsedQuery = OwnInquiryListQueryDTO.safeParse(req.query);

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { inquiries, meta } = await inquiryService.listOwnInquiries(
        req.user._id.toString(),
        parsedQuery.data,
      );

      return ApiResponseHelper.success(
        res,
        inquiries,
        "Inquiries fetched successfully",
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

  async getOwnInquiry(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(
          res,
          "Authentication token is required",
          401,
        );
      }

      const inquiry = await inquiryService.getOwnInquiry(
        req.user._id.toString(),
        readParamId(req),
      );

      return ApiResponseHelper.success(
        res,
        inquiry,
        "Inquiry fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateOwnInquiry(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(
          res,
          "Authentication token is required",
          401,
        );
      }

      const parsedData = UpdateOwnInquiryDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const inquiry = await inquiryService.updateOwnInquiry(
        req.user._id.toString(),
        readParamId(req),
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        inquiry,
        "Inquiry updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async cancelOwnInquiry(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseHelper.error(
          res,
          "Authentication token is required",
          401,
        );
      }

      const inquiry = await inquiryService.cancelOwnInquiry(
        req.user._id.toString(),
        readParamId(req),
      );

      return ApiResponseHelper.success(
        res,
        inquiry,
        "Inquiry closed successfully",
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
