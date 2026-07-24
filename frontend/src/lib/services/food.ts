import { foodProviders } from "../../../lib/pahuna-content";

export type PublicFoodProvider = {
  id?: string;
  slug: string;
  name: string;
  type?: string;
  area?: string;
  district?: string;
  address?: string;
  shortDescription?: string;
  cuisines?: string[];
  services?: string[];
  priceLevel?: string;
  image?: string;
  images?: string[];
  latitude?: number;
  longitude?: number;
  featured?: boolean;
  active?: boolean;
  features?: string[];
  typeLabel?: string;
  rating?: number;
  verificationStatus?: string;
};

export async function getFeaturedFoodProviders(limit = 3): Promise<PublicFoodProvider[]> {
  return foodProviders
    .filter((provider) => provider.featured !== false)
    .slice(0, limit)
    .map((provider) => ({
      ...provider,
      images: provider.gallery?.length ? provider.gallery : [provider.image],
    }));
}
