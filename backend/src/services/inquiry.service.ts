import mongoose from "mongoose";
import { hotelSeedData } from "../data/hotel-seed.data";
import { CreateInquiryDTO } from "../dtos/inquiry.dto";
import { HttpException } from "../exceptions/http-exception";
import { HotelModel } from "../models/hotel.model";
import { InquiryModel } from "../models/inquiry.model";

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
        throw new HttpException(404, "Hotel not found");
      }

      return hotel._id;
    }

    return undefined;
  }

  async createInquiry(userId: string, payload: CreateInquiryDTO) {
    const hotelId = await this.resolveHotelId(payload);

    if (hotelInquiryTypes.has(payload.inquiryType) && !hotelId) {
      throw new HttpException(
        400,
        "A hotel is required for this type of inquiry",
      );
    }

    const inquiry = await InquiryModel.create({
      userId,
      hotelId,
      title: payload.title,
      message: payload.message,
      inquiryType: payload.inquiryType,
      status: "NEW",
    });

    return {
      _id: inquiry._id.toString(),
      userId: inquiry.userId.toString(),
      hotelId: inquiry.hotelId?.toString(),
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
}
