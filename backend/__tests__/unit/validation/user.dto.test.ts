import { CreateUserDTO, LoginUserDTO, UpdatePasswordDTO, UpdateUserDTO } from "../../../src/dtos/user.dto";

describe("user DTO validation", () => {
  test("registration requires full name", () => {
    const result = CreateUserDTO.safeParse({ email: "qa@example.com", phoneNumber: "9800000000", password: "123456" });
    expect(result.success).toBe(false);
  });

  test("registration rejects invalid email", () => {
    const result = CreateUserDTO.safeParse({ fullName: "QA-TEST User", email: "bad", phoneNumber: "9800000000", password: "123456" });
    expect(result.success).toBe(false);
  });

  test("registration rejects weak password", () => {
    const result = CreateUserDTO.safeParse({ fullName: "QA-TEST User", email: "qa@example.com", phoneNumber: "9800000000", password: "123" });
    expect(result.success).toBe(false);
  });

  test("registration accepts valid payload", () => {
    const result = CreateUserDTO.safeParse({ fullName: "QA-TEST User", email: "qa@example.com", phoneNumber: "9800000000", password: "123456" });
    expect(result.success).toBe(true);
  });

  test("login rejects invalid email", () => {
    expect(LoginUserDTO.safeParse({ email: "bad", password: "123456" }).success).toBe(false);
  });

  test("login requires password", () => {
    expect(LoginUserDTO.safeParse({ email: "qa@example.com" }).success).toBe(false);
  });

  test("login accepts valid credentials shape", () => {
    expect(LoginUserDTO.safeParse({ email: "qa@example.com", password: "123456" }).success).toBe(true);
  });

  test("profile update allows partial name change", () => {
    expect(UpdateUserDTO.safeParse({ fullName: "QA-TEST Updated" }).success).toBe(true);
  });

  test("profile update rejects invalid email", () => {
    expect(UpdateUserDTO.safeParse({ email: "invalid" }).success).toBe(false);
  });

  test("profile update rejects too-long bio", () => {
    expect(UpdateUserDTO.safeParse({ bio: "x".repeat(501) }).success).toBe(false);
  });

  test("password update requires current password", () => {
    expect(UpdatePasswordDTO.safeParse({ newPassword: "1234567" }).success).toBe(false);
  });

  test("password update rejects short new password", () => {
    expect(UpdatePasswordDTO.safeParse({ currentPassword: "123456", newPassword: "123" }).success).toBe(false);
  });

  test("password update accepts valid payload", () => {
    expect(UpdatePasswordDTO.safeParse({ currentPassword: "123456", newPassword: "abcdef" }).success).toBe(true);
  });
});
