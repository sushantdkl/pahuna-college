import { Request, Response } from "express";
import { z } from "zod";
import {
  CreateTrainingEnrollmentDTO,
  OwnTrainingEnrollmentListQueryDTO,
  TrainingCourseListQueryDTO,
  UpdateOwnTrainingEnrollmentDTO,
} from "../dtos/training.dto";
import { HttpException } from "../exceptions/http-exception";
import { TrainingService } from "../services/training.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const trainingService = new TrainingService();

function readSlugParam(req: Request) {
  const slug = req.params.slug;
  return Array.isArray(slug) ? slug[0] : slug;
}

function readParamId(req: Request) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function requireUserId(req: AuthRequest) {
  if (!req.user) {
    throw new HttpException(401, "Authentication token is required");
  }

  return req.user._id.toString();
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

  // ============== Mobile: own enrollment endpoints ==============

  async listOwnEnrollments(req: AuthRequest, res: Response) {
    try {
      const userId = requireUserId(req);
      const parsedQuery = OwnTrainingEnrollmentListQueryDTO.safeParse(req.query);

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { enrollments, meta } = await trainingService.listOwnEnrollments(
        userId,
        parsedQuery.data,
      );

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

  async getOwnEnrollment(req: AuthRequest, res: Response) {
    try {
      const enrollment = await trainingService.getOwnEnrollment(
        requireUserId(req),
        readParamId(req),
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

  async updateOwnEnrollment(req: AuthRequest, res: Response) {
    try {
      const userId = requireUserId(req);
      const parsedData = UpdateOwnTrainingEnrollmentDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const enrollment = await trainingService.updateOwnEnrollment(
        userId,
        readParamId(req),
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

  async cancelOwnEnrollment(req: AuthRequest, res: Response) {
    try {
      const enrollment = await trainingService.cancelOwnEnrollment(
        requireUserId(req),
        readParamId(req),
      );

      return ApiResponseHelper.success(
        res,
        enrollment,
        "Training enrollment cancelled successfully",
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
