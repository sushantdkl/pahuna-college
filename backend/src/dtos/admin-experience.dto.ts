import { z } from "zod";
import { ExperienceSchema } from "../types/experience.type";

export const AdminCreateExperienceDTO = ExperienceSchema;

export type AdminCreateExperienceDTO = z.infer<typeof AdminCreateExperienceDTO>;

export const AdminUpdateExperienceDTO = ExperienceSchema.partial();

export type AdminUpdateExperienceDTO = z.infer<typeof AdminUpdateExperienceDTO>;
