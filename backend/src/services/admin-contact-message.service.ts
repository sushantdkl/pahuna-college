import mongoose from "mongoose";
import {
  AdminContactMessageListQueryDTO,
  AdminUpdateContactMessageDTO,
} from "../dtos/contact-message.dto";
import { HttpException } from "../exceptions/http-exception";
import { ContactMessageModel } from "../models/contact-message.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class AdminContactMessageService {
  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid contact message id");
    }
  }

  private populateResponder(
    query: ReturnType<typeof ContactMessageModel.findById>,
  ) {
    return query.populate("respondedBy", "fullName email");
  }

  private buildFilter(params: AdminContactMessageListQueryDTO) {
    const filter: Record<string, unknown> = {};

    if (params.status) {
      filter.status = params.status;
    }

    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { subject: regex },
        { message: regex },
        { status: regex },
      ];
    }

    return filter;
  }

  async listContactMessages(params: AdminContactMessageListQueryDTO) {
    const skip = (params.page - 1) * params.limit;
    const filter = this.buildFilter(params);
    const [
      messages,
      total,
      totalMessages,
      newMessages,
      respondedMessages,
      closedMessages,
    ] = await Promise.all([
      ContactMessageModel.find(filter)
        .populate("respondedBy", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(params.limit),
      ContactMessageModel.countDocuments(filter),
      ContactMessageModel.countDocuments(),
      ContactMessageModel.countDocuments({ status: "NEW" }),
      ContactMessageModel.countDocuments({ status: "RESPONDED" }),
      ContactMessageModel.countDocuments({ status: "CLOSED" }),
    ]);

    return {
      messages,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
        summary: {
          total: totalMessages,
          new: newMessages,
          responded: respondedMessages,
          closed: closedMessages,
        },
      },
    };
  }

  async getContactMessage(id: string) {
    this.assertValidId(id);

    const message = await this.populateResponder(
      ContactMessageModel.findById(id),
    );

    if (!message) {
      throw new HttpException(404, "Contact message not found");
    }

    return message;
  }

  async updateContactMessage(
    id: string,
    adminId: string,
    payload: AdminUpdateContactMessageDTO,
  ) {
    this.assertValidId(id);

    const updatePayload = {
      ...payload,
      status: payload.status || (payload.response ? "RESPONDED" : undefined),
      respondedBy: payload.response ? adminId : undefined,
    };
    const message = await this.populateResponder(
      ContactMessageModel.findByIdAndUpdate(id, updatePayload, {
        returnDocument: "after",
        runValidators: true,
      }),
    );

    if (!message) {
      throw new HttpException(404, "Contact message not found");
    }

    return message;
  }

  async deleteContactMessage(id: string) {
    this.assertValidId(id);

    const message = await ContactMessageModel.findByIdAndDelete(id);

    if (!message) {
      throw new HttpException(404, "Contact message not found");
    }

    return { deleted: true };
  }
}
