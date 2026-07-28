import { describe, expect, test } from "vitest";
import { getImageOrPlaceholder, isBackendUploadImage } from "@/lib/assets";

describe("public image helpers", () => {
  test("expands backend upload paths to the backend origin", () => {
    expect(getImageOrPlaceholder("/uploads/destinations/qa-test.png", "destination")).toBe(
      "http://localhost:4000/uploads/destinations/qa-test.png",
    );
  });

  test("detects normalized backend upload URLs", () => {
    expect(isBackendUploadImage("http://localhost:4000/uploads/destinations/qa-test.png")).toBe(true);
  });

  test("detects relative backend upload paths", () => {
    expect(isBackendUploadImage("/uploads/food/qa-test.png")).toBe(true);
  });

  test("does not mark static public images as backend uploads", () => {
    expect(isBackendUploadImage("/images/surkhet/bulbule-lake.jpg")).toBe(false);
  });

  test("returns a real food fallback image when source is missing", () => {
    expect(getImageOrPlaceholder(null, "food")).toContain("images.unsplash.com");
  });
});
