// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Phone, Shield } from "lucide-react";
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
import { callbackSchema, type CallbackInput } from "@backend/lib/validations";
import { submitCallbackRequest } from "@/actions/callback";

interface CallbackFormProps {
  hotelId?: string;
  hotelName?: string;
  compact?: boolean;
}

const timeSlots = [
  "Morning (9 AM - 12 PM)",
  "Afternoon (12 PM - 3 PM)",
  "Evening (3 PM - 6 PM)",
  "Anytime",
];

export function CallbackForm({ hotelId, hotelName, compact = false }: CallbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CallbackInput>({
    resolver: zodResolver(callbackSchema as never) as Resolver<CallbackInput>,
    defaultValues: {
      hotelId,
      hotelName,
      source: "website",
    },
  });

  async function onSubmit(data: CallbackInput) {
    setIsSubmitting(true);
    try {
      const result = await submitCallbackRequest(data);
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
        title="Callback Requested!"
        message="Our team will call you at your preferred time. Keep your phone handy."
        details="For immediate help, call +977-083-520000"
        onReset={() => setIsSuccess(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!compact && (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Request a Callback</h3>
            <p className="text-xs text-muted-foreground">We&apos;ll call you — no waiting on hold.</p>
          </div>
        </div>
      )}

      <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
        <div className="space-y-1.5">
          <Label htmlFor="cb-fullName" className="text-xs">Full Name *</Label>
          <Input id="cb-fullName" {...register("fullName")} placeholder="Your name" className="h-9 text-sm" />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cb-phone" className="text-xs">Phone Number *</Label>
          <Input id="cb-phone" {...register("phone")} placeholder="+977-..." className="h-9 text-sm" />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
        <div className="space-y-1.5">
          <Label htmlFor="cb-email" className="text-xs">Email (optional)</Label>
          <Input id="cb-email" type="email" {...register("email")} placeholder="you@example.com" className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Preferred Callback Time</Label>
          <Select onValueChange={(v) => setValue("preferredTime", v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!compact && (
        <div className="space-y-1.5">
          <Label htmlFor="cb-message" className="text-xs">Brief Message</Label>
          <Textarea
            id="cb-message"
            {...register("message")}
            placeholder={hotelName ? `I'd like to know about ${hotelName}...` : "How can we help?"}
            rows={2}
            className="text-sm"
          />
        </div>
      )}

      <Button type="submit" className="w-full" size="sm" disabled={isSubmitting}>
        <Phone className="h-4 w-4 mr-2" />
        {isSubmitting ? "Requesting..." : "Request Callback"}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
        <Shield className="h-3 w-3" />
        <span>No spam. We value your privacy.</span>
      </div>
    </form>
  );
}


