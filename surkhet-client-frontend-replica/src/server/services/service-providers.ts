export type PublicServiceProvider = any;

export const serviceProviders: PublicServiceProvider[] = [
  { id: "stay-1", slug: "hotel-suva", name: "Hotel Suva", type: "HOTEL", propertyType: "HOTEL", typeLabel: "Hotel", district: "Surkhet", area: "Birendranagar", address: "Birendranagar, Surkhet", shortDesc: "Comfortable city hotel in Surkhet.", shortDescription: "Comfortable city hotel in Surkhet.", longDescription: "A practical stay base for Surkhet and Karnali trips.", priceFrom: 2500, currency: "NPR", rating: 4.2, verificationStatus: "VERIFIED", consentStatus: "APPROVED", featured: true, isFeatured: true, amenities: ["Wi-Fi", "Parking"], services: ["Rooms", "Food"], images: ["/images/placeholders/stay-placeholder.svg"], googleMapLink: "https://www.openstreetmap.org/search?query=Hotel%20Suva%20Surkhet", latitude: 28.6019, longitude: 81.6339 },
  { id: "stay-2", slug: "siddhartha-sunny-resort", name: "Siddhartha Sunny Resort", type: "RESORT", propertyType: "RESORT", typeLabel: "Resort", district: "Surkhet", area: "Birendranagar", address: "Surkhet", shortDesc: "Resort stay with local access.", shortDescription: "Resort stay with local access.", longDescription: "A comfortable resort option.", priceFrom: 6100, currency: "NPR", rating: 4.4, verificationStatus: "VERIFIED", consentStatus: "APPROVED", featured: true, isFeatured: true, amenities: ["Garden", "Restaurant"], services: ["Rooms"], images: ["/images/placeholders/stay-placeholder.svg"], googleMapLink: "https://www.openstreetmap.org/search?query=Siddhartha%20Sunny%20Resort", latitude: 28.59, longitude: 81.62 },
];

export async function getServiceProviders(..._args: any[]) {
  return serviceProviders;
}

export async function getFeaturedServiceProviders(..._args: any[]) {
  return serviceProviders.filter((item) => item.featured);
}

export async function getProvidersByDistrict(district: string) {
  return serviceProviders.filter((item) => item.district.toLowerCase() === district.toLowerCase());
}

export async function getServiceProviderBySlug(slug: string, ..._args: any[]) {
  return serviceProviders.find((item) => item.slug === slug) ?? null;
}

export function getServiceProviderSlugs() {
  return serviceProviders.map((item) => item.slug);
}

export function canShowDirectContact(_provider: PublicServiceProvider) {
  return true;
}

export function getVerificationBadge(provider: PublicServiceProvider) {
  return provider.verificationLabel ?? "Verified";
}

export function isStayProviderType(type?: string) {
  return ["HOTEL", "RESORT", "HOMESTAY", "GUEST_HOUSE", "LODGE"].includes(String(type ?? "").toUpperCase());
}
