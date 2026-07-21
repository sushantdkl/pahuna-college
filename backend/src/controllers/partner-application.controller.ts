import { Request, Response } from "express";
import { z } from "zod";
import { CreatePartnerApplicationDTO } from "../dtos/partner-application.dto";
import { PartnerApplicationService } from "../services/partner-application.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const partnerApplicationService = new PartnerApplicationService();

export class PartnerApplicationController {
  async createApplication(req: Request, res: Response) {
    try {
      const parsedData = CreatePartnerApplicationDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const application = await partnerApplicationService.createApplication(
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        application,
        "Partner application submitted successfully",
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
