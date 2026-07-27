import { describe, expect, test } from "vitest";
import {
  destinations,
  featuredStays,
  foodHighlights,
  foodProviders,
  galleryItems,
  images,
  navItems,
  quickActions,
  routeCards,
  surkhetPlaces,
} from "../../lib/pahuna-content";
import {
  aboutCopy,
  consultingCopy,
  contactCopy,
  faqCopy,
  homeCopy,
  hotelsCopy,
  partnerCopy,
  roadmapCopy,
  trainingCopy,
} from "../../src/server/data/site-copy";

describe("legacy Pahuna content contracts", () => {
  test("nav items have local hrefs and readable labels", () => {
    expect(navItems.every((item) => item.href.startsWith("/"))).toBe(true);
    expect(navItems.every((item) => item.label.trim().length > 1)).toBe(true);
  });

  test.each(quickActions.slice(0, 5))("quick action $title has title, body and href", (item) => {
    expect(item.title).toBeTruthy();
    expect(item.description).toBeTruthy();
    expect(item.href).toMatch(/^\//);
  });

  test.each(surkhetPlaces.slice(0, 3))("Surkhet place $title has image and CTA", (item) => {
    expect(item.image).toMatch(/^(https?:\/\/|\/)/);
    expect(item.href).toMatch(/^\//);
  });

  test.each(destinations)("destination $title has guide link and image", (item) => {
    expect(item.href).toMatch(/^\/destinations/);
    expect(item.eyebrow).toBeTruthy();
    expect(item.image).toMatch(/^(https?:\/\/|\/)/);
  });

  test.each(foodHighlights)("food highlight $title maps to food guide", (item) => {
    expect(item.href).toMatch(/^\/food\//);
    expect(item.description.length).toBeGreaterThan(4);
  });

  test.each(routeCards.slice(0, 2))("route card $route has route metadata", (item) => {
    expect(item.route).toBeTruthy();
    expect(item.mode).toBeTruthy();
    expect(item.note).toBeTruthy();
    expect(item.status).toBeTruthy();
  });

  test.each(galleryItems.slice(0, 3))("gallery item has usable image and label %#", (item) => {
    expect(item.image).toMatch(/^(https?:\/\/|\/)/);
    expect(item.alt.length).toBeGreaterThan(3);
  });

  test.each(featuredStays.slice(0, 4))("featured stay $name has public route and image", (stay) => {
    expect(stay.slug).toMatch(/^[a-z0-9-]+$/);
    expect(stay.image).toMatch(/^(https?:\/\/|\/)/);
    expect(stay.gallery.length).toBeGreaterThan(0);
    expect(stay.district).toBeTruthy();
    expect(stay.area).toBeTruthy();
  });

  test.each(foodProviders.slice(0, 4))("food provider $name has public route fields", (provider) => {
    expect(provider.slug).toMatch(/^[a-z0-9-]+$/);
    expect(provider.name).toBeTruthy();
    expect(provider.area).toBeTruthy();
    expect(provider.district).toBeTruthy();
    expect(provider.shortDescription).toBeTruthy();
  });

  test("image dictionary uses real public or remote assets", () => {
    expect(Object.values(images).every((value) => /^(https?:\/\/|\/)/.test(value))).toBe(true);
  });

  test("featured stay slugs are unique", () => {
    const slugs = featuredStays.map((stay) => stay.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("food provider slugs are unique", () => {
    const slugs = foodProviders.map((provider) => provider.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("site copy contracts", () => {
  const copies = [
    ["home", homeCopy],
    ["about", aboutCopy],
    ["hotels", hotelsCopy],
    ["contact", contactCopy],
    ["consulting", consultingCopy],
    ["training", trainingCopy],
    ["faq", faqCopy],
    ["partner", partnerCopy],
    ["roadmap", roadmapCopy],
  ] as const;

  test.each(copies)("%s copy has metadata title", (_name, copy) => {
    expect(copy.metadata?.title || copy.hero?.title).toBeTruthy();
  });

  test("site copy avoids mojibake replacement characters", () => {
    const allCopy = copies.map(([, copy]) => JSON.stringify(copy)).join("\n");
    expect(allCopy).not.toMatch(/Ã|Â|�/);
  });
});
