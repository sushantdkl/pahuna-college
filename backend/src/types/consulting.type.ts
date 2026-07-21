import { z } from "zod";

export const ConsultingLeadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
  "CLOSED",
]);

export type ConsultingLeadStatus = z.infer<
  typeof ConsultingLeadStatusSchema
>;
