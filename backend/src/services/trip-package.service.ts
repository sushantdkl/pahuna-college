import mongoose from "mongoose";
import { TripPackageListQueryDTO } from "../dtos/trip-package.dto";
import { HttpException } from "../exceptions/http-exception";
import { TripPackageModel } from "../models/trip-package.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class TripPackageService {
  private buildFilter(params: TripPackageListQueryDTO) {
    const filter: Record<string, unknown> = { isActive: true };
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

  async listPackages(params: TripPackageListQueryDTO) {
    const filter = this.buildFilter(params);
    const skip = (params.page - 1) * params.limit;
    const [packages, total] = await Promise.all([
      TripPackageModel.find(filter)
        .populate("destinationId", "name slug district")
        .sort({ createdAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(params.limit),
      TripPackageModel.countDocuments(filter),
    ]);
    return {
      packages,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
      },
    };
  }

  async getPackage(slug: string) {
    const tripPackage = await TripPackageModel.findOne({
      slug,
      isActive: true,
    }).populate("destinationId", "name slug district");

    if (!tripPackage) {
      throw new HttpException(404, "Trip package not found");
    }

    return tripPackage;
  }
}
