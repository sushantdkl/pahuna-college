import { loginApi, registerApi } from "@/lib/api/auth";
import type { LoginFormData, RegisterFormData } from "@/schemas/auth.schema";

// Actions are the bridge from auth components to API helpers, keeping pages free from fetch details.
export async function registerAction(data: RegisterFormData) {
  return registerApi(data);
}

export async function loginAction(data: LoginFormData) {
  return loginApi(data);
}
