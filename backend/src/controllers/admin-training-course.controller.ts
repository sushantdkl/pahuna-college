import { Response } from "express";
import { z } from "zod";
import {
  AdminTrainingCourseListQueryDTO,
  CreateTrainingCourseDTO,
  UpdateTrainingCourseDTO,
} from "../dtos/training.dto";
import { AdminTrainingCourseService } from "../services/admin-training-course.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const adminTrainingCourseService = new AdminTrainingCourseService();

function readIdParam(req: AuthRequest) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function courseBody(body: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries({
      title: body.title,
      slug: body.slug,
      description: body.description,
      category: body.category,
      duration: body.duration,
      price: body.price,
      level: body.level,
      mode: body.mode,
      location: body.location,
      startDate: body.startDate ?? body.start_date,
      endDate: body.endDate ?? body.end_date,
      maxParticipants: body.maxParticipants ?? body.max_participants,
      image: body.image,
      status: body.status,
      isActive: body.isActive ?? body.is_active,
    }).filter(([, value]) => value !== undefined),
  );
}

function uploadedCourseImage(req: AuthRequest) {
  return req.file ? `/uploads/training/${req.file.filename}` : undefined;
}

export class AdminTrainingCourseController {
  async listCourses(req: AuthRequest, res: Response) {
    try {
      const parsedQuery = AdminTrainingCourseListQueryDTO.safeParse({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        status: req.query.status,
        category: req.query.category,
        active: req.query.active ?? req.query.isActive,
      });

      if (!parsedQuery.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedQuery.error),
          400,
        );
      }

      const { courses, meta } = await adminTrainingCourseService.listCourses(
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

  async getCourse(req: AuthRequest, res: Response) {
    try {
      const course = await adminTrainingCourseService.getCourse(
        readIdParam(req),
      );

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

  async createCourse(req: AuthRequest, res: Response) {
    try {
      const parsedData = CreateTrainingCourseDTO.safeParse(
        {
          ...courseBody(req.body),
          ...(uploadedCourseImage(req) ? { image: uploadedCourseImage(req) } : {}),
        },
      );

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const course = await adminTrainingCourseService.createCourse(
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        course,
        "Training course created successfully",
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

  async updateCourse(req: AuthRequest, res: Response) {
    try {
      const parsedData = UpdateTrainingCourseDTO.safeParse(
        {
          ...courseBody(req.body),
          ...(uploadedCourseImage(req) ? { image: uploadedCourseImage(req) } : {}),
        },
      );

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const course = await adminTrainingCourseService.updateCourse(
        readIdParam(req),
        parsedData.data,
      );

      return ApiResponseHelper.success(
        res,
        course,
        "Training course updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async deleteCourse(req: AuthRequest, res: Response) {
    try {
      const result = await adminTrainingCourseService.deleteCourse(
        readIdParam(req),
      );

      return ApiResponseHelper.success(
        res,
        result,
        "Training course deleted successfully",
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
