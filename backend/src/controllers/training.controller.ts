import { Request, Response } from "express";
import { z } from "zod";
import {
  CreateTrainingEnrollmentDTO,
  TrainingCourseListQueryDTO,
} from "../dtos/training.dto";
import { TrainingService } from "../services/training.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const trainingService = new TrainingService();

function readSlugParam(req: Request) {
  const slug = req.params.slug;
  return Array.isArray(slug) ? slug[0] : slug;
}

export class TrainingController {
  async listCourses(req: Request, res: Response) {
    try {
      const parsedQuery = TrainingCourseListQueryDTO.safeParse(req.query);

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { courses, meta } = await trainingService.listCourses(
        parsedQuery.data,
      );

      return ApiResponseHelper.success(
        res,
        courses,
        "Training courses fetched successfully",
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

  async getCourse(req: Request, res: Response) {
    try {
      const course = await trainingService.getCourse(readSlugParam(req));

      return ApiResponseHelper.success(
        res,
        course,
        "Training course fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async createEnrollment(req: AuthRequest, res: Response) {
    try {
      const parsedData = CreateTrainingEnrollmentDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const enrollment = await trainingService.createEnrollment(
        parsedData.data,
        req.user?._id?.toString(),
      );

      return ApiResponseHelper.success(
        res,
        enrollment,
        "Training enrollment submitted successfully",
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
