export const mainNavigation = [
  { label: "Home", href: "/" },
  { label: "Explore Surkhet", href: "/explore" },
  { label: "Stays", href: "/hotels" },
  { label: "Food", href: "/food" },
  { label: "Destinations", href: "/destinations" },
  { label: "Trip Planner", href: "/trip-planner" },
  { label: "Packages", href: "/packages" },
  { label: "Blog", href: "/blog" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "B2B Consulting", href: "/consulting", description: "Hospitality business support" },
      { label: "Training Academy", href: "/training", description: "Hospitality career programs" },
      { label: "Partner With Us", href: "/partner", description: "Join the Pahuna network" },
      { label: "Trip Routes", href: "/routes", description: "Karnali route planning" },
      { label: "Things To Do", href: "/experiences", description: "Experiences and activities" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation = {
  discover: [
    { label: "Explore Surkhet", href: "/explore" },
    { label: "Destinations", href: "/destinations" },
    { label: "Hotels & Stays", href: "/hotels" },
    { label: "Things to Do", href: "/experiences" },
    { label: "Trip Ideas", href: "/itineraries" },
    { label: "Trip Planner", href: "/trip-planner" },
    { label: "Packages", href: "/packages" },
    { label: "Trip Routes", href: "/routes" },
  ],
  services: [
    { label: "B2B Consulting", href: "/consulting" },
    { label: "Training Academy", href: "/training" },
    { label: "Partner With Us", href: "/partner" },
    { label: "Trip Routes", href: "/routes" },
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
