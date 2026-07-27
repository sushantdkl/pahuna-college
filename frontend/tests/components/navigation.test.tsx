import { describe, expect, test } from "vitest";
import { mainNavigation } from "@/lib/data/navigation";

describe("main navigation", () => {
  test("places Packages and Blog between Trip Planner and Services", () => {
    const labels = mainNavigation.map((item) => item.label);
    expect(labels).toEqual([
      "Home",
      "Explore Surkhet",
      "Stays",
      "Food",
      "Destinations",
      "Trip Planner",
      "Packages",
      "Blog",
      "Services",
      "Contact",
    ]);
  });

  test("keeps Contact after the services dropdown", () => {
    const labels = mainNavigation.map((item) => item.label);
    expect(labels.indexOf("Contact")).toBeGreaterThan(labels.indexOf("Services"));
  });

  test("services dropdown exposes business and route links", () => {
    const services = mainNavigation.find((item) => item.label === "Services");
    expect(services?.children?.map((item) => item.href)).toEqual([
      "/consulting",
      "/training",
      "/partner",
      "/routes",
      "/experiences",
    ]);
  });
});
