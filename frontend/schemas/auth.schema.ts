import { z } from "zod";

// Frontend schemas stop invalid auth data before the Component -> Action -> API call chain begins.
export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  // Confirm password is a UI-only safety check and is stripped before the backend request.
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Login validation keeps the backend request focused on a real email and provided password.
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
