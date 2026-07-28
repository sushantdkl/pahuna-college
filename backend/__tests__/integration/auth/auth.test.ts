import bcryptjs from "bcryptjs";
import { UserModel } from "../../../src/models/user.model";
import { api } from "../../helpers/requests";
import { createUser, qaEmail } from "../../helpers/factories";

describe("auth API", () => {
  test("valid registration creates a safe user", async () => {
    const email = qaEmail("register");
    const response = await api()
      .post("/api/v1/auth/register")
      .send({ fullName: "QA-TEST Registered User", email, phoneNumber: "9800000000", password: "123456" })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(email);
    expect(response.body.data.user.password).toBeUndefined();
    expect(response.body.data.user.role).toBe("user");
  });

  test("registration hashes password in database", async () => {
    const email = qaEmail("hash");
    await api()
      .post("/api/v1/auth/register")
      .send({ fullName: "QA-TEST Hash User", email, phoneNumber: "9800000000", password: "123456" })
      .expect(200);

    const user = await UserModel.findOne({ email }).lean();
    expect(user?.password).not.toBe("123456");
    expect(await bcryptjs.compare("123456", user?.password || "")).toBe(true);
  });

  test("duplicate registration is rejected", async () => {
    const email = qaEmail("duplicate");
    await createUser({ email });

    const response = await api()
      .post("/api/v1/auth/register")
      .send({ fullName: "QA-TEST Duplicate", email, phoneNumber: "9800000000", password: "123456" })
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test("valid login returns token and public user", async () => {
    const email = qaEmail("login");
    await createUser({ email, password: "123456" });

    const response = await api()
      .post("/api/v1/auth/login")
      .send({ email, password: "123456" })
      .expect(200);

    expect(response.body.data.token).toEqual(expect.any(String));
    expect(response.body.data.user.password).toBeUndefined();
  });

  test("wrong password is rejected", async () => {
    const email = qaEmail("wrong");
    await createUser({ email, password: "123456" });

    await api()
      .post("/api/v1/auth/login")
      .send({ email, password: "badpass" })
      .expect(400);
  });

  test("inactive user cannot log in", async () => {
    const email = qaEmail("inactive");
    await createUser({ email, password: "123456", isActive: false });

    await api()
      .post("/api/v1/auth/login")
      .send({ email, password: "123456" })
      .expect(403);
  });
});
