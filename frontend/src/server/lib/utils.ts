import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value?: number | string | null, currency = "NPR") {
  if (value === null || value === undefined || value === "") return "On request";
  const numeric = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numeric)) return `${currency} ${value}`;
  return `${currency} ${numeric.toLocaleString("en-IN")}`;
}

export function getInitials(name = "Pahuna") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}
