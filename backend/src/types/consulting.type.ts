import { z } from "zod";

export const ConsultingLeadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
]);

export type ConsultingLeadStatus = z.infer<
  typeof ConsultingLeadStatusSchema
>;
