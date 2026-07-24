"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Building2, Shield, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormSuccess } from "@/components/shared/form-success";
import { hotelLeadSchema, type HotelLeadInput } from "@server/lib/validations";
import { submitHotelLead } from "@/actions/hotel-lead";
import { PROPERTY_TYPES, PRICE_RANGES } from "@server/lib/constants";

export function HotelLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<HotelLeadInput>({
    resolver: zodResolver(hotelLeadSchema as never) as Resolver<HotelLeadInput>,
    defaultValues: {
      currentOnline: false,
    },
  });

  async function onSubmit(data: HotelLeadInput) {
    setIsSubmitting(true);
    try {
      const result = await submitHotelLead(data);
      if (result.success) {
        setIsSuccess(true);
        reset();
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <FormSuccess
        title="Application Received!"
        message="Thank you for your interest in listing your property. Our partnerships team will contact you within 24 hours."
        details="We'll discuss verification, listing setup, and how to maximize your bookings."
        actions={[
          { label: "View Partner Benefits", href: "/partner", variant: "outline" },
        ]}
        onReset={() => setIsSuccess(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">List Your Hotel</h3>
          <p className="text-xs text-muted-foreground">
            Get your property on Surkhet&apos;s #1 hospitality platform.
          </p>
        </div>
      </div>

      {/* Row 1: Hotel name + Property type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="hl-hotelName">Hotel / Property Name *</Label>
          <Input id="hl-hotelName" {...register("hotelName")} placeholder="e.g. Hotel Karnali Star" />
          {errors.hotelName && (
            <p className="text-xs text-destructive">{errors.hotelName.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Property Type *</Label>
          <Select onValueChange={(v) => setValue("propertyType", v as HotelLeadInput["propertyType"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.propertyType && (
            <p className="text-xs text-destructive">{errors.propertyType.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Owner + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="hl-ownerName">Owner / Manager Name *</Label>
          <Input id="hl-ownerName" {...register("ownerName")} placeholder="Full name" />
          {errors.ownerName && (
            <p className="text-xs text-destructive">{errors.ownerName.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hl-email">Email *</Label>
          <Input id="hl-email" type="email" {...register("email")} placeholder="you@hotel.com" />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Row 3: Phone + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="hl-phone">Phone *</Label>
          <Input id="hl-phone" {...register("phone")} placeholder="+977-..." />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hl-location">Location / Address *</Label>
          <Input id="hl-location" {...register("location")} placeholder="Birendranagar, Surkhet" />
          {errors.location && (
            <p className="text-xs text-destructive">{errors.location.message}</p>
          )}
        </div>
      </div>

      {/* Row 4: Rooms + Price Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="hl-totalRooms">Total Rooms</Label>
          <Input id="hl-totalRooms" type="number" min={1} {...register("totalRooms", { valueAsNumber: true })} placeholder="e.g. 20" />
        </div>
        <div className="space-y-1.5">
          <Label>Price Range (per night)</Label>
          <Select onValueChange={(v) => setValue("priceRange", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((r) => (
                <SelectItem key={r.label} value={r.label}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 5: Website + Online presence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="hl-website">Website (if any)</Label>
          <Input id="hl-website" {...register("website")} placeholder="https://..." />
        </div>
        <div className="space-y-1.5 flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("currentOnline")}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Currently listed on other platforms</span>
          </label>
        </div>
      </div>

      {/* Challenges */}
      <div className="space-y-1.5">
        <Label htmlFor="hl-challenges">Current Challenges (optional)</Label>
        <Textarea
          id="hl-challenges"
          {...register("challenges")}
          placeholder="Low visibility, no online bookings, seasonal issues..."
          rows={2}
        />
      </div>

      {/* Goals */}
      <div className="space-y-1.5">
        <Label htmlFor="hl-goals">What do you hope to achieve?</Label>
        <Textarea
          id="hl-goals"
          {...register("goals")}
          placeholder="More bookings, better online presence, training for staff..."
          rows={2}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Submitting..." : "Submit Your Property"}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Shield className="h-3 w-3" />
        <span>Free listing. No hidden fees. We review within 24 hours.</span>
      </div>
    </form>
  );
}


