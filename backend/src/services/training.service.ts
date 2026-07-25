import mongoose from "mongoose";
import {
  CreateTrainingEnrollmentDTO,
  TrainingCourseListQueryDTO,
} from "../dtos/training.dto";
import { HttpException } from "../exceptions/http-exception";
import { TrainingCourseModel } from "../models/training-course.model";
import { TrainingEnrollmentModel } from "../models/training-enrollment.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class TrainingService {
  private buildCourseFilter(params: TrainingCourseListQueryDTO) {
    const filter: Record<string, unknown> = {
      status: "PUBLISHED",
      isActive: true,
    };

    if (params.category) {
      filter.category = {
        $regex: `^${escapeRegex(params.category)}$`,
        $options: "i",
      };
    }

    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [
        { title: regex },
        { slug: regex },
        { description: regex },
        { category: regex },
        { level: regex },
        { mode: regex },
        { location: regex },
      ];
    }

    return filter;
  }

  async listCourses(params: TrainingCourseListQueryDTO) {
    const filter = this.buildCourseFilter(params);
    const skip = (params.page - 1) * params.limit;
    const [courses, total] = await Promise.all([
      TrainingCourseModel.find(filter)
        .sort({ createdAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(params.limit),
      TrainingCourseModel.countDocuments(filter),
    ]);

    return {
      courses,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
      },
    };
  }

  async getCourse(slug: string) {
    const course = await TrainingCourseModel.findOne({
      slug,
      status: "PUBLISHED",
      isActive: true,
    });

    if (!course) {
      throw new HttpException(404, "Training course not found");
    }

    return course;
  }

  async createEnrollment(
    payload: CreateTrainingEnrollmentDTO,
    userId?: string,
  ) {
    const courseLookup = mongoose.Types.ObjectId.isValid(payload.courseId)
      ? { _id: payload.courseId }
      : { slug: payload.courseId };

    const course = await TrainingCourseModel.findOne({
      ...courseLookup,
      status: "PUBLISHED",
      isActive: true,
    });

    if (!course) {
      throw new HttpException(404, "Selected training course is not available");
    }

    return TrainingEnrollmentModel.create({
      ...payload,
      courseId: course._id,
      userId: userId && mongoose.Types.ObjectId.isValid(userId) ? userId : undefined,
      status: "PENDING",
    });
  }
}
