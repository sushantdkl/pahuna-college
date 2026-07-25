"use server";

import { db } from "@server/lib/db";
import { callbackSchema, type CallbackInput } from "@server/lib/validations";
import { isObjectId } from "@server/lib/prisma-id";
import {
  sendEmail,
  sendEmails,
  buildCallbackConfirmationEmail,
  buildAdminNotificationEmail,
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

export async function submitCallbackRequest(data: CallbackInput): Promise<ActionResult> {
  const parsed = callbackSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  const d = parsed.data;

  try {
    const resolvedHotelId = await resolveHotelId(d.hotelId);
    const resolvedServiceProviderId = await resolveServiceProviderId(d.hotelId);

    // Store as an Inquiry with type CALLBACK_REQUEST
    await db.inquiry.create({
      data: {
        type: "CALLBACK_REQUEST",
        fullName: d.fullName,
        email: d.email || "",
        phone: d.phone,
        hotelId: resolvedHotelId,
        serviceProviderId: resolvedServiceProviderId,
        message: [
          d.message,
          d.preferredTime ? `Preferred callback time: ${d.preferredTime}` : null,
          d.hotelName ? `Regarding: ${d.hotelName}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        source: d.source || "website",
      },
    });

    // Send confirmation + admin notification (non-blocking)
    if (d.email) {
      const confirmEmail = buildCallbackConfirmationEmail({
        fullName: d.fullName,
        phone: d.phone,
        preferredTime: d.preferredTime,
      });
      sendEmails(
        { ...confirmEmail, to: d.email },
        {
          type: "Callback Request",
          name: d.fullName,
          email: d.email,
          details: `Phone: ${d.phone}\nPreferred Time: ${d.preferredTime || "ASAP"}\n${d.hotelName ? `Provider: ${d.hotelName}` : ""}\n${d.message || ""}`,
        },
      );
    } else {
      // No user email — send admin notification only
      sendEmail(
        buildAdminNotificationEmail({
          type: "Callback Request",
          name: d.fullName,
          email: "No email provided",
          details: `Phone: ${d.phone}\nPreferred Time: ${d.preferredTime || "ASAP"}\n${d.hotelName ? `Provider: ${d.hotelName}` : ""}\n${d.message || ""}`,
        }),
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Callback request error:", error);
    return { success: false, error: "Failed to submit callback request. Please try again." };
  }
}


