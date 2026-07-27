import mongoose from "mongoose";
import {
  AdminConsultingLeadListQueryDTO,
  UpdateConsultingLeadDTO,
} from "../dtos/consulting.dto";
import { HttpException } from "../exceptions/http-exception";
import { ConsultingLeadModel } from "../models/consulting-lead.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class AdminConsultingLeadService {
  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid consulting lead id");
    }
  }

  private populateLead(query: ReturnType<typeof ConsultingLeadModel.findById>) {
    return query
      .populate("serviceId", "title slug category")
      .populate("assignedTo", "fullName email");
  }

  private buildFilter(params: AdminConsultingLeadListQueryDTO) {
    const filter: Record<string, unknown> = {};
    if (params.status) filter.status = params.status;
    if (params.serviceId && mongoose.Types.ObjectId.isValid(params.serviceId)) {
      filter.serviceId = params.serviceId;
    }
    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { businessName: regex },
        { message: regex },
        { status: regex },
        { response: regex },
      ];
    }
    return filter;
  }

  async listLeads(params: AdminConsultingLeadListQueryDTO) {
    const filter = this.buildFilter(params);
    const skip = (params.page - 1) * params.limit;
    const [leads, total, all, fresh, contacted, won] = await Promise.all([
      ConsultingLeadModel.find(filter)
        .populate("serviceId", "title slug category")
        .populate("assignedTo", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      ConsultingLeadModel.countDocuments(filter),
      ConsultingLeadModel.countDocuments(),
      ConsultingLeadModel.countDocuments({ status: "NEW" }),
      ConsultingLeadModel.countDocuments({ status: "CONTACTED" }),
      ConsultingLeadModel.countDocuments({ status: "WON" }),
    ]);

    return {
      leads,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
        summary: { total: all, new: fresh, contacted, won },
      },
    };
  }

  async getLead(id: string) {
    this.assertValidId(id);
    const lead = await this.populateLead(ConsultingLeadModel.findById(id));
    if (!lead) {
      throw new HttpException(404, "Consulting lead not found");
    }
    return lead;
  }

  async updateLead(
    id: string,
    adminId: string,
    payload: UpdateConsultingLeadDTO,
  ) {
    this.assertValidId(id);
    const updatePayload = {
      ...payload,
      assignedTo: payload.assignedTo || adminId,
    };
    const lead = await this.populateLead(
      ConsultingLeadModel.findByIdAndUpdate(id, updatePayload, {
        returnDocument: "after",
        runValidators: true,
      }),
    );
    if (!lead) {
      throw new HttpException(404, "Consulting lead not found");
    }
    return lead;
  }

  async deleteLead(id: string) {
    this.assertValidId(id);
    const lead = await ConsultingLeadModel.findByIdAndDelete(id);
    if (!lead) {
      throw new HttpException(404, "Consulting lead not found");
    }
    return { deleted: true };
  }
}
