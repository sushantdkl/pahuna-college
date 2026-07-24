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
export const budgetTiers = [];
