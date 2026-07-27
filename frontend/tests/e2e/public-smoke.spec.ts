import { expect, test } from "@playwright/test";

async function expectUsablePage(page: import("@playwright/test").Page, path: string) {
  await page.goto(path);
  await expect(page.locator("body")).toBeVisible();
  await expect(page.getByRole("heading").first()).toBeVisible();
  await expect(page.locator("body")).not.toContainText("404");
}

test("public landing page and primary navigation work", async ({ page }) => {
  await page.goto("/");
  const mainNav = page.getByRole("navigation", { name: /main navigation/i });
  await expect(mainNav).toBeVisible();
  await mainNav.getByRole("link", { name: "Destinations" }).click();
  await expect(page).toHaveURL(/\/destinations/);
});

test("navbar exposes Blog before Services and Contact after Services", async ({ page }) => {
  await page.goto("/destinations");
  const navText = await page.getByRole("navigation", { name: /main navigation/i }).innerText();
  expect(navText.indexOf("Blog")).toBeGreaterThan(navText.indexOf("Trip Planner"));
  expect(navText.indexOf("Services")).toBeGreaterThan(navText.indexOf("Blog"));
  expect(navText.indexOf("Contact")).toBeGreaterThan(navText.indexOf("Services"));
});

test("food View Guide opens the exact provider page", async ({ page }) => {
  await page.goto("/food");
  await page.getByRole("link", { name: /view guide/i }).first().click();
  await expect(page).toHaveURL(/\/food\//);
});

test("destination View Guide opens the exact destination page", async ({ page }) => {
  await page.goto("/destinations");
  await page.getByRole("link", { name: /view guide/i }).first().click();
  await expect(page).toHaveURL(/\/destinations\//);
});

test("trip planner is reachable from navigation", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: /main navigation/i })
    .getByRole("link", { name: "Trip Planner" })
    .click();
  await expect(page).toHaveURL(/\/trip-planner/);
});

for (const path of [
  "/about",
  "/contact",
  "/hotels",
  "/food",
  "/destinations",
  "/packages",
  "/routes",
  "/training",
  "/consulting",
  "/blog",
]) {
  test(`public route ${path} renders usable content`, async ({ page }) => {
    await expectUsablePage(page, path);
  });
}

test("forgot-password page links back to login", async ({ page }) => {
  await page.goto("/forgot-password");
  await expect(page.getByRole("link", { name: /back to login/i })).toHaveAttribute(
    "href",
    "/login",
  );
});

test("register page exposes account creation form", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByRole("heading").first()).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/^password/i)).toBeVisible();
});

test("forgot-password page validates malformed email", async ({ page }) => {
  await page.goto("/forgot-password");
  const email = page.getByLabel(/email address/i);
  await email.fill("bad-email");
  await page.getByRole("button", { name: /send reset link/i }).click();
  await expect(email).toHaveJSProperty("validity.valid", false);
});

test("reset-password page shows missing token state", async ({ page }) => {
  await page.goto("/reset-password");
  await expect(page.getByText(/missing a token/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /reset password/i })).toBeDisabled();
});

test("admin login page remains separate from public user login", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByText(/admin portal/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /user login/i })).toHaveAttribute("href", "/login");
});
