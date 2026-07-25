import mongoose from "mongoose";
import {
  ConsultingServiceListQueryDTO,
  CreateConsultingLeadDTO,
  OwnConsultingLeadListQueryDTO,
  UpdateOwnConsultingLeadDTO,
} from "../dtos/consulting.dto";
import { HttpException } from "../exceptions/http-exception";
import { ConsultingLeadModel } from "../models/consulting-lead.model";
import { ConsultingServiceModel } from "../models/consulting-service.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class ConsultingService {
  private buildServiceFilter(params: ConsultingServiceListQueryDTO) {
    const filter: Record<string, unknown> = { isActive: true };

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
        { price: regex },
        { duration: regex },
        { deliverables: regex },
      ];
    }

    return filter;
  }

  async listServices(params: ConsultingServiceListQueryDTO) {
    const filter = this.buildServiceFilter(params);
    const skip = (params.page - 1) * params.limit;
    const [services, total] = await Promise.all([
      ConsultingServiceModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      ConsultingServiceModel.countDocuments(filter),
    ]);

    return {
      services,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
      },
    };
  }

  async getService(slug: string) {
    const service = await ConsultingServiceModel.findOne({
      slug,
      isActive: true,
    });

    if (!service) {
      throw new HttpException(404, "Consulting service not found");
    }

    return service;
  }

  async createLead(payload: CreateConsultingLeadDTO, userId?: string) {
    let serviceId = payload.serviceId;
    if (payload.serviceId) {
      const serviceLookup = mongoose.Types.ObjectId.isValid(payload.serviceId)
        ? { _id: payload.serviceId }
        : { slug: payload.serviceId };
      const service = await ConsultingServiceModel.findOne({
        ...serviceLookup,
        isActive: true,
      });

      if (!service) {
        throw new HttpException(404, "Selected consulting service is not available");
      }
      serviceId = service._id.toString();
    }

    return ConsultingLeadModel.create({
      ...payload,
      serviceId: serviceId || undefined,
      userId:
        userId && mongoose.Types.ObjectId.isValid(userId) ? userId : undefined,
      status: "NEW",
    });
  }

  // ============== Mobile: own consulting request reads and writes ==============
  //
  // Ownership is enforced inside the query using the id from the verified
  // token. A user id is never read from the request body.

  private assertValidId(id: string, label = "consulting request") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, `Invalid ${label} id`);
    }
  }

  // Mobile-safe projection: the sales pipeline assignment stays internal.
  private toMobileLead(lead: any) {
    const service = lead.serviceId;
    const servicePopulated =
      service && typeof service === "object" && service.title;

    return {
      _id: lead._id.toString(),
      serviceId: servicePopulated
        ? service._id.toString()
        : lead.serviceId?.toString(),
      serviceTitle: servicePopulated ? service.title : undefined,
      serviceSlug: servicePopulated ? service.slug : undefined,
      contactName: lead.contactName || lead.name,
      email: lead.email,
      phone: lead.phone,
      businessName: lead.businessName,
      businessType: lead.businessType,
      businessStage: lead.businessStage || lead.stage,
      businessSize: lead.businessSize,
      location: lead.location,
      timeline: lead.timeline,
      budget: lead.budget || lead.budgetRange,
      message: lead.message,
      status: lead.status,
      response: lead.response,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  }

  async listOwnLeads(userId: string, params: OwnConsultingLeadListQueryDTO) {
    const filter: Record<string, unknown> = { userId };

    if (params.status) {
      filter.status = params.status;
    }

    const skip = (params.page - 1) * params.limit;

    const [leads, total] = await Promise.all([
      ConsultingLeadModel.find(filter)
        .populate("serviceId", "title slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      ConsultingLeadModel.countDocuments(filter),
    ]);

    return {
      leads: leads.map((lead) => this.toMobileLead(lead)),
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
      },
    };
  }

  async getOwnLead(userId: string, id: string) {
    this.assertValidId(id);

    const lead = await ConsultingLeadModel.findOne({
      _id: id,
      userId,
    }).populate("serviceId", "title slug");

    if (!lead) {
      throw new HttpException(404, "Consulting request not found");
    }

    return this.toMobileLead(lead);
  }

  async updateOwnLead(
    userId: string,
    id: string,
    payload: UpdateOwnConsultingLeadDTO,
  ) {
    this.assertValidId(id);

    // Keep the legacy duplicate columns in step so the web admin keeps
    // rendering the same values.
    const updatePayload: Record<string, unknown> = { ...payload };
    if (payload.contactName) {
      updatePayload.name = payload.contactName;
    }
    if (payload.businessStage) {
      updatePayload.stage = payload.businessStage;
    }
    if (payload.budget) {
      updatePayload.budgetRange = payload.budget;
    }

    const lead = await ConsultingLeadModel.findOneAndUpdate(
      { _id: id, userId, status: "NEW" },
      updatePayload,
      { returnDocument: "after", runValidators: true },
    ).populate("serviceId", "title slug");

    if (!lead) {
      const exists = await ConsultingLeadModel.exists({ _id: id, userId });
      throw new HttpException(
        exists ? 409 : 404,
        exists
          ? "This request can no longer be edited because our team has already picked it up"
          : "Consulting request not found",
      );
    }

    return this.toMobileLead(lead);
  }

  async cancelOwnLead(userId: string, id: string) {
    this.assertValidId(id);

    const lead = await ConsultingLeadModel.findOneAndUpdate(
      { _id: id, userId, status: { $in: ["NEW", "CONTACTED", "QUALIFIED"] } },
      { status: "LOST" },
      { returnDocument: "after", runValidators: true },
    ).populate("serviceId", "title slug");

    if (!lead) {
      const exists = await ConsultingLeadModel.exists({ _id: id, userId });
      throw new HttpException(
        exists ? 409 : 404,
        exists
          ? "This request can no longer be cancelled"
          : "Consulting request not found",
      );
    }

    return this.toMobileLead(lead);
  }
}
