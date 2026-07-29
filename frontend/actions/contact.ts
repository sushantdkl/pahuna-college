"use server";

import { createContactMessageApi } from "@/lib/api/contact-messages";
import { contactSchema, type ContactInput } from "@server/lib/validations";
import type { ActionResult } from "@server/lib/types/actions";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContact(data: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  const payload = parsed.data;

  try {
    await createContactMessageApi({
      name: text(payload.fullName) || text(payload.name),
      email: text(payload.email),
      phone: text(payload.phone) || undefined,
      subject: text(payload.subject) || "Website message",
      message: text(payload.message),
    });

    return { success: true };
  } catch (error) {
    console.error("Contact submission error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message. Please try again.",
    };
  }
}
