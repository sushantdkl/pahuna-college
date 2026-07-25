import { Response } from "express";
import { z } from "zod";
import {
  CreateReservationDTO,
  ReservationListQueryDTO,
  UpdateReservationDTO,
} from "../dtos/reservation.dto";
import { ReservationService } from "../services/reservation.service";
import { AuthRequest } from "../types/auth-request.type";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const reservationService = new ReservationService();

function idParam(req: AuthRequest, key = "id") {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
}

export class ReservationController {
  async listRoomTypes(req: AuthRequest, res: Response) {
    try {
      const hotelId = idParam(req, "hotelId");
      await reservationService.ensureDefaultRoomTypes(hotelId);
      const rooms = await reservationService.listRoomTypes(hotelId);
      return ApiResponseHelper.success(res, rooms, "Room types fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async createReservation(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return ApiResponseHelper.error(res, "Authentication token is required", 401);
      const parsed = CreateReservationDTO.safeParse(req.body);
      if (!parsed.success) return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
      const reservation = await reservationService.createReservation(req.user._id.toString(), parsed.data);
      return ApiResponseHelper.success(res, reservation, "Reservation request submitted successfully", 201);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async myReservations(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return ApiResponseHelper.error(res, "Authentication token is required", 401);
      const reservations = await reservationService.listUserReservations(req.user._id.toString());
      return ApiResponseHelper.success(res, reservations, "Reservations fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async cancelReservation(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return ApiResponseHelper.error(res, "Authentication token is required", 401);
      const reservation = await reservationService.cancelUserReservation(req.user._id.toString(), idParam(req));
      return ApiResponseHelper.success(res, reservation, "Reservation cancelled successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminList(req: AuthRequest, res: Response) {
    try {
      const parsed = ReservationListQueryDTO.safeParse(req.query);
      if (!parsed.success) return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
      const { reservations, meta } = await reservationService.listAdminReservations(parsed.data);
      return ApiResponseHelper.success(res, reservations, "Reservations fetched successfully", 200, meta);
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminGet(req: AuthRequest, res: Response) {
    try {
      const reservation = await reservationService.getReservation(idParam(req));
      return ApiResponseHelper.success(res, reservation, "Reservation fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }

  async adminUpdate(req: AuthRequest, res: Response) {
    try {
      const parsed = UpdateReservationDTO.safeParse(req.body);
      if (!parsed.success) return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
      const reservation = await reservationService.updateReservation(idParam(req), parsed.data);
      return ApiResponseHelper.success(res, reservation, "Reservation updated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
    }
  }
}
