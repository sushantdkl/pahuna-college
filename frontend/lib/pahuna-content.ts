export type NavItem = {
  label: string;
  href: string;
};

export type FeatureCard = {
  title: string;
  eyebrow?: string;
  description: string;
  href: string;
  image?: string;
  meta?: string;
};

export type StayCard = {
  name: string;
  type: string;
  area: string;
  district: string;
  priceFrom?: string;
  verified?: boolean;
  publicListing?: boolean;
  amenities: string[];
  image: string;
  googleMapLink?: string;
  latitude?: number;
  longitude?: number;
};

export const navItems: NavItem[] = [
  { label: "Explore Surkhet", href: "/explore" },
  { label: "Stays", href: "/hotels" },
  { label: "Food", href: "/food" },
  { label: "Destinations", href: "/destinations" },
  { label: "Trip Planner", href: "/trip-planner" },
  { label: "Contact", href: "/contact" },
];

export const images = {
  hero: "/images/karnali/karnali-river-2.jpg",
  karnaliHero: "/images/hero/karnali-hero.jpg",
  bulbule: "/images/surkhet/bulbule-lake.jpg",
  kakrebihar: "/images/surkhet/kakrebihar.jpg",
  kakrebiharAlt: "/images/surkhet/kakrebihar-2.jpg",
  deutiBajai: "/images/surkhet/deuti-bajai-2.jpg",
  ghantaghar: "/images/surkhet/ghantaghar-surkhet-4.jpg",
  gurase: "/images/surkhet/gurase-view-tower.jpg",
  stadium: "/images/surkhet/karnali-stadium.jpg",
  bheriBridge: "/images/surkhet/bheri-river-bridge.jpg",
  ranimatta: "/images/surkhet/ranimatta.jpg",
  nightView: "/images/surkhet/surkhet-night-view.jpg",
  rara: "/images/karnali/rara-lake.jpg",
  phoksundo: "/images/karnali/phoksundo-lake.jpg",
  kupinde: "/images/karnali/kupinde-daha.jpg",
  karnaliRiver: "/images/karnali/karnali-river.jpg",
  bheriRiver: "/images/karnali/bheri-river.jpg",
  tharuCulture: "/images/experiences/tharu-cultural-evening.jpg",
  paragliding: "/images/experiences/paragliding-surkhet.jpg",
  camping: "/images/experiences/camping.jpg",
  cycling: "/images/experiences/cycling.jpg",
  horseRiding: "/images/experiences/horse-riding.jpg",
  food: "/images/experiences/tharu-cultural-evening.jpg",
  cafe: "/images/surkhet/ghantaghar-surkhet-5.jpg",
  tea: "/images/karnali/apple-jumla.jpg",
  stay: "/images/surkhet/surkhet-night-view.jpg",
  hotelFallback: "/images/placeholders/stay-placeholder.svg",
  foodFallback: "/images/placeholders/food-placeholder.svg",
  destinationFallback: "/images/placeholders/destination-placeholder.svg",
  routeFallback: "/images/karnali/bheri-corridor-jajarkot.jpg",
};

export function safeImage(image?: string, fallback = images.destinationFallback) {
  return image?.trim() || fallback;
}

export const quickActions: FeatureCard[] = [
  {
    title: "Explore Surkhet",
    description: "Places, routes, stays, food, and local tips from one clean guide.",
    href: "/explore",
    meta: "Main gateway",
  },
  {
    title: "Find a stay",
    description: "Browse hotels, resorts, lodges, homestays, and public listings.",
    href: "/hotels",
    meta: "Stays",
  },
  {
    title: "Find food & cafes",
    description: "Cafes, local restaurants, momo spots, and family food stops.",
    href: "/food",
    meta: "Food",
  },
  {
    title: "Explore destinations",
    description: "Surkhet, Rara, Phoksundo, Dailekh, Jumla, and wider Karnali.",
    href: "/destinations",
    meta: "Places",
  },
  {
    title: "Plan a trip",
    description: "Turn your days, route, and budget into a simple travel plan.",
    href: "/trip-planner",
    meta: "Planner",
  },
  {
    title: "Estimate route/cost",
    description: "Preview route difficulty, transport options, and practical costs.",
    href: "/trip-planner#routes",
    meta: "Cost",
  },
  {
    title: "Send inquiry",
    description: "Ask about availability, routes, food stops, or local support.",
    href: "/contact",
    meta: "Help",
  },
];

export const surkhetPlaces: FeatureCard[] = [
  {
    title: "Bulbule Lake",
    eyebrow: "Lake walk",
    description: "A calm Surkhet stop for family walks, local snacks, and easy evening plans.",
    href: "/explore#bulbule-lake",
    image: images.bulbule,
  },
  {
    title: "Kakrebihar",
    eyebrow: "Culture",
    description: "Historic ruins, forest surroundings, and one of Surkhet's strongest heritage anchors.",
    href: "/explore#kakrebihar",
    image: images.kakrebihar,
  },
  {
    title: "Deuti Bajai",
    eyebrow: "Temple",
    description: "A respected local spiritual site often included in short Surkhet itineraries.",
    href: "/explore#deuti-bajai",
    image: images.deutiBajai,
  },
  {
    title: "Ghantaghar",
    eyebrow: "City icon",
    description: "A simple city landmark for first-time visitors exploring Birendranagar.",
    href: "/explore#ghantaghar",
    image: images.ghantaghar,
  },
  {
    title: "Gurase View Tower",
    eyebrow: "Viewpoint",
    description: "Cooler hill air, long views, and a clean short escape from Surkhet valley.",
    href: "/explore#gurase-view-tower",
    image: images.gurase,
  },
  {
    title: "Bheri River Bridge",
    eyebrow: "Route moment",
    description: "A practical route marker and scenic stop on regional Karnali movement.",
    href: "/explore#bheri-river-bridge",
    image: images.bheriBridge,
  },
];

export const featuredStays: StayCard[] = [
  {
    name: "Valley View Resort",
    type: "Resort",
    area: "Birendranagar",
    district: "Surkhet",
    priceFrom: "Rs. 5,500/night",
    verified: true,
    publicListing: true,
    amenities: ["Parking", "Family rooms", "Restaurant"],
    image: images.nightView,
    googleMapLink: "https://maps.google.com/?q=Birendranagar+Surkhet",
  },
  {
    name: "Bulbule Heritage Inn",
    type: "Hotel",
    area: "Bulbule",
    district: "Surkhet",
    priceFrom: "Rs. 3,800/night",
    verified: true,
    publicListing: true,
    amenities: ["Near lake", "Wi-Fi", "Breakfast"],
    image: images.bulbule,
    googleMapLink: "https://maps.google.com/?q=Bulbule+Lake+Surkhet",
  },
  {
    name: "Kakrebihar Guest House",
    type: "Guest House",
    area: "Latikoili",
    district: "Surkhet",
    priceFrom: "Ask price",
    verified: false,
    publicListing: true,
    amenities: ["Local host", "Quiet area", "Simple rooms"],
    image: images.kakrebiharAlt,
    googleMapLink: "https://maps.google.com/?q=Kakrebihar+Surkhet",
  },
  {
    name: "Gurase Hill Stay",
    type: "Homestay",
    area: "Gurase",
    district: "Dailekh / Surkhet route",
    priceFrom: "Ask availability",
    verified: false,
    publicListing: true,
    amenities: ["Viewpoint", "Tea stop", "Local meals"],
    image: images.gurase,
    googleMapLink: "https://maps.google.com/?q=Gurase+View+Tower",
  },
];

export const foodHighlights: FeatureCard[] = [
  {
    title: "Local thakali & family restaurants",
    eyebrow: "Food",
    description: "Easy meal stops around Birendranagar for travelers before longer routes.",
    href: "/food",
    image: images.food,
  },
  {
    title: "Cafes near the city core",
    eyebrow: "Cafes",
    description: "Coffee, tea, light snacks, and planning breaks before moving onward.",
    href: "/food",
    image: images.cafe,
  },
  {
    title: "Route-side tea and snacks",
    eyebrow: "Local stops",
    description: "Small practical food stops for Gurase, Dailekh, and longer road journeys.",
    href: "/food",
    image: images.tea,
  },
];

export const destinations: FeatureCard[] = [
  {
    title: "Rara Lake",
    eyebrow: "Mugu",
    description: "A dream Karnali destination that needs planning, buffer days, and confirmed logistics.",
    href: "/destinations#rara",
    image: images.rara,
  },
  {
    title: "Shey Phoksundo",
    eyebrow: "Dolpa",
    description: "A remote blue lake experience for travelers ready for tougher logistics.",
    href: "/destinations#phoksundo",
    image: images.phoksundo,
  },
  {
    title: "Kupinde Daha",
    eyebrow: "Salyan",
    description: "A peaceful lake extension from Surkhet for flexible regional plans.",
    href: "/destinations#kupinde",
    image: images.kupinde,
  },
];

export const routeCards = [
  {
    route: "Kathmandu to Surkhet",
    mode: "Flight or road",
    note: "Best entry route for first-time Karnali travelers.",
    status: "Confirm schedule",
  },
  {
    route: "Surkhet to Rara",
    mode: "Road / jeep mix",
    note: "Plan buffer days for road, weather, and overnight stops.",
    status: "Season dependent",
  },
  {
    route: "Surkhet to Dailekh",
    mode: "Road",
    note: "Useful short cultural extension from Surkhet.",
    status: "Moderate",
  },
  {
    route: "Surkhet to Dolpa / Phoksundo",
    mode: "Flight / road mix",
    note: "Remote route with operator and weather dependency.",
    status: "Needs confirmation",
  },
];

export const galleryItems = [
  { title: "Bulbule Lake", category: "Surkhet", image: images.bulbule, alt: "Bulbule Lake in Surkhet" },
  { title: "Kakrebihar ruins", category: "Surkhet", image: images.kakrebihar, alt: "Kakrebihar heritage site" },
  { title: "Gurase View Tower", category: "Surkhet", image: images.gurase, alt: "Gurase viewpoint and tower" },
  { title: "Bheri River Bridge", category: "Surkhet", image: images.bheriBridge, alt: "Bheri River Bridge near Surkhet" },
  { title: "Rara Lake", category: "Karnali", image: images.rara, alt: "Rara Lake in Karnali" },
  { title: "Phoksundo Lake", category: "Karnali", image: images.phoksundo, alt: "Phoksundo Lake in Dolpa" },
  { title: "Karnali River", category: "Karnali", image: images.karnaliRiver, alt: "Karnali River landscape" },
  { title: "Tharu Cultural Evening", category: "Culture", image: images.tharuCulture, alt: "Tharu cultural performance" },
  { title: "Camping routes", category: "Adventure", image: images.camping, alt: "Camping experience in Karnali" },
];
