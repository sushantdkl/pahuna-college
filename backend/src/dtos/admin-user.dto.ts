import { z } from "zod";
import { UserSchema } from "../types/user.type";

export const AdminCreateUserDTO = UserSchema.pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  location: true,
  bio: true,
  profileImage: true,
  isActive: true,
  emailVerified: true,
  password: true,
  role: true,
});

export type AdminCreateUserDTO = z.infer<typeof AdminCreateUserDTO>;

export const AdminUpdateUserDTO = UserSchema.pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  location: true,
  bio: true,
  profileImage: true,
  isActive: true,
  emailVerified: true,
  role: true,
})
  .extend({
    password: z.preprocess(
      (value) => (typeof value === "string" && !value.trim() ? undefined : value),
      UserSchema.shape.password.optional(),
    ),
  })
  .partial();

export type AdminUpdateUserDTO = z.infer<typeof AdminUpdateUserDTO>;
