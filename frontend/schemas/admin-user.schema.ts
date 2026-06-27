import { z } from "zod";

export const adminUserCreateSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "user"], { message: "Role is required" }),
  phoneNumber: z.string().trim().optional(),
  location: z.string().trim().optional(),
});

export const adminUserEditSchema = adminUserCreateSchema
  .extend({
    password: z.string().optional(),
  })
  .refine((data) => !data.password || data.password.length >= 6, {
    message: "Password must be at least 6 characters long",
    path: ["password"],
  });

export type AdminUserCreateFormData = z.infer<typeof adminUserCreateSchema>;
export type AdminUserEditFormData = z.infer<typeof adminUserEditSchema>;
