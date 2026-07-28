import { Request, Response } from "express";
import { z } from "zod";
import { CreateContactMessageDTO } from "../dtos/contact-message.dto";
import { ContactMessageService } from "../services/contact-message.service";
import { emailNotificationService } from "../services/email-notification.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const contactMessageService = new ContactMessageService();

export class ContactMessageController {
  async createContactMessage(req: Request, res: Response) {
    try {
      const parsedData = CreateContactMessageDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const contactMessage = await contactMessageService.createContactMessage(
        parsedData.data,
      );

      await emailNotificationService.sendNotification({
        subject: `[Pahuna Contact] ${parsedData.data.subject}`,
        replyTo: parsedData.data.email,
        text: [
          `Name: ${parsedData.data.name}`,
          `Email: ${parsedData.data.email}`,
          `Phone: ${parsedData.data.phone || "Not provided"}`,
          `Subject: ${parsedData.data.subject}`,
          "",
          parsedData.data.message,
          "",
          `Message ID: ${contactMessage._id}`,
        ].join("\n"),
      });

      return ApiResponseHelper.success(
        res,
        contactMessage,
        "Contact message submitted successfully",
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
