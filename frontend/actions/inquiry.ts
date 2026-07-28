"use server";

import { db } from "@server/lib/db";
import { inquirySchema, type InquiryInput } from "@server/lib/validations";
import { isObjectId } from "@server/lib/prisma-id";
import {
  sendEmails,
  buildInquiryConfirmationEmail,
} from "@server/lib/email";
import type { ActionResult } from "@server/lib/types/actions";

async function resolveHotelId(value?: string) {
  if (!value) return null;

  if (isObjectId(value)) {
    const hotel = await db.hotel.findUnique({
      where: { id: value },
      select: { id: true },
    });
    if (hotel) return hotel.id;
  }

  const hotel = await db.hotel.findUnique({
    where: { slug: value },
    select: { id: true },
  });

  return hotel?.id ?? null;
}

async function resolveServiceProviderId(value?: string) {
  if (!value) return null;

  if (isObjectId(value)) {
    const provider = await db.serviceProvider.findUnique({
      where: { id: value },
      select: { id: true },
    });
    if (provider) return provider.id;
  }

  const provider = await db.serviceProvider.findUnique({
    where: { slug: value },
    select: { id: true },
  });

  return provider?.id ?? null;
}

export async function submitInquiry(data: InquiryInput): Promise<ActionResult<{ inquiryId: string }>> {
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  const { fullName, email, phone, type, hotelId, hotelName, checkIn, checkOut, guests, rooms, message, source } = parsed.data;

  try {
    const resolvedHotelId = await resolveHotelId(hotelId);
    const resolvedServiceProviderId = await resolveServiceProviderId(hotelId);

    const inquiry = await db.inquiry.create({
      data: {
        type,
        fullName,
        email,
        phone: phone || null,
        hotelId: resolvedHotelId,
        serviceProviderId: resolvedServiceProviderId,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        guests: guests || null,
        rooms: rooms || null,
        message: message || null,
        source: source || "website",
      },
    });

    // Send user confirmation + admin notification (non-blocking)
    const confirmationEmail = buildInquiryConfirmationEmail({
      fullName,
      hotelName,
      checkIn,
      checkOut,
    });
    sendEmails(
      { ...confirmationEmail, to: email },
      {
          type: type === "HOTEL_BOOKING" ? "Hotel Booking Inquiry" : "General Inquiry",
          name: fullName,
          email,
          details: [
          hotelName ? `Provider: ${hotelName}` : null,
          checkIn && checkOut ? `Dates: ${checkIn} → ${checkOut}` : null,
          guests ? `Guests: ${guests}` : null,
          rooms ? `Rooms: ${rooms}` : null,
          message ? `Message: ${message}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      },
    );

    return { success: true, data: { inquiryId: String((inquiry as { id?: string; _id?: string }).id ?? (inquiry as { _id?: string })._id ?? "") } };
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return { success: false, error: "Failed to submit inquiry. Please try again." };
  }
}


