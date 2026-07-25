export type TrainingIconName = string;
export type ConsultingIconName = string;
export type TrainingCourse = any;
export type ConsultingService = any;
export type CaseStudy = any;
export type ConsultingTestimonial = any;
export type TripPackage = any;
export type RoadmapPhase = any;

export const demoBlogPosts: any[] = [
  { slug: "why-surkhet-should-be-your-next-destination", title: "Why Surkhet Should Be Your Next Destination", excerpt: "Plan a practical Surkhet visit.", category: "Travel Guide", tags: ["Surkhet"], image: "/images/placeholders/hero-placeholder.svg", publishedAt: "2026-01-01", readTime: "5 min read", author: "Pahuna Team", content: "Surkhet is the practical gateway to Karnali." },
  { slug: "things-to-do-in-birendranagar", title: "10 Things to Do in Birendranagar", excerpt: "Local places and experiences.", category: "Things to Do", tags: ["Birendranagar"], image: "/images/placeholders/hero-placeholder.svg", publishedAt: "2026-01-02", readTime: "4 min read", author: "Pahuna Team", content: "Explore lakes, temples, cafes, and viewpoints." },
];
export const getBlogPostSlugs = () => demoBlogPosts.map((post) => post.slug);

export const demoExperiences: any[] = [
  { id: "exp-1", slug: "surkhet-hike-to-deuti-bajai", title: "Surkhet Hike to Deuti Bajai", name: "Surkhet Hike to Deuti Bajai", category: "Culture", image: "/images/surkhet/deuti-bajai.jpg", location: "Surkhet", duration: "2 hrs", price: "NPR 1,500", shortDescription: "Temple visit with local context.", description: "A guided cultural stop in Surkhet.", latitude: 28.58, longitude: 81.63, featured: true },
  { id: "exp-2", slug: "traditional-tharu-cultural-evening", title: "Traditional Tharu Cultural Evening", name: "Traditional Tharu Cultural Evening", category: "Culture", image: "/images/experiences/tharu-cultural-evening.jpg", location: "Surkhet", duration: "2 hrs", price: "NPR 2,000", shortDescription: "Food, music, and cultural hosting.", description: "A cultural evening experience.", latitude: 28.6, longitude: 81.62, featured: true },
];

export const demoDestinations: any[] = [
  { id: "bulbule", slug: "bulbule-tal", name: "Bulbule Tal", title: "Bulbule Tal", district: "Surkhet", category: "Lake", categoryLabel: "Lake", difficulty: "Easy", difficultyLabel: "Easy", image: "/images/surkhet/bulbule-lake.jpg", coverImage: "/images/surkhet/bulbule-lake.jpg", gallery: ["/images/surkhet/bulbule-lake.jpg"], shortDescription: "Urban lake and local gathering spot.", description: "A calm Surkhet anchor.", latitude: 28.6, longitude: 81.63, featured: true, attractions: ["Lake walk", "Local food"], bestSeason: "All year" },
  { id: "deuti", slug: "deuti-bajai-temple", name: "Deuti Bajai Temple", title: "Deuti Bajai Temple", district: "Surkhet", category: "Temple", categoryLabel: "Temple", difficulty: "Easy", difficultyLabel: "Easy", image: "/images/surkhet/deuti-bajai.jpg", coverImage: "/images/surkhet/deuti-bajai.jpg", gallery: ["/images/surkhet/deuti-bajai.jpg"], shortDescription: "Important religious site near Birendranagar.", description: "A popular temple stop.", latitude: 28.58, longitude: 81.64, featured: true, attractions: ["Temple", "Culture"], bestSeason: "All year" },
  { id: "rara", slug: "rara-lake", name: "Rara Lake", title: "Rara Lake", district: "Mugu", category: "Lake", categoryLabel: "Lake", difficulty: "Moderate", difficultyLabel: "Moderate", image: "/images/karnali/rara-lake.jpg", coverImage: "/images/karnali/rara-lake.jpg", gallery: ["/images/karnali/rara-lake.jpg"], shortDescription: "Highland lake destination.", description: "Karnali's iconic lake journey.", latitude: 29.53, longitude: 82.09, featured: true, attractions: ["Lake", "Highlands"], bestSeason: "October - March" },
];

export const demoItineraries: any[] = [
  {
    slug: "surkhet-essentials-3-days",
    title: "Surkhet Essentials - 3 Days",
    summary: "Temples, lakes, heritage sites, and local cuisine.",
    shortDesc: "A practical three-day Surkhet introduction.",
    description: "The perfect introduction to Surkhet covering temples, lakes, heritage sites, and local cuisine.",
    duration: "3 Days",
    durationDays: 3,
    difficulty: "Easy",
    estimatedCost: "NPR 8,000 - 12,000",
    groupSize: "2 - 8 people",
    priceFrom: 8000,
    image: "/images/surkhet/bulbule-lake.jpg",
    stops: demoDestinations.slice(0, 2),
    highlights: ["Bulbule Lake", "Kakrebihar", "Local food"],
    bestSeason: "October - March",
    days: [
      { dayNumber: 1, title: "Arrive in Birendranagar", description: "Settle in and explore nearby food stops.", activities: ["Check in", "Local cafe walk"], meals: "Dinner", overnight: "Birendranagar", latitude: 28.602, longitude: 81.634 },
      { dayNumber: 2, title: "Bulbule Lake and Kakrebihar", description: "Visit Surkhet’s key anchors.", activities: ["Bulbule Lake", "Kakrebihar", "Local lunch"], meals: "Breakfast, lunch", overnight: "Birendranagar", latitude: 28.6, longitude: 81.63 },
      { dayNumber: 3, title: "Temple and viewpoint loop", description: "Close with Deuti Bajai and short city stops.", activities: ["Deuti Bajai Temple", "Shopping", "Departure"], meals: "Breakfast", overnight: "Optional", latitude: 28.58, longitude: 81.64 },
    ],
  },
  {
    slug: "karnali-gateway-5-days",
    title: "Karnali Gateway - 5 Days",
    summary: "Extended Surkhet and Karnali route context.",
    shortDesc: "A five-day gateway plan from Surkhet.",
    description: "Extended exploration of Surkhet and surrounding areas with deeper cultural and nature immersion.",
    duration: "5 Days",
    durationDays: 5,
    difficulty: "Moderate",
    estimatedCost: "NPR 15,000 - 28,000",
    groupSize: "2 - 6 people",
    priceFrom: 15000,
    image: "/images/surkhet/surkhet-night-view.jpg",
    stops: demoDestinations,
    highlights: ["Surkhet", "Dailekh", "Rara"],
    bestSeason: "October - April",
    days: [
      { dayNumber: 1, title: "Surkhet arrival", description: "Prepare route and stay in Birendranagar.", activities: ["Arrival", "Route briefing"], meals: "Dinner", overnight: "Birendranagar", latitude: 28.602, longitude: 81.634 },
      { dayNumber: 2, title: "Surkhet anchors", description: "Explore lake, temple, and food stops.", activities: ["Bulbule", "Deuti Bajai", "Local food"], meals: "Breakfast, lunch", overnight: "Birendranagar", latitude: 28.6, longitude: 81.63 },
      { dayNumber: 3, title: "Dailekh route", description: "Travel toward Dailekh with heritage stops.", activities: ["Road journey", "Local market"], meals: "Breakfast", overnight: "Dailekh", latitude: 28.84, longitude: 81.71 },
      { dayNumber: 4, title: "Karnali highland context", description: "Build toward remote Karnali route planning.", activities: ["Viewpoints", "Route planning"], meals: "Breakfast", overnight: "Route stay", latitude: 29.1, longitude: 81.9 },
      { dayNumber: 5, title: "Return to Surkhet", description: "Return with buffer for road conditions.", activities: ["Return drive", "Departure"], meals: "Breakfast", overnight: "Optional", latitude: 28.602, longitude: 81.634 },
    ],
  },
];
export const getItinerarySlugs = () => demoItineraries.map((item) => item.slug);

export const tripPackages: any[] = [
  {
    id: "package-1",
    slug: "surkhet-city-package",
    title: "Surkhet City Package",
    name: "Surkhet City Package",
    shortDesc: "A compact city package for Surkhet.",
    description: "A practical package covering Surkhet stays, local food, heritage stops, and a guided Birendranagar loop.",
    duration: "2 Days",
    tier: "standard",
    priceFrom: 8000,
    pricePerPerson: { min: 8000, max: 12000 },
    groupSize: "2 - 8 people",
    bestSeason: "October - March",
    costSplit: { accommodation: 40, food: 25, transport: 20, activities: 10, misc: 5 },
    image: "/images/surkhet/bulbule-lake.jpg",
    highlights: ["Comfortable stay", "Local food", "Guided Surkhet loop"],
    inclusions: ["Hotel", "Breakfast", "Local guide"],
    days: [
      { dayNumber: 1, title: "Arrival and city food walk", highlights: ["Check in", "Bulbule Lake", "Local dinner"], meals: "Dinner", overnight: "Birendranagar", latitude: 28.602, longitude: 81.634 },
      { dayNumber: 2, title: "Temple and heritage loop", highlights: ["Deuti Bajai Temple", "Kakrebihar", "Departure support"], meals: "Breakfast", overnight: "Optional", latitude: 28.58, longitude: 81.64 },
    ],
    itinerary: [{ day: 1, title: "Arrival", description: "Explore Birendranagar." }],
  },
];
export const getPackageSlugs = () => tripPackages.map((item) => item.slug);

export const transportRoutes: any[] = [{ from: "Kathmandu", to: "Surkhet", mode: "Flight", duration: "1 hr", costFrom: 8500, frequency: "Daily" }];
export const tourismRoadmap: any[] = [
  { phase: "1", title: "Explore Surkhet", timeline: "Now", status: "completed", description: "Start with local anchors across Surkhet.", deliverables: ["Public Surkhet guide", "Stay listings", "Food listings", "Route context"] },
  { phase: "2", title: "Karnali Route Planning", timeline: "In progress", status: "in-progress", description: "Build route and cost context for key Karnali journeys.", deliverables: ["Route estimator", "Trip planner", "Map sections", "Inquiry flow"] },
  { phase: "3", title: "Partner Network", timeline: "Upcoming", status: "upcoming", description: "Grow verified hospitality and tourism partners.", deliverables: ["Partner applications", "Training links", "Consulting leads"] },
];
export const faqItems: any[] = [{ question: "Where is Pahuna focused?", answer: "Surkhet and Karnali Province." }];

export const consultingServices: any[] = [
  {
    id: "consulting-1",
    slug: "hotel-setup-launch",
    title: "Hotel Setup & Launch",
    name: "Hotel Setup & Launch",
    tagline: "Open confidently with a clear operating plan.",
    icon: "Hotel",
    category: "Launch",
    isFeatured: true,
    shortDesc: "Complete launch planning.",
    shortDescription: "Complete launch planning.",
    description: "Support for hospitality setup, branding, operations, staffing, and launch planning for new properties.",
    features: [
      { title: "Brand & Market Setup", description: "Positioning, guest segment, pricing, and service promise." },
      { title: "Operations Blueprint", description: "Room, front desk, housekeeping, kitchen, and guest-flow setup." },
    ],
    deliverables: [
      { title: "Launch Plan", items: ["Brand checklist", "Opening timeline", "Staffing plan"] },
      { title: "Operations Kit", items: ["SOP outline", "Guest journey map", "Vendor checklist"] },
    ],
    idealFor: ["New hotels", "Homestays", "Boutique resorts"],
    priceFrom: 25000,
    startingPrice: "NPR 25,000",
    duration: "2 weeks",
    color: "emerald",
  },
  {
    id: "consulting-2",
    slug: "operations-consulting",
    title: "Operations Consulting",
    name: "Operations Consulting",
    tagline: "Improve daily service and team coordination.",
    icon: "Building2",
    category: "Operations",
    isFeatured: true,
    shortDesc: "Improve service flow.",
    shortDescription: "Improve service flow.",
    description: "Practical operations support for existing hotels, cafes, restaurants, and tourism operators.",
    features: [
      { title: "SOP Review", description: "Audit current guest-facing workflows and improve team handoffs." },
      { title: "Service Training", description: "Build practical routines for consistent guest experience." },
    ],
    deliverables: [
      { title: "Operations Checklist", items: ["Daily checklist", "Service recovery notes", "Team role map"] },
      { title: "Improvement Roadmap", items: ["Priority actions", "Timeline", "Measurement plan"] },
    ],
    idealFor: ["Hotels", "Cafes", "Restaurants"],
    priceFrom: 18000,
    startingPrice: "NPR 18,000",
    duration: "1 week",
    color: "blue",
  },
];
export const getServiceSlugs = () => consultingServices.map((item) => item.slug);
export const getServiceBySlug = (slug: string) => consultingServices.find((item) => item.slug === slug);
export const consultingProcess: any[] = [{ title: "Discovery Call", description: "Understand goals.", duration: "30 min" }, { title: "Proposal", description: "Action plan.", duration: "3 days" }];
export const consultingStats: any[] = [{ label: "Businesses served", value: "40+" }, { label: "Satisfaction", value: "92%" }];
export const caseStudies: any[] = [
  {
    id: "case-1",
    clientName: "Hotel Karnali View",
    businessType: "Hotel",
    location: "Birendranagar, Surkhet",
    duration: "6 weeks",
    challenge: "Improve operations and guest communication.",
    solution: "Created SOPs, front desk scripts, and pricing recommendations.",
    results: [
      { metric: "Occupancy Lift", value: "42%" },
      { metric: "Repeat Guests", value: "+28%" },
    ],
    testimonial: { quote: "Pahuna helped us focus on what guests actually notice.", author: "Suman Budha", role: "Owner" },
  },
];
export const consultingTestimonials: any[] = [
  { id: "testimonial-1", author: "Suman Budha", role: "Owner", company: "Hotel Karnali View", quote: "Practical, local, and easy to implement.", rating: 5 },
];
export const getCaseStudiesForService = (_slug: string) => caseStudies;
export const getTestimonialsForService = (_slug: string) => consultingTestimonials;

export const trainingCourses: any[] = [
  {
    id: "course-1",
    slug: "professional-barista-training",
    title: "Professional Barista Training",
    name: "Professional Barista Training",
    icon: "Coffee",
    color: "amber",
    isFeatured: true,
    isUpcoming: true,
    category: "Food & Beverage",
    level: "Beginner",
    mode: "In-person",
    duration: "2 weeks",
    fee: 12000,
    price: 12000,
    priceFrom: 12000,
    maxStudents: 16,
    schedule: "Morning / Evening",
    batchInfo: "Next batch opens soon",
    tagline: "Master espresso, service, and cafe workflow.",
    shortDesc: "Hands-on coffee and cafe service training.",
    shortDescription: "Hands-on coffee training.",
    description: "Learn cafe service, coffee basics, espresso preparation, and guest handling.",
    modules: [
      { title: "Coffee Basics", duration: "3 days", topics: ["Beans and grind", "Espresso basics", "Milk steaming"] },
      { title: "Cafe Service", duration: "4 days", topics: ["Guest greeting", "Order flow", "Clean counter routine"] },
    ],
    instructor: { name: "Pahuna Trainer", title: "Hospitality Instructor", bio: "Experienced trainer focused on practical cafe service.", experience: "6+ years", specialties: ["Coffee", "Service", "Operations"] },
    certification: "Certificate of completion from Pahuna Training Academy.",
    careerOutcomes: [{ role: "Barista", description: "Cafe counter and coffee preparation roles." }, { role: "Cafe Assistant", description: "Service and guest handling support." }],
    faqs: [{ question: "Do I need experience?", answer: "No. This course is beginner friendly." }],
    outcomes: ["Coffee basics"],
  },
  {
    id: "course-2",
    slug: "hotel-management-fundamentals",
    title: "Hotel Management Fundamentals",
    name: "Hotel Management Fundamentals",
    icon: "Hotel",
    color: "blue",
    isFeatured: true,
    isUpcoming: true,
    category: "Hotel",
    level: "Beginner",
    mode: "In-person",
    duration: "4 weeks",
    fee: 18000,
    price: 18000,
    priceFrom: 18000,
    maxStudents: 20,
    schedule: "Weekday",
    batchInfo: "Limited seats",
    tagline: "Learn hotel operations from front desk to guest care.",
    shortDesc: "Hotel operations basics.",
    shortDescription: "Hotel operations basics.",
    description: "Learn hospitality operations, front desk communication, guest service, and team routines.",
    modules: [
      { title: "Front Desk", duration: "1 week", topics: ["Check-in", "Guest communication", "Records"] },
      { title: "Guest Service", duration: "1 week", topics: ["Housekeeping coordination", "Service recovery", "Guest feedback"] },
    ],
    instructor: { name: "Pahuna Trainer", title: "Hotel Operations Coach", bio: "Practical hotel operations and service trainer.", experience: "8+ years", specialties: ["Front desk", "Housekeeping", "Guest service"] },
    certification: "Certificate of completion from Pahuna Training Academy.",
    careerOutcomes: [{ role: "Front Desk Assistant", description: "Support check-in and guest communication." }, { role: "Operations Assistant", description: "Help coordinate daily hotel routines." }],
    faqs: [{ question: "Is placement support available?", answer: "Career guidance is included." }],
    outcomes: ["Front desk"],
  },
];
export const getCourseSlugs = () => trainingCourses.map((item) => item.slug);
export const getCourseBySlug = (slug: string, ..._args) => trainingCourses.find((item) => item.slug === slug);
export const getFeaturedCourses = () => trainingCourses.filter((course) => course.isFeatured);
export const getRelatedCourses = (slug: string, limit = 3) => trainingCourses.filter((course) => course.slug !== slug).slice(0, limit);
export const getTestimonialsForCourse = (_slug: string) => studentTestimonials;
export const trainingStats: any[] = [{ label: "Students", value: "500+" }, { label: "Placement", value: "92%" }];
export const enrollmentProcess: any[] = [{ title: "Apply", description: "Submit course interest." }, { title: "Start Training", description: "Join practical sessions." }];
export const studentTestimonials: any[] = [{ name: "Anu", quote: "Training helped my career.", rating: 5 }];
export const generalFAQs: any[] = [{ question: "Do I need experience?", answer: "No, beginner courses are available." }];

export type BudgetTier = any;
export const budgetTiers: BudgetTier[] = [
  { id: "budget", value: "budget", emoji: "🎒", label: "Budget Traveler", tagline: "Smart & simple", description: "Simple local stays and practical route support.", includes: ["Basic stay", "Local meals", "Shared transport", "Essential route guidance"], perDayMin: 2000, perDayMax: 4000, range: "NPR 2,000 - 4,000" },
  { id: "standard", value: "standard", emoji: "🧳", label: "Standard Traveler", tagline: "Comfort meets value", description: "Balanced comfort, reliable stays, and guided local planning.", includes: ["Comfort stay", "Restaurant meals", "Private/local transport mix", "Guided city loop"], perDayMin: 5000, perDayMax: 10000, range: "NPR 5,000 - 10,000" },
  { id: "premium", value: "premium", emoji: "✨", label: "Premium Traveler", tagline: "Best of Surkhet", description: "Higher-comfort stays, private support, and curated experiences.", includes: ["Premium stay", "Curated dining", "Private transport", "Custom guide support"], perDayMin: 12000, perDayMax: 30000, range: "NPR 12,000 - 30,000" },
];

export const calculateTripCost = (tierId: string, days: number) => {
  const tier = budgetTiers.find((item) => item.id === tierId) ?? budgetTiers[1];
  return { min: tier.perDayMin * days, max: tier.perDayMax * days };
};

export const costBreakdown = [
  {
    emoji: "🏨",
    category: "Accommodation",
    items: [
      { name: "Budget stay", unit: "per night", budget: { min: 1200, max: 2500 }, standard: { min: 2500, max: 6500 }, premium: { min: 8000, max: 18000 } },
      { name: "Highland lodge", unit: "per night", budget: { min: 1500, max: 3000 }, standard: { min: 3500, max: 8000 }, premium: { min: 10000, max: 22000 } },
    ],
  },
  {
    emoji: "🍲",
    category: "Food & Dining",
    items: [
      { name: "Breakfast", unit: "per meal", budget: { min: 200, max: 400 }, standard: { min: 400, max: 800 }, premium: { min: 900, max: 1600 } },
      { name: "Dinner", unit: "per meal", budget: { min: 400, max: 800 }, standard: { min: 900, max: 1800 }, premium: { min: 2000, max: 4000 } },
    ],
  },
  {
    emoji: "🚌",
    category: "Local Transport",
    items: [
      { name: "Within Birendranagar", unit: "per trip", budget: { min: 300, max: 800 }, standard: { min: 900, max: 1800 }, premium: { min: 2500, max: 6000 } },
      { name: "Jeep to nearby stop", unit: "per day", budget: { min: 2500, max: 5000 }, standard: { min: 6000, max: 12000 }, premium: { min: 14000, max: 25000 } },
    ],
  },
  {
    emoji: "🧭",
    category: "Activities",
    items: [
      { name: "Guided tour", unit: "per activity", budget: { min: 500, max: 1200 }, standard: { min: 1500, max: 3500 }, premium: { min: 5000, max: 12000 } },
      { name: "Entry fees", unit: "per person", budget: { min: 100, max: 300 }, standard: { min: 300, max: 800 }, premium: { min: 1000, max: 2500 } },
    ],
  },
];

export {
  getDestinationSlugs,
  getDestinationDistricts,
  toDistrictSlug,
} from "./destinations";
export {
  serviceProviders,
  getServiceProviders,
  getFeaturedServiceProviders,
  getServiceProviderBySlug,
  getServiceProviderSlugs,
  canShowDirectContact,
  getVerificationBadge,
  isStayProviderType,
} from "./service-providers";
