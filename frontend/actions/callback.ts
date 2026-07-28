"use server";

import { createContactMessageApi } from "@/lib/api/contact-messages";
import { callbackSchema, type CallbackInput } from "@server/lib/validations";
import type { ActionResult } from "@server/lib/types/actions";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function submitCallbackRequest(data: CallbackInput): Promise<ActionResult> {
  const parsed = callbackSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  const payload = parsed.data;
  const fullName = text(payload.fullName) || text(payload.name);
  const preferredTime = text(payload.preferredTime);
  const hotelName = text(payload.hotelName);
  const message = [
    text(payload.message),
    preferredTime ? `Preferred callback time: ${preferredTime}` : null,
    hotelName ? `Regarding: ${hotelName}` : null,
    text(payload.source) ? `Source: ${text(payload.source)}` : "Source: website",
  ].filter(Boolean).join("\n");

  try {
    await createContactMessageApi({
      name: fullName,
      email: text(payload.email) || "callback@pahuna.com",
      phone: text(payload.phone) || undefined,
      subject: hotelName ? `Callback request for ${hotelName}` : "Callback request",
      message: message || "Callback requested from Pahuna website.",
    });

    return { success: true };
  } catch (error) {
    console.error("Callback request error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit callback request. Please try again.",
    };
  }
}
