import { CreateNewsletterSubscriberDTO } from "../dtos/newsletter-subscriber.dto";
import { NewsletterSubscriberModel } from "../models/newsletter-subscriber.model";

export class NewsletterSubscriberService {
  async subscribe(payload: CreateNewsletterSubscriberDTO) {
    const subscriber = await NewsletterSubscriberModel.findOneAndUpdate(
      { email: payload.email.toLowerCase() },
      {
        $set: {
          email: payload.email.toLowerCase(),
          name: payload.name || undefined,
          isActive: true,
        },
        $setOnInsert: {
          subscribedAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );

    return {
      _id: subscriber._id.toString(),
      email: subscriber.email,
      name: subscriber.name,
      isActive: subscriber.isActive,
      subscribedAt: subscriber.subscribedAt,
      createdAt: subscriber.createdAt,
      updatedAt: subscriber.updatedAt,
    };
  }
}
