// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
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
import { partnerSchema, type PartnerInput } from "@backend/lib/validations";
import { submitPartnerApplication } from "@/actions/partner";

const partnerTypes = [
  { value: "HOTEL", label: "Hotel" },
  { value: "RESORT", label: "Resort" },
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "TRAVEL_AGENCY", label: "Travel Agency" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "OTHER", label: "Other" },
];

export function PartnerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PartnerInput>({
    resolver: zodResolver(partnerSchema as never) as Resolver<PartnerInput>,
    defaultValues: {
      existingOnline: false,
    },
  });

  async function onSubmit(data: PartnerInput) {
    setIsSubmitting(true);
    try {
      const result = await submitPartnerApplication(data);
      if (result.success) {
        toast.success(
          "Application submitted! We'll review it within 48 hours."
        );
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            placeholder="Your business name"
            {...register("businessName")}
          />
          {errors.businessName && (
            <p className="text-sm text-destructive">
              {errors.businessName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="partnerType">Business Type *</Label>
          <Select
            onValueChange={(value) =>
              setValue("partnerType", value as PartnerInput["partnerType"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {partnerTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.partnerType && (
            <p className="text-sm text-destructive">
              {errors.partnerType.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ownerName">Owner / Manager Name *</Label>
          <Input
            id="ownerName"
            placeholder="Full name"
            {...register("ownerName")}
          />
          {errors.ownerName && (
            <p className="text-sm text-destructive">
              {errors.ownerName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@business.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            placeholder="+977-..."
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Business address"
            {...register("address")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            placeholder="https://..."
            {...register("website")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalRooms">Total Rooms (if applicable)</Label>
          <Input
            id="totalRooms"
            type="number"
            placeholder="e.g. 20"
            {...register("totalRooms", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="challenges">
          What challenges does your business face?
        </Label>
        <Textarea
          id="challenges"
          placeholder="Tell us about your current challenges..."
          rows={3}
          {...register("challenges")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals">What are your goals for partnering?</Label>
        <Textarea
          id="goals"
          placeholder="What do you hope to achieve?"
          rows={3}
          {...register("goals")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Submit Application
          </>
        )}
      </Button>
    </form>
  );
}


