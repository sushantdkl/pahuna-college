"use server";

// TODO: Persist partner applications with Prisma.
import { partnerSchema, type PartnerInput } from "@server/lib/validations";
import {
  sendEmails,
  buildPartnerConfirmationEmail,
} from "@server/lib/email";
import type { ActionResult } from "@server/lib/types/actions";

export async function submitPartnerApplication(data: PartnerInput): Promise<ActionResult> {
  const parsed = partnerSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  // TODO: Implement Prisma-based partner application submission
  // For now, return success to prevent build errors
  
  try {
    console.log("Partner application submitted:", parsed.data);
    return { success: true };
  } catch (error) {
    console.error("Partner application error:", error);
    return { success: false, error: "Failed to submit application. Please try again." };
  }
}


