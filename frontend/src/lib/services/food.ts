export type PublicFoodProvider = any;

const cafeImage = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80";
const coffeeShopImage = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80";

export const foodProviders: PublicFoodProvider[] = [
  { id: "food-1", slug: "4s-cafe", name: "4S Cafe", type: "CAFE", typeLabel: "Cafe", district: "Surkhet", area: "Birendranagar", shortDescription: "Friendly local cafe.", longDescription: "A casual cafe for travelers.", image: cafeImage, images: [cafeImage], gallery: [cafeImage], cuisines: ["Cafe", "Snacks"], services: ["Breakfast", "Coffee"], features: ["Family friendly"], priceLevel: "NPR 300 - 900", rating: 4.1, verificationStatus: "PUBLIC_LISTING", googleMapLink: "https://www.openstreetmap.org/search?query=4S%20Cafe%20Surkhet", latitude: 28.602, longitude: 81.634 },
  { id: "food-2", slug: "tuina-coffee-shop", name: "Tuina Coffee Shop", type: "CAFE", typeLabel: "Cafe", district: "Surkhet", area: "Birendranagar", shortDescription: "Coffee and quick bites.", longDescription: "A simple stop for coffee.", image: coffeeShopImage, images: [coffeeShopImage], gallery: [coffeeShopImage], cuisines: ["Coffee"], services: ["Coffee"], features: ["Local"], priceLevel: "NPR 250 - 800", rating: 4.0, verificationStatus: "PUBLIC_LISTING", googleMapLink: "https://www.openstreetmap.org/search?query=Tuina%20Coffee%20Surkhet", latitude: 28.603, longitude: 81.632 },
];

export async function getFoodProviders(..._args) {
  return foodProviders;
}

export async function getFeaturedFoodProviders(..._args) {
  return foodProviders.slice(0, 6);
}

export async function getFoodProviderBySlug(slug: string, ..._args) {
  return foodProviders.find((item) => item.slug === slug) ?? null;
}

export function getFoodProviderSlugs() {
  return foodProviders.map((item) => item.slug);
}

export async function getFoodProvidersForTripContext(..._args) {
  return foodProviders.slice(0, 4);
}

export function canShowFoodDirectContact(_provider: PublicFoodProvider) {
  return true;
}

export function getFoodVerificationBadge(provider: PublicFoodProvider) {
  return provider.verificationLabel ?? "Verified";
}
