import mongoose from "mongoose";
import {
  AdminConsultingServiceListQueryDTO,
  CreateConsultingServiceDTO,
  UpdateConsultingServiceDTO,
} from "../dtos/consulting.dto";
import { HttpException } from "../exceptions/http-exception";
import { ConsultingLeadModel } from "../models/consulting-lead.model";
import { ConsultingServiceModel } from "../models/consulting-service.model";

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

export class AdminConsultingServiceService {
  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid consulting service id");
    }
  }

  private async ensureUniqueSlug(slug: string, exceptId?: string) {
    const existing = await ConsultingServiceModel.exists({
      slug,
      ...(exceptId ? { _id: { $ne: exceptId } } : {}),
    });

    if (existing) {
      throw new HttpException(400, "Consulting service slug already exists");
    }
  }

  private buildFilter(params: AdminConsultingServiceListQueryDTO) {
    const filter: Record<string, unknown> = {};

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
        { price: regex },
        { duration: regex },
        { deliverables: regex },
      ];
    }

    return filter;
  }

  async listServices(params: AdminConsultingServiceListQueryDTO) {
    const filter = this.buildFilter(params);
    const skip = (params.page - 1) * params.limit;
    const [services, total, totalServices, activeServices, totalLeads, newLeads] =
      await Promise.all([
        ConsultingServiceModel.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(params.limit),
        ConsultingServiceModel.countDocuments(filter),
        ConsultingServiceModel.countDocuments(),
        ConsultingServiceModel.countDocuments({ isActive: true }),
        ConsultingLeadModel.countDocuments(),
        ConsultingLeadModel.countDocuments({ status: "NEW" }),
      ]);

    return {
      services,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
        summary: { totalServices, activeServices, totalLeads, newLeads },
      },
    };
  }

  async getService(id: string) {
    this.assertValidId(id);
    const service = await ConsultingServiceModel.findById(id);

    if (!service) {
      throw new HttpException(404, "Consulting service not found");
    }

    return service;
  }

  async createService(payload: CreateConsultingServiceDTO) {
    const slug = slugify(payload.slug || payload.title);
    if (!slug) {
      throw new HttpException(400, "A valid consulting service slug is required");
    }
    await this.ensureUniqueSlug(slug);
    return ConsultingServiceModel.create({ ...payload, slug });
  }

  async updateService(id: string, payload: UpdateConsultingServiceDTO) {
    this.assertValidId(id);
    const existing = await ConsultingServiceModel.findById(id);
    if (!existing) {
      throw new HttpException(404, "Consulting service not found");
    }
    const slug = payload.slug ? slugify(payload.slug) : undefined;
    if (slug) await this.ensureUniqueSlug(slug, id);
    return ConsultingServiceModel.findByIdAndUpdate(
      id,
      removeUndefined({ ...payload, slug }),
      { returnDocument: "after", runValidators: true },
    );
  }

  async deleteService(id: string) {
    this.assertValidId(id);
    const service = await ConsultingServiceModel.findByIdAndDelete(id);
    if (!service) {
      throw new HttpException(404, "Consulting service not found");
    }
    await ConsultingLeadModel.updateMany({ serviceId: id }, { $unset: { serviceId: "" } });
    return { deleted: true };
  }
}
