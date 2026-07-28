import { CreateContactMessageDTO } from "../dtos/contact-message.dto";
import { ContactMessageModel } from "../models/contact-message.model";

export class ContactMessageService {
  async createContactMessage(payload: CreateContactMessageDTO) {
    const contactMessage = await ContactMessageModel.create({
      ...payload,
      phone: payload.phone || undefined,
      status: "NEW",
    });

    return {
      _id: contactMessage._id.toString(),
      name: contactMessage.name,
      email: contactMessage.email,
      phone: contactMessage.phone,
      subject: contactMessage.subject,
      message: contactMessage.message,
      status: contactMessage.status,
      createdAt: contactMessage.createdAt,
      updatedAt: contactMessage.updatedAt,
    };
  }
}
