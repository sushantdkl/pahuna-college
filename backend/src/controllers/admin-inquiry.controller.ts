import { Response } from "express";
import { z } from "zod";
import {
  AdminInquiryListQueryDTO,
  AdminUpdateInquiryDTO,
} from "../dtos/inquiry.dto";
import { AdminInquiryService } from "../services/admin-inquiry.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminInquiryService = new AdminInquiryService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

export class AdminInquiryController {
  async listInquiries(req: AuthRequest, res: Response) {
    try {
      const parsedQuery = AdminInquiryListQueryDTO.safeParse({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        status: req.query.status,
        inquiryType:
          req.query.inquiryType || req.query.inquiry_type || req.query.type,
        hotelId: req.query.hotelId || req.query.hotel_id,
        tripPackageId: req.query.tripPackageId || req.query.trip_package_id,
      });

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { inquiries, meta } = await adminInquiryService.listInquiries(
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

  async getInquiry(req: AuthRequest, res: Response) {
    try {
      const inquiry = await adminInquiryService.getInquiry(readIdParam(req));

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

  async updateInquiry(req: AuthRequest, res: Response) {
    try {
      const parsedData = AdminUpdateInquiryDTO.safeParse({
        status: req.body.status,
        response: req.body.response,
        assignedTo: req.body.assignedTo || req.body.assigned_to,
      });

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const inquiry = await adminInquiryService.updateInquiry(
        readIdParam(req),
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

  async deleteInquiry(req: AuthRequest, res: Response) {
    try {
      const result = await adminInquiryService.deleteInquiry(readIdParam(req));

      return ApiResponseHelper.success(
        res,
        result,
        "Inquiry deleted successfully",
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
