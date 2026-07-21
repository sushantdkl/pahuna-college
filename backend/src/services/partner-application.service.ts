import { CreatePartnerApplicationDTO } from "../dtos/partner-application.dto";
import { PartnerApplicationModel } from "../models/partner-application.model";

export class PartnerApplicationService {
  async createApplication(payload: CreatePartnerApplicationDTO) {
    const application = await PartnerApplicationModel.create({
      ...payload,
      email: payload.email.trim().toLowerCase(),
      address: payload.address || undefined,
      website: payload.website || undefined,
      currentRevenue: payload.currentRevenue || undefined,
      challenges: payload.challenges || undefined,
      goals: payload.goals || undefined,
      status: "PENDING",
      notes: undefined,
      reviewedBy: undefined,
      reviewedAt: undefined,
    });

    return {
      _id: application._id.toString(),
      status: application.status,
      businessName: application.businessName,
      partnerType: application.partnerType,
      ownerName: application.ownerName,
      email: application.email,
      phone: application.phone,
      createdAt: application.createdAt,
    };
  }
}
