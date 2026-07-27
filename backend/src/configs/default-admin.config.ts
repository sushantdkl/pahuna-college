export const DEFAULT_ADMIN_EMAIL =
  process.env.DEFAULT_ADMIN_EMAIL?.toLowerCase().trim() || "admin@pahuna.com";

export const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "123456";

export const isDefaultAdminEmail = (email?: string): boolean =>
  email?.toLowerCase().trim() === DEFAULT_ADMIN_EMAIL;
