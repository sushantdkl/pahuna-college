import mongoose from "mongoose";
import {
  AdminPartnerApplicationListQueryDTO,
  AdminUpdatePartnerApplicationDTO,
} from "../dtos/partner-application.dto";
import { HttpException } from "../exceptions/http-exception";
import { PartnerApplicationModel } from "../models/partner-application.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class AdminPartnerApplicationService {
  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid partner application id");
    }
  }

  private populateReviewer(
    query: ReturnType<typeof PartnerApplicationModel.findById>,
  ) {
    return query.populate("reviewedBy", "fullName email");
  }

  private buildFilter(params: AdminPartnerApplicationListQueryDTO) {
    const filter: Record<string, unknown> = {};

    if (params.status) {
      filter.status = params.status;
    }

    if (params.type) {
      filter.partnerType = params.type;
    }

    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [
        { businessName: regex },
        { ownerName: regex },
        { email: regex },
        { phone: regex },
        { address: regex },
        { website: regex },
      ];
    }

    return filter;
  }

  async listApplications(params: AdminPartnerApplicationListQueryDTO) {
    const skip = (params.page - 1) * params.limit;
    const filter = this.buildFilter(params);
    const [applications, total, all, pending, approved, rejected] =
      await Promise.all([
        PartnerApplicationModel.find(filter)
          .populate("reviewedBy", "fullName email")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(params.limit),
        PartnerApplicationModel.countDocuments(filter),
        PartnerApplicationModel.countDocuments(),
        PartnerApplicationModel.countDocuments({ status: "PENDING" }),
        PartnerApplicationModel.countDocuments({ status: "APPROVED" }),
        PartnerApplicationModel.countDocuments({ status: "REJECTED" }),
      ]);

    return {
      applications,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
        summary: { total: all, pending, approved, rejected },
      },
    };
  }

  async getApplication(id: string) {
    this.assertValidId(id);

    const application = await this.populateReviewer(
      PartnerApplicationModel.findById(id),
    );

    if (!application) {
      throw new HttpException(404, "Partner application not found");
    }

    return application;
  }

  async updateApplication(
    id: string,
    adminId: string,
    payload: AdminUpdatePartnerApplicationDTO,
  ) {
    this.assertValidId(id);

    const existing = await PartnerApplicationModel.findById(id);

    if (!existing) {
      throw new HttpException(404, "Partner application not found");
    }

    const updatePayload: Record<string, unknown> = {
      ...payload,
      reviewedBy: adminId,
    };

    if (
      payload.status &&
      payload.status !== "PENDING" &&
      existing.status === "PENDING"
    ) {
      updatePayload.reviewedAt = new Date();
    }

    const application = await this.populateReviewer(
      PartnerApplicationModel.findByIdAndUpdate(id, updatePayload, {
        returnDocument: "after",
        runValidators: true,
      }),
    );

    if (!application) {
      throw new HttpException(404, "Partner application not found");
    }

    return application;
  }

  async deleteApplication(id: string) {
    this.assertValidId(id);

    const application = await PartnerApplicationModel.findByIdAndDelete(id);

    if (!application) {
      throw new HttpException(404, "Partner application not found");
    }

    return { deleted: true };
  }
}
