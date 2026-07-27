import mongoose from "mongoose";
import {
  CreateReservationDTO,
  ReservationListQueryDTO,
  UpdateReservationDTO,
} from "../dtos/reservation.dto";
import { HttpException } from "../exceptions/http-exception";
import { HotelModel } from "../models/hotel.model";
import { ReservationModel } from "../models/reservation.model";
import { RoomTypeModel } from "../models/room-type.model";

function assertValidId(id: string, label: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpException(400, `Invalid ${label} id`);
  }
}

function nightsBetween(checkIn: Date, checkOut: Date) {
  return Math.max(
    Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)),
    1,
  );
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function cleanReservation(reservation: any) {
  const json = reservation.toJSON ? reservation.toJSON() : reservation;
  return {
    ...json,
    _id: json._id?.toString(),
    userId: json.userId?._id ? { ...json.userId, _id: json.userId._id.toString() } : json.userId?.toString?.() || json.userId,
    hotelId: json.hotelId?._id ? { ...json.hotelId, _id: json.hotelId._id.toString() } : json.hotelId?.toString?.() || json.hotelId,
    roomTypeId: json.roomTypeId?._id ? { ...json.roomTypeId, _id: json.roomTypeId._id.toString() } : json.roomTypeId?.toString?.() || json.roomTypeId,
  };
}

export class ReservationService {
  async listRoomTypes(hotelId: string) {
    assertValidId(hotelId, "hotel");
    return RoomTypeModel.find({ hotelId, active: true }).sort({ createdAt: -1 });
  }

  async ensureDefaultRoomTypes(hotelId: string) {
    assertValidId(hotelId, "hotel");
    const hotel = await HotelModel.findOne({ _id: hotelId, isActive: true });
    if (!hotel) throw new HttpException(404, "Hotel not found");

    const existing = await RoomTypeModel.countDocuments({ hotelId });
    if (existing > 0) return;

    await RoomTypeModel.create({
      hotelId,
      name: hotel.propertyType || "Standard Room",
      description: "Reservation request room type based on the stay's published room inventory.",
      capacity: 2,
      beds: "Confirm with stay",
      pricePerNight: hotel.priceMin || 0,
      totalRooms: hotel.availableRooms || hotel.totalRooms || 1,
      amenities: hotel.amenities || [],
      images: hotel.images || [],
      active: true,
    });
  }

  private async validateAndPrice(payload: CreateReservationDTO) {
    assertValidId(payload.hotelId, "hotel");
    assertValidId(payload.roomTypeId, "room type");

    if (payload.checkIn < startOfToday()) {
      throw new HttpException(400, "Check-in cannot be in the past");
    }

    const hotel = await HotelModel.findOne({ _id: payload.hotelId, isActive: true });
    if (!hotel) throw new HttpException(404, "Hotel not found");

    const roomType = await RoomTypeModel.findOne({
      _id: payload.roomTypeId,
      hotelId: payload.hotelId,
      active: true,
    });
    if (!roomType) throw new HttpException(400, "Room type is not available for this stay");

    const guests = payload.adults + payload.children;
    if (guests > roomType.capacity * payload.numberOfRooms) {
      throw new HttpException(400, "Guest count exceeds selected room capacity");
    }

    const overlapping = await ReservationModel.aggregate([
      {
        $match: {
          roomTypeId: roomType._id,
          status: "CONFIRMED",
          checkIn: { $lt: payload.checkOut },
          checkOut: { $gt: payload.checkIn },
        },
      },
      { $group: { _id: null, rooms: { $sum: "$numberOfRooms" } } },
    ]);
    const confirmedRooms = overlapping[0]?.rooms || 0;
    if (confirmedRooms + payload.numberOfRooms > roomType.totalRooms) {
      throw new HttpException(400, "Requested rooms exceed available confirmed inventory");
    }

    return {
      hotel,
      roomType,
      estimatedTotal: roomType.pricePerNight * payload.numberOfRooms * nightsBetween(payload.checkIn, payload.checkOut),
    };
  }

  async createReservation(userId: string, payload: CreateReservationDTO) {
    assertValidId(userId, "user");
    const { estimatedTotal } = await this.validateAndPrice(payload);
    const reservation = await ReservationModel.create({
      ...payload,
      userId,
      estimatedTotal,
      status: "PENDING",
    });
    return cleanReservation(await this.getReservation(reservation._id.toString()));
  }

  async listUserReservations(userId: string) {
    assertValidId(userId, "user");
    const reservations = await ReservationModel.find({ userId })
      .populate("hotelId", "name propertyType district address images")
      .populate("roomTypeId", "name pricePerNight capacity beds")
      .sort({ createdAt: -1 });
    return reservations.map(cleanReservation);
  }

  async cancelUserReservation(userId: string, id: string) {
    assertValidId(userId, "user");
    assertValidId(id, "reservation");
    const reservation = await ReservationModel.findOne({ _id: id, userId });
    if (!reservation) throw new HttpException(404, "Reservation not found");
    if (!["PENDING", "CONFIRMED"].includes(reservation.status)) {
      throw new HttpException(400, "This reservation can no longer be cancelled");
    }
    reservation.status = "CANCELLED";
    await reservation.save();
    return cleanReservation(await this.getReservation(id));
  }

  async listAdminReservations(params: ReservationListQueryDTO) {
    const filter: Record<string, unknown> = {};
    if (params.status) filter.status = params.status;
    if (params.hotelId) filter.hotelId = params.hotelId;
    if (params.search) {
      filter.$or = [
        { guestName: { $regex: params.search, $options: "i" } },
        { email: { $regex: params.search, $options: "i" } },
        { phone: { $regex: params.search, $options: "i" } },
      ];
    }
    const skip = (params.page - 1) * params.limit;
    const [reservations, total] = await Promise.all([
      ReservationModel.find(filter)
        .populate("hotelId", "name propertyType district address images")
        .populate("roomTypeId", "name pricePerNight capacity beds")
        .populate("userId", "fullName email phoneNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      ReservationModel.countDocuments(filter),
    ]);
    return {
      reservations: reservations.map(cleanReservation),
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
      },
    };
  }

  async getReservation(id: string) {
    assertValidId(id, "reservation");
    const reservation = await ReservationModel.findById(id)
      .populate("hotelId", "name propertyType district address images")
      .populate("roomTypeId", "name pricePerNight capacity beds")
      .populate("userId", "fullName email phoneNumber");
    if (!reservation) throw new HttpException(404, "Reservation not found");
    return reservation;
  }

  async updateReservation(id: string, payload: UpdateReservationDTO) {
    assertValidId(id, "reservation");
    const reservation = await ReservationModel.findByIdAndUpdate(id, payload, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!reservation) throw new HttpException(404, "Reservation not found");
    return cleanReservation(await this.getReservation(id));
  }
}
