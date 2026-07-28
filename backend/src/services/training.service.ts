import mongoose from "mongoose";
import {
  CreateTrainingEnrollmentDTO,
  OwnTrainingEnrollmentListQueryDTO,
  TrainingCourseListQueryDTO,
  UpdateOwnTrainingEnrollmentDTO,
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

  // ============== Mobile: own enrollment reads and writes ==============
  //
  // Ownership is enforced inside the query using the id from the verified
  // token. A user id is never read from the request body.

  private assertValidId(id: string, label = "enrollment") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, `Invalid ${label} id`);
    }
  }

  // Mobile-safe projection: the admin `response` is the learner's own reply
  // and stays; nothing else internal is exposed.
  private toMobileEnrollment(enrollment: any) {
    const course = enrollment.courseId;
    const coursePopulated = course && typeof course === "object" && course.title;

    return {
      _id: enrollment._id.toString(),
      courseId: coursePopulated
        ? course._id.toString()
        : enrollment.courseId?.toString(),
      courseTitle: coursePopulated ? course.title : undefined,
      courseSlug: coursePopulated ? course.slug : undefined,
      fullName: enrollment.fullName || enrollment.name,
      email: enrollment.email,
      phone: enrollment.phone,
      age: enrollment.age,
      education: enrollment.education || enrollment.educationLevel,
      experience: enrollment.experience || enrollment.priorExperience,
      motivation: enrollment.motivation || enrollment.message,
      status: enrollment.status,
      response: enrollment.response,
      enrolledAt: enrollment.enrolledAt,
      createdAt: enrollment.createdAt,
      updatedAt: enrollment.updatedAt,
    };
  }

  async listOwnEnrollments(
    userId: string,
    params: OwnTrainingEnrollmentListQueryDTO,
  ) {
    const filter: Record<string, unknown> = { userId };

    if (params.status) {
      filter.status = params.status;
    }

    const skip = (params.page - 1) * params.limit;

    const [enrollments, total] = await Promise.all([
      TrainingEnrollmentModel.find(filter)
        .populate("courseId", "title slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      TrainingEnrollmentModel.countDocuments(filter),
    ]);

    return {
      enrollments: enrollments.map((enrollment) =>
        this.toMobileEnrollment(enrollment),
      ),
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
      },
    };
  }

  async getOwnEnrollment(userId: string, id: string) {
    this.assertValidId(id);

    const enrollment = await TrainingEnrollmentModel.findOne({
      _id: id,
      userId,
    }).populate("courseId", "title slug");

    if (!enrollment) {
      throw new HttpException(404, "Training enrollment not found");
    }

    return this.toMobileEnrollment(enrollment);
  }

  async updateOwnEnrollment(
    userId: string,
    id: string,
    payload: UpdateOwnTrainingEnrollmentDTO,
  ) {
    this.assertValidId(id);

    // Keep the legacy duplicate columns in step so the web admin keeps
    // rendering the same values.
    const updatePayload: Record<string, unknown> = { ...payload };
    if (payload.fullName) {
      updatePayload.name = payload.fullName;
    }
    if (payload.education) {
      updatePayload.educationLevel = payload.education;
    }
    if (payload.experience) {
      updatePayload.priorExperience = payload.experience;
    }
    if (payload.motivation) {
      updatePayload.message = payload.motivation;
    }

    const enrollment = await TrainingEnrollmentModel.findOneAndUpdate(
      { _id: id, userId, status: "PENDING" },
      updatePayload,
      { returnDocument: "after", runValidators: true },
    ).populate("courseId", "title slug");

    if (!enrollment) {
      const exists = await TrainingEnrollmentModel.exists({ _id: id, userId });
      throw new HttpException(
        exists ? 409 : 404,
        exists
          ? "Only a pending enrollment can be edited"
          : "Training enrollment not found",
      );
    }

    return this.toMobileEnrollment(enrollment);
  }

  async cancelOwnEnrollment(userId: string, id: string) {
    this.assertValidId(id);

    const enrollment = await TrainingEnrollmentModel.findOneAndUpdate(
      { _id: id, userId, status: { $in: ["PENDING", "CONFIRMED"] } },
      { status: "CANCELLED" },
      { returnDocument: "after", runValidators: true },
    ).populate("courseId", "title slug");

    if (!enrollment) {
      const exists = await TrainingEnrollmentModel.exists({ _id: id, userId });
      throw new HttpException(
        exists ? 409 : 404,
        exists
          ? "This enrollment can no longer be cancelled"
          : "Training enrollment not found",
      );
    }

    return this.toMobileEnrollment(enrollment);
  }
}
