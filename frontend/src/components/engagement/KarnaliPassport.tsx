// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Lock, Sparkles, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PASSPORT_BADGES, type PassportBadgeId } from "@/lib/engagement-data";
import {
  getPassportBadges,
  PASSPORT_UPDATED_EVENT,
  unlockPassportBadge,
  type StoredPassportBadge,
} from "@/lib/passport";
import { cn } from "@backend/lib/utils";

interface KarnaliPassportProps {
  autoUnlockBadge?: PassportBadgeId;
  focusBadges?: PassportBadgeId[];
  compact?: boolean;
  className?: string;
}

export function KarnaliPassport({
  autoUnlockBadge,
  focusBadges,
  compact = false,
  className,
}: KarnaliPassportProps) {
  const [badges, setBadges] = useState<StoredPassportBadge[]>(() =>
    PASSPORT_BADGES.map((badge) => ({
      id: badge.id,
      name: badge.name,
      unlocked: false,
    })),
  );

  useEffect(() => {
    const refresh = () => setBadges(getPassportBadges());
    refresh();
    window.addEventListener(PASSPORT_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(PASSPORT_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (!autoUnlockBadge) return;
    const timeout = window.setTimeout(() => {
      setBadges(unlockPassportBadge(autoUnlockBadge));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [autoUnlockBadge]);

  const visibleBadges = useMemo(() => {
    const merged = PASSPORT_BADGES.map((badge) => ({
      ...badge,
      ...(badges.find((stored) => stored.id === badge.id) ?? {}),
    }));
    if (!focusBadges?.length) return merged;
    const focused = merged.filter((badge) => focusBadges.includes(badge.id));
    return compact ? focused.slice(0, 4) : focused;
  }, [badges, compact, focusBadges]);

  const unlockedCount = badges.filter((badge) => badge.unlocked).length;
  const total = PASSPORT_BADGES.length;

  const unlockNext = () => {
    const nextLocked = PASSPORT_BADGES.find(
      (badge) => !badges.some((stored) => stored.id === badge.id && stored.unlocked),
    );
    if (nextLocked) setBadges(unlockPassportBadge(nextLocked.id));
  };

  return (
    <Card className={cn("rounded-3xl border-emerald-100 bg-amber-50/60 shadow-sm", className)}>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge className="w-fit bg-primary text-primary-foreground">
            <Trophy className="h-3.5 w-3.5" />
            Karnali Passport
          </Badge>
          <span className="text-sm font-medium text-primary">
            {unlockedCount} of {total} badges unlocked
          </span>
        </div>
        <CardTitle className="text-2xl">Unlock your Karnali Passport</CardTitle>
        <p className="text-sm text-muted-foreground">
          Collect lightweight travel badges as you explore routes, vibes, and destinations.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className={cn("grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}>
          {visibleBadges.map(({ id, name, description, icon: Icon, unlocked }) => (
            <button
              key={id}
              type="button"
              onClick={() => setBadges(unlockPassportBadge(id))}
              className={cn(
                "rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md",
                unlocked
                  ? "border-primary/25 bg-white text-foreground"
                  : "border-border bg-white/60 text-muted-foreground",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl",
                    unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {unlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                {unlocked && <Badge variant="secondary">Unlocked</Badge>}
              </div>
              <h3 className="mt-3 font-semibold">{name}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5">{description}</p>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/routes">
              Build a route to unlock more
              <Sparkles className="h-4 w-4" />
            </Link>
          </Button>
          <Button type="button" variant="outline" onClick={unlockNext}>
            Try a badge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
