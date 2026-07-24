import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value?: number | string | null, currency = "NPR") {
  if (value === undefined || value === null || value === "") return "Ask price";
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return String(value);
  return `${currency} ${new Intl.NumberFormat("en-IN").format(numeric)}`;
}

export function getInitials(value = "Pahuna") {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "PH";
}
