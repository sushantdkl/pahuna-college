export type ImageType = "hero" | "destination" | "food" | "stay" | "route" | "service" | "experience" | "placeholder";

export const assets = {
  logo: "/logo/pahuna-logo-clean.svg",
  icon: "/logo/pahuna-icon.svg",
  hero: {
    surkhet: "/images/hero/surkhet-hero.jpg",
    karnali: "/images/hero/karnali-hero.jpg",
  },
  placeholders: {
    hero: "/images/placeholders/hero-placeholder.svg",
    destination: "/images/placeholders/destination-placeholder.svg",
    food: "/images/placeholders/food-placeholder.svg",
    stay: "/images/placeholders/stay-placeholder.svg",
    route: "/images/placeholders/route-placeholder.svg",
    service: "/images/placeholders/service-placeholder.svg",
  },
  surkhet: {
    bulbule: "/images/surkhet/bulbule-lake.jpg",
    bulbuleLake: "/images/surkhet/bulbule-lake.jpg",
    deuti: "/images/surkhet/deuti-bajai.jpg",
    deutiBajai: "/images/surkhet/deuti-bajai.jpg",
    kakrebihar: "/images/surkhet/kakrebihar.jpg",
    ghantaghar: "/images/surkhet/ghantaghar-surkhet.jpg",
    guraseViewTower: "/images/surkhet/gurase-view-tower.jpg",
    bheriRiverBridge: "/images/surkhet/bheri-river-bridge.jpg",
    ranimatta: "/images/surkhet/ranimatta.jpg",
    stadium: "/images/surkhet/karnali-stadium.jpg",
    night: "/images/surkhet/surkhet-night-view.jpg",
  },
  karnali: {
    rara: "/images/karnali/rara-lake.jpg",
    raraLake: "/images/karnali/rara-lake.jpg",
    phoksundo: "/images/karnali/phoksundo-lake.jpg",
    phoksundoLake: "/images/karnali/phoksundo-lake.jpg",
    river: "/images/karnali/karnali-river.jpg",
    karnaliRiver: "/images/karnali/karnali-river.jpg",
    karnaliRiver2: "/images/karnali/karnali-river-2.jpg",
    mahabuDailekh: "/images/karnali/mahabu-dailekh.jpg",
  },
};

export function getImageOrPlaceholder(src?: string | null, type: ImageType = "placeholder") {
  if (src?.startsWith("/uploads/")) {
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${src}`;
  }

  if (src) return src;
  return assets.placeholders[type as keyof typeof assets.placeholders] ?? assets.placeholders.hero;
}
