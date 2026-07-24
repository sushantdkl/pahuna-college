export type PublicFoodProvider = any;

export const foodProviders: PublicFoodProvider[] = [
  { id: "food-1", slug: "4s-cafe", name: "4S Cafe", type: "CAFE", typeLabel: "Cafe", district: "Surkhet", area: "Birendranagar", shortDescription: "Friendly local cafe.", longDescription: "A casual cafe for travelers.", image: "/images/food/cafe-placeholder.svg", images: ["/images/food/cafe-placeholder.svg"], gallery: ["/images/food/cafe-placeholder.svg"], cuisines: ["Cafe", "Snacks"], services: ["Breakfast", "Coffee"], features: ["Family friendly"], priceLevel: "NPR 300 - 900", rating: 4.1, verificationStatus: "PUBLIC_LISTING", googleMapLink: "https://www.openstreetmap.org/search?query=4S%20Cafe%20Surkhet", latitude: 28.602, longitude: 81.634 },
  { id: "food-2", slug: "tuina-coffee-shop", name: "Tuina Coffee Shop", type: "CAFE", typeLabel: "Cafe", district: "Surkhet", area: "Birendranagar", shortDescription: "Coffee and quick bites.", longDescription: "A simple stop for coffee.", image: "/images/food/cafe-placeholder.svg", images: ["/images/food/cafe-placeholder.svg"], gallery: ["/images/food/cafe-placeholder.svg"], cuisines: ["Coffee"], services: ["Coffee"], features: ["Local"], priceLevel: "NPR 250 - 800", rating: 4.0, verificationStatus: "PUBLIC_LISTING", googleMapLink: "https://www.openstreetmap.org/search?query=Tuina%20Coffee%20Surkhet", latitude: 28.603, longitude: 81.632 },
];

export async function getFoodProviders(..._args: any[]) {
  return foodProviders;
}

export async function getFeaturedFoodProviders(..._args: any[]) {
  return foodProviders.slice(0, 6);
}

export async function getFoodProviderBySlug(slug: string, ..._args: any[]) {
  return foodProviders.find((item) => item.slug === slug) ?? null;
}

export function getFoodProviderSlugs() {
  return foodProviders.map((item) => item.slug);
}

export async function getFoodProvidersForTripContext(..._args: any[]) {
  return foodProviders.slice(0, 4);
}

export function canShowFoodDirectContact(_provider: PublicFoodProvider) {
  return true;
}

export function getFoodVerificationBadge(provider: PublicFoodProvider) {
  return provider.verificationLabel ?? "Verified";
}
