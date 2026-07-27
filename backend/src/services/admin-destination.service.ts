import mongoose from "mongoose";
import {
  AdminCreateDestinationDTO,
  AdminUpdateDestinationDTO,
} from "../dtos/admin-destination.dto";
import { HttpException } from "../exceptions/http-exception";
import { destinationSeedData } from "../data/destination-seed.data";
import { DestinationModel, IDestination } from "../models/destination.model";

type ListDestinationsParams = {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  district?: string;
  active?: string;
  featured?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readBooleanFilter(value?: string) {
  if (value === undefined || value === "") return undefined;
  return value.toLowerCase() === "true";
}

function cleanPayload<T extends Record<string, unknown>>(payload: T) {
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined || payload[key] === "") {
      delete payload[key];
    }
  });

  return payload;
}

export class AdminDestinationService {
  private async seedDestinationsIfEmpty() {
    const total = await DestinationModel.estimatedDocumentCount();

    if (total > 0) {
      return;
    }

    await DestinationModel.insertMany(destinationSeedData);
  }

  private toAdminDestination(destination: IDestination) {
    return {
      _id: destination._id.toString(),
      name: destination.name,
      slug: destination.slug,
      description: destination.description,
      attractions: destination.attractions || [],
      bestTimeToVisit: destination.bestTimeToVisit,
      distanceFromSurkhetKm: destination.distanceFromSurkhetKm,
      latitude: destination.latitude,
      longitude: destination.longitude,
      images: destination.images || [],
      category: destination.category,
      district: destination.district,
      isActive: destination.isActive,
      isFeatured: destination.isFeatured,
      createdAt: destination.createdAt,
      updatedAt: destination.updatedAt,
    };
  }

  private toPublicDestination(destination: IDestination) {
    return {
      _id: destination._id.toString(),
      name: destination.name,
      slug: destination.slug,
      description: destination.description,
      attractions: destination.attractions || [],
      bestTimeToVisit: destination.bestTimeToVisit,
      distanceFromSurkhetKm: destination.distanceFromSurkhetKm,
      latitude: destination.latitude,
      longitude: destination.longitude,
      images: destination.images || [],
      category: destination.category,
      district: destination.district,
      isFeatured: destination.isFeatured,
    };
  }

  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid destination id");
    }
  }

  private buildFilter(params: ListDestinationsParams) {
    const search = params.search?.trim();
    const category = params.category?.trim();
    const district = params.district?.trim();
    const active = readBooleanFilter(params.active);
    const featured = readBooleanFilter(params.featured);
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { attractions: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (district) {
      filter.district = { $regex: district, $options: "i" };
    }

    if (active !== undefined) {
      filter.isActive = active;
    }

    if (featured !== undefined) {
      filter.isFeatured = featured;
    }

    return filter;
  }

  private async ensureUniqueSlug(slug: string, exceptId?: string) {
    const existing = await DestinationModel.findOne({
      slug,
      ...(exceptId ? { _id: { $ne: exceptId } } : {}),
    });

    if (existing) {
      throw new HttpException(400, "Destination slug already exists");
    }
  }

  async listDestinations(params: ListDestinationsParams) {
    await this.seedDestinationsIfEmpty();

    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const filter = this.buildFilter(params);

    const [destinations, total] = await Promise.all([
      DestinationModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      DestinationModel.countDocuments(filter),
    ]);

    return {
      destinations: destinations.map((destination) =>
        this.toAdminDestination(destination),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async listPublicDestinations(params: ListDestinationsParams) {
    await this.seedDestinationsIfEmpty();

    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;
    const filter = { ...this.buildFilter(params), isActive: true };

    const [destinations, total] = await Promise.all([
      DestinationModel.find(filter).sort({ createdAt: -1, updatedAt: -1 }).skip(skip).limit(limit),
      DestinationModel.countDocuments(filter),
    ]);

    return {
      destinations: destinations.map((destination) => this.toPublicDestination(destination)),
      meta: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
    };
  }

  async getPublicDestination(identifier: string) {
    await this.seedDestinationsIfEmpty();
    const destination = mongoose.Types.ObjectId.isValid(identifier)
      ? await DestinationModel.findOne({ _id: identifier, isActive: true })
      : await DestinationModel.findOne({ slug: identifier.toLowerCase(), isActive: true });

    if (!destination) {
      throw new HttpException(404, "Destination not found");
    }

    return this.toPublicDestination(destination);
  }

  async getDestination(id: string) {
    this.assertValidId(id);

    const destination = await DestinationModel.findById(id);

    if (!destination) {
      throw new HttpException(404, "Destination not found");
    }

    return this.toAdminDestination(destination);
  }

  async createDestination(payload: AdminCreateDestinationDTO) {
    const slug = payload.slug?.trim() || slugify(payload.name);

    await this.ensureUniqueSlug(slug);

    const destination = await DestinationModel.create(
      cleanPayload({
        ...payload,
        slug,
      }),
    );

    return this.toAdminDestination(destination);
  }

  async updateDestination(id: string, payload: AdminUpdateDestinationDTO) {
    this.assertValidId(id);

    const updatePayload = cleanPayload({
      ...payload,
      slug: payload.slug ? slugify(payload.slug) : undefined,
    });

    if (updatePayload.slug) {
      await this.ensureUniqueSlug(String(updatePayload.slug), id);
    }

    const destination = await DestinationModel.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true },
    );

    if (!destination) {
      throw new HttpException(404, "Destination not found");
    }

    return this.toAdminDestination(destination);
  }

  async deleteDestination(id: string) {
    this.assertValidId(id);

    const deleted = await DestinationModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new HttpException(404, "Destination not found");
    }

    return { deleted: true };
  }
}
