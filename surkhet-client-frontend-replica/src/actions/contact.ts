"use server";

import { db } from "@server/lib/db";
import { contactSchema, type ContactInput } from "@server/lib/validations";
import { sendEmails, buildContactConfirmationEmail } from "@server/lib/email";
import type { ActionResult } from "@server/lib/types/actions";

export async function submitContact(data: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  const { fullName, email, phone, subject, message } = parsed.data;

  try {
    await db.contactMessage.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    });

    // Send user confirmation + admin notification (non-blocking)
    sendEmails(
      buildContactConfirmationEmail({ fullName, email, subject: subject ?? undefined }),
      {
        type: "Contact Message",
        name: fullName,
        email,
        details: `Subject: ${subject ?? "—"}\n\n${message}`,
      },
    );

    return { success: true };
  } catch (error) {
    console.error("Contact submission error:", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}


