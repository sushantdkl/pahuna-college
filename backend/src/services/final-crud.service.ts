import mongoose, { Model } from "mongoose";
import {
  CreateFAQDTO,
  CreateFoodProviderDTO,
  CreateRouteSegmentDTO,
  CreateTestimonialDTO,
  CreateTransportRouteDTO,
  FAQListQueryDTO,
  FoodProviderListQueryDTO,
  RouteListQueryDTO,
  TestimonialListQueryDTO,
  UpdateFAQDTO,
  UpdateFoodProviderDTO,
  UpdateRouteSegmentDTO,
  UpdateTestimonialDTO,
  UpdateTransportRouteDTO,
} from "../dtos/final-crud.dto";
import { HttpException } from "../exceptions/http-exception";
import { FAQModel } from "../models/faq.model";
import { FoodProviderModel } from "../models/food-provider.model";
import { RouteSegmentModel } from "../models/route-segment.model";
import { TestimonialModel } from "../models/testimonial.model";
import { TransportRouteModel } from "../models/transport-route.model";

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

function assertValidId(id: string, label: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpException(400, `Invalid ${label} id`);
  }
}

async function ensureUniqueSlug(
  model: Model<any>,
  slug: string,
  label: string,
  exceptId?: string,
) {
  const existing = await model.exists({
    slug,
    ...(exceptId ? { _id: { $ne: exceptId } } : {}),
  });
  if (existing) {
    throw new HttpException(400, `${label} slug already exists`);
  }
}

function pagination(page: number, limit: number, total: number) {
  return { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) };
}

export class FoodProviderService {
  private buildFilter(params: FoodProviderListQueryDTO, publicOnly = false) {
    const filter: Record<string, unknown> = publicOnly ? { active: true } : {};
    if (!publicOnly && params.active !== undefined) filter.active = params.active;
    if (params.featured !== undefined) filter.featured = params.featured;
    if (params.verificationStatus) filter.verificationStatus = params.verificationStatus;
    if (params.type) filter.type = { $regex: `^${escapeRegex(params.type)}$`, $options: "i" };
    if (params.area) filter.area = { $regex: `^${escapeRegex(params.area)}$`, $options: "i" };
    if (params.district) filter.district = { $regex: `^${escapeRegex(params.district)}$`, $options: "i" };
    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [
        { name: regex },
        { slug: regex },
        { type: regex },
        { district: regex },
        { area: regex },
        { shortDescription: regex },
        { longDescription: regex },
        { cuisines: regex },
        { services: regex },
        { features: regex },
      ];
    }
    return filter;
  }

  async list(params: FoodProviderListQueryDTO, publicOnly = false) {
    const filter = this.buildFilter(params, publicOnly);
    const skip = (params.page - 1) * params.limit;
    const [providers, total, all, active, featured, pending] = await Promise.all([
      FoodProviderModel.find(filter)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      FoodProviderModel.countDocuments(filter),
      FoodProviderModel.countDocuments(),
      FoodProviderModel.countDocuments({ active: true }),
      FoodProviderModel.countDocuments({ featured: true }),
      FoodProviderModel.countDocuments({ verificationStatus: "PENDING" }),
    ]);
    return {
      providers,
      meta: {
        ...pagination(params.page, params.limit, total),
        summary: { total: all, active, featured, pending },
      },
    };
  }

  async getBySlug(slug: string) {
    const provider = await FoodProviderModel.findOne({ slug, active: true });
    if (!provider) throw new HttpException(404, "Food provider not found");
    return provider;
  }

  async getById(id: string) {
    assertValidId(id, "food provider");
    const provider = await FoodProviderModel.findById(id);
    if (!provider) throw new HttpException(404, "Food provider not found");
    return provider;
  }

  async create(payload: CreateFoodProviderDTO) {
    const slug = slugify(payload.slug || payload.name);
    if (!slug) throw new HttpException(400, "A valid food provider slug is required");
    await ensureUniqueSlug(FoodProviderModel, slug, "Food provider");
    return FoodProviderModel.create({ ...payload, slug });
  }

  async update(id: string, payload: UpdateFoodProviderDTO) {
    assertValidId(id, "food provider");
    const existing = await FoodProviderModel.findById(id);
    if (!existing) throw new HttpException(404, "Food provider not found");
    const slug = payload.slug ? slugify(payload.slug) : undefined;
    if (slug) await ensureUniqueSlug(FoodProviderModel, slug, "Food provider", id);
    return FoodProviderModel.findByIdAndUpdate(
      id,
      removeUndefined({ ...payload, slug }),
      { returnDocument: "after", runValidators: true },
    );
  }

  async delete(id: string) {
    assertValidId(id, "food provider");
    const provider = await FoodProviderModel.findByIdAndDelete(id);
    if (!provider) throw new HttpException(404, "Food provider not found");
    return { deleted: true };
  }
}

export class RouteCrudService {
  private buildTransportFilter(params: RouteListQueryDTO, publicOnly = false) {
    const filter: Record<string, unknown> = publicOnly ? { isActive: true } : {};
    if (!publicOnly && params.active !== undefined) filter.isActive = params.active;
    if (params.mode) filter.mode = { $regex: `^${escapeRegex(params.mode)}$`, $options: "i" };
    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [
        { fromLocation: regex },
        { toLocation: regex },
        { mode: regex },
        { frequency: regex },
        { notes: regex },
      ];
    }
    return filter;
  }

  private buildSegmentFilter(params: RouteListQueryDTO, publicOnly = false) {
    const filter: Record<string, unknown> = publicOnly ? { active: true } : {};
    if (!publicOnly && params.active !== undefined) filter.active = params.active;
    if (params.featured !== undefined) filter.featured = params.featured;
    if (params.mode) filter.mode = params.mode.toUpperCase();
    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [
        { from: regex },
        { to: regex },
        { slug: regex },
        { mode: regex },
        { notes: regex },
        { riskNotes: regex },
        { seasonality: regex },
      ];
    }
    return filter;
  }

  async listTransportRoutes(params: RouteListQueryDTO, publicOnly = false) {
    const filter = this.buildTransportFilter(params, publicOnly);
    const skip = (params.page - 1) * params.limit;
    const [routes, total, all, active] = await Promise.all([
      TransportRouteModel.find(filter)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      TransportRouteModel.countDocuments(filter),
      TransportRouteModel.countDocuments(),
      TransportRouteModel.countDocuments({ isActive: true }),
    ]);
    return { routes, meta: { ...pagination(params.page, params.limit, total), summary: { total: all, active } } };
  }

  async listRouteSegments(params: RouteListQueryDTO, publicOnly = false) {
    const filter = this.buildSegmentFilter(params, publicOnly);
    const skip = (params.page - 1) * params.limit;
    const [segments, total, all, active, featured] = await Promise.all([
      RouteSegmentModel.find(filter)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      RouteSegmentModel.countDocuments(filter),
      RouteSegmentModel.countDocuments(),
      RouteSegmentModel.countDocuments({ active: true }),
      RouteSegmentModel.countDocuments({ featured: true }),
    ]);
    return {
      segments,
      meta: { ...pagination(params.page, params.limit, total), summary: { total: all, active, featured } },
    };
  }

  async getTransportRoute(id: string) {
    assertValidId(id, "transport route");
    const route = await TransportRouteModel.findById(id);
    if (!route) throw new HttpException(404, "Transport route not found");
    return route;
  }

  async getRouteSegment(idOrSlug: string, admin = false) {
    const query = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug, ...(admin ? {} : { active: true }) };
    const segment = await RouteSegmentModel.findOne(query);
    if (!segment) throw new HttpException(404, "Route segment not found");
    return segment;
  }

  async createTransportRoute(payload: CreateTransportRouteDTO) {
    return TransportRouteModel.create(payload);
  }

  async createRouteSegment(payload: CreateRouteSegmentDTO) {
    const slug = slugify(payload.slug || `${payload.from}-${payload.to}-${payload.mode}`);
    if (!slug) throw new HttpException(400, "A valid route segment slug is required");
    await ensureUniqueSlug(RouteSegmentModel, slug, "Route segment");
    return RouteSegmentModel.create({ ...payload, slug });
  }

  async updateTransportRoute(id: string, payload: UpdateTransportRouteDTO) {
    assertValidId(id, "transport route");
    const existing = await TransportRouteModel.findById(id);
    if (!existing) throw new HttpException(404, "Transport route not found");
    return TransportRouteModel.findByIdAndUpdate(id, payload, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  async updateRouteSegment(id: string, payload: UpdateRouteSegmentDTO) {
    assertValidId(id, "route segment");
    const existing = await RouteSegmentModel.findById(id);
    if (!existing) throw new HttpException(404, "Route segment not found");
    const slug = payload.slug ? slugify(payload.slug) : undefined;
    if (slug) await ensureUniqueSlug(RouteSegmentModel, slug, "Route segment", id);
    return RouteSegmentModel.findByIdAndUpdate(
      id,
      removeUndefined({ ...payload, slug }),
      { returnDocument: "after", runValidators: true },
    );
  }

  async deleteTransportRoute(id: string) {
    assertValidId(id, "transport route");
    const route = await TransportRouteModel.findByIdAndDelete(id);
    if (!route) throw new HttpException(404, "Transport route not found");
    return { deleted: true };
  }

  async deleteRouteSegment(id: string) {
    assertValidId(id, "route segment");
    const segment = await RouteSegmentModel.findByIdAndDelete(id);
    if (!segment) throw new HttpException(404, "Route segment not found");
    return { deleted: true };
  }
}

export class FAQService {
  private buildFilter(params: FAQListQueryDTO, publicOnly = false) {
    const filter: Record<string, unknown> = publicOnly ? { isPublished: true } : {};
    if (!publicOnly && params.published !== undefined) filter.isPublished = params.published;
    if (params.category) filter.category = { $regex: `^${escapeRegex(params.category)}$`, $options: "i" };
    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [{ question: regex }, { answer: regex }, { category: regex }];
    }
    return filter;
  }

  async list(params: FAQListQueryDTO, publicOnly = false) {
    const filter = this.buildFilter(params, publicOnly);
    const skip = (params.page - 1) * params.limit;
    const [faqs, total, all, published] = await Promise.all([
      FAQModel.find(filter).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(params.limit),
      FAQModel.countDocuments(filter),
      FAQModel.countDocuments(),
      FAQModel.countDocuments({ isPublished: true }),
    ]);
    return { faqs, meta: { ...pagination(params.page, params.limit, total), summary: { total: all, published, draft: Math.max(all - published, 0) } } };
  }

  async get(id: string, publicOnly = false) {
    assertValidId(id, "FAQ");
    const faq = await FAQModel.findOne({ _id: id, ...(publicOnly ? { isPublished: true } : {}) });
    if (!faq) throw new HttpException(404, "FAQ not found");
    return faq;
  }

  async create(payload: CreateFAQDTO, userId?: mongoose.Types.ObjectId) {
    return FAQModel.create({ ...payload, createdBy: userId, updatedBy: userId });
  }

  async update(id: string, payload: UpdateFAQDTO, userId?: mongoose.Types.ObjectId) {
    assertValidId(id, "FAQ");
    const existing = await FAQModel.findById(id);
    if (!existing) throw new HttpException(404, "FAQ not found");
    return FAQModel.findByIdAndUpdate(id, { ...payload, updatedBy: userId }, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  async delete(id: string) {
    assertValidId(id, "FAQ");
    const faq = await FAQModel.findByIdAndDelete(id);
    if (!faq) throw new HttpException(404, "FAQ not found");
    return { deleted: true };
  }
}

export class TestimonialService {
  private buildFilter(params: TestimonialListQueryDTO, publicOnly = false) {
    const filter: Record<string, unknown> = publicOnly ? { isPublished: true } : {};
    if (!publicOnly && params.published !== undefined) filter.isPublished = params.published;
    if (params.category) filter.category = { $regex: `^${escapeRegex(params.category)}$`, $options: "i" };
    if (params.serviceSlug) filter.serviceSlug = { $regex: `^${escapeRegex(params.serviceSlug)}$`, $options: "i" };
    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [
        { name: regex },
        { role: regex },
        { company: regex },
        { quote: regex },
        { category: regex },
        { serviceSlug: regex },
      ];
    }
    return filter;
  }

  async list(params: TestimonialListQueryDTO, publicOnly = false) {
    const filter = this.buildFilter(params, publicOnly);
    const skip = (params.page - 1) * params.limit;
    const [testimonials, total, all, published] = await Promise.all([
      TestimonialModel.find(filter).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(params.limit),
      TestimonialModel.countDocuments(filter),
      TestimonialModel.countDocuments(),
      TestimonialModel.countDocuments({ isPublished: true }),
    ]);
    return {
      testimonials,
      meta: { ...pagination(params.page, params.limit, total), summary: { total: all, published, draft: Math.max(all - published, 0) } },
    };
  }

  async get(id: string, publicOnly = false) {
    assertValidId(id, "testimonial");
    const testimonial = await TestimonialModel.findOne({
      _id: id,
      ...(publicOnly ? { isPublished: true } : {}),
    });
    if (!testimonial) throw new HttpException(404, "Testimonial not found");
    return testimonial;
  }

  async create(payload: CreateTestimonialDTO, userId?: mongoose.Types.ObjectId) {
    return TestimonialModel.create({ ...payload, createdBy: userId, updatedBy: userId });
  }

  async update(id: string, payload: UpdateTestimonialDTO, userId?: mongoose.Types.ObjectId) {
    assertValidId(id, "testimonial");
    const existing = await TestimonialModel.findById(id);
    if (!existing) throw new HttpException(404, "Testimonial not found");
    return TestimonialModel.findByIdAndUpdate(id, { ...payload, updatedBy: userId }, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  async delete(id: string) {
    assertValidId(id, "testimonial");
    const testimonial = await TestimonialModel.findByIdAndDelete(id);
    if (!testimonial) throw new HttpException(404, "Testimonial not found");
    return { deleted: true };
  }
}
