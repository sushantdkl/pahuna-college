import { Request, Response } from "express";
import { z } from "zod";
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
import {
  FAQService,
  FoodProviderService,
  RouteCrudService,
  TestimonialService,
} from "../services/final-crud.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const foodService = new FoodProviderService();
const routeService = new RouteCrudService();
const faqService = new FAQService();
const testimonialService = new TestimonialService();

function idParam(req: Request) {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
}

function slugParam(req: Request) {
  const slug = req.params.slug;
  return Array.isArray(slug) ? slug[0] : slug;
}

function handleParseError(res: Response, error: z.ZodError) {
  return ApiResponseHelper.error(res, z.prettifyError(error), 400);
}

function parseQuery<T>(res: Response, schema: z.ZodType<T>, query: unknown) {
  const parsed = schema.safeParse(query);
  if (!parsed.success) {
    handleParseError(res, parsed.error);
    return null;
  }
  return parsed.data;
}

function foodBody(body: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries({
      name: body.name,
      slug: body.slug,
      type: body.type,
      district: body.district,
      municipality: body.municipality,
      area: body.area,
      address: body.address,
      latitude: body.latitude,
      longitude: body.longitude,
      shortDescription: body.shortDescription ?? body.short_description,
      longDescription: body.longDescription ?? body.long_description,
      cuisines: body.cuisines,
      services: body.services,
      features: body.features,
      priceLevel: body.priceLevel ?? body.price_level,
      openingHours: body.openingHours ?? body.opening_hours,
      phone: body.phone,
      email: body.email,
      website: body.website,
      sourceUrl: body.sourceUrl ?? body.source_url,
      sourceLabel: body.sourceLabel ?? body.source_label,
      images: body.images,
      rating: body.rating,
      reviewCount: body.reviewCount ?? body.review_count,
      verificationStatus: body.verificationStatus ?? body.verification_status,
      consentStatus: body.consentStatus ?? body.consent_status,
      featured: body.featured,
      active: body.active,
    }).filter(([, value]) => value !== undefined),
  );
}

function transportBody(body: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries({
      fromLocation: body.fromLocation ?? body.from_location,
      toLocation: body.toLocation ?? body.to_location,
      mode: body.mode,
      durationHours: body.durationHours ?? body.duration_hours,
      costMin: body.costMin ?? body.cost_min,
      costMax: body.costMax ?? body.cost_max,
      frequency: body.frequency,
      notes: body.notes,
      isActive: body.isActive ?? body.is_active,
      sortOrder: body.sortOrder ?? body.sort_order,
    }).filter(([, value]) => value !== undefined),
  );
}

function segmentBody(body: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries({
      from: body.from,
      to: body.to,
      slug: body.slug,
      mode: body.mode,
      distanceKm: body.distanceKm ?? body.distance_km,
      durationMin: body.durationMin ?? body.duration_min,
      durationMax: body.durationMax ?? body.duration_max,
      costMin: body.costMin ?? body.cost_min,
      costMax: body.costMax ?? body.cost_max,
      currency: body.currency,
      seasonality: body.seasonality,
      reliability: body.reliability,
      notes: body.notes,
      riskNotes: body.riskNotes ?? body.risk_notes,
      recommendedStopover: body.recommendedStopover ?? body.recommended_stopover,
      requiresConfirmation: body.requiresConfirmation ?? body.requires_confirmation,
      active: body.active,
      featured: body.featured,
    }).filter(([, value]) => value !== undefined),
  );
}

export class FoodProviderController {
  async list(req: Request, res: Response) {
    try {
      const query = parseQuery(res, FoodProviderListQueryDTO, req.query);
      if (!query) return;
      const { providers, meta } = await foodService.list(query, true);
      return ApiResponseHelper.success(res, providers, "Food providers fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async get(req: Request, res: Response) {
    try {
      const provider = await foodService.getBySlug(slugParam(req));
      return ApiResponseHelper.success(res, provider, "Food provider fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminList(req: AuthRequest, res: Response) {
    try {
      const query = parseQuery(res, FoodProviderListQueryDTO, req.query);
      if (!query) return;
      const { providers, meta } = await foodService.list(query, false);
      return ApiResponseHelper.success(res, providers, "Food providers fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminGet(req: AuthRequest, res: Response) {
    try {
      const provider = await foodService.getById(idParam(req));
      return ApiResponseHelper.success(res, provider, "Food provider fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminCreate(req: AuthRequest, res: Response) {
    try {
      const parsed = CreateFoodProviderDTO.safeParse(foodBody(req.body));
      if (!parsed.success) return handleParseError(res, parsed.error);
      const provider = await foodService.create(parsed.data);
      return ApiResponseHelper.success(res, provider, "Food provider created successfully", 201);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminUpdate(req: AuthRequest, res: Response) {
    try {
      const parsed = UpdateFoodProviderDTO.safeParse(foodBody(req.body));
      if (!parsed.success) return handleParseError(res, parsed.error);
      const provider = await foodService.update(idParam(req), parsed.data);
      return ApiResponseHelper.success(res, provider, "Food provider updated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminDelete(req: AuthRequest, res: Response) {
    try {
      const result = await foodService.delete(idParam(req));
      return ApiResponseHelper.success(res, result, "Food provider deleted successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }
}

export class RouteCrudController {
  async publicTransportRoutes(req: Request, res: Response) {
    try {
      const query = parseQuery(res, RouteListQueryDTO, req.query);
      if (!query) return;
      const { routes, meta } = await routeService.listTransportRoutes(query, true);
      return ApiResponseHelper.success(res, routes, "Transport routes fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async publicRouteSegments(req: Request, res: Response) {
    try {
      const query = parseQuery(res, RouteListQueryDTO, req.query);
      if (!query) return;
      const { segments, meta } = await routeService.listRouteSegments(query, true);
      return ApiResponseHelper.success(res, segments, "Route segments fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async publicRouteSegment(req: Request, res: Response) {
    try {
      const segment = await routeService.getRouteSegment(slugParam(req), false);
      return ApiResponseHelper.success(res, segment, "Route segment fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminTransportRoutes(req: AuthRequest, res: Response) {
    try {
      const query = parseQuery(res, RouteListQueryDTO, req.query);
      if (!query) return;
      const { routes, meta } = await routeService.listTransportRoutes(query, false);
      return ApiResponseHelper.success(res, routes, "Transport routes fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminRouteSegments(req: AuthRequest, res: Response) {
    try {
      const query = parseQuery(res, RouteListQueryDTO, req.query);
      if (!query) return;
      const { segments, meta } = await routeService.listRouteSegments(query, false);
      return ApiResponseHelper.success(res, segments, "Route segments fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminTransportRoute(req: AuthRequest, res: Response) {
    try {
      const route = await routeService.getTransportRoute(idParam(req));
      return ApiResponseHelper.success(res, route, "Transport route fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminRouteSegment(req: AuthRequest, res: Response) {
    try {
      const segment = await routeService.getRouteSegment(idParam(req), true);
      return ApiResponseHelper.success(res, segment, "Route segment fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async createTransportRoute(req: AuthRequest, res: Response) {
    try {
      const parsed = CreateTransportRouteDTO.safeParse(transportBody(req.body));
      if (!parsed.success) return handleParseError(res, parsed.error);
      const route = await routeService.createTransportRoute(parsed.data);
      return ApiResponseHelper.success(res, route, "Transport route created successfully", 201);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async createRouteSegment(req: AuthRequest, res: Response) {
    try {
      const parsed = CreateRouteSegmentDTO.safeParse(segmentBody(req.body));
      if (!parsed.success) return handleParseError(res, parsed.error);
      const segment = await routeService.createRouteSegment(parsed.data);
      return ApiResponseHelper.success(res, segment, "Route segment created successfully", 201);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async updateTransportRoute(req: AuthRequest, res: Response) {
    try {
      const parsed = UpdateTransportRouteDTO.safeParse(transportBody(req.body));
      if (!parsed.success) return handleParseError(res, parsed.error);
      const route = await routeService.updateTransportRoute(idParam(req), parsed.data);
      return ApiResponseHelper.success(res, route, "Transport route updated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async updateRouteSegment(req: AuthRequest, res: Response) {
    try {
      const parsed = UpdateRouteSegmentDTO.safeParse(segmentBody(req.body));
      if (!parsed.success) return handleParseError(res, parsed.error);
      const segment = await routeService.updateRouteSegment(idParam(req), parsed.data);
      return ApiResponseHelper.success(res, segment, "Route segment updated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async deleteTransportRoute(req: AuthRequest, res: Response) {
    try {
      const result = await routeService.deleteTransportRoute(idParam(req));
      return ApiResponseHelper.success(res, result, "Transport route deleted successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async deleteRouteSegment(req: AuthRequest, res: Response) {
    try {
      const result = await routeService.deleteRouteSegment(idParam(req));
      return ApiResponseHelper.success(res, result, "Route segment deleted successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }
}

export class FAQController {
  async list(req: Request, res: Response) {
    try {
      const query = parseQuery(res, FAQListQueryDTO, req.query);
      if (!query) return;
      const { faqs, meta } = await faqService.list(query, true);
      return ApiResponseHelper.success(res, faqs, "FAQs fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async get(req: Request, res: Response) {
    try {
      const faq = await faqService.get(idParam(req), true);
      return ApiResponseHelper.success(res, faq, "FAQ fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminList(req: AuthRequest, res: Response) {
    try {
      const query = parseQuery(res, FAQListQueryDTO, req.query);
      if (!query) return;
      const { faqs, meta } = await faqService.list(query, false);
      return ApiResponseHelper.success(res, faqs, "FAQs fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminGet(req: AuthRequest, res: Response) {
    try {
      const faq = await faqService.get(idParam(req), false);
      return ApiResponseHelper.success(res, faq, "FAQ fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminCreate(req: AuthRequest, res: Response) {
    try {
      const parsed = CreateFAQDTO.safeParse(req.body);
      if (!parsed.success) return handleParseError(res, parsed.error);
      const faq = await faqService.create(parsed.data, req.user?._id);
      return ApiResponseHelper.success(res, faq, "FAQ created successfully", 201);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminUpdate(req: AuthRequest, res: Response) {
    try {
      const parsed = UpdateFAQDTO.safeParse(req.body);
      if (!parsed.success) return handleParseError(res, parsed.error);
      const faq = await faqService.update(idParam(req), parsed.data, req.user?._id);
      return ApiResponseHelper.success(res, faq, "FAQ updated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminDelete(req: AuthRequest, res: Response) {
    try {
      const result = await faqService.delete(idParam(req));
      return ApiResponseHelper.success(res, result, "FAQ deleted successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }
}

export class TestimonialController {
  async list(req: Request, res: Response) {
    try {
      const query = parseQuery(res, TestimonialListQueryDTO, req.query);
      if (!query) return;
      const { testimonials, meta } = await testimonialService.list(query, true);
      return ApiResponseHelper.success(res, testimonials, "Testimonials fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async get(req: Request, res: Response) {
    try {
      const testimonial = await testimonialService.get(idParam(req), true);
      return ApiResponseHelper.success(res, testimonial, "Testimonial fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminList(req: AuthRequest, res: Response) {
    try {
      const query = parseQuery(res, TestimonialListQueryDTO, req.query);
      if (!query) return;
      const { testimonials, meta } = await testimonialService.list(query, false);
      return ApiResponseHelper.success(res, testimonials, "Testimonials fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminGet(req: AuthRequest, res: Response) {
    try {
      const testimonial = await testimonialService.get(idParam(req), false);
      return ApiResponseHelper.success(res, testimonial, "Testimonial fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminCreate(req: AuthRequest, res: Response) {
    try {
      const parsed = CreateTestimonialDTO.safeParse(req.body);
      if (!parsed.success) return handleParseError(res, parsed.error);
      const testimonial = await testimonialService.create(parsed.data, req.user?._id);
      return ApiResponseHelper.success(res, testimonial, "Testimonial created successfully", 201);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminUpdate(req: AuthRequest, res: Response) {
    try {
      const parsed = UpdateTestimonialDTO.safeParse(req.body);
      if (!parsed.success) return handleParseError(res, parsed.error);
      const testimonial = await testimonialService.update(idParam(req), parsed.data, req.user?._id);
      return ApiResponseHelper.success(res, testimonial, "Testimonial updated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminDelete(req: AuthRequest, res: Response) {
    try {
      const result = await testimonialService.delete(idParam(req));
      return ApiResponseHelper.success(res, result, "Testimonial deleted successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }
}
