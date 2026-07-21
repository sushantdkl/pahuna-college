import mongoose from "mongoose";
import {
  ConsultingServiceListQueryDTO,
  CreateConsultingLeadDTO,
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

  async createLead(payload: CreateConsultingLeadDTO) {
    if (payload.serviceId && !mongoose.Types.ObjectId.isValid(payload.serviceId)) {
      throw new HttpException(400, "Invalid consulting service id");
    }

    if (payload.serviceId) {
      const service = await ConsultingServiceModel.findOne({
        _id: payload.serviceId,
        isActive: true,
      });

      if (!service) {
        throw new HttpException(404, "Selected consulting service is not available");
      }
    }

    return ConsultingLeadModel.create({
      ...payload,
      serviceId: payload.serviceId || undefined,
      status: "NEW",
    });
  }
}
