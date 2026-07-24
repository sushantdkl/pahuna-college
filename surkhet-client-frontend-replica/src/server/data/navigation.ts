export const mainNavigation: any[] = [
  { label: "Home", href: "/" },
  { label: "Explore Surkhet", href: "/explore" },
  { label: "Stays", href: "/hotels" },
  { label: "Food", href: "/food" },
  { label: "Destinations", href: "/destinations" },
  { label: "Trip Planner", href: "/trip-planner" },
  { label: "Contact", href: "/contact" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "B2B Consulting", href: "/consulting", description: "Hospitality business support" },
      { label: "Training Academy", href: "/training", description: "Hospitality career programs" },
      { label: "Partner With Us", href: "/partner", description: "Join the Pahuna network" },
      { label: "Trip Routes", href: "/routes", description: "Karnali route planning" },
      { label: "Trip Cost", href: "/trip-cost", description: "Estimate travel budget" },
      { label: "Things To Do", href: "/experiences", description: "Experiences and activities" },
    ],
  },
];

export const footerNavigation: any = {
  discover: [
    { label: "Explore Surkhet", href: "/explore" },
    { label: "Destinations", href: "/destinations" },
    { label: "Hotels & Stays", href: "/hotels" },
    { label: "Things to Do", href: "/experiences" },
    { label: "Trip Ideas", href: "/itineraries" },
    { label: "Trip Planner", href: "/trip-planner" },
  ],
  services: [
    { label: "B2B Consulting", href: "/consulting" },
    { label: "Training Academy", href: "/training" },
    { label: "Partner With Us", href: "/partner" },
    { label: "Blog & Guides", href: "/blog" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};
