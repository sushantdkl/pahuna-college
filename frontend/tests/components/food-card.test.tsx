import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { FoodCard } from "@/components/food/food-card";

const provider = {
  slug: "qa-test-cafe",
  name: "QA-TEST Cafe",
  typeLabel: "Cafe",
  verificationStatus: "PUBLIC_LISTING",
  images: ["/uploads/food/qa-test.png"],
  area: "Birendranagar",
  district: "Surkhet",
  rating: 4.4,
  shortDescription: "Coffee and snacks for test travelers.",
  cuisines: ["Coffee", "Snacks"],
};

describe("FoodCard", () => {
  test("renders admin-uploaded image as an unoptimized backend upload", () => {
    render(<FoodCard provider={provider as any} />);
    const image = screen.getByAltText("QA-TEST Cafe");
    expect(image).toHaveAttribute("src", "http://localhost:5050/uploads/food/qa-test.png");
  });

  test("links to the food guide", () => {
    render(<FoodCard provider={provider as any} />);
    expect(screen.getByRole("link", { name: /view guide/i })).toHaveAttribute("href", "/food/qa-test-cafe");
  });

  test("shows consent-safe inquiry language", () => {
    render(<FoodCard provider={provider as any} />);
    expect(screen.getByText(/contact via pahuna inquiry/i)).toBeInTheDocument();
  });
});
