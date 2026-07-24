export type ConsultingIconName = "briefcase" | "chart" | "hotel" | "training" | string;
export type TrainingIconName = "book" | "certificate" | "hotel" | "users" | string;

export type ConsultingService = {
  slug: string;
  title: string;
  description: string;
  category?: string;
  price?: string;
  duration?: string;
  icon?: ConsultingIconName;
  features?: string[];
  deliverables?: string[];
  isActive?: boolean;
};

export type CaseStudy = {
  title: string;
  client: string;
  challenge: string;
  solution: string;
  results: string[];
};

export type ConsultingTestimonial = {
  name: string;
  role?: string;
  quote: string;
  rating?: number;
};

export type TrainingCourse = {
  slug: string;
  title: string;
  description: string;
  category?: string;
  duration?: string;
  price?: number;
  icon?: TrainingIconName;
  features?: string[];
};

export type TripPackage = {
  slug: string;
  title: string;
  description: string;
  durationDays?: number;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  highlights?: string[];
};

export const consultingProcess = [
  { title: "Discovery Call", description: "Understand your business, challenges, and goals." },
  { title: "Site Assessment", description: "Review operations, service flow, and market position." },
  { title: "Custom Proposal", description: "Define a practical plan with milestones." },
  { title: "Implementation", description: "Support rollout and team enablement." },
];

export const trainingCourses: TrainingCourse[] = [];
export const transportRoutes = [];
export const budgetCategories = [];

export type BudgetTier = "budget" | "standard" | "premium";

export const budgetTiers: Array<{
  id: BudgetTier;
  label: string;
  tagline: string;
  emoji: string;
  perDayMin: number;
  perDayMax: number;
  description: string;
  includes: string[];
}> = [
  {
    id: "budget",
    label: "Budget Traveler",
    tagline: "Smart & simple",
    emoji: "🎒",
    perDayMin: 2000,
    perDayMax: 4000,
    description: "Basic stays, local meals, shared transport, and practical routing.",
    includes: ["Public listings", "Local food", "Shared or road transport"],
  },
  {
    id: "standard",
    label: "Standard Traveler",
    tagline: "Comfort meets value",
    emoji: "🧳",
    perDayMin: 5000,
    perDayMax: 10000,
    description: "Comfortable stays, mixed transport, and more flexible local experiences.",
    includes: ["Comfort stays", "Cafe and restaurant stops", "Jeep or mixed route options"],
  },
  {
    id: "premium",
    label: "Premium Traveler",
    tagline: "Best of Surkhet",
    emoji: "✨",
    perDayMin: 12000,
    perDayMax: 30000,
    description: "Premium stays, guided planning, route buffers, and remote travel support.",
    includes: ["Premium stays", "Private transport planning", "Remote route buffers"],
  },
];

export const costBreakdown = [
  {
    category: "Accommodation",
    emoji: "🏨",
    items: [
      {
        name: "Nightly stay",
        unit: "per night",
        budget: { min: 800, max: 1800 },
        standard: { min: 2500, max: 5500 },
        premium: { min: 8000, max: 18000 },
      },
    ],
  },
  {
    category: "Food & Dining",
    emoji: "🍲",
    items: [
      {
        name: "Meals",
        unit: "per day",
        budget: { min: 600, max: 1200 },
        standard: { min: 1200, max: 2500 },
        premium: { min: 2500, max: 6000 },
      },
    ],
  },
  {
    category: "Local Transport",
    emoji: "🚌",
    items: [
      {
        name: "Route movement",
        unit: "per day",
        budget: { min: 500, max: 1200 },
        standard: { min: 1500, max: 3500 },
        premium: { min: 5000, max: 12000 },
      },
    ],
  },
  {
    category: "Activities & Experiences",
    emoji: "🧭",
    items: [
      {
        name: "Local activities",
        unit: "per day",
        budget: { min: 100, max: 600 },
        standard: { min: 800, max: 2200 },
        premium: { min: 2500, max: 9000 },
      },
    ],
  },
];

export function calculateTripCost(tier: BudgetTier, days: number) {
  const selected = budgetTiers.find((item) => item.id === tier) || budgetTiers[1];
  return {
    min: selected.perDayMin * days,
    max: selected.perDayMax * days,
  };
}

export const demoDestinations = [
  {
    name: "Bulbule Lake",
    slug: "bulbule-lake",
    latitude: 28.5954,
    longitude: 81.6311,
    coverImage: "/images/surkhet/bulbule-lake.jpg",
    category: "lake",
    entryFee: "Free",
    bestSeason: "October - March",
  },
  {
    name: "Kakrebihar",
    slug: "kakrebihar",
    latitude: 28.5768,
    longitude: 81.6255,
    coverImage: "/images/surkhet/kakrebihar.jpg",
    category: "temple",
    entryFee: "Free",
    bestSeason: "Year round",
  },
  {
    name: "Deuti Bajai Temple",
    slug: "deuti-bajai-temple",
    latitude: 28.585,
    longitude: 81.655,
    coverImage: "/images/surkhet/deuti-bajai-2.jpg",
    category: "temple",
    entryFee: "Free",
    bestSeason: "Year round",
  },
  {
    name: "Rara Lake",
    slug: "rara-lake",
    latitude: 29.5297,
    longitude: 82.0889,
    coverImage: "/images/karnali/rara-lake.jpg",
    category: "lake",
    entryFee: "Permit required",
    bestSeason: "October - March",
  },
  {
    name: "Shey Phoksundo Lake",
    slug: "shey-phoksundo-lake",
    latitude: 29.2056,
    longitude: 82.9563,
    coverImage: "/images/karnali/phoksundo-lake.jpg",
    category: "lake",
    entryFee: "Permit required",
    bestSeason: "April - October",
  },
  {
    name: "Gurase View Tower",
    slug: "gurase-view-tower",
    latitude: 28.743,
    longitude: 81.568,
    coverImage: "/images/surkhet/gurase-view-tower.jpg",
    category: "destination",
    entryFee: "Free",
    bestSeason: "Year round",
  },
  {
    name: "Bheri River Bridge",
    slug: "bheri-river-bridge",
    latitude: 28.721,
    longitude: 81.704,
    coverImage: "/images/surkhet/bheri-river-bridge.jpg",
    category: "destination",
    entryFee: "Free",
    bestSeason: "Year round",
  },
  {
    name: "Karnali Stadium",
    slug: "karnali-stadium",
    latitude: 28.603,
    longitude: 81.63,
    coverImage: "/images/surkhet/karnali-stadium.jpg",
    category: "destination",
    entryFee: "Free",
    bestSeason: "Year round",
  },
];

export const demoExperiences = [
  {
    title: "Tharu Cultural Evening",
    slug: "tharu-cultural-evening",
    latitude: 28.61,
    longitude: 81.62,
    coverImage: "/images/experiences/tharu-cultural-evening.jpg",
    priceRange: "NPR 1,500 - 4,000",
    duration: "Evening",
  },
  {
    title: "Paragliding in Surkhet",
    slug: "paragliding-surkhet",
    latitude: 28.63,
    longitude: 81.61,
    coverImage: "/images/experiences/paragliding-surkhet.jpg",
    priceRange: "NPR 5,000 - 9,000",
    duration: "Half day",
  },
  {
    title: "Camping Around Karnali Routes",
    slug: "camping-around-karnali-routes",
    latitude: 28.7,
    longitude: 81.69,
    coverImage: "/images/experiences/camping.jpg",
    priceRange: "NPR 2,500 - 7,000",
    duration: "1-2 days",
  },
  {
    title: "Cycling Around Birendranagar",
    slug: "cycling-around-birendranagar",
    latitude: 28.6,
    longitude: 81.63,
    coverImage: "/images/experiences/cycling.jpg",
    priceRange: "NPR 800 - 2,000",
    duration: "2-4 hours",
  },
];
