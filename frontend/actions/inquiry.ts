"use server";

import { createInquiryApi } from "@/lib/api/inquiries";
import { inquirySchema, type InquiryInput } from "@server/lib/validations";
import type { ActionResult } from "@server/lib/types/actions";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function objectId(value: unknown) {
  const raw = text(value);
  return /^[a-f\d]{24}$/i.test(raw) ? raw : undefined;
}

function inquiryType(value: unknown) {
  const raw = text(value);
  if (
    raw === "HOTEL" ||
    raw === "AVAILABILITY" ||
    raw === "BOOKING" ||
    raw === "RESERVATION" ||
    raw === "TRAVEL_SUPPORT" ||
    raw === "GENERAL"
  ) {
    return raw;
  }

  if (raw === "HOTEL_BOOKING") return "BOOKING";
  return "GENERAL";
}

export async function submitInquiry(data: InquiryInput): Promise<ActionResult<{ inquiryId: string }>> {
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  const payload = parsed.data;
  const hotelName = text(payload.hotelName);
  const title = text(payload.title) || (hotelName ? `Inquiry for ${hotelName}` : "Website inquiry");
  const details = [
    text(payload.message),
    text(payload.fullName) ? `Name: ${text(payload.fullName)}` : null,
    text(payload.email) ? `Email: ${text(payload.email)}` : null,
    text(payload.phone) ? `Phone: ${text(payload.phone)}` : null,
    text(payload.checkIn) ? `Check-in: ${text(payload.checkIn)}` : null,
    text(payload.checkOut) ? `Check-out: ${text(payload.checkOut)}` : null,
    payload.guests ? `Guests: ${payload.guests}` : null,
    payload.rooms ? `Rooms: ${payload.rooms}` : null,
    text(payload.source) ? `Source: ${text(payload.source)}` : "Source: website",
  ].filter(Boolean).join("\n");

  try {
    const response = await createInquiryApi({
      hotelId: objectId(payload.hotelId),
      tripPackageId: objectId(payload.tripPackageId),
      hotelName,
      title,
      message: details || title,
      inquiryType: inquiryType(payload.type || payload.inquiryType),
    });

    return { success: true, data: { inquiryId: response.data?._id || "" } };
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit inquiry. Please sign in and try again.",
    };
  }
}
