// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SUCCESS_MESSAGE =
  "Your inquiry has been sent to Pahuna. Our team will confirm availability, route, and final cost before booking.";

const INTEREST_OPTIONS = [
  "Culture",
  "Nature",
  "Religious",
  "Food",
  "Adventure",
  "Family",
  "Photography",
  "Hidden places",
];

export type InquiryLeadType =
  | "TRIP_PLAN"
  | "STAY_INQUIRY"
  | "SERVICE_INQUIRY"
  | "DESTINATION_INQUIRY"
  | "ITINERARY_INQUIRY"
  | "TRAINING"
  | "CONSULTING";

interface InquiryCollectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
}

type SubmissionState = "idle" | "submitting" | "sent";

export function InquiryCollector({
  open,
  onOpenChange,
  leadType,
  sourcePage,
  leadSource,
  selectedDestination,
  selectedStay,
  selectedItinerary,
  selectedService,
  generatedPlanJson,
  defaultBudgetRange,
  defaultTravelersCount = 2,
  defaultInterests = [],
}: InquiryCollectorProps) {
  const normalizedInterests = useMemo(
    () =>
      defaultInterests
        .map((interest) => interest.charAt(0).toUpperCase() + interest.slice(1))
        .filter(Boolean),
    [defaultInterests],
  );

  const [state, setState] = useState<SubmissionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    preferredContactMethod: "WHATSAPP",
    travelDate: "",
    flexibleDate: true,
    travelersCount: String(defaultTravelersCount),
    roomsCount: "",
    budgetRange: defaultBudgetRange ?? "",
    specialRequests: "",
    consentToContact: false,
  });
  const [interests, setInterests] = useState<string[]>(normalizedInterests);

  const selectedLabel =
    selectedDestination ||
    selectedStay ||
    selectedItinerary ||
    selectedService ||
    "your Karnali inquiry";

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  };

  const submit = async () => {
    setError(null);
    setState("submitting");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          travelersCount: Number(form.travelersCount),
          roomsCount: form.roomsCount ? Number(form.roomsCount) : undefined,
          interests,
          leadType,
          sourcePage,
          leadSource,
          selectedDestination,
          selectedStay,
          selectedItinerary,
          selectedService,
          generatedPlanJson,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(data?.message ?? "Unable to submit inquiry right now.");
        setState("idle");
        return;
      }

      setState("sent");
      toast.success(SUCCESS_MESSAGE);
    } catch (submissionError) {
      console.error(
        "Inquiry submission failed",
        submissionError instanceof Error ? submissionError.message : submissionError,
      );
      setError("Unable to submit inquiry right now. Please check your details and try again.");
      setState("idle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl border-emerald-100 bg-amber-50/95 p-0 shadow-2xl sm:max-w-2xl">
        <div className="bg-card p-6 sm:p-8">
          <DialogHeader>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge className="bg-primary text-primary-foreground">Pahuna Inquiry</Badge>
              <Badge variant="outline">{leadType.replace(/_/g, " ")}</Badge>
            </div>
            <DialogTitle className="text-2xl">Send Inquiry</DialogTitle>
            <DialogDescription>
              Share a few details for {selectedLabel}. Pahuna will verify
              availability, route, and final cost before confirmation.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          {state === "sent" ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
              <p className="font-semibold">{SUCCESS_MESSAGE}</p>
              <p className="mt-2 text-emerald-900/80">
                Submitting this form does not confirm booking. Pahuna will verify
                availability, route, and final cost before confirmation.
              </p>
              <Button className="mt-5" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lead-full-name">Full name</Label>
                  <Input
                    id="lead-full-name"
                    value={form.fullName}
                    onChange={(event) => update("fullName", event.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-phone">Phone number</Label>
                  <Input
                    id="lead-phone"
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="+977"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-email">Email optional</Label>
                  <Input
                    id="lead-email"
                    type="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferred contact method</Label>
                  <Select
                    value={form.preferredContactMethod}
                    onValueChange={(value) => update("preferredContactMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHONE">Phone</SelectItem>
                      <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-date">Travel date optional</Label>
                  <Input
                    id="lead-date"
                    type="date"
                    value={form.travelDate}
                    onChange={(event) => update("travelDate", event.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 rounded-2xl border bg-background px-4 py-3">
                  <input
                    id="lead-flexible-date"
                    type="checkbox"
                    checked={form.flexibleDate}
                    onChange={(event) => update("flexibleDate", event.target.checked)}
                    className="h-4 w-4 rounded border-primary text-primary"
                  />
                  <Label htmlFor="lead-flexible-date" className="text-sm">
                    My travel date is flexible
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-travelers">Travelers count</Label>
                  <Input
                    id="lead-travelers"
                    type="number"
                    min={1}
                    max={50}
                    value={form.travelersCount}
                    onChange={(event) => update("travelersCount", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-rooms">Rooms count optional</Label>
                  <Input
                    id="lead-rooms"
                    type="number"
                    min={1}
                    max={20}
                    value={form.roomsCount}
                    onChange={(event) => update("roomsCount", event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-budget">Budget range</Label>
                <Input
                  id="lead-budget"
                  value={form.budgetRange}
                  onChange={(event) => update("budgetRange", event.target.value)}
                  placeholder="Example: NPR 20,000 - 35,000"
                />
              </div>

              <div className="space-y-3">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm transition-colors",
                        interests.includes(interest)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40",
                      )}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-requests">Special requests</Label>
                <Textarea
                  id="lead-requests"
                  value={form.specialRequests}
                  onChange={(event) => update("specialRequests", event.target.value)}
                  placeholder="Dates, preferred stay, route questions, accessibility needs, or anything Pahuna should verify."
                  className="min-h-24"
                />
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                <p>
                  Submitting this form does not confirm booking. Pahuna will verify
                  availability, route, and final cost before confirmation.
                </p>
                <p className="mt-2">
                  Routes, fares, flights, and availability may change due to weather,
                  season, road condition, and operator schedule.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border bg-background px-4 py-3">
                <input
                  id="lead-consent"
                  type="checkbox"
                  checked={form.consentToContact}
                  onChange={(event) => update("consentToContact", event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-primary text-primary"
                />
                <Label htmlFor="lead-consent" className="text-sm leading-relaxed">
                  I agree that Pahuna may contact me about this inquiry.
                </Label>
              </div>

              {error && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                className="w-full sm:w-auto"
                onClick={submit}
                disabled={state === "submitting"}
              >
                {state === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending inquiry...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Inquiry
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

