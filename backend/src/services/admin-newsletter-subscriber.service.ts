import mongoose from "mongoose";
import {
  AdminNewsletterSubscriberListQueryDTO,
  AdminUpdateNewsletterSubscriberDTO,
} from "../dtos/newsletter-subscriber.dto";
import { HttpException } from "../exceptions/http-exception";
import { NewsletterSubscriberModel } from "../models/newsletter-subscriber.model";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class AdminNewsletterSubscriberService {
  private assertValidId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(400, "Invalid newsletter subscriber id");
    }
  }

  private buildFilter(params: AdminNewsletterSubscriberListQueryDTO) {
    const filter: Record<string, unknown> = {};

    if (params.active !== undefined) {
      filter.isActive = params.active;
    }

    if (params.search) {
      const regex = { $regex: escapeRegex(params.search), $options: "i" };
      filter.$or = [{ name: regex }, { email: regex }];
    }

    return filter;
  }

  async listSubscribers(params: AdminNewsletterSubscriberListQueryDTO) {
    const skip = (params.page - 1) * params.limit;
    const filter = this.buildFilter(params);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [subscribers, total, totalSubscribers, active, inactive, newThisMonth] =
      await Promise.all([
        NewsletterSubscriberModel.find(filter)
          .sort({ subscribedAt: -1 })
          .skip(skip)
          .limit(params.limit),
        NewsletterSubscriberModel.countDocuments(filter),
        NewsletterSubscriberModel.countDocuments(),
        NewsletterSubscriberModel.countDocuments({ isActive: true }),
        NewsletterSubscriberModel.countDocuments({ isActive: false }),
        NewsletterSubscriberModel.countDocuments({
          subscribedAt: { $gte: monthStart },
        }),
      ]);

    return {
      subscribers,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
        summary: {
          total: totalSubscribers,
          active,
          inactive,
          newThisMonth,
        },
      },
    };
  }

  async getSubscriber(id: string) {
    this.assertValidId(id);

    const subscriber = await NewsletterSubscriberModel.findById(id);

    if (!subscriber) {
      throw new HttpException(404, "Newsletter subscriber not found");
    }

    return subscriber;
  }

  async updateSubscriber(
    id: string,
    payload: AdminUpdateNewsletterSubscriberDTO,
  ) {
    this.assertValidId(id);

    const updatePayload: Record<string, unknown> = { ...payload };

    if (payload.isActive === true) {
      updatePayload.unsubscribedAt = null;
    } else if (payload.isActive === false) {
      updatePayload.unsubscribedAt = new Date();
    }

    const subscriber = await NewsletterSubscriberModel.findByIdAndUpdate(
      id,
      updatePayload,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!subscriber) {
      throw new HttpException(404, "Newsletter subscriber not found");
    }

    return subscriber;
  }

  async deleteSubscriber(id: string) {
    this.assertValidId(id);

    const subscriber = await NewsletterSubscriberModel.findByIdAndDelete(id);

    if (!subscriber) {
      throw new HttpException(404, "Newsletter subscriber not found");
    }

    return { deleted: true };
  }
}
