"use server";

import { db } from "@server/lib/db";
import { newsletterSchema, type NewsletterInput } from "@server/lib/validations";
import type { ActionResult } from "@server/lib/types/actions";

export async function subscribeNewsletter(data: NewsletterInput): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid email address." };
  }

  try {
    // Upsert to handle duplicate subscriptions gracefully
    await db.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: { isActive: true, name: parsed.data.name || undefined },
      create: { email: parsed.data.email, name: parsed.data.name || null },
    });

    return { success: true };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { success: false, error: "Failed to subscribe. Please try again." };
  }
}


