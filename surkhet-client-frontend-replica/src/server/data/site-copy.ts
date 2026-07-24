const metadata = (title: string) => ({
  title,
  description: "Pahuna tourism and hospitality platform for Surkhet and Karnali.",
  ogTitle: title,
  ogDescription: "Discover stays, food, routes, training, consulting, and experiences across Karnali.",
  keywords: ["Pahuna", "Surkhet", "Karnali", "tourism"],
});

export const homeCopy: any = {
  metadata: metadata("Discover Surkhet & Plan Your Karnali Stay"),
  hero: { badge: "Surkhet and Karnali travel guide", title: "Discover Surkhet & Plan Your Karnali Stay", subtitle: "Pahuna helps you plan Surkhet, find stays, discover cafes and restaurants, compare Karnali destinations, check routes and cost, and send trip inquiries." },
};

export const aboutCopy: any = {
  metadata: metadata("About Pahuna"),
  hero: {
    heading: "Built for Karnali hospitality",
    description: "Pahuna connects travelers, stays, food providers, routes, and hospitality services across Surkhet and Karnali.",
  },
  mission: {
    heading: "Our mission",
    description: "Make Karnali travel easier, safer, and more useful for guests and local businesses.",
  },
  vision: {
    heading: "Our vision",
    description: "A trusted digital tourism platform for Karnali Province.",
  },
  values: {
    title: "What We Value",
    subtitle: "A practical platform grounded in local hospitality.",
    items: [
      { title: "Local First", description: "Karnali businesses, guides, and communities are at the center." },
      { title: "Trust", description: "Clear details, verified listings, and useful contact flows." },
      { title: "Practical Travel", description: "Routes, costs, stays, and food organized for real journeys." },
      { title: "Hospitality Growth", description: "Training and consulting that help local operators improve." },
    ],
  },
  journey: {
    title: "Our Journey",
    subtitle: "A platform growing with Surkhet and Karnali tourism.",
    milestones: [
      { year: "2026", event: "Pahuna launches as a public tourism and hospitality platform." },
      { year: "2027", event: "More Karnali routes, stays, food providers, and training partners join." },
    ],
  },
  contact: {
    heading: "Talk to Pahuna",
    description: "Reach our team for travel support, partnerships, consulting, and training.",
  },
};

export const hotelsCopy: any = {
  metadata: metadata("Stays & Services across Karnali"),
  hero: { badge: "Stay Map & Services", title: "Stays & Services", highlight: "across Karnali", subtitle: "Find verified stays and local travel services across Surkhet and Karnali." },
  assistance: { heading: "Need help choosing a stay?", description: "Send your route, date, and group details for assistance." },
  newsletter: { heading: "Get Surkhet stay updates", description: "Useful stay and route notes from Pahuna." },
};

export const contactCopy: any = {
  metadata: metadata("Contact Pahuna"),
  hero: { heading: "Contact Us", description: "Have a question, feedback, or business inquiry? We would love to hear from you." },
  contactCards: {
    visit: { title: "Visit Us" },
    call: { title: "Call Us" },
    email: { title: "Email Us" },
    hours: { title: "Office Hours", description: "Sun - Fri, 10:00 AM - 6:00 PM" },
  },
  form: {
    title: "Send Us a Message",
    subtitle: "We typically respond within 24 hours.",
  },
};

export const consultingCopy: any = {
  metadata: metadata("Hospitality Consulting"),
  hero: {
    description: "Expert consulting for hotels, cafes, restaurants, and tourism operators in Nepal. From setup to operations, we build hospitality businesses that thrive.",
  },
  trustBadges: [
    { label: "Registered Consultants", description: "Business support for hospitality operators." },
    { label: "Local Market Insight", description: "Surkhet and Karnali context." },
    { label: "Results Focused", description: "Actionable plans and training." },
  ],
  serveList: ["Hotels & Resorts", "Cafes & Coffee Shops", "Restaurants & Bars", "Tourism Operators", "Homestays & Lodges", "Hospitality Brands"],
  services: {
    title: "Our Consulting Services",
    subtitle: "Specialized services for every stage of your hospitality business growth.",
  },
  caseStudies: {
    title: "Case Studies",
    subtitle: "Real results from businesses supported by Pahuna hospitality consultants.",
  },
  testimonials: {
    title: "What Our Clients Say",
    subtitle: "Trusted by hospitality businesses across Karnali Province.",
  },
  whyUs: {
    heading: "Why Businesses Choose Us",
    reasons: [
      { title: "Local First Perspective", description: "We understand Karnali hospitality, travelers, and local operating realities." },
      { title: "Implementation, Not Just Advice", description: "You receive practical steps your team can follow." },
      { title: "Measurable Results", description: "We focus on guest experience, bookings, and repeatable operations." },
      { title: "Built to Grow", description: "Training and consulting can support your team as you expand." },
    ],
  },
  discoveryCall: {
    heading: "Free Discovery Call",
    description: "Discuss your business goals and receive practical next steps from the Pahuna team.",
    socialProof: "Trusted by hospitality businesses across Karnali Province.",
  },
  inquiryForm: {
    heading: "Tell Us About Your Business",
    description: "Fill out the form below and our team will respond within 24 hours with a tailored plan.",
  },
};

export const trainingCopy: any = {
  metadata: metadata("Hospitality Training Academy"),
  hero: {
    description: "Professional courses in service, café skills, housekeeping, front desk, and hospitality operations for Karnali’s growing tourism industry.",
  },
  trustBadges: [
    { label: "Industry Certified", description: "Career-focused training." },
    { label: "Job Placement", description: "Career guidance and support." },
    { label: "Hands-on Training", description: "Practical hospitality skills." },
  ],
  whyTrainWithUs: { title: "Why Train With Us?", subtitle: "We do not just teach theory. We prepare you for the real world of hospitality." },
  featuredPrograms: { title: "Featured Programs", subtitle: "Our most popular courses designed for career starters and working professionals." },
  morePrograms: { title: "More Programs", subtitle: "Specialized courses for every area of hospitality." },
  enrollment: { title: "How Enrollment Works", subtitle: "A simple process from consultation to classroom." },
  studentStories: { title: "Student Success Stories", subtitle: "Hear from graduates who launched their careers through our programs." },
  faq: { title: "Frequently Asked Questions", subtitle: "Common questions about our training programs." },
  enrollForm: { title: "Enroll in a Course", subtitle: "Fill out the form below and our team will contact you within 24 hours with next steps and payment details." },
};

export const faqCopy: any = { metadata: metadata("FAQ"), hero: { title: "Frequently Asked Questions" } };
export const partnerCopy: any = {
  metadata: metadata("Partner With Pahuna"),
  hero: {
    heading: "Grow Together With Us",
    description: "Join Pahuna’s partner network and connect with travelers exploring Nepal’s Karnali region.",
  },
  partnerTypes: {
    title: "Who Can Partner?",
    subtitle: "We welcome all hospitality and tourism businesses in the region.",
    types: [
      { title: "Hotels & Resorts", description: "List rooms, local packages, and guest services." },
      { title: "Restaurants & Cafes", description: "Feature your dining experience to travelers." },
      { title: "Travel Agencies", description: "Collaborate on curated local packages and itineraries." },
      { title: "Transport Providers", description: "Offer reliable transportation to routes and destinations." },
    ],
  },
  benefits: {
    title: "Partner Benefits",
    subtitle: "Here’s what you get when you join our network.",
    items: ["Free listing on our platform with detailed business profile", "Access to qualified leads and booking inquiries", "Co-marketing opportunities and social media features", "Consulting support for branding and operations", "Training discounts for your staff through our academy", "Priority placement for verified and trusted partners"],
  },
  form: {
    title: "Apply to Become a Partner",
    subtitle: "Fill out the form below and our team will review your application within 48 hours.",
  },
};
export const roadmapCopy: any = {
  metadata: metadata("Tourism Roadmap"),
  hero: {
    badge: "Tourism Roadmap",
    title: "Karnali Tourism",
    highlight: "Roadmap",
    subtitle: "How Pahuna is building practical tourism infrastructure for Surkhet and Karnali.",
  },
  stats: [
    { value: "15+", label: "Public routes" },
    { value: "50+", label: "Listings planned" },
    { value: "5", label: "Karnali districts" },
    { value: "24h", label: "Inquiry response" },
  ],
  cta: {
    heading: "Help Build Karnali Tourism",
    description: "Partner with Pahuna to improve travel information, listings, training, and route planning.",
  },
};
