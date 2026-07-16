import mongoose from "mongoose";
import { AdminInquiryListQueryDTO, AdminUpdateInquiryDTO } from "../dtos/inquiry.dto";
import { HttpException } from "../exceptions/http-exception";
import { HotelModel } from "../models/hotel.model";
import { InquiryModel } from "../models/inquiry.model";
import { UserModel } from "../models/user.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class AdminInquiryService {
  private assertValidId(id: string, label = "inquiry") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, `Invalid ${label} id`);
    }
  }

  private populateInquiry(query: ReturnType<typeof InquiryModel.findById>) {
    return query
      .populate("userId", "fullName email phoneNumber")
      .populate("hotelId", "name address propertyType")
      .populate("assignedTo", "fullName email");
  }

  private async buildFilter(params: AdminInquiryListQueryDTO) {
    const filter: Record<string, unknown> = {};

    if (params.status) {
      filter.status = params.status;
    }

    if (params.inquiryType) {
      filter.inquiryType = params.inquiryType;
    }

    if (params.hotelId) {
      filter.hotelId = params.hotelId;
    }

    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      const [users, hotels] = await Promise.all([
        UserModel.find({
          $or: [{ fullName: regex }, { email: regex }],
        }).select("_id"),
        HotelModel.find({ name: regex }).select("_id"),
      ]);

      filter.$or = [
        { title: regex },
        { message: regex },
        { inquiryType: regex },
        { status: regex },
        { userId: { $in: users.map((user) => user._id) } },
        { hotelId: { $in: hotels.map((hotel) => hotel._id) } },
      ];
    }

    return filter;
  }

  async listInquiries(params: AdminInquiryListQueryDTO) {
    const skip = (params.page - 1) * params.limit;
    const filter = await this.buildFilter(params);

    const [inquiries, total] = await Promise.all([
      InquiryModel.find(filter)
        .populate("userId", "fullName email phoneNumber")
        .populate("hotelId", "name address propertyType")
        .populate("assignedTo", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      InquiryModel.countDocuments(filter),
    ]);

    return {
      inquiries,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
      },
    };
  }

  async getInquiry(id: string) {
    this.assertValidId(id);

    const inquiry = await this.populateInquiry(InquiryModel.findById(id));

    if (!inquiry) {
      throw new HttpException(404, "Inquiry not found");
    }

    return inquiry;
  }

  async updateInquiry(id: string, payload: AdminUpdateInquiryDTO) {
    this.assertValidId(id);

    if (payload.assignedTo) {
      this.assertValidId(payload.assignedTo, "assigned user");
      const assignee = await UserModel.findOne({
        _id: payload.assignedTo,
        role: "admin",
      }).select("_id");

      if (!assignee) {
        throw new HttpException(400, "Inquiry assignee must be an admin user");
      }
    }

    const updatePayload = {
      ...payload,
      status: payload.status || (payload.response ? "RESPONDED" : undefined),
    };
    const inquiry = await this.populateInquiry(
      InquiryModel.findByIdAndUpdate(id, updatePayload, {
        returnDocument: "after",
        runValidators: true,
      }),
    );

    if (!inquiry) {
      throw new HttpException(404, "Inquiry not found");
    }

    return inquiry;
  }

  async deleteInquiry(id: string) {
    this.assertValidId(id);

    const inquiry = await InquiryModel.findByIdAndDelete(id);

    if (!inquiry) {
      throw new HttpException(404, "Inquiry not found");
    }

    return { deleted: true };
  }
}
