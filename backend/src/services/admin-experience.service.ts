import mongoose from "mongoose";
import {
  AdminCreateExperienceDTO,
  AdminUpdateExperienceDTO,
} from "../dtos/admin-experience.dto";
import { HttpException } from "../exceptions/http-exception";
import { experienceSeedData } from "../data/experience-seed.data";
import { ExperienceModel, IExperience } from "../models/experience.model";

type ListExperiencesParams = {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  active?: string;
  providerId?: string;
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

export class AdminExperienceService {
  private async seedExperiencesIfEmpty() {
    const total = await ExperienceModel.estimatedDocumentCount();

    if (total > 0) {
      return;
    }

    await ExperienceModel.insertMany(experienceSeedData);
  }

  private toAdminExperience(experience: IExperience) {
    return {
      _id: experience._id.toString(),
      providerId: experience.providerId?.toString(),
      name: experience.name,
      description: experience.description,
      category: experience.category,
      price: experience.price,
      duration: experience.duration,
      location: experience.location,
      latitude: experience.latitude,
      longitude: experience.longitude,
      maxParticipants: experience.maxParticipants,
      images: experience.images || [],
      rating: experience.rating,
      reviewCount: experience.reviewCount,
      isActive: experience.isActive,
      createdAt: experience.createdAt,
      updatedAt: experience.updatedAt,
    };
  }

  private toPublicExperience(experience: IExperience) {
    return {
      _id: experience._id.toString(),
      slug: slugify(experience.name),
      name: experience.name,
      description: experience.description,
      category: experience.category,
      price: experience.price,
      duration: experience.duration,
      location: experience.location,
      latitude: experience.latitude,
      longitude: experience.longitude,
      maxParticipants: experience.maxParticipants,
      images: experience.images || [],
      rating: experience.rating,
      reviewCount: experience.reviewCount,
    };
  }

  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid experience id");
    }
  }

  private buildFilter(params: ListExperiencesParams) {
    const search = params.search?.trim();
    const category = params.category?.trim();
    const active = readBooleanFilter(params.active);
    const providerId = params.providerId?.trim();
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (active !== undefined) {
      filter.isActive = active;
    }

    if (providerId) {
      this.assertValidId(providerId);
      filter.providerId = providerId;
    }

    return filter;
  }

  async listExperiences(params: ListExperiencesParams) {
    await this.seedExperiencesIfEmpty();

    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const filter = this.buildFilter(params);

    const [experiences, total] = await Promise.all([
      ExperienceModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ExperienceModel.countDocuments(filter),
    ]);

    return {
      experiences: experiences.map((experience) =>
        this.toAdminExperience(experience),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async listPublicExperiences(params: ListExperiencesParams) {
    await this.seedExperiencesIfEmpty();

    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;
    const filter = { ...this.buildFilter(params), isActive: true };

    const [experiences, total] = await Promise.all([
      ExperienceModel.find(filter).sort({ createdAt: -1, updatedAt: -1 }).skip(skip).limit(limit),
      ExperienceModel.countDocuments(filter),
    ]);

    return {
      experiences: experiences.map((experience) => this.toPublicExperience(experience)),
      meta: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
    };
  }

  async getPublicExperience(identifier: string) {
    await this.seedExperiencesIfEmpty();
    const experience = mongoose.Types.ObjectId.isValid(identifier)
      ? await ExperienceModel.findOne({ _id: identifier, isActive: true })
      : (await ExperienceModel.find({ isActive: true })).find(
          (candidate) => slugify(candidate.name) === identifier.toLowerCase(),
        );

    if (!experience) {
      throw new HttpException(404, "Experience not found");
    }

    return this.toPublicExperience(experience);
  }

  async getExperience(id: string) {
    this.assertValidId(id);

    const experience = await ExperienceModel.findById(id);

    if (!experience) {
      throw new HttpException(404, "Experience not found");
    }

    return this.toAdminExperience(experience);
  }

  async createExperience(payload: AdminCreateExperienceDTO) {
    const experience = await ExperienceModel.create(cleanPayload({ ...payload }));

    return this.toAdminExperience(experience);
  }

  async updateExperience(id: string, payload: AdminUpdateExperienceDTO) {
    this.assertValidId(id);

    const updatePayload = cleanPayload({ ...payload });
    const experience = await ExperienceModel.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });

    if (!experience) {
      throw new HttpException(404, "Experience not found");
    }

    return this.toAdminExperience(experience);
  }

  async deleteExperience(id: string) {
    this.assertValidId(id);

    const deleted = await ExperienceModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new HttpException(404, "Experience not found");
    }

    return { deleted: true };
  }
}
