import {
  createAdminUserApi,
  deleteAdminUserApi,
  getAdminUserApi,
  getAdminUsersApi,
  updateAdminUserApi,
  type AdminUserListParams,
} from "@/lib/api/admin-users";
import type {
  AdminUserCreateFormData,
  AdminUserEditFormData,
} from "@/schemas/admin-user.schema";

export async function getAdminUsersAction(params: AdminUserListParams) {
  return getAdminUsersApi(params);
}

export async function getAdminUserAction(id: string) {
  return getAdminUserApi(id);
}

export async function createAdminUserAction(data: AdminUserCreateFormData) {
  return createAdminUserApi(data);
}

export async function updateAdminUserAction(
  id: string,
  data: AdminUserEditFormData,
) {
  return updateAdminUserApi(id, data);
}

export async function deleteAdminUserAction(id: string) {
  return deleteAdminUserApi(id);
}
