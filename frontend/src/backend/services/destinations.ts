export type PublicDestination = {
  id?: string;
  slug: string;
  name: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  district?: string;
  category?: string;
  difficulty?: string;
  image?: string;
  images?: string[];
  latitude?: number;
  longitude?: number;
  bestSeason?: string;
  estimatedCost?: string;
  duration?: string;
};
