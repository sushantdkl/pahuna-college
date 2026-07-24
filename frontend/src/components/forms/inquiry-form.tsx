// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSuccess } from "@/components/shared/form-success";
import { inquirySchema, type InquiryInput } from "@backend/lib/validations";
import { submitInquiry } from "@/actions/inquiry";

interface InquiryFormProps {
  hotelId?: string;
  hotelName?: string;
  isStay?: boolean;
}

export function InquiryForm({ hotelId, hotelName, isStay = true }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const showStayFields = Boolean(hotelId && isStay);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema as never) as Resolver<InquiryInput>,
    defaultValues: {
      type: showStayFields ? "HOTEL_BOOKING" : "GENERAL",
      hotelId,
      hotelName,
      source: "website",
    },
  });

  async function onSubmit(data: InquiryInput) {
    setIsSubmitting(true);
    try {
      const result = await submitInquiry(data);
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
        title="Inquiry Sent!"
        message={
          hotelName
            ? `We've received your inquiry for ${hotelName}. Our team will confirm availability and get back to you.`
            : "We've received your inquiry. Our team will respond within 2-4 hours."
        }
        details="Check your email for a confirmation."
        actions={[
          { label: "Browse More Stays & Services", href: "/hotels", variant: "outline" },
        ]}
        onReset={() => setIsSuccess(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="font-semibold text-lg">
        {hotelName ? `Inquire about ${hotelName}` : "Send an Inquiry"}
      </h3>

      <div>
        <Label htmlFor="inq-fullName">Full Name *</Label>
        <Input id="inq-fullName" {...register("fullName")} placeholder="Your name" />
        {errors.fullName && (
          <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="inq-email">Email *</Label>
        <Input
          id="inq-email"
          type="email"
          {...register("email")}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="inq-phone">Phone</Label>
        <Input id="inq-phone" {...register("phone")} placeholder="+977-..." />
      </div>

      {showStayFields && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="inq-checkIn">Check-in</Label>
            <Input id="inq-checkIn" type="date" {...register("checkIn")} />
          </div>
          <div>
            <Label htmlFor="inq-checkOut">Check-out</Label>
            <Input id="inq-checkOut" type="date" {...register("checkOut")} />
          </div>
        </div>
      )}

      {showStayFields && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="inq-guests">Guests</Label>
            <Input
              id="inq-guests"
              type="number"
              min={1}
              max={20}
              {...register("guests", { valueAsNumber: true })}
              placeholder="2"
            />
          </div>
          <div>
            <Label htmlFor="inq-rooms">Rooms</Label>
            <Input
              id="inq-rooms"
              type="number"
              min={1}
              max={10}
              {...register("rooms", { valueAsNumber: true })}
              placeholder="1"
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="inq-message">Message</Label>
        <Textarea
          id="inq-message"
          {...register("message")}
          placeholder={
            showStayFields
              ? "Any special requests or questions..."
              : "Tell us what you're looking for..."
          }
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Sending..." : "Send Inquiry"}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Shield className="h-3 w-3" />
        <span>Your data is secure. We respond within 2-4 hours.</span>
      </div>
    </form>
  );
}


