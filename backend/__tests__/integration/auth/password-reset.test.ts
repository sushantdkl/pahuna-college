import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { jest } from "@jest/globals";
import { PasswordResetTokenModel } from "../../../src/models/password-reset-token.model";
import { UserModel } from "../../../src/models/user.model";
import { emailNotificationService } from "../../../src/services/email-notification.service";
import { api } from "../../helpers/requests";
import { createUser, qaEmail } from "../../helpers/factories";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function createResetToken(userId: unknown, overrides: Record<string, unknown> = {}) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  await PasswordResetTokenModel.create({
    userId,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + 45 * 60 * 1000),
    ...overrides,
  });
  return rawToken;
}

describe("password reset API", () => {
  beforeEach(() => {
    jest
      .spyOn(emailNotificationService, "sendPasswordResetEmail")
      .mockResolvedValue({ sent: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("missing email is rejected", async () => {
    const response = await api()
      .post("/api/v1/auth/request-password-reset")
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test("malformed email is rejected", async () => {
    const response = await api()
      .post("/api/v1/auth/request-password-reset")
      .send({ email: "not-an-email" })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test("known email receives a generic success response", async () => {
    const email = qaEmail("reset-known");
    await createUser({ email });

    const response = await api()
      .post("/api/v1/auth/request-password-reset")
      .send({ email })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toMatch(/if an account exists/i);
    expect(JSON.stringify(response.body)).not.toContain("token");
    expect(response.body.data.user).toBeUndefined();
  });

  test("unknown email receives the same generic success response", async () => {
    const response = await api()
      .post("/api/v1/auth/request-password-reset")
      .send({ email: qaEmail("reset-unknown") })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toMatch(/if an account exists/i);
    expect(JSON.stringify(response.body)).not.toContain("token");
  });

  test("reset request creates a hashed token for known users", async () => {
    const email = qaEmail("reset-token");
    const user = await createUser({ email });

    await api()
      .post("/api/v1/auth/request-password-reset")
      .send({ email })
      .expect(200);

    const token = await PasswordResetTokenModel.findOne({ userId: user._id }).lean();
    expect(token?.tokenHash).toEqual(expect.any(String));
    expect(token?.tokenHash).toHaveLength(64);
    expect(token?.tokenHash).not.toContain(email);
  });

  test("reset token stores a future expiry", async () => {
    const email = qaEmail("reset-expiry");
    const user = await createUser({ email });

    await api()
      .post("/api/v1/auth/request-password-reset")
      .send({ email })
      .expect(200);

    const token = await PasswordResetTokenModel.findOne({ userId: user._id }).lean();
    expect(token?.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  test("previous active tokens are revoked when requesting a new reset", async () => {
    const email = qaEmail("reset-revoke");
    const user = await createUser({ email });
    await createResetToken(user._id);

    await api()
      .post("/api/v1/auth/request-password-reset")
      .send({ email })
      .expect(200);

    const tokens = await PasswordResetTokenModel.find({ userId: user._id }).lean();
    expect(tokens).toHaveLength(2);
    expect(tokens.filter((token) => token.revokedAt)).toHaveLength(1);
  });

  test("Nodemailer service receives the correct recipient and reset URL", async () => {
    const email = qaEmail("reset-mail");
    await createUser({ email, fullName: "QA-TEST Mail User" });
    const spy = jest.spyOn(emailNotificationService, "sendPasswordResetEmail");

    await api()
      .post("/api/v1/auth/request-password-reset")
      .send({ email })
      .expect(200);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: email,
        fullName: "QA-TEST Mail User",
        resetUrl: expect.stringContaining("/reset-password?token="),
      }),
    );
  });

  test("inactive users do not receive reset email", async () => {
    const email = qaEmail("reset-inactive");
    await createUser({ email, isActive: false });
    const spy = jest.spyOn(emailNotificationService, "sendPasswordResetEmail");

    await api()
      .post("/api/v1/auth/request-password-reset")
      .send({ email })
      .expect(200);

    expect(spy).not.toHaveBeenCalled();
  });

  test("invalid reset token is rejected", async () => {
    const response = await api()
      .post("/api/v1/auth/reset-password/invalid-token")
      .send({ newPassword: "newpass123" })
      .expect(400);

    expect(response.body.message).toMatch(/invalid or expired/i);
  });

  test("expired reset token is rejected", async () => {
    const user = await createUser({ email: qaEmail("reset-expired") });
    const token = await createResetToken(user._id, {
      expiresAt: new Date(Date.now() - 1000),
    });

    await api()
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ newPassword: "newpass123" })
      .expect(400);
  });

  test("used reset token is rejected", async () => {
    const user = await createUser({ email: qaEmail("reset-used") });
    const token = await createResetToken(user._id, {
      usedAt: new Date(),
    });

    await api()
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ newPassword: "newpass123" })
      .expect(400);
  });

  test("weak new password is rejected", async () => {
    const user = await createUser({ email: qaEmail("reset-weak") });
    const token = await createResetToken(user._id);

    await api()
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ newPassword: "123" })
      .expect(400);
  });

  test("same password is rejected", async () => {
    const user = await createUser({
      email: qaEmail("reset-same"),
      password: "oldpass123",
    });
    const token = await createResetToken(user._id);

    await api()
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ newPassword: "oldpass123" })
      .expect(400);
  });

  test("valid reset hashes the new password", async () => {
    const email = qaEmail("reset-valid");
    const user = await createUser({ email, password: "oldpass123" });
    const token = await createResetToken(user._id);

    await api()
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ newPassword: "newpass123" })
      .expect(200);

    const updatedUser = await UserModel.findOne({ email }).lean();
    expect(updatedUser?.password).not.toBe("newpass123");
    expect(await bcryptjs.compare("newpass123", updatedUser?.password || "")).toBe(true);
  });

  test("valid reset marks token as used", async () => {
    const user = await createUser({ email: qaEmail("reset-mark-used") });
    const token = await createResetToken(user._id);

    await api()
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ newPassword: "newpass123" })
      .expect(200);

    const storedToken = await PasswordResetTokenModel.findOne({
      tokenHash: hashToken(token),
    }).lean();
    expect(storedToken?.usedAt).toBeTruthy();
  });

  test("reset token cannot be reused", async () => {
    const user = await createUser({ email: qaEmail("reset-reuse") });
    const token = await createResetToken(user._id);

    await api()
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ newPassword: "newpass123" })
      .expect(200);

    await api()
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ newPassword: "anotherpass123" })
      .expect(400);
  });

  test("old password fails and new password succeeds after reset", async () => {
    const email = qaEmail("reset-login");
    const user = await createUser({ email, password: "oldpass123" });
    const token = await createResetToken(user._id);

    await api()
      .post(`/api/v1/auth/reset-password/${token}`)
      .send({ newPassword: "newpass123" })
      .expect(200);

    await api()
      .post("/api/v1/auth/login")
      .send({ email, password: "oldpass123" })
      .expect(400);

    await api()
      .post("/api/v1/auth/login")
      .send({ email, password: "newpass123" })
      .expect(200);
  });
});
