import mongoose from "mongoose";
import {
  AdminTrainingEnrollmentListQueryDTO,
  UpdateTrainingEnrollmentDTO,
} from "../dtos/training.dto";
import { HttpException } from "../exceptions/http-exception";
import { TrainingEnrollmentModel } from "../models/training-enrollment.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class AdminTrainingEnrollmentService {
  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid training enrollment id");
    }
  }

  private populateEnrollment(
    query: ReturnType<typeof TrainingEnrollmentModel.findById>,
  ) {
    return query
      .populate("courseId", "title slug category duration")
      .populate("userId", "fullName email");
  }

  private buildFilter(params: AdminTrainingEnrollmentListQueryDTO) {
    const filter: Record<string, unknown> = {};

    if (params.status) filter.status = params.status;
    if (params.courseId && mongoose.Types.ObjectId.isValid(params.courseId)) {
      filter.courseId = params.courseId;
    }
    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { message: regex },
        { status: regex },
        { response: regex },
      ];
    }

    return filter;
  }

  async listEnrollments(params: AdminTrainingEnrollmentListQueryDTO) {
    const filter = this.buildFilter(params);
    const skip = (params.page - 1) * params.limit;
    const [enrollments, total, all, pending, confirmed, completed] =
      await Promise.all([
        TrainingEnrollmentModel.find(filter)
          .populate("courseId", "title slug category duration")
          .populate("userId", "fullName email")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(params.limit),
        TrainingEnrollmentModel.countDocuments(filter),
        TrainingEnrollmentModel.countDocuments(),
        TrainingEnrollmentModel.countDocuments({ status: "PENDING" }),
        TrainingEnrollmentModel.countDocuments({ status: "CONFIRMED" }),
        TrainingEnrollmentModel.countDocuments({ status: "COMPLETED" }),
      ]);

    return {
      enrollments,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
        summary: { total: all, pending, confirmed, completed },
      },
    };
  }

  async getEnrollment(id: string) {
    this.assertValidId(id);
    const enrollment = await this.populateEnrollment(
      TrainingEnrollmentModel.findById(id),
    );

    if (!enrollment) {
      throw new HttpException(404, "Training enrollment not found");
    }

    return enrollment;
  }

  async updateEnrollment(id: string, payload: UpdateTrainingEnrollmentDTO) {
    this.assertValidId(id);
    const enrollment = await this.populateEnrollment(
      TrainingEnrollmentModel.findByIdAndUpdate(id, payload, {
        returnDocument: "after",
        runValidators: true,
      }),
    );

    if (!enrollment) {
      throw new HttpException(404, "Training enrollment not found");
    }

    return enrollment;
  }

  async deleteEnrollment(id: string) {
    this.assertValidId(id);
    const enrollment = await TrainingEnrollmentModel.findByIdAndDelete(id);

    if (!enrollment) {
      throw new HttpException(404, "Training enrollment not found");
    }

    return { deleted: true };
  }
}
