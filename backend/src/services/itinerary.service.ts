import mongoose from "mongoose";
import { destinationSeedData } from "../data/destination-seed.data";
import { experienceSeedData } from "../data/experience-seed.data";
import { hotelSeedData } from "../data/hotel-seed.data";
import {
  CreateItineraryDTO,
  UpdateItineraryDTO,
} from "../dtos/itinerary.dto";
import { HttpException } from "../exceptions/http-exception";
import { DestinationModel } from "../models/destination.model";
import { ExperienceModel } from "../models/experience.model";
import { HotelModel } from "../models/hotel.model";
import { IItinerary, ItineraryModel } from "../models/itinerary.model";

type ReferencePayload = {
  destinationId?: string;
  hotelIds?: string[];
  experienceIds?: string[];
};

function removeUndefined<T extends Record<string, unknown>>(payload: T) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
}

function calculateTotalDays(startDate?: Date, endDate?: Date) {
  if (!startDate || !endDate) return undefined;
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((endDate.getTime() - startDate.getTime()) / millisecondsPerDay) + 1;
}

export class ItineraryService {
  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid itinerary id");
    }
  }

  private populateItinerary(query: ReturnType<typeof ItineraryModel.findOne>) {
    return query
      .populate("destinationId", "name slug district category images")
      .populate("hotelIds", "name address propertyType images")
      .populate("experienceIds", "name category location duration images");
  }

  private async validateReferences(payload: ReferencePayload) {
    const checks: Promise<unknown>[] = [];

    if (payload.destinationId) {
      checks.push(
        DestinationModel.exists({ _id: payload.destinationId }).then((destination) => {
          if (!destination) throw new HttpException(400, "Destination not found");
        }),
      );
    }

    if (payload.hotelIds) {
      checks.push(
        HotelModel.countDocuments({ _id: { $in: payload.hotelIds } }).then((count) => {
          if (count !== new Set(payload.hotelIds).size) {
            throw new HttpException(400, "One or more hotels were not found");
          }
        }),
      );
    }

    if (payload.experienceIds) {
      checks.push(
        ExperienceModel.countDocuments({
          _id: { $in: payload.experienceIds },
        }).then((count) => {
          if (count !== new Set(payload.experienceIds).size) {
            throw new HttpException(400, "One or more experiences were not found");
          }
        }),
      );
    }

    await Promise.all(checks);
  }

  private datesForUpdate(existing: IItinerary, payload: UpdateItineraryDTO) {
    const startDate = payload.startDate || existing.startDate;
    const endDate = payload.endDate || existing.endDate;

    if (startDate && endDate && endDate < startDate) {
      throw new HttpException(400, "End date cannot be before start date");
    }

    return { startDate, endDate };
  }

  async getPlannerOptions() {
    const [destinationCount, hotelCount, experienceCount] = await Promise.all([
      DestinationModel.estimatedDocumentCount(),
      HotelModel.estimatedDocumentCount(),
      ExperienceModel.estimatedDocumentCount(),
    ]);

    await Promise.all([
      destinationCount === 0
        ? DestinationModel.insertMany(destinationSeedData)
        : Promise.resolve(),
      hotelCount === 0 ? HotelModel.insertMany(hotelSeedData) : Promise.resolve(),
      experienceCount === 0
        ? ExperienceModel.insertMany(experienceSeedData)
        : Promise.resolve(),
    ]);

    const [destinations, hotels, experiences] = await Promise.all([
      DestinationModel.find({ isActive: true })
        .select("name slug district category images")
        .sort({ name: 1 }),
      HotelModel.find({ isActive: true })
        .select("name address district propertyType priceMin priceMax images")
        .sort({ name: 1 }),
      ExperienceModel.find({ isActive: true })
        .select("name category location price duration images")
        .sort({ name: 1 }),
    ]);

    return { destinations, hotels, experiences };
  }

  async createItinerary(userId: string, payload: CreateItineraryDTO) {
    await this.validateReferences(payload);

    const totalDays =
      payload.totalDays || calculateTotalDays(payload.startDate, payload.endDate);
    const itinerary = await ItineraryModel.create({
      ...payload,
      userId,
      totalDays,
    });

    return this.getOwnItinerary(userId, itinerary._id.toString());
  }

  async listOwnItineraries(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const filter = { userId };
    const [itineraries, total] = await Promise.all([
      ItineraryModel.find(filter)
        .populate("destinationId", "name slug district category images")
        .populate("hotelIds", "name address propertyType images")
        .populate("experienceIds", "name category location duration images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ItineraryModel.countDocuments(filter),
    ]);

    return {
      itineraries,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async getOwnItinerary(userId: string, id: string) {
    this.assertValidId(id);
    const itinerary = await this.populateItinerary(
      ItineraryModel.findOne({ _id: id, userId }),
    );

    if (!itinerary) {
      throw new HttpException(404, "Itinerary not found");
    }

    return itinerary;
  }

  async updateOwnItinerary(
    userId: string,
    id: string,
    payload: UpdateItineraryDTO,
  ) {
    this.assertValidId(id);
    const existing = await ItineraryModel.findOne({ _id: id, userId });

    if (!existing) {
      throw new HttpException(404, "Itinerary not found");
    }

    await this.validateReferences(payload);
    const { startDate, endDate } = this.datesForUpdate(existing, payload);
    const updatePayload = removeUndefined({
      ...payload,
      status: payload.status ?? existing.status,
      isPublic: payload.isPublic ?? existing.isPublic,
      hotelIds: payload.hotelIds ?? existing.hotelIds,
      experienceIds: payload.experienceIds ?? existing.experienceIds,
      totalDays:
        payload.totalDays || calculateTotalDays(startDate, endDate),
    });
    const itinerary = await this.populateItinerary(
      ItineraryModel.findOneAndUpdate({ _id: id, userId }, updatePayload, {
        returnDocument: "after",
        runValidators: true,
      }),
    );

    return itinerary;
  }

  async deleteOwnItinerary(userId: string, id: string) {
    this.assertValidId(id);
    const itinerary = await ItineraryModel.findOneAndDelete({ _id: id, userId });

    if (!itinerary) {
      throw new HttpException(404, "Itinerary not found");
    }

    return { deleted: true };
  }
}
