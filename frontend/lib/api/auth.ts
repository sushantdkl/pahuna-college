import type {
  LoginFormData,
  PasswordUpdateFormData,
  RegisterFormData,
} from "@/schemas/auth.schema";
import { apiGet, apiPatch, apiPost } from "./axios-instance";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  profileImage?: string;
  role?: string;
  createdAt?: string;
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

export async function whoamiApi() {
  return apiGet<RegisterResponse>("/auth/whoami", true);
}

export async function updateProfileApi(data: FormData) {
  return apiPatch<RegisterResponse>("/auth/update", data, true);
}

export async function updatePasswordApi(data: PasswordUpdateFormData) {
  const { confirmPassword, ...payload } = data;
  void confirmPassword;

  return apiPatch<{ message: string }>("/auth/update-password", payload, true);
}
