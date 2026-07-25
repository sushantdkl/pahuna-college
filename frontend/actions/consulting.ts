"use server";

import { createConsultingLead } from "@/lib/api/consulting";
import { consultingLeadSchema, type ConsultingLeadInput } from "@server/lib/validations";
import type { ActionResult } from "@server/lib/types/actions";

function looksLikeObjectId(value?: string) {
  return Boolean(value && /^[a-f\d]{24}$/i.test(value));
}

function text(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

export async function submitConsultingLead(data: ConsultingLeadInput): Promise<ActionResult> {
  const parsed = consultingLeadSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  const d = parsed.data;

  try {
    await createConsultingLead({
      serviceId: text(d.serviceId) || (looksLikeObjectId(text(d.serviceType)) ? text(d.serviceType) : undefined),
      name: text(d.contactName) || text(d.name),
      contactName: text(d.contactName) || text(d.name),
      email: text(d.email),
      phone: text(d.phone),
      businessName: text(d.businessName),
      businessType: text(d.businessType),
      businessStage: text(d.stage) || text(d.businessStage),
      stage: text(d.stage) || text(d.businessStage),
      businessSize: text(d.businessSize),
      location: text(d.location),
      serviceType: text(d.serviceType),
      timeline: text(d.timeline),
      budget: text(d.budget),
      budgetRange: text(d.budget),
      message: text(d.message),
    });

    return { success: true };
  } catch (error) {
    console.error("Consulting lead error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit inquiry. Please try again.",
    };
  }
}
