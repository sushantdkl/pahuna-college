import { Response } from "express";
import { z } from "zod";
import {
  AdminTrainingEnrollmentListQueryDTO,
  UpdateTrainingEnrollmentDTO,
} from "../dtos/training.dto";
import { AdminTrainingEnrollmentService } from "../services/admin-training-enrollment.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminTrainingEnrollmentService = new AdminTrainingEnrollmentService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

export class AdminTrainingEnrollmentController {
  async listEnrollments(req: AuthRequest, res: Response) {
    try {
      const parsedQuery = AdminTrainingEnrollmentListQueryDTO.safeParse(
        req.query,
      );

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { enrollments, meta } =
        await adminTrainingEnrollmentService.listEnrollments(parsedQuery.data);

      return ApiResponseHelper.success(
        res,
        enrollments,
        "Training enrollments fetched successfully",
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

  async getEnrollment(req: AuthRequest, res: Response) {
    try {
      const enrollment = await adminTrainingEnrollmentService.getEnrollment(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        enrollment,
        "Training enrollment fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateEnrollment(req: AuthRequest, res: Response) {
    try {
      const parsedData = UpdateTrainingEnrollmentDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const enrollment =
        await adminTrainingEnrollmentService.updateEnrollment(
          readIdParam(req),
          parsedData.data,
        );

      return ApiResponseHelper.success(
        res,
        enrollment,
        "Training enrollment updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteEnrollment(req: AuthRequest, res: Response) {
    try {
      const result = await adminTrainingEnrollmentService.deleteEnrollment(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Training enrollment deleted successfully",
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
