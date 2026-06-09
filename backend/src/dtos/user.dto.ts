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
