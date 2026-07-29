export type ImageType = "hero" | "destination" | "food" | "stay" | "route" | "service" | "experience" | "placeholder";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050")
  .replace(/\/$/, "")
  .replace(/\/api\/v1$/, "");

export const assets = {
  logo: "/logo/pahuna-logo-clean.svg",
  icon: "/logo/pahuna-icon.svg",
  hero: {
    surkhet: "/images/hero/surkhet-hero.jpg",
    karnali: "/images/hero/karnali-hero.jpg",
  },
  placeholders: {
    hero: "/images/hero/surkhet-hero.jpg",
    destination: "/images/surkhet/bulbule-lake.jpg",
    food: "/images/cafe_interior.jpg",
    stay: "/images/hotel_room.jpg",
    route: "/images/surkhet_road.jpg",
    service: "/images/karnali_bridge.jpg",
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
    return `${API_ORIGIN}${src}`;
  }

  if (src) return src;
  return assets.placeholders[type as keyof typeof assets.placeholders] ?? assets.placeholders.hero;
}

export function isBackendUploadImage(src?: string | null) {
  return Boolean(src && (src.startsWith("/uploads/") || src.includes("/uploads/")));
}
