"use server";

import { createNewsletterSubscriberApi } from "@/lib/api/newsletter-subscribers";
import { newsletterSchema, type NewsletterInput } from "@server/lib/validations";
import type { ActionResult } from "@server/lib/types/actions";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function subscribeNewsletter(data: NewsletterInput): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid email address." };
  }

  try {
    await createNewsletterSubscriberApi({
      email: text(parsed.data.email),
      name: text(parsed.data.name) || undefined,
    });

    return { success: true };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to subscribe. Please try again.",
    };
  }
}
