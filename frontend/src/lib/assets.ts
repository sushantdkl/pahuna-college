export const assets = {
  placeholders: {
    stay: "/images/placeholders/stay-placeholder.svg",
    food: "/images/placeholders/food-placeholder.svg",
    destination: "/images/placeholders/destination-placeholder.svg",
    experience: "/images/placeholders/experience-placeholder.svg",
  },
};

export function getImageOrPlaceholder(src?: string | null, fallback = assets.placeholders.destination) {
  return src && src.trim() ? src : fallback;
}
