import { demoDestinations } from "@server/services";

export type PublicDestination = any;

export async function getDestinations(..._args) {
  return demoDestinations;
}

export async function getFeaturedDestinations(..._args) {
  return demoDestinations.filter((item) => item.featured).slice(0, 6);
}

export async function getDestinationBySlug(slug: string, ..._args) {
  return demoDestinations.find((item) => item.slug === slug) ?? null;
}

export function getDestinationSlugs() {
  return demoDestinations.map((item) => item.slug);
}

export async function getDestinationsByDistrict(districtSlug: string) {
  return demoDestinations.filter((item) => item.district.toLowerCase().replace(/\s+/g, "-") === districtSlug || item.district.toLowerCase() === districtSlug.toLowerCase());
}

export function getDistrictSlugs() {
  return Array.from(new Set(demoDestinations.map((item) => item.district.toLowerCase().replace(/\s+/g, "-"))));
}

export function toDistrictSlug(district: string) {
  return district.toLowerCase().replace(/\s+/g, "-");
}

export function fromDistrictSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getDestinationDistricts() {
  return Array.from(new Set(demoDestinations.map((item) => item.district)));
}
