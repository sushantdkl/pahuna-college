import mongoose from "mongoose";
import dotenv from "dotenv";
import { afterAll, afterEach, beforeAll } from "@jest/globals";
import { PasswordResetTokenModel } from "../src/models/password-reset-token.model";

dotenv.config({ path: ".env.test" });
dotenv.config();

const testDbUrl = process.env.DATABASE_URL_TEST
  || process.env.MONGODB_URL_TEST;

function assertSafeTestDatabase(url: string) {
  const lowered = url.toLowerCase();
  const isTestDb = lowered.includes("test") || lowered.includes("qa");
  const looksProduction = lowered.includes("prod")
    || lowered.includes("production")
    || lowered.endsWith("/pahuna_college");

  if (!isTestDb || looksProduction) {
    throw new Error("Refusing to run tests against unsafe database URL.");
  }
}

beforeAll(async () => {
  if (!testDbUrl) {
    throw new Error(
      "MONGODB_URL_TEST or DATABASE_URL_TEST must be set before running backend tests.",
    );
  }

  process.env.MONGODB_URL = testDbUrl;
  process.env.JWT_SECRET = process.env.JWT_SECRET || "QA-TEST-JWT-SECRET";
  assertSafeTestDatabase(testDbUrl);

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(testDbUrl);
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  await PasswordResetTokenModel.deleteMany({});
  await Promise.all(
    Object.values(collections).map((collection) =>
      collection.deleteMany({
        $or: [
          { email: /^qa-test-/i },
          { slug: /^qa-test-/i },
          { name: /^QA-TEST-/ },
          { title: /^QA-TEST-/ },
          { fullName: /^QA-TEST-/ },
        ],
      }),
    ),
  );
});

afterAll(async () => {
  await mongoose.disconnect();
});
