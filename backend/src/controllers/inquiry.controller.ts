import { Response } from "express";
import { z } from "zod";
import { CreateInquiryDTO } from "../dtos/inquiry.dto";
import { InquiryService } from "../services/inquiry.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const inquiryService = new InquiryService();

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

      const parsedData = CreateInquiryDTO.safeParse(req.body);

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
}
