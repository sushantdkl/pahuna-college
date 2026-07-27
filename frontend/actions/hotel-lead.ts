"use server";

import { createPartnerApplicationApi } from "@/lib/api/partner-applications";
import { hotelLeadSchema, type HotelLeadInput } from "@server/lib/validations";
import type { ActionResult } from "@server/lib/types/actions";

function text(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function number(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function partnerType(value: unknown) {
  const raw = text(value);
  if (raw === "HOTEL" || raw === "RESORT" || raw === "RESTAURANT" || raw === "TRAVEL_AGENCY" || raw === "TRANSPORT" || raw === "OTHER") {
    return raw;
  }
  return "HOTEL";
}

export async function submitHotelLead(data: HotelLeadInput): Promise<ActionResult> {
  const parsed = hotelLeadSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  const d = parsed.data;

  try {
    await createPartnerApplicationApi({
      businessName: text(d.hotelName),
      partnerType: partnerType(d.propertyType),
      ownerName: text(d.ownerName),
      email: text(d.email),
      phone: text(d.phone),
      address: text(d.location),
      website: text(d.website),
      totalRooms: number(d.totalRooms),
      currentRevenue: text(d.priceRange),
      existingOnline: Boolean(d.currentOnline),
      challenges: text(d.challenges),
      goals: text(d.goals),
    });

    return { success: true };
  } catch (error) {
    console.error("Hotel lead submission error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit hotel lead",
    };
  }
}
