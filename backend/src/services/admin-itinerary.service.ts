import mongoose from "mongoose";
import {
  AdminCreateItineraryDTO,
  AdminItineraryListQueryDTO,
  AdminUpdateItineraryDTO,
} from "../dtos/itinerary.dto";
import { HttpException } from "../exceptions/http-exception";
import { DestinationModel } from "../models/destination.model";
import { ExperienceModel } from "../models/experience.model";
import { HotelModel } from "../models/hotel.model";
import { ItineraryModel } from "../models/itinerary.model";
import { UserModel } from "../models/user.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function calculateTotalDays(startDate?: Date, endDate?: Date) {
  if (!startDate || !endDate) return undefined;
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((endDate.getTime() - startDate.getTime()) / millisecondsPerDay) + 1;
}

function removeUndefined<T extends Record<string, unknown>>(payload: T) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
}

export class AdminItineraryService {
  private assertValidId(id: string, label = "itinerary") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, `Invalid ${label} id`);
    }
  }

  private populateItinerary(query: ReturnType<typeof ItineraryModel.findById>) {
    return query
      .populate("userId", "fullName email phoneNumber")
      .populate("destinationId", "name slug district category images")
      .populate("hotelIds", "name address propertyType images")
      .populate("experienceIds", "name category location duration images");
  }

  private async validateReferences(
    payload: Partial<AdminCreateItineraryDTO>,
    requireUser = false,
  ) {
    if (requireUser || payload.userId) {
      const user = await UserModel.exists({ _id: payload.userId });
      if (!user) throw new HttpException(400, "Itinerary user not found");
    }

    if (payload.destinationId) {
      const destination = await DestinationModel.exists({
        _id: payload.destinationId,
      });
      if (!destination) throw new HttpException(400, "Destination not found");
    }

    if (payload.hotelIds) {
      const hotelCount = await HotelModel.countDocuments({
        _id: { $in: payload.hotelIds },
      });
      if (hotelCount !== new Set(payload.hotelIds).size) {
        throw new HttpException(400, "One or more hotels were not found");
      }
    }

    if (payload.experienceIds) {
      const experienceCount = await ExperienceModel.countDocuments({
        _id: { $in: payload.experienceIds },
      });
      if (experienceCount !== new Set(payload.experienceIds).size) {
        throw new HttpException(400, "One or more experiences were not found");
      }
    }
  }

  private async buildFilter(params: AdminItineraryListQueryDTO) {
    const filter: Record<string, unknown> = {};

    if (params.status) filter.status = params.status;
    if (params.isPublic !== undefined) filter.isPublic = params.isPublic;
    if (params.destinationId) filter.destinationId = params.destinationId;
    if (params.userId) filter.userId = params.userId;

    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      const [users, destinations] = await Promise.all([
        UserModel.find({
          $or: [{ fullName: regex }, { email: regex }],
        }).select("_id"),
        DestinationModel.find({ name: regex }).select("_id"),
      ]);

      filter.$or = [
        { title: regex },
        { description: regex },
        { status: regex },
        { userId: { $in: users.map((user) => user._id) } },
        {
          destinationId: {
            $in: destinations.map((destination) => destination._id),
          },
        },
      ];
    }

    return filter;
  }

  async listItineraries(params: AdminItineraryListQueryDTO) {
    const skip = (params.page - 1) * params.limit;
    const filter = await this.buildFilter(params);
    const [
      itineraries,
      total,
      totalItineraries,
      plannedItineraries,
      publicItineraries,
      completedItineraries,
    ] = await Promise.all([
      ItineraryModel.find(filter)
        .populate("userId", "fullName email phoneNumber")
        .populate("destinationId", "name slug district category images")
        .populate("hotelIds", "name address propertyType images")
        .populate("experienceIds", "name category location duration images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      ItineraryModel.countDocuments(filter),
      ItineraryModel.countDocuments(),
      ItineraryModel.countDocuments({ status: "PLANNED" }),
      ItineraryModel.countDocuments({ isPublic: true }),
      ItineraryModel.countDocuments({ status: "COMPLETED" }),
    ]);

    return {
      itineraries,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
        summary: {
          total: totalItineraries,
          planned: plannedItineraries,
          public: publicItineraries,
          completed: completedItineraries,
        },
      },
    };
  }

  async getItinerary(id: string) {
    this.assertValidId(id);
    const itinerary = await this.populateItinerary(ItineraryModel.findById(id));

    if (!itinerary) {
      throw new HttpException(404, "Itinerary not found");
    }

    return itinerary;
  }

  async createItinerary(payload: AdminCreateItineraryDTO) {
    await this.validateReferences(payload, true);
    const itinerary = await ItineraryModel.create({
      ...payload,
      totalDays:
        payload.totalDays || calculateTotalDays(payload.startDate, payload.endDate),
    });

    return this.getItinerary(itinerary._id.toString());
  }

  async updateItinerary(id: string, payload: AdminUpdateItineraryDTO) {
    this.assertValidId(id);
    const existing = await ItineraryModel.findById(id);

    if (!existing) {
      throw new HttpException(404, "Itinerary not found");
    }

    await this.validateReferences(payload);
    const startDate = payload.startDate || existing.startDate;
    const endDate = payload.endDate || existing.endDate;

    if (startDate && endDate && endDate < startDate) {
      throw new HttpException(400, "End date cannot be before start date");
    }

    const updatePayload = removeUndefined({
      ...payload,
      totalDays:
        payload.totalDays || calculateTotalDays(startDate, endDate),
    });
    const itinerary = await this.populateItinerary(
      ItineraryModel.findByIdAndUpdate(id, updatePayload, {
        returnDocument: "after",
        runValidators: true,
      }),
    );

    return itinerary;
  }

  async deleteItinerary(id: string) {
    this.assertValidId(id);
    const itinerary = await ItineraryModel.findByIdAndDelete(id);

    if (!itinerary) {
      throw new HttpException(404, "Itinerary not found");
    }

    return { deleted: true };
  }
}
