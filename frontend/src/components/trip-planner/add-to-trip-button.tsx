"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Check, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  addTripDraftItem,
  emptyTripDraft,
  readTripDraft,
  removeTripDraftItem,
  subscribeToTripDraft,
  type TripDraftListKey,
} from "@/lib/trip-draft";

type AddToTripButtonProps = {
  listKey: TripDraftListKey;
  itemId: string;
  label: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost";
};

export function AddToTripButton({
  listKey,
  itemId,
  label,
  className,
  size = "sm",
  variant = "outline",
}: AddToTripButtonProps) {
  const snapshot = useSyncExternalStore(
    subscribeToTripDraft,
    () => JSON.stringify(readTripDraft()),
    () => JSON.stringify(emptyTripDraft),
  );
  const draft = useMemo(() => readSnapshot(snapshot), [snapshot]);
  const added = draft[listKey].includes(itemId);

  const toggle = () => {
    if (added) {
      removeTripDraftItem(listKey, itemId);
      toast.success(`${label} removed from your trip`);
      return;
    }

    addTripDraftItem(listKey, itemId);
    toast.success(`${label} added to your trip`);
  };

  return (
    <Button
      type="button"
      size={size}
      variant={added ? "secondary" : variant}
      className={className}
      onClick={toggle}
      aria-pressed={added}
    >
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {added ? "Added" : "Add to trip"}
      {added ? <X className="h-3.5 w-3.5 opacity-60" /> : null}
    </Button>
  );
}

function readSnapshot(snapshot: string) {
  try {
    return JSON.parse(snapshot) as typeof emptyTripDraft;
  } catch {
    return emptyTripDraft;
  }
}
