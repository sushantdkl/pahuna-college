import { api } from "../../helpers/requests";

describe("public API contract", () => {
  test("health endpoint returns a stable success envelope", async () => {
    const response = await api().get("/").expect(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Pahuna API is running",
    });
  });

  test("missing API routes return standard not found envelope", async () => {
    const response = await api().get("/api/v1/qa-test-missing").expect(404);
    expect(response.body).toMatchObject({
      success: false,
      message: "API route not found",
    });
  });

  test.each([
    ["/api/v1/hotels"],
    ["/api/v1/destinations"],
    ["/api/v1/experiences"],
    ["/api/v1/food-providers"],
    ["/api/v1/blog-posts"],
    ["/api/v1/trip-packages"],
  ])("public listing endpoint responds with JSON for %s", async (path) => {
    const response = await api().get(path).expect((res) => {
      expect([200, 404]).toContain(res.status);
    });
    expect(response.type).toContain("json");
  });
});
