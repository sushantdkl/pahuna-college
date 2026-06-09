import type { LoginFormData, RegisterFormData } from "@/schemas/auth.schema";
import { apiPost } from "./axios-instance";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
};

export type LoginResponse = {
  user: AuthUser;
  token: string;
};

export type RegisterResponse = {
  user: AuthUser;
};

export async function registerApi(data: RegisterFormData) {
  // confirmPassword is validated on the frontend but not sent to the backend user model.
  const { confirmPassword, ...payload } = data;
  void confirmPassword;

  return apiPost<RegisterResponse>("/auth/register", payload);
}

export async function loginApi(data: LoginFormData) {
  // Login API returns the JWT and public user data that the component stores after success.
  return apiPost<LoginResponse>("/auth/login", data);
}
