import mongoose from "mongoose";
import { AdminCreateHotelDTO, AdminUpdateHotelDTO } from "../dtos/admin-hotel.dto";
import { HttpException } from "../exceptions/http-exception";
import { hotelSeedData } from "../data/hotel-seed.data";
import { HotelModel, IHotel } from "../models/hotel.model";

type ListHotelsParams = {
  page?: string;
  limit?: string;
  search?: string;
  type?: string;
  propertyType?: string;
  district?: string;
  verified?: string;
  featured?: string;
};

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

export class AdminHotelService {
  private async seedHotelsIfEmpty() {
    const total = await HotelModel.estimatedDocumentCount();

    if (total > 0) {
      return;
    }

    await HotelModel.insertMany(hotelSeedData);
  }

  private toAdminHotel(hotel: IHotel) {
    return {
      _id: hotel._id.toString(),
      ownerId: hotel.ownerId?.toString(),
      name: hotel.name,
      description: hotel.description,
      address: hotel.address,
      district: hotel.district,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      propertyType: hotel.propertyType,
      starRating: hotel.starRating,
      priceMin: hotel.priceMin,
      priceMax: hotel.priceMax,
      amenities: hotel.amenities || [],
      contactPhone: hotel.contactPhone,
      email: hotel.email,
      images: hotel.images || [],
      isVerified: hotel.isVerified,
      isFeatured: hotel.isFeatured,
      isActive: hotel.isActive,
      totalRooms: hotel.totalRooms,
      availableRooms: hotel.availableRooms,
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt,
    };
  }

  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid hotel id");
    }
  }

  private buildFilter(params: ListHotelsParams) {
    const search = params.search?.trim();
    const type = params.propertyType?.trim() || params.type?.trim();
    const district = params.district?.trim();
    const verified = readBooleanFilter(params.verified);
    const featured = readBooleanFilter(params.featured);
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { contactPhone: { $regex: search, $options: "i" } },
        { propertyType: { $regex: search, $options: "i" } },
      ];
    }

    if (type) {
      filter.propertyType = { $regex: `^${type}$`, $options: "i" };
    }

    if (district) {
      filter.$or = [
        ...(Array.isArray(filter.$or) ? filter.$or : []),
        { district: { $regex: district, $options: "i" } },
        { address: { $regex: district, $options: "i" } },
      ];
    }

    if (verified !== undefined) {
      filter.isVerified = verified;
    }

    if (featured !== undefined) {
      filter.isFeatured = featured;
    }

    return filter;
  }

  async listHotels(params: ListHotelsParams) {
    await this.seedHotelsIfEmpty();

    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const filter = this.buildFilter(params);

    const [hotels, total] = await Promise.all([
      HotelModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      HotelModel.countDocuments(filter),
    ]);

    return {
      hotels: hotels.map((hotel) => this.toAdminHotel(hotel)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async getHotel(id: string) {
    this.assertValidId(id);

    const hotel = await HotelModel.findById(id);

    if (!hotel) {
      throw new HttpException(404, "Hotel not found");
    }

    return this.toAdminHotel(hotel);
  }

  async createHotel(payload: AdminCreateHotelDTO) {
    const hotel = await HotelModel.create(cleanPayload({ ...payload }));

    return this.toAdminHotel(hotel);
  }

  async updateHotel(id: string, payload: AdminUpdateHotelDTO) {
    this.assertValidId(id);

    const updatePayload = cleanPayload({ ...payload });
    const hotel = await HotelModel.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });

    if (!hotel) {
      throw new HttpException(404, "Hotel not found");
    }

    return this.toAdminHotel(hotel);
  }

  async deleteHotel(id: string) {
    this.assertValidId(id);

    const deleted = await HotelModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new HttpException(404, "Hotel not found");
    }

    return { deleted: true };
  }
}
