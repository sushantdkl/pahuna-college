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
  bio?: string;
  profileImage?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};

export type AdminUserListParams = {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  active?: string;
  verified?: string;
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

  if (params.role) searchParams.set("role", params.role);
  if (params.active) searchParams.set("active", params.active);
  if (params.verified) searchParams.set("verified", params.verified);

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
