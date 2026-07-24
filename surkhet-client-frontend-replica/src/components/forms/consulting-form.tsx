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
import { Separator } from "@/components/ui/separator";
import { FormSuccess } from "@/components/shared/form-success";
import {
  consultingLeadSchema,
  type ConsultingLeadInput,
} from "@server/lib/validations";
import { submitConsultingLead } from "@/actions/consulting";
import {
  CONSULTING_SERVICES,
  BUSINESS_TYPES,
  BUSINESS_STAGES,
  PROJECT_TIMELINES,
} from "@server/lib/constants";

interface ConsultingFormProps {
  /** Pre-select a service (e.g. when coming from a service detail page) */
  defaultService?: string;
}

export function ConsultingForm({ defaultService }: ConsultingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ConsultingLeadInput>({
    resolver: zodResolver(consultingLeadSchema as never) as Resolver<ConsultingLeadInput>,
    defaultValues: {
      serviceType: defaultService || "",
    },
  });

  async function onSubmit(data: ConsultingLeadInput) {
    setIsSubmitting(true);
    try {
      const result = await submitConsultingLead(data);
      if (result.success) {
        setIsSuccess(true);
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
        title="Consultation Request Received"
        message="Our consulting team will review your requirements and respond within 24 hours with a tailored plan."
        details="You'll also receive a confirmation email with next steps."
        actions={[
          { label: "View Services", href: "/consulting", variant: "outline" },
          { label: "Browse Hotels", href: "/hotels", variant: "outline" },
        ]}
        onReset={() => {
          reset();
          setIsSuccess(false);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Section 1: Contact ── */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-4">
          Contact Details
        </h3>
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
            <Label htmlFor="contactName">Contact Person *</Label>
            <Input
              id="contactName"
              placeholder="Full name"
              {...register("contactName")}
            />
            {errors.contactName && (
              <p className="text-sm text-destructive">
                {errors.contactName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
          <div className="space-y-2">
            <Label htmlFor="c-email">Email *</Label>
            <Input
              id="c-email"
              type="email"
              placeholder="you@business.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-phone">Phone</Label>
            <Input
              id="c-phone"
              placeholder="+977-..."
              {...register("phone")}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Section 2: Business Context ── */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-4">
          About Your Business
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Business Type</Label>
            <Select
              onValueChange={(v) => setValue("businessType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((bt) => (
                  <SelectItem key={bt.value} value={bt.value}>
                    {bt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Business Stage</Label>
            <Select onValueChange={(v) => setValue("stage", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_STAGES.map((bs) => (
                  <SelectItem key={bs.value} value={bs.value}>
                    {bs.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
          <div className="space-y-2">
            <Label>Business Size</Label>
            <Select
              onValueChange={(v) => setValue("businessSize", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Small">Small (1-10 rooms/tables)</SelectItem>
                <SelectItem value="Medium">Medium (11-50 rooms/tables)</SelectItem>
                <SelectItem value="Large">Large (50+ rooms/tables)</SelectItem>
                <SelectItem value="Enterprise">
                  Enterprise / Multi-location
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-location">Location</Label>
            <Input
              id="c-location"
              placeholder="City / district"
              {...register("location")}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Section 3: Service Requirements ── */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-4">
          Service Requirements
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary Service Needed *</Label>
            <Select
              defaultValue={defaultService}
              onValueChange={(v) => setValue("serviceType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {CONSULTING_SERVICES.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceType && (
              <p className="text-sm text-destructive">
                {errors.serviceType.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Timeline</Label>
            <Select
              onValueChange={(v) => setValue("timeline", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="When do you need this?" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_TIMELINES.map((tl) => (
                  <SelectItem key={tl.value} value={tl.value}>
                    {tl.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="c-budget">Approximate Budget</Label>
          <Input
            id="c-budget"
            placeholder="e.g. NPR 50,000 – 1,00,000"
            {...register("budget")}
          />
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="c-message">
            Tell us about your challenges & goals
          </Label>
          <Textarea
            id="c-message"
            placeholder="Describe what you need help with..."
            rows={4}
            {...register("message")}
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full font-semibold"
      >
        {isSubmitting ? (
          "Submitting..."
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Request Free Consultation
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Free initial consultation · No obligation · Response within 24 hours
      </p>
    </form>
  );
}


