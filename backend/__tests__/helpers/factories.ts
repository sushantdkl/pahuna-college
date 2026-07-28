import bcryptjs from "bcryptjs";
import { UserModel } from "../../src/models/user.model";

const stamp = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function qaEmail(prefix = "user") {
  return `qa-test-${prefix}-${stamp()}@example.com`;
}

export async function createUser(overrides: Record<string, unknown> = {}) {
  const password = String(overrides.password || "123456");
  return UserModel.create({
    fullName: `QA-TEST User ${stamp()}`,
    email: qaEmail(),
    phoneNumber: "9800000000",
    password: await bcryptjs.hash(password, 10),
    role: "user",
    isActive: true,
    emailVerified: false,
    ...overrides,
  });
}

export async function createAdmin(overrides: Record<string, unknown> = {}) {
  return createUser({
    fullName: `QA-TEST Admin ${stamp()}`,
    email: qaEmail("admin"),
    role: "admin",
    ...overrides,
  });
}
