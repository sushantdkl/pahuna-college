import mongoose from "mongoose";
import {
  AdminTripPackageListQueryDTO,
  CreateTripPackageDTO,
  UpdateTripPackageDTO,
} from "../dtos/trip-package.dto";
import { HttpException } from "../exceptions/http-exception";
import { DestinationModel } from "../models/destination.model";
import { TripPackageModel } from "../models/trip-package.model";

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

export class AdminTripPackageService {
  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid trip package id");
    }
  }

  private async ensureUniqueSlug(slug: string, exceptId?: string) {
    const existing = await TripPackageModel.exists({
      slug,
      ...(exceptId ? { _id: { $ne: exceptId } } : {}),
    });
    if (existing) {
      throw new HttpException(400, "Trip package slug already exists");
    }
  }

  private async normalizePayload<T extends CreateTripPackageDTO | UpdateTripPackageDTO>(
    payload: T,
  ) {
    if (payload.destinationId) {
      if (!mongoose.Types.ObjectId.isValid(payload.destinationId)) {
        throw new HttpException(400, "Invalid destination id");
      }
      const destination = await DestinationModel.exists({
        _id: payload.destinationId,
      });
      if (!destination) {
        throw new HttpException(404, "Destination not found");
      }
    }
    return payload;
  }

  private buildFilter(params: AdminTripPackageListQueryDTO) {
    const filter: Record<string, unknown> = {};
    if (params.active !== undefined) filter.isActive = params.active;
    if (params.featured !== undefined) filter.isFeatured = params.featured;
    if (params.destinationId && mongoose.Types.ObjectId.isValid(params.destinationId)) {
      filter.destinationId = params.destinationId;
    }
    if (params.difficulty) {
      filter.difficulty = {
        $regex: `^${escapeRegex(params.difficulty)}$`,
        $options: "i",
      };
    }
    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [
        { title: regex },
        { slug: regex },
        { description: regex },
        { highlights: regex },
        { difficulty: regex },
      ];
    }
    return filter;
  }

  async listPackages(params: AdminTripPackageListQueryDTO) {
    const filter = this.buildFilter(params);
    const skip = (params.page - 1) * params.limit;
    const [packages, total, all, active, featured, priceStats] =
      await Promise.all([
        TripPackageModel.find(filter)
          .populate("destinationId", "name slug district")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(params.limit),
        TripPackageModel.countDocuments(filter),
        TripPackageModel.countDocuments(),
        TripPackageModel.countDocuments({ isActive: true }),
        TripPackageModel.countDocuments({ isFeatured: true }),
        TripPackageModel.aggregate([
          { $match: { price: { $type: "number" } } },
          { $group: { _id: null, averagePrice: { $avg: "$price" } } },
        ]),
      ]);

    return {
      packages,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
        summary: {
          total: all,
          active,
          featured,
          averagePrice: Math.round(priceStats[0]?.averagePrice || 0),
        },
      },
    };
  }

  async getPackage(id: string) {
    this.assertValidId(id);
    const tripPackage = await TripPackageModel.findById(id).populate(
      "destinationId",
      "name slug district",
    );
    if (!tripPackage) {
      throw new HttpException(404, "Trip package not found");
    }
    return tripPackage;
  }

  async createPackage(payload: CreateTripPackageDTO) {
    const normalized = await this.normalizePayload(payload);
    const slug = slugify(normalized.slug || normalized.title);
    if (!slug) {
      throw new HttpException(400, "A valid trip package slug is required");
    }
    await this.ensureUniqueSlug(slug);
    return TripPackageModel.create({ ...normalized, slug });
  }

  async updatePackage(id: string, payload: UpdateTripPackageDTO) {
    this.assertValidId(id);
    const existing = await TripPackageModel.findById(id);
    if (!existing) {
      throw new HttpException(404, "Trip package not found");
    }
    const normalized = await this.normalizePayload(payload);
    const slug = normalized.slug ? slugify(normalized.slug) : undefined;
    if (slug) await this.ensureUniqueSlug(slug, id);
    return TripPackageModel.findByIdAndUpdate(
      id,
      removeUndefined({ ...normalized, slug }),
      { returnDocument: "after", runValidators: true },
    ).populate("destinationId", "name slug district");
  }

  async deletePackage(id: string) {
    this.assertValidId(id);
    const tripPackage = await TripPackageModel.findByIdAndDelete(id);
    if (!tripPackage) {
      throw new HttpException(404, "Trip package not found");
    }
    return { deleted: true };
  }
}
