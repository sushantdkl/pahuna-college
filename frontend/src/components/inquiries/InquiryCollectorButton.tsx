// @ts-nocheck
"use client";

import type * as React from "react";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InquiryCollector,
  type InquiryLeadType,
} from "@/components/inquiries/InquiryCollector";

interface InquiryCollectorButtonProps extends Omit<React.ComponentProps<typeof Button>, "onClick"> {
  label: string;
  leadType: InquiryLeadType;
  sourcePage?: string;
  leadSource?: string;
  selectedDestination?: string;
  selectedStay?: string;
  selectedItinerary?: string;
  selectedService?: string;
  generatedPlanJson?: unknown;
  defaultBudgetRange?: string;
  defaultTravelersCount?: number;
  defaultInterests?: string[];
  showIcon?: boolean;
}

export function InquiryCollectorButton({
  label,
  leadType,
  sourcePage,
  leadSource,
  selectedDestination,
  selectedStay,
  selectedItinerary,
  selectedService,
  generatedPlanJson,
  defaultBudgetRange,
  defaultTravelersCount,
  defaultInterests,
  showIcon = true,
  ...buttonProps
}: InquiryCollectorButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)}>
        {showIcon && <MessageCircle className="h-4 w-4" />}
        {label}
      </Button>
      <InquiryCollector
        open={open}
        onOpenChange={setOpen}
        leadType={leadType}
        sourcePage={sourcePage}
        leadSource={leadSource}
        selectedDestination={selectedDestination}
        selectedStay={selectedStay}
        selectedItinerary={selectedItinerary}
        selectedService={selectedService}
        generatedPlanJson={generatedPlanJson}
        defaultBudgetRange={defaultBudgetRange}
        defaultTravelersCount={defaultTravelersCount}
        defaultInterests={defaultInterests}
      />
    </>
  );
}
