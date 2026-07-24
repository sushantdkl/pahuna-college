import type { UserRole } from "./user-role";

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrator",
  PROVIDER: "Provider",
  USER: "Traveler",
  admin: "Administrator",
  provider: "Provider",
  user: "Traveler",
};

export function hasPermission(role: UserRole | undefined, permission: string) {
  if (!role) return false;
  if (String(role).toLowerCase() === "admin") return true;
  return permission !== "admin";
}
