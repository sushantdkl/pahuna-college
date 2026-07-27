export const SITE_CONFIG = {
  name: "Pahuna",
  title: "Pahuna - Karnali Stays, Food and Experiences",
  tagline: "Karnali Awaits",
  description: "Integrated tourism platform for Surkhet and Karnali.",
  url: "https://pahuna.com",
  email: "hello@pahuna.com",
  phone: "+977-083-520000",
  address: "Birendranagar, Surkhet, Karnali Province, Nepal",
  socials: { facebook: "#", instagram: "#", twitter: "#" },
  social: { facebook: "#", instagram: "#", twitter: "#" },
};

const option = (value: string, label = value) => ({ value, label });

export const EXPERIENCE_CATEGORIES = [
  { value: "ADVENTURE", label: "Adventure" },
  { value: "CULTURE", label: "Culture" },
  { value: "NATURE", label: "Nature" },
  { value: "FOOD", label: "Food & Dining" },
  { value: "WELLNESS", label: "Wellness" },
  { value: "RELIGIOUS", label: "Religious & Spiritual" },
  { value: "SHOPPING", label: "Shopping" },
  { value: "NIGHTLIFE", label: "Nightlife" },
  { value: "HERITAGE", label: "Heritage" },
  { value: "EVENTS", label: "Events & Festivals" },
];
export const PROPERTY_TYPES = ["Hotel", "Resort", "Homestay", "Guest House", "Apartment", "Eco Lodge"].map((item) => option(item));
export const PRICE_RANGES = [
  { value: "budget", label: "Budget", min: 0, max: 4000 },
  { value: "standard", label: "Standard", min: 4000, max: 10000 },
  { value: "premium", label: "Premium", min: 10000, max: 25000 },
  { value: "luxury", label: "Luxury", min: 25000, max: null },
];
export const PROVIDER_TYPES = ["Hotel", "Resort", "Homestay", "Guest House", "Cafe", "Restaurant"].map((item) => option(item.toUpperCase().replace(/\s+/g, "_"), item));
export const BUSINESS_TYPES = ["Hotel", "Restaurant", "Cafe", "Travel Agency", "Training Institute", "Other"].map((item) => option(item.toLowerCase().replace(/\s+/g, "-"), item));
export const BUSINESS_STAGES = ["Idea", "Launch", "Growth", "Expansion"].map((item) => option(item.toLowerCase(), item));
export const CONSULTING_GOALS = ["Branding", "Operations", "Revenue", "Guest Experience", "Staff Training"].map((item) => option(item.toLowerCase().replace(/\s+/g, "-"), item));
export const CONSULTING_SERVICES = ["Hotel Setup & Launch", "Operations Consulting", "Menu & Pricing", "Training & Staff"];
export const PROJECT_TIMELINES = ["Immediately", "1-3 months", "3-6 months", "Flexible"].map((item) => option(item.toLowerCase().replace(/\s+/g, "-"), item));
export const KARNALI_DISTRICTS = ["Surkhet", "Dailekh", "Mugu", "Jumla", "Dolpa", "Kalikot", "Humla"];
export const STAR_RATINGS = [1, 2, 3, 4, 5];
