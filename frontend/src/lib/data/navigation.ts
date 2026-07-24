export const mainNavigation = [
  { title: "Home", href: "/" },
  { title: "Explore Surkhet", href: "/explore" },
  { title: "Stays", href: "/hotels" },
  { title: "Food", href: "/food" },
  { title: "Destinations", href: "/destinations" },
  { title: "Trip Planner", href: "/trip-planner" },
  { title: "Contact", href: "/contact" },
  {
    title: "Services",
    href: "/services",
    children: [
      { title: "B2B Consulting", href: "/consulting", description: "Grow your hospitality business" },
      { title: "Training Academy", href: "/training", description: "Hospitality career programs" },
      { title: "Partner With Us", href: "/partner", description: "Join the Pahuna network" },
      { title: "Trip Routes", href: "/routes", description: "Karnali route planning" },
      { title: "Trip Cost", href: "/trip-cost", description: "Estimate route and travel costs" },
      { title: "Things To Do", href: "/experiences", description: "Experiences around Surkhet" },
    ],
  },
];

export const footerNavigation = {
  discover: [
    { title: "Explore Surkhet", href: "/explore" },
    { title: "Destinations", href: "/destinations" },
    { title: "Hotels & Stays", href: "/hotels" },
    { title: "Things to Do", href: "/experiences" },
    { title: "Trip Ideas", href: "/itineraries" },
    { title: "Trip Planner", href: "/trip-planner" },
  ],
  services: [
    { title: "B2B Consulting", href: "/consulting" },
    { title: "Training Academy", href: "/training" },
    { title: "Partner With Us", href: "/partner" },
    { title: "Blog & Guides", href: "/blog" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "FAQ", href: "/faq" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms & Conditions", href: "/terms" },
  ],
};
