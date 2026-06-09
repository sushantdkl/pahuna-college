import { loginApi, registerApi } from "@/lib/api/auth";
import type { LoginFormData, RegisterFormData } from "@/schemas/auth.schema";

export async function registerAction(data: RegisterFormData) {
  return registerApi(data);
}

export async function loginAction(data: LoginFormData) {
  return loginApi(data);
}
