"use server";

import { db } from "@server/lib/db";
import { consultingLeadSchema, type ConsultingLeadInput } from "@server/lib/validations";
import { sendEmails, buildConsultingConfirmationEmail } from "@server/lib/email";
import type { ActionResult } from "@server/lib/types/actions";

export async function submitConsultingLead(data: ConsultingLeadInput): Promise<ActionResult> {
  const parsed = consultingLeadSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError || "Please check your form and try again." };
  }

  const d = parsed.data;

  try {
    await db.consultingLead.create({
      data: {
        businessName: d.businessName,
        contactName: d.contactName,
        email: d.email,
        phone: d.phone || null,
        businessType: d.businessType || null,
        businessSize: d.businessSize || null,
        location: d.location || null,
        website: d.website || null,
        serviceType: d.serviceType,
        services: d.services ? JSON.stringify(d.services) : null,
        stage: d.stage || null,
        message: d.message || null,
        budget: d.budget || null,
        timeline: d.timeline || null,
        leadSource: d.leadSource || "website",
      },
    });

    // Send user confirmation + admin notification (non-blocking)
    const confirmEmail = buildConsultingConfirmationEmail({
      contactName: d.contactName,
      businessName: d.businessName,
      serviceType: d.serviceType,
    });
    sendEmails(
      { ...confirmEmail, to: d.email },
      {
        type: "Consulting Lead",
        name: `${d.contactName} (${d.businessName})`,
        email: d.email,
        details: [
          `Service: ${d.serviceType}`,
          d.businessType ? `Business Type: ${d.businessType}` : null,
          d.businessSize ? `Size: ${d.businessSize}` : null,
          d.stage ? `Stage: ${d.stage}` : null,
          d.budget ? `Budget: ${d.budget}` : null,
          d.timeline ? `Timeline: ${d.timeline}` : null,
          d.message ? `\nMessage: ${d.message}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      },
    );

    return { success: true };
  } catch (error) {
    console.error("Consulting lead error:", error);
    return { success: false, error: "Failed to submit inquiry. Please try again." };
  }
}


