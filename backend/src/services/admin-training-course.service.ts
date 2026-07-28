import mongoose from "mongoose";
import {
  AdminTrainingCourseListQueryDTO,
  CreateTrainingCourseDTO,
  UpdateTrainingCourseDTO,
} from "../dtos/training.dto";
import { HttpException } from "../exceptions/http-exception";
import { TrainingCourseModel } from "../models/training-course.model";
import { TrainingEnrollmentModel } from "../models/training-enrollment.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function removeUndefined<T extends Record<string, unknown>>(payload: T) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
}

export class AdminTrainingCourseService {
  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid training course id");
    }
  }

  private async ensureUniqueSlug(slug: string, exceptId?: string) {
    const existing = await TrainingCourseModel.exists({
      slug,
      ...(exceptId ? { _id: { $ne: exceptId } } : {}),
    });

    if (existing) {
      throw new HttpException(400, "Training course slug already exists");
    }
  }

  private buildFilter(params: AdminTrainingCourseListQueryDTO) {
    const filter: Record<string, unknown> = {};

    if (params.status) filter.status = params.status;
    if (params.active !== undefined) filter.isActive = params.active;
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
        { duration: regex },
        { level: regex },
        { mode: regex },
        { location: regex },
      ];
    }

    return filter;
  }

  async listCourses(params: AdminTrainingCourseListQueryDTO) {
    const filter = this.buildFilter(params);
    const skip = (params.page - 1) * params.limit;
    const [
      courses,
      total,
      totalCourses,
      activeCourses,
      totalEnrollments,
      pendingEnrollments,
    ] = await Promise.all([
      TrainingCourseModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      TrainingCourseModel.countDocuments(filter),
      TrainingCourseModel.countDocuments(),
      TrainingCourseModel.countDocuments({
        status: "PUBLISHED",
        isActive: true,
      }),
      TrainingEnrollmentModel.countDocuments(),
      TrainingEnrollmentModel.countDocuments({ status: "PENDING" }),
    ]);

    return {
      courses,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
        summary: {
          totalCourses,
          activeCourses,
          totalEnrollments,
          pendingEnrollments,
        },
      },
    };
  }

  async getCourse(id: string) {
    this.assertValidId(id);
    const course = await TrainingCourseModel.findById(id);

    if (!course) {
      throw new HttpException(404, "Training course not found");
    }

    return course;
  }

  async createCourse(payload: CreateTrainingCourseDTO) {
    const slug = slugify(payload.slug || payload.title);

    if (!slug) {
      throw new HttpException(400, "A valid training course slug is required");
    }

    await this.ensureUniqueSlug(slug);
    return TrainingCourseModel.create({ ...payload, slug });
  }

  async updateCourse(id: string, payload: UpdateTrainingCourseDTO) {
    this.assertValidId(id);
    const existing = await TrainingCourseModel.findById(id);

    if (!existing) {
      throw new HttpException(404, "Training course not found");
    }

    const slug = payload.slug ? slugify(payload.slug) : undefined;
    if (slug) await this.ensureUniqueSlug(slug, id);

    const course = await TrainingCourseModel.findByIdAndUpdate(
      id,
      removeUndefined({ ...payload, slug }),
      { returnDocument: "after", runValidators: true },
    );

    return course;
  }

  async deleteCourse(id: string) {
    this.assertValidId(id);
    const course = await TrainingCourseModel.findByIdAndDelete(id);

    if (!course) {
      throw new HttpException(404, "Training course not found");
    }

    await TrainingEnrollmentModel.deleteMany({ courseId: id });
    return { deleted: true };
  }
}
