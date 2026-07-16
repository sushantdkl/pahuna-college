import { Response } from "express";
import { z } from "zod";
import { CreateInquiryDTO } from "../dtos/inquiry.dto";
import { emailNotificationService } from "../services/email-notification.service";
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

      const parsedData = CreateInquiryDTO.safeParse({
        hotelId: req.body.hotelId || req.body.hotel_id,
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
}
