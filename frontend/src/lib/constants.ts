export const SITE_CONFIG = {
  name: "Pahuna",
  tagline: "Karnali Awaits",
  description:
    "Pahuna is Nepal's first integrated tourism platform for Karnali Province. Premium stays, authentic experiences, B2B consulting and hospitality training.",
  phone: "+977-083-520000",
  email: "hello@pahuna.com",
  address: "Birendranagar, Surkhet, Karnali Province, Nepal",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
  },
};

export const PRICE_RANGES = [
  { label: "Budget", value: "budget", min: 0, max: 2500 },
  { label: "Standard", value: "standard", min: 2500, max: 8000 },
  { label: "Premium", value: "premium", min: 8000, max: 30000 },
];

export const PROVIDER_TYPES = ["Hotel", "Resort", "Guest House", "Lodge", "Homestay"];
export const PROPERTY_TYPES = PROVIDER_TYPES;
export const EXPERIENCE_CATEGORIES = [
  "Adventure",
  "Culture",
  "Nature",
  "Food & Dining",
  "Religious & Spiritual",
  "Shopping",
  "Nightlife",
  "Parks & Relax",
];

export const BUSINESS_TYPES = ["Hotel", "Restaurant", "Travel Agency", "Training Partner", "Other"];
export const BUSINESS_STAGES = ["Idea", "Startup", "Growing", "Established"];
export const COURSE_INTERESTS = ["Basic Training", "Operations", "Front Office", "Food Safety"];
