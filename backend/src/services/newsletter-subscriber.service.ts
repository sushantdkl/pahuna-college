import { CreateNewsletterSubscriberDTO } from "../dtos/newsletter-subscriber.dto";
import { NewsletterSubscriberModel } from "../models/newsletter-subscriber.model";

export class NewsletterSubscriberService {
  async subscribe(payload: CreateNewsletterSubscriberDTO) {
    const email = payload.email.trim().toLowerCase();
    const setPayload: Record<string, unknown> = {
      isActive: true,
      unsubscribedAt: null,
    };

    if (payload.name) {
      setPayload.name = payload.name.trim();
    }

    return NewsletterSubscriberModel.findOneAndUpdate(
      { email },
      {
        $set: setPayload,
        $setOnInsert: {
          email,
          subscribedAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
  }
}
