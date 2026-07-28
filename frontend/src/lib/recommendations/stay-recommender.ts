export const DESTINATION_DISTRICTS = ["Surkhet", "Dailekh", "Mugu", "Jumla", "Dolpa"];
export const DESTINATION_INTERESTS = ["City base", "Lake", "Temple", "Remote route"];
export const LOCATION_PREFERENCES = ["Central", "Quiet", "Near bus park", "Near destination"];
export const STAY_PREFERENCES = ["budget", "standard", "premium", "homestay"];
export const TRAVEL_TYPES = ["solo", "couple", "family", "friends", "business"];
export const REQUIRED_AMENITIES = ["Wi-Fi", "Parking", "Restaurant", "Hot shower"];

export type StayRecommenderResponse = {
  recommendations: Array<{
    id?: string;
    rank?: number;
    name: string;
    slug: string;
    type: string;
    verificationLabel: string;
    rating?: number;
    contactLabel?: string;
    district?: string;
    area?: string;
    aiExplanation?: string;
    matchedReasons?: string[];
    missingInfoWarnings?: string[];
    ctas?: { viewDetails: string; inquiry?: string };
    priceFrom?: number | null;
    currency: string;
    bestFor: string[];
    reasons?: string[];
    score?: number;
  }>;
  summary?: string;
  disclaimer?: string;
  warnings?: string[];
};
