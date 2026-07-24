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
};
