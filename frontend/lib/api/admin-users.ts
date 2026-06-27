import { apiDelete, apiGet, apiPatch, apiPost } from "./axios-instance";
import type {
  AdminUserCreateFormData,
  AdminUserEditFormData,
} from "@/schemas/admin-user.schema";

export type AdminUser = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};

export type AdminUserListParams = {
  page: number;
  limit: number;
  search?: string;
};

export type AdminUserDeleteResponse = {
  deleted: boolean;
};

function toQueryString(params: AdminUserListParams) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  return searchParams.toString();
}

export async function getAdminUsersApi(params: AdminUserListParams) {
  return apiGet<AdminUser[]>(`/admin/users?${toQueryString(params)}`, true);
}

export async function getAdminUserApi(id: string) {
  return apiGet<AdminUser>(`/admin/users/${id}`, true);
}

export async function createAdminUserApi(data: AdminUserCreateFormData) {
  return apiPost<AdminUser>("/admin/users", data, true);
}

export async function updateAdminUserApi(
  id: string,
  data: AdminUserEditFormData,
) {
  const payload = {
    ...data,
    password: data.password?.trim() ? data.password : undefined,
  };

  return apiPatch<AdminUser>(`/admin/users/${id}`, payload, true);
}

export async function deleteAdminUserApi(id: string) {
  return apiDelete<AdminUserDeleteResponse>(`/admin/users/${id}`, true);
}
