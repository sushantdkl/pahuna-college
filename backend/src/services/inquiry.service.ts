import mongoose from "mongoose";
import { hotelSeedData } from "../data/hotel-seed.data";
import {
  CreateInquiryDTO,
  OwnInquiryListQueryDTO,
  UpdateOwnInquiryDTO,
} from "../dtos/inquiry.dto";
import { HttpException } from "../exceptions/http-exception";
import { HotelModel } from "../models/hotel.model";
import { DestinationModel } from "../models/destination.model";
import { ExperienceModel } from "../models/experience.model";
import { InquiryModel } from "../models/inquiry.model";
import { ItineraryModel } from "../models/itinerary.model";
import { TripPackageModel } from "../models/trip-package.model";

const hotelInquiryTypes = new Set([
  "HOTEL",
  "AVAILABILITY",
  "BOOKING",
  "RESERVATION",
]);

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class InquiryService {
  private async ensureHotelSeeds() {
    const hotelCount = await HotelModel.estimatedDocumentCount();

    if (hotelCount === 0) {
      await HotelModel.insertMany(hotelSeedData);
    }
  }

  private async resolveHotelId(payload: CreateInquiryDTO) {
    if (payload.hotelId) {
      if (!mongoose.Types.ObjectId.isValid(payload.hotelId)) {
        throw new HttpException(400, "Invalid hotel id");
      }

      const hotel = await HotelModel.findById(payload.hotelId).select("_id");

      if (!hotel) {
        throw new HttpException(404, "Hotel not found");
      }

      return hotel._id;
    }

    if (payload.hotelName) {
      await this.ensureHotelSeeds();

      const hotel = await HotelModel.findOne({
        name: {
          $regex: `^${escapeRegex(payload.hotelName)}$`,
          $options: "i",
        },
      }).select("_id");

      if (!hotel) {
        return undefined;
      }

      return hotel._id;
    }

    return undefined;
  }

  private async resolveTripPackageId(payload: CreateInquiryDTO) {
    if (!payload.tripPackageId) return undefined;

    if (!mongoose.Types.ObjectId.isValid(payload.tripPackageId)) {
      throw new HttpException(400, "Invalid trip package id");
    }

    const tripPackage = await TripPackageModel.findOne({
      _id: payload.tripPackageId,
      isActive: true,
    }).select("_id");

    if (!tripPackage) {
      throw new HttpException(404, "Trip package not found");
    }

    return tripPackage._id;
  }

  /// Confirms a related catalogue record exists before it is stored, so an
  /// inquiry can never point at something the customer cannot see.
  private async resolveRelatedId(
    id: string | undefined,
    model: { findOne: (filter: Record<string, unknown>) => any },
    label: string,
    extraFilter: Record<string, unknown> = {},
  ) {
    if (!id) return undefined;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, `Invalid ${label} id`);
    }

    const record = await model
      .findOne({ _id: id, ...extraFilter })
      .select("_id");

    if (!record) {
      throw new HttpException(404, `${label} not found`);
    }

    return record._id;
  }

  async createInquiry(userId: string, payload: CreateInquiryDTO) {
    const hotelId = await this.resolveHotelId(payload);
    const tripPackageId = await this.resolveTripPackageId(payload);
    const destinationId = await this.resolveRelatedId(
      payload.destinationId,
      DestinationModel,
      "Destination",
      { isActive: true },
    );
    const experienceId = await this.resolveRelatedId(
      payload.experienceId,
      ExperienceModel,
      "Experience",
      { isActive: true },
    );
    // An itinerary must belong to the caller before it can be referenced.
    const itineraryId = await this.resolveRelatedId(
      payload.itineraryId,
      ItineraryModel,
      "Itinerary",
      { userId },
    );

    if (
      hotelInquiryTypes.has(payload.inquiryType) &&
      !hotelId &&
      !payload.hotelName
    ) {
      throw new HttpException(
        400,
        "A hotel is required for this type of inquiry",
      );
    }

    const inquiry = await InquiryModel.create({
      userId,
      hotelId,
      tripPackageId,
      destinationId,
      experienceId,
      itineraryId,
      title: payload.title,
      message: payload.message,
      inquiryType: payload.inquiryType,
      status: "NEW",
    });

    return {
      _id: inquiry._id.toString(),
      userId: inquiry.userId.toString(),
      hotelId: inquiry.hotelId?.toString(),
      tripPackageId: inquiry.tripPackageId?.toString(),
      destinationId: inquiry.destinationId?.toString(),
      experienceId: inquiry.experienceId?.toString(),
      itineraryId: inquiry.itineraryId?.toString(),
      title: inquiry.title,
      message: inquiry.message,
      inquiryType: inquiry.inquiryType,
      status: inquiry.status,
      response: inquiry.response,
      assignedTo: inquiry.assignedTo?.toString(),
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
    };
  }

  // ============== Mobile: own-record reads and writes ==============
  //
  // Ownership is always enforced inside the database query using the id taken
  // from the verified token. A user id is never accepted from the client.

  private assertValidId(id: string, label = "inquiry") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, `Invalid ${label} id`);
    }
  }

  /// Mobile-safe projection: internal notes and admin assignment stay out.
  private toMobileInquiry(inquiry: any) {
    const hotel = inquiry.hotelId;
    const hotelIsPopulated = hotel && typeof hotel === "object" && hotel.name;

    return {
      _id: inquiry._id.toString(),
      hotelId: hotelIsPopulated
        ? hotel._id.toString()
        : inquiry.hotelId?.toString(),
      hotelName: hotelIsPopulated ? hotel.name : undefined,
      tripPackageId: inquiry.tripPackageId?.toString(),
      destinationId: inquiry.destinationId?.toString(),
      experienceId: inquiry.experienceId?.toString(),
      itineraryId: inquiry.itineraryId?.toString(),
      title: inquiry.title,
      message: inquiry.message,
      inquiryType: inquiry.inquiryType,
      status: inquiry.status,
      response: inquiry.response,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
    };
  }

  async listOwnInquiries(userId: string, params: OwnInquiryListQueryDTO) {
    const filter: Record<string, unknown> = { userId };

    if (params.status) {
      filter.status = params.status;
    }

    if (params.inquiryType) {
      filter.inquiryType = params.inquiryType;
    }

    const skip = (params.page - 1) * params.limit;

    const [inquiries, total] = await Promise.all([
      InquiryModel.find(filter)
        .populate("hotelId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      InquiryModel.countDocuments(filter),
    ]);

    return {
      inquiries: inquiries.map((inquiry) => this.toMobileInquiry(inquiry)),
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
      },
    };
  }

  async getOwnInquiry(userId: string, id: string) {
    this.assertValidId(id);

    const inquiry = await InquiryModel.findOne({ _id: id, userId }).populate(
      "hotelId",
      "name",
    );

    if (!inquiry) {
      throw new HttpException(404, "Inquiry not found");
    }

    return this.toMobileInquiry(inquiry);
  }

  async updateOwnInquiry(
    userId: string,
    id: string,
    payload: UpdateOwnInquiryDTO,
  ) {
    this.assertValidId(id);

    // Editing is only allowed while nobody has picked the inquiry up.
    const inquiry = await InquiryModel.findOneAndUpdate(
      { _id: id, userId, status: "NEW" },
      payload,
      { returnDocument: "after", runValidators: true },
    ).populate("hotelId", "name");

    if (!inquiry) {
      const exists = await InquiryModel.exists({ _id: id, userId });
      throw new HttpException(
        exists ? 409 : 404,
        exists
          ? "This inquiry can no longer be edited because it is already being handled"
          : "Inquiry not found",
      );
    }

    return this.toMobileInquiry(inquiry);
  }

  async cancelOwnInquiry(userId: string, id: string) {
    this.assertValidId(id);

    const inquiry = await InquiryModel.findOneAndUpdate(
      { _id: id, userId, status: { $in: ["NEW", "IN_PROGRESS"] } },
      { status: "CLOSED" },
      { returnDocument: "after", runValidators: true },
    ).populate("hotelId", "name");

    if (!inquiry) {
      const exists = await InquiryModel.exists({ _id: id, userId });
      throw new HttpException(
        exists ? 409 : 404,
        exists
          ? "This inquiry has already been closed"
          : "Inquiry not found",
      );
    }

    return this.toMobileInquiry(inquiry);
  }
}
