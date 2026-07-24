"use server";

// TODO: Persist hotel leads with Prisma.
import { hotelLeadSchema, type HotelLeadInput } from "@server/lib/validations";
import {
  sendEmails,
  buildHotelLeadConfirmationEmail,
} from "@server/lib/email";
import type { ActionResult } from "@server/lib/types/actions";

export async function submitHotelLead(data: HotelLeadInput): Promise<ActionResult> {
  const parsed = hotelLeadSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  // TODO: Implement Prisma-based hotel lead submission
  // For now, return success to prevent build errors
  
  try {
    console.log("Hotel lead submitted:", parsed.data);
    return { success: true };
  } catch (error) {
    console.error("Hotel lead submission error:", error);
    return { success: false, error: "Failed to submit hotel lead" };
  }
}


