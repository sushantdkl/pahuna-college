import { Request, Response } from "express";
import { z } from "zod";
import { CreateNewsletterSubscriberDTO } from "../dtos/newsletter-subscriber.dto";
import { NewsletterSubscriberService } from "../services/newsletter-subscriber.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const newsletterSubscriberService = new NewsletterSubscriberService();

export class NewsletterSubscriberController {
  async subscribe(req: Request, res: Response) {
    try {
      const parsedData = CreateNewsletterSubscriberDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const subscriber = await newsletterSubscriberService.subscribe(
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        subscriber,
        "Newsletter subscription saved successfully",
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
