"use client";

import { PASSPORT_BADGES, type PassportBadgeId } from "@/lib/engagement-data";

export const PASSPORT_STORAGE_KEY = "pahuna_karnali_passport_badges";
export const PASSPORT_UPDATED_EVENT = "pahuna-passport-updated";

export type StoredPassportBadge = {
  id: PassportBadgeId;
  name: string;
  unlocked: boolean;
  unlockedAt?: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getPassportBadges(): StoredPassportBadge[] {
  const base = PASSPORT_BADGES.map((badge) => ({
    id: badge.id,
    name: badge.name,
    unlocked: false,
  }));

  if (!canUseStorage()) return base;

  try {
    const stored = window.localStorage.getItem(PASSPORT_STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as StoredPassportBadge[]) : [];
    return base.map((badge) => {
      const match = parsed.find((item) => item.id === badge.id);
      return match ? { ...badge, ...match } : badge;
    });
  } catch {
    return base;
  }
}

export function savePassportBadges(badges: StoredPassportBadge[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(PASSPORT_STORAGE_KEY, JSON.stringify(badges));
  window.dispatchEvent(new CustomEvent(PASSPORT_UPDATED_EVENT));
}

export function unlockPassportBadge(badgeId: PassportBadgeId) {
  const badges = getPassportBadges();
  const next = badges.map((badge) =>
    badge.id === badgeId
      ? {
          ...badge,
          unlocked: true,
          unlockedAt: badge.unlockedAt ?? new Date().toISOString(),
        }
      : badge,
  );
  savePassportBadges(next);
  return next;
}

export function isBadgeUnlocked(badgeId: PassportBadgeId) {
  return getPassportBadges().some((badge) => badge.id === badgeId && badge.unlocked);
}

export function getBadgeProgress() {
  const badges = getPassportBadges();
  return {
    total: badges.length,
    unlocked: badges.filter((badge) => badge.unlocked).length,
    badges,
  };
}

