import { z } from "zod";

// Shared user validation keeps DTOs and model-facing types aligned for Sprint 2 auth requests.
export const UserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .optional(),
  location: z.string().trim().optional(),
  bio: z.string().trim().max(500, "Bio must be 500 characters or less").optional(),
  profileImage: z.string().trim().optional(),
  password: z.string().min(6, "Password must be at least 6 character long"),
  role: z.enum(["admin", "user"]).default("user"),
});

// UserType is inferred from Zod so TypeScript follows the same rules used at runtime.
export type UserType = z.infer<typeof UserSchema>;
