import { z } from "zod";
import { UserSchema } from "../types/user.type";

// Registration accepts only the fields the API should receive from the frontend form.
export const CreateUserDTO = UserSchema.pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  password: true,
});

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

// Login intentionally stays small: email identifies the account and password proves ownership.
export const LoginUserDTO = UserSchema.pick({
  email: true,
  password: true,
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

export const UpdateUserDTO = UserSchema.pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  location: true,
  bio: true,
  profileImage: true,
}).partial();

export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

export const UpdatePasswordDTO = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters long"),
});

export type UpdatePasswordDTO = z.infer<typeof UpdatePasswordDTO>;
